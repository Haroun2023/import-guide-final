import { Activity } from "lucide-react";
import { faqs, programs, stories, type Program } from "@/config/content";
import { copy, display, homeSections, type HomeSectionId } from "@/config/copy";
import { devices, type DeviceId } from "@/config/devices";
import { site } from "@/config/site";
import { seoOverrides } from "@/seo";
import { NAV } from "@/components/layout/nav";
import { clock12 } from "@/components/ui/OpenStatus";
import { cmsRuntime } from "./flag";
import { getState } from "./store";
import type { CmsState } from "./types";

/**
 * Runs before the site renders in a browser where the demo CMS was opened:
 * copies the CMS content into the site's config objects, so every component
 * shows the edits. Visitors without the CMS never load this file.
 */

const DAY_AR: Record<string, string> = {
  Saturday: "السبت",
  Sunday: "الأحد",
  Monday: "الإثنين",
  Tuesday: "الثلاثاء",
  Wednesday: "الأربعاء",
  Thursday: "الخميس",
  Friday: "الجمعة",
};
export const WEEK = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

/** «يوميًا», «السبت – الخميس» or a list of days. */
export function daysLabel(days: string[]) {
  const on = WEEK.filter((d) => days.includes(d));
  if (on.length === 7) return "يوميًا";
  if (!on.length) return "مغلق";
  const idx = on.map((d) => WEEK.indexOf(d));
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  return contiguous && on.length > 2 ? `${DAY_AR[on[0]]} – ${DAY_AR[on[on.length - 1]]}` : on.map((d) => DAY_AR[d]).join("، ");
}

const mix = (base: string, pct: number, to: "white" | "black") => `color-mix(in oklab, ${base} ${pct}%, ${to})`;

/** The theme customizer's colors as CSS variables (Tailwind reads the same names). */
export function themeCss(t: CmsState["theme"]) {
  const scale = (name: string, base: string) =>
    [
      [50, mix(base, 7, "white")],
      [100, mix(base, 16, "white")],
      [200, mix(base, 30, "white")],
      [300, mix(base, 50, "white")],
      [400, mix(base, 76, "white")],
      [500, mix(base, 92, "white")],
      [600, base],
      [700, mix(base, 80, "black")],
      [800, mix(base, 62, "black")],
      [900, mix(base, 48, "black")],
      [950, mix(base, 30, "black")],
    ]
      .map(([k, v]) => `--color-${name}-${k}:${v};`)
      .join("");
  return `:root{${scale("brand", t.brand)}${scale("navy", t.navy)}--radius-card:${t.radius}rem;}`;
}

export function applyCms(): { maintenance: boolean; redirectTo?: string } {
  const s = getState();
  cmsRuntime.active = true;
  const plugin = (id: string) => s.plugins[id]?.installed && s.plugins[id]?.active;

  // Redirects (the old site's links, short links for print)
  if (plugin("redirects")) {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    const hit = s.redirects.find((r) => r.from.replace(/\/+$/, "") === path);
    if (hit && hit.to !== path) return { maintenance: false, redirectTo: hit.to };
  }

  // Site settings
  const e = s.site;
  Object.assign(site, {
    isDemo: e.isDemo,
    name: e.name,
    fullName: e.fullName,
    tagline: e.tagline,
    city: e.city,
    responseTimeMinutes: e.responseTimeMinutes,
    social: { ...site.social, ...e.social },
    offer: { ...e.offer },
    stats: e.stats.map((x) => ({ ...x })),
    features: { ...site.features, ...e.features },
    insurers: [...e.insurers],
    license: { ...e.license },
    rating: e.rating,
  });
  Object.assign(site.contact, e.contact);
  site.openingHoursSpec = [{ days: [...e.hours.days], opens: e.hours.opens, closes: e.hours.closes }];
  site.hours = [{ days: daysLabel(e.hours.days), time: `${clock12(e.hours.opens)} – ${clock12(e.hours.closes)}` }];
  if (site.branches[0]) site.branches[0].address = e.address;

  // Home sections: text, order, visibility
  for (const [k, v] of Object.entries(s.copy)) if (k in copy) Object.assign(copy[k as keyof typeof copy], v);
  homeSections.splice(0, homeSections.length, ...s.homeSections.filter((x) => homeSections.some((h) => h.id === x.id)).map((x) => ({ ...x, id: x.id as HomeSectionId })));

  // Programs: edited, added, drafts hidden
  const originals = new Map(programs.map((p) => [p.id, p]));
  const next = s.programs
    .filter((p) => p.status === "published")
    .map((ed) => {
      const o = originals.get(ed.id);
      return { ...(o ?? {}), ...ed, icon: o?.icon ?? Activity, devices: (ed.devices ?? []) as DeviceId[] } as Program;
    });
  programs.splice(0, programs.length, ...next);

  for (const ed of s.devices) {
    const d = devices.find((x) => x.id === ed.id);
    if (d) Object.assign(d, { ...ed, id: d.id, badge: ed.badge || undefined, mdma: ed.mdma || undefined });
  }
  faqs.splice(0, faqs.length, ...s.faqs.map((f) => ({ ...f })));
  (NAV as unknown as { href: string; label: string }[]).splice(0, NAV.length, ...s.menus.header.filter((n) => n.href !== "/blog" || s.posts.some((p) => p.status === "published")));

  // Plugins that change the site
  const wa = s.plugins.whatsapp;
  display.whatsappFab = !!plugin("whatsapp");
  display.whatsappSide = wa?.settings.side === "start" ? "start" : "end";
  display.whatsappMessage = String(wa?.settings.message ?? "");
  const approved = s.reviews.filter((r) => r.status === "approved");
  display.stories = !!plugin("reviews") && !!s.plugins.reviews.settings.showOnHome && approved.length > 0;
  if (display.stories) stories.splice(0, stories.length, ...approved.map((r) => ({ quote: r.text, name: r.name, context: r.context, sample: r.demo })));

  // Search titles: the SEO plugin's per-page overrides, then the articles
  if (plugin("seo")) {
    for (const [path, v] of Object.entries(s.seo)) seoOverrides[path] = { title: v.title || undefined, description: v.description || undefined };
  }
  seoOverrides["/blog"] = { title: `المقالات | ${e.name}`, description: `نصائح وشروح من فريق ${e.name} عن الألم والتأهيل والزيارة الأولى.` };
  for (const p of s.posts.filter((x) => x.status === "published")) seoOverrides[`/blog/${p.slug}`] = { title: p.seo.title || `${p.title} | ${e.name}`, description: p.seo.description || p.excerpt };

  // Theme
  const t = s.theme;
  if (t.preset !== "logo" || t.radius !== 1.5) {
    const style = document.createElement("style");
    style.id = "cms-theme";
    style.textContent = themeCss(t);
    document.head.appendChild(style);
  }

  return { maintenance: !!plugin("maintenance") && !location.pathname.startsWith("/admin") };
}
