import { Check, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { complaints } from "@/config/booking";
import { site } from "@/config/site";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { CallLink, WhatsAppLink } from "@/components/layout/ContactLinks";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Commitments } from "@/components/sections/Commitments";
import { FAQ } from "@/components/sections/FAQ";
import { InsuranceCheck } from "@/components/sections/InsuranceCheck";
import { Icon3D } from "@/components/ui/Icon3D";
import { OpenStatus } from "@/components/ui/OpenStatus";

const NEXT = [
  { icon: "message-circle", title: "نتصل بك", text: `خلال ${site.responseTimeMinutes} دقيقة في أوقات العمل، لنختار معك الموعد المناسب.` },
  { icon: "stethoscope", title: "تقييمك الأول", text: "نسمعك، ونفحص حركتك، ونشرح لك سبب الألم بكلام واضح." },
  { icon: "clipboard-list", title: "خطتك مكتوبة", text: "أهداف وعدد جلسات تقديري، تعرفها قبل أن تبدأ." },
];

/** /book (?c=<complaint> preselects the reason): the booking form above the fold, reassurance around it. */
export default function BookPage() {
  // Read ?c= after hydration (the prerendered page has no query string).
  const [complaint, setComplaint] = useState<string>();
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    if (c && complaints.some((x) => x.id === c)) setComplaint(c);
  }, []);
  const branch = site.branches[0];

  return (
    <SiteLayout placement="book:sticky">
      <section className="grain relative isolate overflow-hidden bg-deep-radial pb-20 pt-28 text-white md:pt-36" aria-labelledby="page-title">
        {/* Phones: heading → form → reassurance. Desktop: copy on one side, the form on the other. */}
        <div className="container-x grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-x-16">
          <div>
            <p className="eyebrow eyebrow-light">احجز تقييمك</p>
            <h1 id="page-title" className="h-section mt-3">
              خطوتك الأولى
              <br />
              <span className="text-gradient-leaf">تأخذ أقل من دقيقة</span>
            </h1>
            <p className="lead-text mt-4 !text-white/75">
              {site.offer.active ? `${site.offer.label}. ` : ""}اترك اسمك ورقمك وسبب الزيارة، ونتصل بك لنرتّب الباقي معك.
            </p>
          </div>

          <div className="rounded-[2rem] bg-mist-50 p-5 text-ink shadow-2xl sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1" data-hide-cta>
            <BookingWizard key={complaint ?? "any"} prefill={{ placement: "book-page", complaint }} />
          </div>

          <div>
            <ol className="grid gap-4">
              {NEXT.map((n, i) => (
                <li key={n.title} className="glass-dark flex items-center gap-4 rounded-2xl p-4">
                  <Icon3D name={n.icon} variant="light" size={48} className="shrink-0" />
                  <div>
                    <p className="font-bold">
                      <span className="text-leaf-300">{i + 1}.</span> {n.title}
                    </p>
                    <p className="text-[0.95rem] leading-7 text-white/70">{n.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <WhatsAppLink placement="book-page" className="btn btn-whatsapp" />
              <CallLink placement="book-page" className="btn btn-ghost-dark" />
            </div>
            <ul className="mt-6 grid gap-3 text-sm text-white/70">
              {branch ? (
                <li className="flex items-start gap-2">
                  <MapPin size={17} className="mt-0.5 shrink-0 text-leaf-400" aria-hidden /> {branch.address}
                </li>
              ) : null}
              <li className="flex items-start gap-2">
                <Clock size={17} className="mt-0.5 shrink-0 text-leaf-400" aria-hidden />
                <span>
                  {site.hours.map((h) => `${h.days}: ${h.time}`).join(" · ")}
                  <OpenStatus className="ms-2 text-leaf-300" />
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check size={17} className="mt-0.5 shrink-0 text-leaf-400" aria-hidden /> لا نشارك تفاصيلك الصحية مع أي منصة إعلانية.
              </li>
            </ul>
          </div>
        </div>
      </section>
      <Commitments />
      <InsuranceCheck />
      <FAQ limit={4} moreLink />
    </SiteLayout>
  );
}
