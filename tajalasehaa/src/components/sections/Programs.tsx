import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { programs, type Program } from "@/config/content";
import { copy } from "@/config/copy";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const TRACKS = [
  { id: "rehab", label: "التأهيل الطبي", note: "أساس عملنا: تقييم، ثم خطة، ثم تمارين نتابعها معك جلسة بجلسة." },
  { id: "wellness", label: "الرعاية التكميلية", note: "خدمات تدعم خطتك عند الحاجة، ولا تحل محلها." },
] as const;

function ProgramCard({ p, i }: { p: Program; i: number }) {
  const Watermark = p.icon;
  return (
    <Reveal
      as="article"
      delay={(i % 3) * 0.06}
      className="glow-card group relative flex h-full flex-col overflow-hidden p-6"
      data-featured={p.featured ? "" : undefined}
    >
      <Watermark size={150} strokeWidth={1} className="pointer-events-none absolute -bottom-8 -start-8 rotate-[-12deg] text-brand-600/[0.05] transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110" aria-hidden />
      {p.featured ? (
        <span className="absolute end-5 top-5 inline-flex items-center gap-1 rounded-full bg-gradient-to-l from-leaf-100 to-white px-2.5 py-1 text-xs font-semibold text-leaf-700 shadow-sm ring-1 ring-leaf-200">
          <Sparkles size={13} aria-hidden /> {p.featured}
        </span>
      ) : null}
      <Icon3D name={p.icon3d} size={72} className="-ms-1 drop-shadow-[0_12px_14px_rgb(16_40_58/0.16)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-[-5deg]" />
      <h3 className="mt-4 text-xl font-bold">
        <Link href={`/programs/${p.id}`} className="after:absolute after:inset-0 after:z-[2] after:rounded-[inherit] after:content-['']">
          {p.title}
        </Link>
      </h3>
      <p className="mt-2 leading-8 text-muted">{p.short}</p>
      <ul className="mt-4 grid gap-2">
        {p.points.map((pt) => (
          <li key={pt} className="flex items-center gap-2.5 text-[0.95rem]">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
              <Check size={12} strokeWidth={3} aria-hidden />
            </span>
            {pt}
          </li>
        ))}
      </ul>
      <span className="mt-auto flex items-center justify-between gap-3 pt-6 font-semibold text-brand-700" aria-hidden>
        اعرف أكثر عن البرنامج
        <span className="arrow-dot">
          <ArrowLeft size={17} />
        </span>
      </span>
    </Reveal>
  );
}

/**
 * Program cards linking to /programs/<id>.
 * `tabs`: one track at a time (home). `all`: both tracks with their own headings (programs page).
 */
export function Programs({ layout = "tabs", heading = true }: { layout?: "tabs" | "all"; heading?: boolean }) {
  const [tab, setTab] = useState<"rehab" | "wellness">("rehab");

  if (layout === "all") {
    return (
      <section id="programs" className="py-16 md:py-24" aria-label="البرامج العلاجية">
        {TRACKS.map((t) => (
          <div key={t.id} className="container-x mt-4 first:mt-0 [&+&]:mt-16">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 className="text-2xl font-bold md:text-3xl">{t.label}</h2>
              <p className="text-muted">{t.note}</p>
            </div>
            <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {programs
                .filter((p) => p.track === t.id)
                .map((p, i) => (
                  <ProgramCard key={p.id} p={p} i={i} />
                ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  const list = programs.filter((p) => p.track === tab);
  return (
    <section id="programs" className="curve-t bg-soft py-20 md:py-28" aria-labelledby={heading ? "programs-title" : undefined}>
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {heading ? (
            <SectionHeading id="programs-title" eyebrow={copy.programs.eyebrow} title={copy.programs.title} lead={copy.programs.lead} />
          ) : (
            <span />
          )}
          <div role="tablist" aria-label="نوع البرامج" className="inline-flex shrink-0 self-start rounded-full bg-white p-1 shadow-sm ring-1 ring-mist-200 md:self-auto">
            {TRACKS.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                id={`tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls="programs-panel"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors ${tab === t.id ? "bg-brand-700 text-white" : "text-muted hover:text-ink"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        id="programs-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 md:container-x md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-6 lg:grid-cols-3"
      >
        {list.map((p, i) => (
          <div key={p.id} className="w-[84%] shrink-0 snap-center sm:w-[60%] md:w-auto">
            <ProgramCard p={p} i={i} />
          </div>
        ))}
      </div>

      <div className="container-x mt-8 text-center">
        <Link href="/programs" className="btn btn-ghost">
          كل البرامج بالتفصيل <ArrowLeft size={18} aria-hidden />
        </Link>
      </div>
    </section>
  );
}
