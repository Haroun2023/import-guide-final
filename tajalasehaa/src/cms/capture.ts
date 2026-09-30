import { uid } from "./defaults";
import { getState, setUser, update } from "./store";
import type { Lead } from "./types";

/** The redirects plugin's 404 log: a visitor in this browser hit a missing page. */
export function log404(path: string) {
  try {
    const s = getState();
    if (!s.plugins.redirects?.active || !s.plugins.redirects.settings.log404 || path.startsWith("/admin")) return;
    update((d) => {
      const hit = d.notFound.find((x) => x.path === path);
      if (hit) {
        hit.hits++;
        hit.last = new Date().toISOString();
      } else d.notFound.unshift({ path, hits: 1, last: new Date().toISOString() });
      d.notFound = d.notFound.slice(0, 50);
    });
  } catch {
    /* ignore */
  }
}

/**
 * A booking sent from the site in a demo browser also lands in the CMS inbox
 * («الحجوزات»), with the anti-spam plugin's verdict. Returns true when saved.
 */
export function captureLead(p: Record<string, unknown>): boolean {
  try {
    const s = getState();
    const antispam = s.plugins.antispam;
    const minMs = Number(antispam?.settings.minSeconds ?? 3) * 1000;
    const str = (k: string) => (typeof p[k] === "string" ? (p[k] as string) : "");
    const spam = !!antispam?.active && (!!str("website") || Number(p.elapsedMs ?? 0) < minMs);
    const attribution = p.attribution as { last?: { params?: Record<string, string> } } | undefined;
    const lead: Lead = {
      id: uid("lead-"),
      ref: str("ref"),
      createdAt: str("submittedAt") || new Date().toISOString(),
      name: str("name"),
      phone: str("phone"),
      complaint: str("complaint"),
      complaintLabel: str("complaintLabel"),
      forWhom: str("forWhom"),
      mode: str("mode") === "home" ? "home" : "clinic",
      time: str("time"),
      therapist: str("therapist"),
      payment: str("payment"),
      insurer: str("insurer"),
      placement: str("placement"),
      source: str("source") || "مباشر",
      campaign: attribution?.last?.params?.utm_campaign,
      status: "new",
      notes: [],
      spam,
    };
    setUser("زائر الموقع");
    return update((d) => void d.leads.unshift(lead), { action: spam ? "طلب مشبوه أوقفته مكافحة الرسائل المزعجة" : "حجز جديد من الموقع", target: `${lead.name} · ${lead.ref}` });
  } catch {
    return false;
  }
}
