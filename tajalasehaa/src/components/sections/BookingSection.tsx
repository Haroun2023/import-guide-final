import { Clock, MapPin } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { BookingWizard } from "@/components/booking/BookingWizard";
import type { BookingPrefill } from "@/components/booking/BookingContext";
import { CallLink, WhatsAppLink } from "@/components/layout/ContactLinks";
import { Reveal } from "@/components/ui/Reveal";

export function BookingSection({ prefill, title }: { prefill?: BookingPrefill; title?: ReactNode }) {
  return (
    <section id="booking" className="grain relative overflow-hidden bg-deep-radial py-20 text-white md:py-28" aria-labelledby="booking-title">
      <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="eyebrow eyebrow-light">احجز الآن</p>
          <h2 id="booking-title" className="h-section mt-3">
            {title ?? (
              <>
                خطوتك الأولى نحو <span className="text-gradient-leaf">حركة بلا ألم</span>
              </>
            )}
          </h2>
          <p className="lead-text mt-4 !text-white/70">
            املأ الطلب في أقل من دقيقة، ويتواصل معك منسّق المرضى خلال {site.responseTimeMinutes} دقيقة في أوقات العمل لتأكيد الموعد الأنسب لك.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <WhatsAppLink placement="booking-section" className="btn btn-whatsapp" />
            <CallLink placement="booking-section" className="btn btn-ghost-dark" />
          </div>

          <ul className="mt-8 grid gap-4 text-white/75">
            {site.branches.map((b) => (
              <li key={b.id}>
                <a href={b.directionsUrl ?? b.mapsUrl} target="_blank" rel="noopener" className="flex items-start gap-3 hover:text-white">
                  <MapPin size={20} className="mt-1 shrink-0 text-leaf-400" aria-hidden />
                  <span>
                    <strong className="block text-white">{b.name}</strong>
                    {b.address} · <span className="underline underline-offset-4">الاتجاهات</span>
                  </span>
                </a>
              </li>
            ))}
            <li className="flex items-start gap-3">
              <Clock size={20} className="mt-1 shrink-0 text-leaf-400" aria-hidden />
              <span>
                {site.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>

        <Reveal className="rounded-[2rem] bg-mist-50 p-5 text-ink shadow-2xl sm:p-8" >
          <div data-hide-cta>
            <BookingWizard prefill={prefill ?? { placement: "booking-section" }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
