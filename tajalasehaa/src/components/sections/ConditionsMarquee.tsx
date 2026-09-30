import { Sparkle } from "lucide-react";

const ITEMS = [
  "الانزلاق الغضروفي",
  "خشونة الركبة",
  "الكتف المتجمّد",
  "عرق النسا",
  "الرباط الصليبي",
  "آلام الرقبة",
  "ما بعد العمليات",
  "مرفق التنس",
  "آلام الحمل وما بعد الولادة",
  "التواء الكاحل",
  "ألم الكعب",
  "تيبّس المفاصل",
];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-7 pe-7 md:gap-10 md:pe-10" aria-hidden={hidden || undefined}>
      {ITEMS.map((t, i) => (
        <li key={t} className="flex items-center gap-7 md:gap-10">
          <span className={i % 2 ? "outline-word" : "text-navy-700"}>{t}</span>
          <Sparkle size={22} className="shrink-0 fill-leaf-400 text-leaf-400" aria-hidden />
        </li>
      ))}
    </ul>
  );
}

/** A slow band of the conditions we see most, in big type (pauses on hover). */
export function ConditionsMarquee() {
  return (
    <section aria-label="حالات نعالجها كثيرًا" className="marquee-band overflow-hidden py-6 md:py-8 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <div className="marquee-track whitespace-nowrap text-[clamp(1.7rem,1.1rem+2.6vw,3.4rem)] font-bold leading-[1.4] [animation-duration:75s]">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
