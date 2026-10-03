import { BadgeCheck, Star } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { site } from "@/config/site";
import { CountUp } from "@/components/ui/CountUp";
import { Icon3D } from "@/components/ui/Icon3D";
import { OpenDot, useOpenState } from "@/components/ui/OpenStatus";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The angles that held up when checked against every center in Madinah
 * (docs/RESEARCH_AR.md §2.6): no other clinic there advertises AlterG, a program
 * for visitors, or Friday hours. Licensed cupping and device lymph drainage are
 * offered elsewhere too, so they stay on their program pages.
 */
const STANDOUTS = [
  { href: "/visit", icon: "calendar-check", label: "نستقبلكم الجمعة أيضًا" },
  { href: "/devices/antigravity", icon: "activity", label: "مشي بوزن أخف على جهاز AlterG" },
  { href: "/programs/umrah", icon: "footprints", label: "برنامج لزوار المدينة والمعتمرين" },
];

function Chip({ href, links, children }: { href: string; links: boolean; children: ReactNode }) {
  const cls = "inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-ink shadow-sm ring-1 ring-mist-200";
  return links ? (
    <Link href={href} className={`${cls} transition hover:-translate-y-0.5 hover:ring-brand-300`}>
      {children}
    </Link>
  ) : (
    <span className={cls}>{children}</span>
  );
}

/** Stats card under the hero, then the few things that set the center apart. `links` off on landing pages. */
export function TrustStrip({ links = true }: { links?: boolean }) {
  const open = useOpenState();
  const hours = site.hours.map((h) => `${h.days} ${h.time}`).join(" · ");

  return (
    <section aria-label="أرقام وثقة" className="trust-strip relative z-10 -mt-10">
      <div className="container-x">
        <Reveal className="card grid grid-cols-2 gap-px overflow-hidden bg-mist-200 p-0 md:grid-cols-4">
          {site.stats.map((s) => (
            <div key={s.label} className="bg-white px-4 py-6 text-center sm:px-6">
              <p className="text-gradient-brand text-[1.9rem] font-bold leading-[1.15] sm:text-[2.3rem]">
                <CountUp value={s.value} />
              </p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </Reveal>

        <ul aria-label="ما يميزنا" className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {/* The prerendered page shows the hours; the live status replaces them once the page runs */}
          <li>
            <Chip href="/visit" links={links}>
              {open ? <OpenDot state={open} /> : <Icon3D name="clock" variant="glyph" size={22} />}
              {open ? open.label : hours}
            </Chip>
          </li>
          {STANDOUTS.map((s) => (
            <li key={s.href}>
              <Chip href={s.href} links={links}>
                <Icon3D name={s.icon} variant="glyph" size={22} />
                {s.label}
              </Chip>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <BadgeCheck size={17} className="text-brand-600" aria-hidden /> أخصائيون مرخّصون ومصنّفون مهنيًا
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck size={17} className="text-brand-600" aria-hidden /> على معايير {site.partner.name} في الرعاية
          </span>
          {site.rating ? (
            <a href={site.rating.url || undefined} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5">
              <Star size={17} className="fill-leaf-400 text-leaf-400" aria-hidden />
              <strong className="text-ink">{site.rating.value}</strong> من {site.rating.count.toLocaleString("en-US")} تقييم على {site.rating.source}
            </a>
          ) : null}
          {site.license.moh ? (
            <span className="inline-flex items-center gap-2">
              <BadgeCheck size={17} className="text-brand-600" aria-hidden /> {site.license.moh}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
