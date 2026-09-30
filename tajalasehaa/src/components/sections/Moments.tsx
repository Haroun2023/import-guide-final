import { Baby, CarFront, Footprints, Laptop } from "lucide-react";
import type { ComponentType } from "react";
import { moments, type Moment } from "@/config/content";
import { PadelIcon, PrayerIcon } from "@/components/ui/Icons";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const ICONS: Record<Moment["icon"], ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  prayer: PrayerIcon,
  walk: Footprints,
  car: CarFront,
  ball: PadelIcon,
  family: Baby,
  desk: Laptop,
};

export function Moments() {
  return (
    <section className="py-20 md:py-28" aria-labelledby="moments-title">
      <div className="container-x">
        <SectionHeading
          id="moments-title"
          eyebrow="لماذا نعالج؟"
          title={
            <>
              هدفنا ليس تخفيف الألم فقط…
              <br />
              <span className="text-brand-600">بل أن تعود إلى ما تحب</span>
            </>
          }
          lead="نقيس نجاح العلاج بلحظات حياتك اليومية — ونضعها أهدافًا واضحة في خطتك من اليوم الأول."
        />
      </div>
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 md:container-x md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-6">
        {moments.map((m, i) => {
          const Icon = ICONS[m.icon];
          return (
            <Reveal key={m.id} delay={i * 0.06} className="card group relative w-[78%] shrink-0 snap-center overflow-hidden p-6 transition-shadow hover:shadow-[var(--shadow-lift)] sm:w-[46%] md:w-auto">
              <div className="absolute -top-10 -end-10 size-32 rounded-full bg-leaf-300/15 transition-transform duration-500 group-hover:scale-125" aria-hidden />
              <div className="relative grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <Icon size={28} aria-hidden />
              </div>
              <h3 className="relative mt-5 text-xl font-bold">{m.title}</h3>
              <p className="relative mt-2 leading-8 text-muted">{m.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
