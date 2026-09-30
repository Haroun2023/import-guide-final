import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { programToComplaint } from "@/config/booking";
import { programs } from "@/config/content";
import { useBooking } from "@/components/booking/BookingContext";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const TABS = [
  { id: "rehab", label: "التأهيل الطبي" },
  { id: "wellness", label: "الرعاية التكميلية" },
] as const;

export function Programs() {
  const [tab, setTab] = useState<"rehab" | "wellness">("rehab");
  const { openBooking } = useBooking();
  const list = programs.filter((p) => p.track === tab);

  return (
    <section id="programs" className="bg-mist-100/70 py-20 md:py-28" aria-labelledby="programs-title">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="programs-title"
            eyebrow="البرامج العلاجية"
            title="برنامج لكل حالة… وخطة لكل شخص"
            lead="التأهيل الطبي هو أساس عملنا، وتكمّله خدمات رعاية داعمة عند الحاجة — ضمن خطة واحدة متكاملة."
          />
          <div role="tablist" aria-label="نوع البرامج" className="inline-flex shrink-0 rounded-full bg-white p-1 shadow-sm ring-1 ring-mist-200">
            {TABS.map((t) => (
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
        {list.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal key={p.id} delay={(i % 3) * 0.06} as="article" className="card relative flex w-[84%] shrink-0 snap-center flex-col p-6 sm:w-[60%] md:w-auto">
              {p.featured ? (
                <span className="absolute end-5 top-5 inline-flex items-center gap-1 rounded-full bg-leaf-100 px-2.5 py-1 text-xs font-semibold text-leaf-700">
                  <Sparkles size={13} aria-hidden /> {p.featured}
                </span>
              ) : null}
              <div className={`grid size-13 place-items-center rounded-2xl ${p.track === "rehab" ? "bg-brand-700 text-white" : "bg-leaf-100 text-leaf-700"}`}>
                <Icon size={26} aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold">{p.title}</h3>
              <p className="mt-2 leading-8 text-muted">{p.short}</p>
              <ul className="mt-4 grid gap-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-[0.95rem]">
                    <Check size={16} className="shrink-0 text-brand-500" aria-hidden /> {pt}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-auto inline-flex items-center gap-2 pt-6 font-semibold text-brand-700 hover:text-brand-900"
                onClick={() =>
                  openBooking({
                    placement: `program:${p.id}`,
                    complaint: programToComplaint[p.id],
                    mode: p.id === "home" ? "home" : undefined,
                  })
                }
              >
                احجز لهذا البرنامج <ArrowLeft size={17} aria-hidden />
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
