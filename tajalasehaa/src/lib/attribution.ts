import { getCookie, readJSON, setCookie, writeJSON } from "./storage";

/**
 * Captures campaign attribution on landing (UTMs + ad click IDs) and keeps a
 * first-touch and last-touch record for 90 days, so every lead can be traced
 * back to the ad, platform and creative that produced it.
 */

const TRACKED = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "fbclid",
  "gclid",
  "gbraid",
  "wbraid",
  "ttclid",
  "ScCid",
  "sccid",
  "msclkid",
  "twclid",
] as const;

const TTL_MS = 90 * 864e5;
const FIRST = "ta_first_touch";
const LAST = "ta_last_touch";

export type Touch = {
  params: Record<string, string>;
  landing: string;
  referrer: string;
  ts: number;
};

function fresh(t: Touch | null) {
  return t && Date.now() - t.ts < TTL_MS ? t : null;
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const params: Record<string, string> = {};
  for (const key of TRACKED) {
    const v = url.searchParams.get(key);
    if (v) params[key] = v.slice(0, 200);
  }
  const touch: Touch = {
    params,
    landing: url.pathname + url.search,
    referrer: document.referrer ? document.referrer.slice(0, 300) : "",
    ts: Date.now(),
  };

  if (!fresh(readJSON<Touch>(FIRST))) writeJSON(FIRST, touch);
  // Only overwrite last-touch when this visit actually carries campaign data.
  if (Object.keys(params).length || !fresh(readJSON<Touch>(LAST))) writeJSON(LAST, touch);

  // Meta click id → first-party _fbc cookie (format: fb.1.<ms>.<fbclid>).
  if (params.fbclid && !getCookie("_fbc")) {
    setCookie("_fbc", `fb.1.${Date.now()}.${params.fbclid}`, 90);
  }
}

export type Attribution = {
  first: Touch | null;
  last: Touch | null;
  fbc?: string;
  fbp?: string;
  ttp?: string;
  scid?: string;
  ga?: string;
};

export function getAttribution(): Attribution {
  return {
    first: fresh(readJSON<Touch>(FIRST)),
    last: fresh(readJSON<Touch>(LAST)),
    fbc: getCookie("_fbc"),
    fbp: getCookie("_fbp"),
    ttp: getCookie("_ttp"),
    scid: getCookie("_scid"),
    ga: getCookie("_ga"),
  };
}

/** A short human-readable source label for staff (e.g. "snapchat / back-pain-oct"). */
export function sourceLabel(a: Attribution) {
  const p = a.last?.params ?? a.first?.params ?? {};
  if (p.utm_source) return [p.utm_source, p.utm_campaign].filter(Boolean).join(" / ");
  if (p.gclid || p.gbraid || p.wbraid) return "google-ads";
  if (p.fbclid) return "meta";
  if (p.ttclid) return "tiktok";
  if (p.ScCid || p.sccid) return "snapchat";
  const ref = a.first?.referrer;
  if (ref) {
    try {
      return new URL(ref).hostname;
    } catch {
      return "referral";
    }
  }
  return "direct";
}
