import { moments, type Moment } from "@/config/content";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const ICONS: Record<Moment["icon"], string> = {
  prayer: "prayer",
  walk: "footprints",
  car: "car",
  ball: "padel",
  family: "baby",
  desk: "laptop",
};

export function Moments() {
  return (
    <section className="py-20 md:py-28" aria-labelledby="moments-title">
      <div className="container-x">
        <SectionHeading
          id="moments-title"
          eyebrow="ما الذي نعمل من أجله؟"
          title={
            <>
              نريدك أن تعود
              <br />
              <span className="text-brand-600">إلى تفاصيل يومك التي تحبها</span>
            </>
          }
          lead="الألم يأخذ منك أشياء صغيرة: سجدة مريحة، ومشوارًا إلى الحرم، ولعبًا مع أطفالك. نكتب هذه التفاصيل أهدافًا في خطتك من أول زيارة."
        />
      </div>
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 md:container-x md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-6">
        {moments.map((m, i) => {
          return (
            <Reveal key={m.id} delay={i * 0.06} className="card group relative w-[78%] shrink-0 snap-center overflow-hidden p-6 transition-shadow hover:shadow-[var(--shadow-lift)] sm:w-[46%] md:w-auto">
              <div className="absolute -top-10 -end-10 size-32 rounded-full bg-leaf-300/15 transition-transform duration-500 group-hover:scale-125" aria-hidden />
              <Icon3D name={ICONS[m.icon]} size={68} className="relative -ms-1 transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-4deg]" />
              <h3 className="relative mt-5 text-xl font-bold">{m.title}</h3>
              <p className="relative mt-2 leading-8 text-muted">{m.text}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
