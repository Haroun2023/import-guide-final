import { BadgeCheck, Star } from "lucide-react";
import { site } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

export function TrustStrip() {
  return (
    <section aria-label="أرقام وثقة" className="relative z-10 -mt-14">
      <div className="container-x">
        <Reveal className="card grid grid-cols-2 gap-px overflow-hidden bg-mist-200 p-0 md:grid-cols-4">
          {site.stats.map((s) => (
            <div key={s.label} className="bg-white px-4 py-6 text-center sm:px-6">
              <p className="text-[1.9rem] font-bold leading-none text-brand-700 tabular sm:text-[2.2rem]">{s.value}</p>
              <p className="mt-2 text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </Reveal>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <BadgeCheck size={17} className="text-brand-600" aria-hidden /> أخصائيون مرخّصون ومصنّفون مهنيًا
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck size={17} className="text-brand-600" aria-hidden /> بمعايير {site.partner.name} الدولية
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
