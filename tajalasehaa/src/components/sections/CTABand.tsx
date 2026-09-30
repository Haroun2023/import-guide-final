import { ArrowLeft, Check } from "lucide-react";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { useBooking, type BookingPrefill } from "@/components/booking/BookingContext";
import { CallLink, WhatsAppLink } from "@/components/layout/ContactLinks";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal } from "@/components/ui/Reveal";

/** Mid-page nudge: one clear next step, with the reassurance right next to it. */
export function CTABand({
  title,
  text,
  booking,
  icon = "calendar-check",
  whatsappText,
}: {
  title: ReactNode;
  text?: ReactNode;
  booking: BookingPrefill;
  icon?: string;
  whatsappText?: string;
}) {
  const { openBooking } = useBooking();
  const reassure = [
    `نرد عليك خلال ${site.responseTimeMinutes} دقيقة في أوقات العمل`,
    "التقييم أولًا، ثم خطة مكتوبة",
    site.features.femaleTherapists ? "أخصائيات للسيدات" : null,
  ].filter(Boolean) as string[];

  return (
    <section className="py-14 md:py-20" aria-label="احجز تقييمك">
      <div className="container-x">
        <Reveal className="grain relative isolate overflow-hidden rounded-[2rem] bg-deep-radial px-6 py-10 text-white sm:px-10 md:py-12">
          <div className="pointer-events-none absolute -bottom-24 -start-16 -z-10 size-80 rounded-full bg-[radial-gradient(closest-side,rgb(90_206_144/0.25),transparent)]" aria-hidden />
          <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
            <Icon3D name={icon} size={88} className="hidden drop-shadow-[0_18px_30px_rgb(0_0_0/0.35)] lg:block" />
            <div>
              <h2 className="text-2xl font-bold leading-snug md:text-[1.9rem]">{title}</h2>
              {text ? <p className="mt-3 max-w-2xl leading-8 text-white/75">{text}</p> : null}
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
                {reassure.map((r) => (
                  <li key={r} className="flex items-center gap-2">
                    <Check size={15} className="text-leaf-300" aria-hidden /> {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <button type="button" className="btn btn-leaf btn-shine" onClick={() => openBooking(booking)}>
                {site.offer.active ? "احجز تقييمك المجاني" : "احجز تقييمك"} <ArrowLeft size={18} aria-hidden />
              </button>
              <WhatsAppLink placement={`${booking.placement}:whatsapp`} message={whatsappText} className="btn btn-ghost-dark">
                <WhatsAppIcon size={20} /> اسألنا على واتساب
              </WhatsAppLink>
              <CallLink placement={`${booking.placement}:call`} className="btn btn-ghost-dark sm:col-span-2 lg:col-span-1" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
