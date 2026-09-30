import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { telLink } from "@/config/site";
import { trackContact } from "@/lib/tracking";
import { useBooking } from "@/components/booking/BookingContext";
import { Logo } from "@/components/ui/Logo";
import { DemoBanner } from "./DemoBanner";
import { WhatsAppLink } from "./ContactLinks";

const NAV = [
  { href: "/#pain-map", label: "أين يؤلمك؟" },
  { href: "/#programs", label: "البرامج" },
  { href: "/#devices", label: "التقنيات" },
  { href: "/#journey", label: "رحلة التعافي" },
  { href: "/#about", label: "من نحن" },
  { href: "/#faq", label: "الأسئلة" },
];

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/**
 * `overDark`: transparent over a dark hero until the page scrolls.
 * `minimal`: campaign landing pages — logo + call only (no exits).
 */
export function Header({ overDark = true, minimal = false }: { overDark?: boolean; minimal?: boolean }) {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const { openBooking } = useBooking();
  const light = overDark && !scrolled && !open;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <DemoBanner />
      <div
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          light ? "bg-transparent" : "bg-mist-50/90 shadow-[0_1px_0_rgb(200_211_213/0.8)] backdrop-blur-xl"
        }`}
      >
        <div className="container-x flex h-[4.25rem] items-center justify-between gap-4">
          <a href="/" className="shrink-0" aria-label="الصفحة الرئيسية">
            <Logo tone={light ? "light" : "dark"} crossfade className="h-9 sm:h-10" />
          </a>

          {!minimal ? (
            <nav aria-label="القائمة الرئيسية" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a
                      href={n.href}
                      className={`rounded-full px-3.5 py-2 text-[0.94rem] font-medium transition-colors ${
                        light ? "text-white/85 hover:bg-white/10 hover:text-white" : "text-ink/80 hover:bg-mist-100 hover:text-ink"
                      }`}
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className="flex items-center gap-2">
            <a
              href={telLink()}
              onClick={() => trackContact("call", "header")}
              className={`grid size-11 place-items-center rounded-full transition-colors ${light ? "text-white hover:bg-white/10" : "text-ink hover:bg-mist-100"}`}
              aria-label="اتصل بنا"
            >
              <Phone size={20} aria-hidden />
            </a>
            <button
              type="button"
              className={`btn ${light ? "btn-leaf" : "btn-primary"} hidden min-h-11 px-5 text-[0.95rem] sm:inline-flex`}
              onClick={() => openBooking({ placement: minimal ? "lp-header" : "header" })}
            >
              احجز تقييمك
            </button>
            {!minimal ? (
              <button
                type="button"
                className={`grid size-11 place-items-center rounded-full lg:hidden ${light ? "text-white hover:bg-white/10" : "text-ink hover:bg-mist-100"}`}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
              </button>
            ) : null}
          </div>
        </div>

        {open && !minimal ? (
          <div id="mobile-menu" className="border-t border-mist-200 bg-mist-50 lg:hidden">
            <nav aria-label="قائمة الجوال" className="container-x py-4">
              <ul className="grid gap-1">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-lg font-medium hover:bg-mist-100">
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="btn btn-primary px-4"
                  onClick={() => {
                    setOpen(false);
                    openBooking({ placement: "mobile-menu" });
                  }}
                >
                  احجز تقييمك
                </button>
                <WhatsAppLink placement="mobile-menu" className="btn btn-whatsapp px-4" />
              </div>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
