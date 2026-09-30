import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { areaToComplaint } from "@/config/booking";
import { bodyAreas } from "@/config/body";
import { programById } from "@/config/content";
import { useBooking } from "@/components/booking/BookingContext";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

/** Every body area with its usual conditions, a link to its program and a booking shortcut. */
export function ConditionsIndex() {
  const { openBooking } = useBooking();
  return (
    <section className="bg-mist-100/70 py-20 md:py-24" aria-labelledby="conditions-title">
      <div className="container-x">
        <SectionHeading
          id="conditions-title"
          eyebrow="الحالات حسب المنطقة"
          title="ما الذي نراه كثيرًا في كل منطقة؟"
          lead="هذه أمثلة لا تشخيص. الأخصائي هو من يحدد سبب ألمك بعد التقييم."
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bodyAreas.map((a, i) => {
            const program = programById(a.program);
            return (
              <Reveal as="li" key={a.id} delay={(i % 3) * 0.05} className="card flex flex-col p-6">
                <h3 className="flex items-center gap-2 text-xl font-bold">
                  <span className="size-2.5 rounded-full bg-coral-500" aria-hidden />
                  {a.label}
                </h3>
                <p className="mt-2 leading-7 text-muted">{a.insight}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {a.conditions.map((c) => (
                    <li key={c} className="rounded-full bg-mist-100 px-3 py-1.5 text-sm">
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-900"
                    onClick={() => openBooking({ placement: `conditions:${a.id}`, complaint: areaToComplaint[a.id] })}
                  >
                    احجز تقييمًا <ArrowLeft size={16} aria-hidden />
                  </button>
                  {program ? (
                    <Link href={`/programs/${program.id}`} className="text-sm text-muted underline decoration-mist-300 underline-offset-4 hover:text-ink">
                      عن برنامج {program.title}
                    </Link>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
