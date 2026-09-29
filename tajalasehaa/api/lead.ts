import { createHash } from "node:crypto";

/**
 * POST /api/lead — Vercel serverless function.
 *
 * 1. Validates the booking request and filters obvious spam (honeypot + timing).
 * 2. Forwards the lead to LEAD_WEBHOOK_URL (Google Sheets Apps Script, Make,
 *    Zapier, n8n or a CRM). Without a destination it answers 503 so the page
 *    falls back to WhatsApp and the lead is never silently lost.
 * 3. Sends server-side conversion events (Meta CAPI, Snap CAPI, TikTok Events
 *    API) with the same event_id the browser pixel used, for de-duplication.
 *    Health details are never sent to ad platforms; hashed phone is sent only
 *    when the visitor opted in to marketing.
 *
 * Environment variables (all optional except the webhook):
 *   LEAD_WEBHOOK_URL, LEAD_WEBHOOK_SECRET
 *   META_PIXEL_ID, META_CAPI_TOKEN, META_TEST_EVENT_CODE, META_GRAPH_VERSION
 *   SNAP_PIXEL_ID, SNAP_CAPI_TOKEN
 *   TIKTOK_PIXEL_ID, TIKTOK_ACCESS_TOKEN, TIKTOK_TEST_EVENT_CODE
 *   ALLOWED_ORIGINS (comma-separated, e.g. https://tajalasehaa.sa)
 */

type Req = {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
};
type Res = {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
  end(): void;
};

type Touch = { params?: Record<string, string>; landing?: string; referrer?: string };
type Attribution = { first?: Touch | null; last?: Touch | null; fbc?: string; fbp?: string; ttp?: string; scid?: string };

const env = process.env;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
const header = (req: Req, name: string) => {
  const v = req.headers[name];
  return Array.isArray(v) ? v[0] : v ?? "";
};

function normalizePhone(raw: string): string | null {
  const latin = raw.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  let digits = latin.replace(/\D/g, "");
  const intl = latin.trim().startsWith("+") || digits.startsWith("00");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (!intl || digits.startsWith("966")) {
    if (digits.startsWith("966")) digits = digits.slice(3);
    digits = digits.replace(/^0/, "");
    return /^5\d{8}$/.test(digits) ? `+966${digits}` : null;
  }
  return /^[1-9]\d{7,14}$/.test(digits) ? `+${digits}` : null;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  try {
    return await Promise.race([p, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

async function postJSON(url: string, body: unknown, headers: Record<string, string> = {}) {
  const res = await withTimeout(
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) }),
    8000,
  );
  if (!res.ok) throw new Error(`${url.split("?")[0]} → ${res.status} ${await res.text().catch(() => "")}`);
  return res;
}

type ConversionContext = {
  eventId: string;
  url: string;
  ip: string;
  ua: string;
  phoneE164: string | null;
  attribution: Attribution;
};

function clickParam(a: Attribution, key: string) {
  return a.last?.params?.[key] ?? a.first?.params?.[key];
}

async function sendMeta(c: ConversionContext) {
  if (!env.META_PIXEL_ID || !env.META_CAPI_TOKEN) return;
  const version = env.META_GRAPH_VERSION || "v24.0";
  const userData: Record<string, unknown> = {
    client_ip_address: c.ip || undefined,
    client_user_agent: c.ua || undefined,
    fbc: c.attribution.fbc || undefined,
    fbp: c.attribution.fbp || undefined,
    country: [sha256("sa")],
  };
  if (c.phoneE164) userData.ph = [sha256(c.phoneE164.replace(/\D/g, ""))];
  await postJSON(`https://graph.facebook.com/${version}/${env.META_PIXEL_ID}/events?access_token=${env.META_CAPI_TOKEN}`, {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: c.eventId,
        action_source: "website",
        event_source_url: c.url,
        user_data: userData,
        custom_data: { content_category: "appointment_request" },
      },
    ],
    ...(env.META_TEST_EVENT_CODE ? { test_event_code: env.META_TEST_EVENT_CODE } : {}),
  });
}

/** Snap Conversions API v3 — verify with Snap Events Manager's test tool when enabling. */
async function sendSnap(c: ConversionContext) {
  if (!env.SNAP_PIXEL_ID || !env.SNAP_CAPI_TOKEN) return;
  const userData: Record<string, unknown> = {
    client_ip_address: c.ip || undefined,
    client_user_agent: c.ua || undefined,
    sc_click_id: clickParam(c.attribution, "ScCid") ?? clickParam(c.attribution, "sccid"),
    sc_cookie1: c.attribution.scid || undefined,
  };
  if (c.phoneE164) userData.ph = [sha256(c.phoneE164.replace(/\D/g, ""))];
  await postJSON(`https://tr.snapchat.com/v3/${env.SNAP_PIXEL_ID}/events?access_token=${env.SNAP_CAPI_TOKEN}`, {
    data: [
      {
        event_name: "SIGN_UP",
        action_source: "WEB",
        event_source_url: c.url,
        event_time: Math.floor(Date.now() / 1000),
        event_id: c.eventId,
        user_data: userData,
      },
    ],
  });
}

async function sendTikTok(c: ConversionContext) {
  if (!env.TIKTOK_PIXEL_ID || !env.TIKTOK_ACCESS_TOKEN) return;
  const user: Record<string, unknown> = {
    ip: c.ip || undefined,
    user_agent: c.ua || undefined,
    ttclid: clickParam(c.attribution, "ttclid"),
    ttp: c.attribution.ttp || undefined,
  };
  if (c.phoneE164) user.phone = sha256(c.phoneE164);
  await postJSON(
    "https://business-api.tiktok.com/open_api/v1.3/event/track/",
    {
      event_source: "web",
      event_source_id: env.TIKTOK_PIXEL_ID,
      ...(env.TIKTOK_TEST_EVENT_CODE ? { test_event_code: env.TIKTOK_TEST_EVENT_CODE } : {}),
      data: [
        {
          event: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: c.eventId,
          user,
          page: { url: c.url },
          properties: { content_type: "product", description: "appointment_request" },
        },
      ],
    },
    { "Access-Token": env.TIKTOK_ACCESS_TOKEN },
  );
}

export default async function handler(req: Req, res: Res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const origin = header(req, "origin");
  if (allowed.length && origin && !allowed.includes(origin)) {
    res.status(403).json({ ok: false, error: "origin_not_allowed" });
    return;
  }

  let body: Record<string, unknown>;
  try {
    body = (typeof req.body === "string" ? JSON.parse(req.body) : req.body ?? {}) as Record<string, unknown>;
  } catch {
    res.status(400).json({ ok: false, error: "invalid_json" });
    return;
  }

  const ref = str(body.ref, 16) || `TA-${Date.now().toString(36).toUpperCase()}`;

  // Spam: hidden honeypot field filled, or submitted faster than a human could.
  if (str(body.website, 100) || Number(body.elapsedMs ?? 0) < 2500) {
    res.status(200).json({ ok: true, ref });
    return;
  }

  const name = str(body.name, 80);
  const phoneE164 = normalizePhone(str(body.phone, 32));
  if (name.length < 2 || !phoneE164) {
    res.status(422).json({ ok: false, error: "invalid_fields" });
    return;
  }

  const attribution = (typeof body.attribution === "object" && body.attribution ? body.attribution : {}) as Attribution;
  const ip = header(req, "x-forwarded-for").split(",")[0].trim() || header(req, "x-real-ip");
  const ua = header(req, "user-agent").slice(0, 400);
  const eventId = str(body.eventId, 64);
  const page = str(body.page, 500);
  const consentMarketing = body.consentMarketing === true;
  const first = attribution.first?.params ?? {};
  const last = attribution.last?.params ?? {};

  const lead = {
    ref,
    receivedAt: new Date().toISOString(),
    name,
    phone: phoneE164,
    complaint: str(body.complaintLabel, 80),
    forWhom: str(body.forWhom, 40),
    mode: str(body.mode, 10) === "home" ? "زيارة منزلية" : "في المركز",
    time: str(body.time, 40),
    therapist: str(body.therapist, 40),
    payment: str(body.payment, 40),
    insurer: str(body.insurer, 80),
    consentMarketing,
    placement: str(body.placement, 60),
    source: str(body.source, 120),
    utm_source: last.utm_source ?? first.utm_source ?? "",
    utm_medium: last.utm_medium ?? first.utm_medium ?? "",
    utm_campaign: last.utm_campaign ?? first.utm_campaign ?? "",
    utm_content: last.utm_content ?? first.utm_content ?? "",
    utm_term: last.utm_term ?? first.utm_term ?? "",
    click_id: last.gclid ?? last.fbclid ?? last.ttclid ?? last.ScCid ?? last.sccid ?? first.gclid ?? first.fbclid ?? first.ttclid ?? first.ScCid ?? "",
    landing: str(attribution.first?.landing, 300),
    referrer: str(attribution.first?.referrer, 300),
    page,
    eventId,
  };

  if (!env.LEAD_WEBHOOK_URL) {
    console.error("[lead] LEAD_WEBHOOK_URL is not set — lead not stored", ref);
    res.status(503).json({ ok: false, error: "no_destination", ref });
    return;
  }

  try {
    await postJSON(env.LEAD_WEBHOOK_URL, { ...lead, secret: env.LEAD_WEBHOOK_SECRET ?? "" });
  } catch (err) {
    console.error("[lead] webhook failed", ref, err);
    res.status(502).json({ ok: false, error: "webhook_failed", ref });
    return;
  }

  if (eventId) {
    const ctx: ConversionContext = { eventId, url: page, ip, ua, phoneE164: consentMarketing ? phoneE164 : null, attribution };
    const results = await Promise.allSettled([sendMeta(ctx), sendSnap(ctx), sendTikTok(ctx)]);
    for (const r of results) if (r.status === "rejected") console.error("[lead] conversion API", ref, r.reason);
  }

  res.status(200).json({ ok: true, ref });
}
