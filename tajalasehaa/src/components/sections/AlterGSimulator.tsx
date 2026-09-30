import { ArrowLeft } from "lucide-react";
import { useId, useState } from "react";
import { deviceById, deviceSrc } from "@/config/devices";
import { useBooking } from "@/components/booking/BookingContext";
import { WhatsAppLink } from "@/components/layout/ContactLinks";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

/** The AlterG takes up to 80% of your weight off, set in 1% steps. */
const MIN_PCT = 20;

/**
 * "Try it yourself": pick your weight and a setting, see how many kilos your
 * legs carry while walking on the AlterG. Illustration only; the therapist sets
 * the real percentage.
 */
export function AlterGSimulator({ placement, complaint }: { placement: string; complaint?: string }) {
  const { openBooking } = useBooking();
  const id = useId();
  const [weight, setWeight] = useState(85);
  const [pct, setPct] = useState(50);
  const carried = Math.round((weight * pct) / 100);
  const lifted = weight - carried;
  const alterg = deviceById("antigravity");

  return (
    <section className="py-16 md:py-24" aria-labelledby={`${id}-title`}>
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            id={`${id}-title`}
            eyebrow="جرّبها بنفسك"
            title="كم كيلوجرامًا ستحمل ركبتاك وأنت تمشي على AlterG؟"
            lead="حرّك المؤشرين لترى الفرق: وزنك، والنسبة التي يضبطها الأخصائي. يرفع الجهاز بضغط الهواء حتى 80% من وزنك، فتمشي بخطوات طبيعية وحِمل أخف على مفاصلك."
          />
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary btn-shine" onClick={() => openBooking({ placement, complaint })}>
              احجز تقييمك <ArrowLeft size={18} aria-hidden />
            </button>
            <WhatsAppLink placement={placement} message="السلام عليكم، أريد أن أعرف إن كان جهاز AlterG مناسبًا لحالتي." className="btn btn-ghost">
              <WhatsAppIcon size={19} /> اسأل عن AlterG
            </WhatsAppLink>
          </div>
        </div>

        <Reveal className="card relative overflow-hidden p-5 sm:p-7">
          <div className="pointer-events-none absolute -end-16 -top-16 size-56 rounded-full bg-[radial-gradient(closest-side,rgb(154_216_255/0.35),transparent)]" aria-hidden />
          <div className="relative flex items-center gap-4">
            <img src={deviceSrc(alterg.image, 480)} alt="" width={Math.round(76 * alterg.image.aspect)} height={76} loading="lazy" decoding="async" className="h-19 w-auto object-contain" />
            <div className="min-w-0">
              <p className="text-sm text-muted">تحمل قدماك وأنت تمشي</p>
              <p className="tabular text-[2.6rem] font-bold leading-none text-brand-700" aria-live="polite">
                {carried} <span className="text-xl font-semibold">كجم</span>
              </p>
              <p className="mt-1.5 text-sm text-muted">
                بدل <span className="tabular">{weight}</span> كجم · أخف بـ <strong className="tabular text-ink">{lifted} كجم</strong>
              </p>
            </div>
          </div>

          {/* The body weight as one bar: the part your legs carry, and the part the air lifts */}
          <div className="relative mt-6" aria-hidden>
            <div className="flex h-4 overflow-hidden rounded-full bg-mist-100 ring-1 ring-mist-200">
              <div className="rounded-full bg-gradient-to-l from-brand-600 to-leaf-400 transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted">
              <span>تحمله قدماك</span>
              <span>يرفعه الهواء</span>
            </div>
          </div>

          <div className="relative mt-6 grid gap-5">
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`${id}-weight`} className="font-semibold">
                  وزنك
                </label>
                <span className="tabular text-sm text-muted">{weight} كجم</span>
              </div>
              <input
                id={`${id}-weight`}
                type="range"
                min={40}
                max={160}
                step={1}
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                aria-valuetext={`${weight} كيلوجرامًا`}
                className="mt-2 h-8 w-full cursor-pointer accent-[var(--color-brand-600)]"
              />
            </div>
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={`${id}-pct`} className="font-semibold">
                  الوزن الذي تمشي به
                </label>
                <span className="tabular text-sm text-muted">{pct}% من وزنك</span>
              </div>
              <input
                id={`${id}-pct`}
                type="range"
                min={MIN_PCT}
                max={100}
                step={1}
                value={pct}
                onChange={(e) => setPct(Number(e.target.value))}
                aria-valuetext={`${pct}% من وزنك، أي ${carried} كيلوجرامًا`}
                className="mt-2 h-8 w-full cursor-pointer accent-[var(--color-brand-600)]"
              />
              <p className="mt-1 text-xs text-muted">أقل ضبط هو {MIN_PCT}% من وزنك، والجهاز يتدرج بخطوات من 1%.</p>
            </div>
          </div>

          <p className="relative mt-6 rounded-2xl bg-mist-50 px-4 py-3 text-sm leading-7 text-muted ring-1 ring-mist-200">
            الأرقام للتوضيح. الأخصائي يحدد النسبة المناسبة لحالتك بعد التقييم، ثم يرفعها تدريجيًا مع تقدّمك.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
