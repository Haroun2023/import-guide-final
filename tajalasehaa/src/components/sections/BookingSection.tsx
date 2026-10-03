import { Clock, MapPin } from "lucide-react";
import { copy, fill } from "@/config/copy";
import { site } from "@/config/site";
import { BookingWizard } from "@/components/booking/BookingWizard";
import type { BookingPrefill } from "@/components/booking/BookingContext";
import { CallLink, WhatsAppLink } from "@/components/layout/ContactLinks";
import { Kinetic } from "@/components/ui/Kinetic";
import { Note } from "@/components/ui/Note";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { Reveal } from "@/components/ui/Reveal";

export function BookingSection({ prefill, title }: { prefill?: BookingPrefill; /** *starred* words get the highlight */ title?: string }) {
  return (
    <section id="booking" className="curve-t grain relative overflow-hidden bg-deep-radial py-20 text-white md:py-28" aria-labelledby="booking-title">
      <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <Reveal className="kinetic">
            <p className="eyebrow eyebrow-light">{copy.booking.eyebrow}</p>
            <h2 id="booking-title" className="h-section mt-3">
              <Kinetic text={title ?? copy.booking.title} accent="dark" />
            </h2>
            <p className="lead-text mt-4 !text-white/70">{fill(copy.booking.lead, { response: site.responseTimeMinutes, city: site.city })}</p>
          </Reveal>

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
                <OpenStatus className="mt-1 text-sm text-leaf-300" />
              </span>
            </li>
          </ul>
        </div>

        <div className="relative pt-12 lg:pt-0">
          <Note tone="light" arrow="curve" delay={0.4} className="absolute end-10 top-0 z-10 lg:-top-16" arrowClassName="-scale-y-100 top-7 left-[-2.4rem]">
            خطوة صغيرة منك، والباقي علينا
          </Note>
          <Reveal className="rounded-[2rem] bg-mist-50 p-5 text-ink shadow-2xl sm:p-8">
            <div data-hide-cta>
              <BookingWizard prefill={prefill ?? { placement: "booking-section" }} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
