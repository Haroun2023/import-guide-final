import { site } from "@/config/site";
import { hasCmsDemo } from "@/cms/flag";
import { getAttribution, sourceLabel } from "./attribution";
import { readJSON, writeJSON } from "./storage";
import { newEventId } from "./tracking";

export type LeadInput = {
  name: string;
  /** E.164 */
  phone: string;
  complaint: string;
  complaintLabel: string;
  forWhom: string;
  mode: "clinic" | "home";
  time: string;
  therapist: string;
  payment: string;
  insurer: string;
  consentMarketing: boolean;
  /** Where the booking started, e.g. "hero", "lp:back-pain", "pain-map:knee" */
  placement: string;
};

export type LeadResult = { ok: boolean; ref: string; eventId: string; reason?: string };

type QueuedLead = { payload: Record<string, unknown>; attempts: number; ts: number };

const QUEUE_KEY = "ta_lead_queue";
const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function makeRef() {
  let out = "";
  for (let i = 0; i < 6; i++) out += REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)];
  return `TA-${out}`;
}

async function post(payload: Record<string, unknown>) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch(site.lead.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
      keepalive: true,
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; error?: string };
    return { ok: res.ok && !!data.ok, ref: data.ref, error: data.error ?? (res.ok ? undefined : `http_${res.status}`) };
  } finally {
    clearTimeout(timer);
  }
}

function enqueue(payload: Record<string, unknown>) {
  const queue = readJSON<QueuedLead[]>(QUEUE_KEY) ?? [];
  queue.push({ payload, attempts: 1, ts: Date.now() });
  writeJSON(QUEUE_KEY, queue.slice(-5));
}

export async function submitLead(input: LeadInput, meta: { startedAt: number; honeypot: string }): Promise<LeadResult> {
  const eventId = newEventId();
  const ref = makeRef();
  const attribution = getAttribution();
  const payload = {
    ...input,
    ref,
    eventId,
    page: typeof location !== "undefined" ? location.href : "",
    attribution,
    source: sourceLabel(attribution),
    elapsedMs: Date.now() - meta.startedAt,
    website: meta.honeypot,
    submittedAt: new Date().toISOString(),
  };

  // Demo CMS open in this browser: the booking also lands in its inbox, which
  // then counts as delivered (the preview has no lead webhook).
  let captured = false;
  if (hasCmsDemo()) {
    try {
      captured = (await import("@/cms/capture")).captureLead(payload);
    } catch {
      /* the site works the same without the demo */
    }
  }

  try {
    const res = await post(payload);
    if (res.ok || captured) return { ok: true, ref: res.ref ?? ref, eventId };
    enqueue(payload);
    return { ok: false, ref, eventId, reason: res.error };
  } catch {
    if (captured) return { ok: true, ref, eventId };
    enqueue(payload);
    return { ok: false, ref, eventId, reason: "network" };
  }
}

/** Retries leads that failed to send on a previous visit (max 3 attempts, 7 days). */
export async function flushLeadQueue() {
  const queue = readJSON<QueuedLead[]>(QUEUE_KEY);
  if (!queue?.length) return;
  const remaining: QueuedLead[] = [];
  for (const item of queue) {
    if (item.attempts >= 3 || Date.now() - item.ts > 7 * 864e5) continue;
    try {
      const res = await post({ ...item.payload, retry: item.attempts });
      if (!res.ok) remaining.push({ ...item, attempts: item.attempts + 1 });
    } catch {
      remaining.push({ ...item, attempts: item.attempts + 1 });
    }
  }
  writeJSON(QUEUE_KEY, remaining);
}

export function leadWhatsAppText(input: Pick<LeadInput, "name" | "complaintLabel" | "mode" | "time" | "therapist" | "forWhom">, ref?: string) {
  return [
    `مرحبًا ${site.name}،`,
    "أرغب بحجز موعد تقييم.",
    input.name ? `الاسم: ${input.name}` : "",
    `الحالة: ${input.complaintLabel}`,
    input.forWhom && input.forWhom !== "لنفسي" ? `الحجز: ${input.forWhom}` : "",
    `نوع الخدمة: ${input.mode === "home" ? "زيارة منزلية" : "في المركز"}`,
    `الوقت المفضل: ${input.time}`,
    input.therapist && input.therapist !== "بدون تفضيل" ? `التفضيل: ${input.therapist}` : "",
    ref ? `رقم الطلب: ${ref}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
