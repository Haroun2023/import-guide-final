import { ArrowLeft, ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "wouter";
import { site } from "@/config/site";
import { useBooking, type BookingPrefill } from "@/components/booking/BookingContext";
import { WhatsAppLink } from "@/components/layout/ContactLinks";
import { WhatsAppIcon } from "@/components/ui/Icons";

export type Crumb = { href: string; label: string };

function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="مسار الصفحة">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
        <li>
          <Link href="/" className="hover:text-white">
            الرئيسية
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={c.href} className="flex items-center gap-1.5">
            <ChevronLeft size={14} aria-hidden className="text-white/35" />
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-white/85">
                {c.label}
              </span>
            ) : (
              <Link href={c.href} className="hover:text-white">
                {c.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Dark page header for inner pages: breadcrumbs, the page's H1, a short lead
 * and the two actions that matter (book / WhatsApp). `aside` shows art on
 * wide screens.
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  booking,
  whatsappText,
  aside,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  booking: BookingPrefill;
  whatsappText?: string;
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const { openBooking } = useBooking();
  return (
    <section className="grain relative isolate overflow-hidden bg-deep-radial pb-16 pt-28 text-white md:pb-20 md:pt-36" aria-labelledby="page-title">
      <div className="pointer-events-none absolute -top-40 end-[-10%] -z-10 size-[34rem] rounded-full bg-[radial-gradient(closest-side,rgb(90_206_144/0.18),transparent)]" aria-hidden />
      <div className={`container-x grid items-center gap-10 ${aside ? "lg:grid-cols-[1.35fr_1fr]" : ""}`}>
        <div className="max-w-3xl">
          <Breadcrumbs items={crumbs} />
          {eyebrow ? <p className="eyebrow eyebrow-light mt-7 animate-rise">{eyebrow}</p> : null}
          <h1 id="page-title" className="h-section mt-3 animate-rise text-white [animation-delay:80ms]">
            {title}
          </h1>
          {lead ? <p className="lead-text mt-5 max-w-2xl animate-rise !text-white/75 [animation-delay:160ms]">{lead}</p> : null}
          <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:240ms]">
            <button type="button" className="btn btn-leaf btn-shine" onClick={() => openBooking(booking)}>
              {site.offer.active ? "احجز تقييمك المجاني" : "احجز تقييمك"}
              <ArrowLeft size={18} aria-hidden />
            </button>
            <WhatsAppLink placement={`${booking.placement}:whatsapp`} message={whatsappText} className="btn btn-ghost-dark">
              <WhatsAppIcon size={20} /> اسألنا على واتساب
            </WhatsAppLink>
          </div>
          {children}
        </div>
        {aside ? <div className="hidden animate-rise [animation-delay:200ms] lg:block">{aside}</div> : null}
      </div>
    </section>
  );
}
