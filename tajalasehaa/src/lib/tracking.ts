import { site } from "@/config/site";

/**
 * Ad-platform pixels + GA4, loaded only for IDs set in site.tracking.
 *
 * Rules baked in:
 * - One shared event_id per lead so browser and server (Conversions API)
 *   events are de-duplicated (Meta eventID, Snap client_dedup_id, TikTok event_id).
 * - Never send health details (complaint, body area, device) to ad platforms.
 *   Those go to our own lead endpoint / GA4 only.
 * - Snap has no LEAD event → SIGN_UP. TikTok renamed SubmitForm → Lead (2025).
 */

type Fn = (...args: unknown[]) => void;
type Queue = Fn & { queue?: unknown[]; callMethod?: Fn; push?: Fn; loaded?: boolean; version?: string };

declare global {
  interface Window {
    fbq?: Queue;
    _fbq?: Queue;
    snaptr?: Queue;
    ttq?: Queue & { page?: Fn; track?: Fn; identify?: Fn; load?: Fn };
    gtag?: Fn;
    dataLayer?: unknown[];
  }
}

const t = site.tracking;
let started = false;

function inject(src: string) {
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function loadMeta(id: string) {
  if (window.fbq) return;
  const n: Queue = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue!.push(args);
  } as Queue;
  n.queue = [];
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  window.fbq = n;
  window._fbq = n;
  inject("https://connect.facebook.net/en_US/fbevents.js");
  window.fbq("init", id);
}

function loadSnap(id: string) {
  if (window.snaptr) return;
  const a: Queue = function (...args: unknown[]) {
    const self = a as Queue & { handleRequest?: Fn };
    if (self.handleRequest) self.handleRequest(...args);
    else a.queue!.push(args);
  } as Queue;
  a.queue = [];
  window.snaptr = a;
  inject("https://sc-static.net/scevent.min.js");
  window.snaptr("init", id, {});
}

function loadTikTok(id: string) {
  if (window.ttq) return;
  // Official async stub, rewritten in TypeScript.
  const methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
  const ttq = [] as unknown as Record<string, unknown> & unknown[] & { _i?: Record<string, unknown>; _t?: Record<string, number>; _o?: Record<string, unknown> };
  const w = window as unknown as Record<string, unknown>;
  w.TiktokAnalyticsObject = "ttq";
  w.ttq = ttq;
  for (const m of methods) {
    ttq[m] = (...args: unknown[]) => {
      ttq.push([m, ...args]);
    };
  }
  ttq.instance = (pid: string) => {
    const inst = (ttq._i?.[pid] ?? []) as unknown[] & Record<string, unknown>;
    for (const m of methods) inst[m] = (...args: unknown[]) => inst.push([m, ...args]);
    return inst;
  };
  ttq._i = { [id]: [] };
  ttq._t = { [id]: Date.now() };
  ttq._o = { [id]: {} };
  (ttq._i[id] as Record<string, unknown>)._u = "https://analytics.tiktok.com/i18n/pixel/events.js";
  inject(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${id}&lib=ttq`);
}

function loadGtag(ids: string[]) {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  // gtag.js expects the raw `arguments` object in dataLayer, not an array.
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments);
  };
  inject(`https://www.googletagmanager.com/gtag/js?id=${ids[0]}`);
  window.gtag("js", new Date());
  for (const id of ids) window.gtag("config", id, { send_page_view: false });
}

export function initTracking() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (t.metaPixelId) loadMeta(t.metaPixelId);
  if (t.snapPixelId) loadSnap(t.snapPixelId);
  if (t.tiktokPixelId) loadTikTok(t.tiktokPixelId);
  const gIds = [t.ga4Id, t.googleAdsId].filter(Boolean);
  if (gIds.length) loadGtag(gIds);
}

export function newEventId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "PageView");
  window.snaptr?.("track", "PAGE_VIEW");
  window.ttq?.page?.();
  if (t.ga4Id) window.gtag?.("event", "page_view", { page_path: path, page_location: location.href, page_title: document.title });
}

/** Lead = submitted booking request. Same eventId is sent server-side. */
export function trackLead(eventId: string, meta: { source: string }) {
  if (typeof window === "undefined") return;
  window.fbq?.("track", "Lead", { content_category: "appointment_request" }, { eventID: eventId });
  window.snaptr?.("track", "SIGN_UP", { client_dedup_id: eventId });
  window.ttq?.track?.("Lead", { content_type: "product", description: "appointment_request" }, { event_id: eventId });
  window.gtag?.("event", "generate_lead", { currency: "SAR", value: 0, lead_source: meta.source });
  if (t.googleAdsLeadSendTo) window.gtag?.("event", "conversion", { send_to: t.googleAdsLeadSendTo, transaction_id: eventId });
}

/** Click-to-WhatsApp / click-to-call — valuable micro-conversions for campaigns. */
export function trackContact(channel: "whatsapp" | "call", placement: string) {
  if (typeof window === "undefined") return;
  const eventId = newEventId();
  window.fbq?.("track", "Contact", { content_category: channel }, { eventID: eventId });
  window.ttq?.track?.("Contact", { description: channel }, { event_id: eventId });
  window.snaptr?.("track", "CUSTOM_EVENT_1", { description: `contact_${channel}`, client_dedup_id: eventId });
  window.gtag?.("event", `contact_${channel}`, { placement });
}

/** Engagement events for our own analytics (GA4). Never forwarded to ad pixels. */
export function trackEngagement(name: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
