import { CalendarCheck, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { telLink, whatsappLink, site } from "@/config/site";
import { trackContact } from "@/lib/tracking";
import { useBooking } from "@/components/booking/BookingContext";
import { WhatsAppIcon } from "@/components/ui/Icons";

/**
 * Sticky bottom bar on phones: Call · WhatsApp · Book. Appears after the
 * hero and hides while any element marked [data-hide-cta] (e.g. the booking
 * form) is on screen, so it never covers the form itself.
 */
export function MobileCTABar({ placement = "sticky-bar", complaint }: { placement?: string; complaint?: string }) {
  const { openBooking } = useBooking();
  const [pastHero, setPastHero] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const targets = document.querySelectorAll("[data-hide-cta]");
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setFormVisible(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const shown = pastHero && !formVisible;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 transition-transform duration-300 md:hidden ${
        shown ? "translate-y-0" : "pointer-events-none translate-y-[130%]"
      }`}
      aria-hidden={!shown}
    >
      <div className="flex items-center gap-2 rounded-[1.4rem] bg-deep/95 p-2 shadow-2xl ring-1 ring-white/10 backdrop-blur">
        <a
          href={telLink()}
          onClick={() => trackContact("call", placement)}
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10 text-white"
          aria-label={`اتصل ${site.contact.phoneDisplay}`}
          tabIndex={shown ? 0 : -1}
        >
          <Phone size={20} aria-hidden />
        </a>
        <a
          href={whatsappLink(`مرحبًا ${site.name}، أرغب بحجز موعد تقييم.`)}
          target="_blank"
          rel="noopener"
          onClick={() => trackContact("whatsapp", placement)}
          className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#25d366] text-white"
          aria-label="تواصل واتساب"
          tabIndex={shown ? 0 : -1}
        >
          <WhatsAppIcon size={22} />
        </a>
        <button
          type="button"
          onClick={() => openBooking({ placement, complaint })}
          className="btn btn-leaf btn-shine min-h-12 flex-1 rounded-2xl text-[1rem]"
          tabIndex={shown ? 0 : -1}
        >
          <CalendarCheck size={19} aria-hidden /> {site.offer.active ? "احجز تقييمك المجاني" : "احجز تقييمك"}
        </button>
      </div>
    </div>
  );
}
