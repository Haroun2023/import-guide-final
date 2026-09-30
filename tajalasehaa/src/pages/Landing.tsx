import { Check, Clock, Gift } from "lucide-react";
import { campaignBySlug } from "@/config/campaigns";
import { site } from "@/config/site";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import { BookingSection } from "@/components/sections/BookingSection";
import { Commitments } from "@/components/sections/Commitments";
import { DeviceLab } from "@/components/sections/DeviceLab";
import { FAQ } from "@/components/sections/FAQ";
import { Journey } from "@/components/sections/Journey";
import { PainMap } from "@/components/sections/PainMap";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { BrandMark } from "@/components/ui/Logo";
import NotFound from "./NotFound";

/**
 * Campaign landing page (/lp/<slug>): one message, one action.
 * No navigation menu, the form sits above the fold, and the headline repeats
 * the ad's promise (message match).
 */
export default function Landing({ slug }: { slug: string }) {
  const c = campaignBySlug(slug);
  if (!c) return <NotFound />;
  const placement = `lp:${c.slug}`;

  const trust = [
    `نتواصل خلال ${site.responseTimeMinutes} دقيقة`,
    site.features.femaleTherapists ? "أخصائيات للنساء" : null,
    site.features.homeVisits ? "زيارات منزلية" : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <Header minimal />
      <main id="main">
        <section className="grain relative overflow-hidden bg-deep-radial pb-24 pt-28 text-white md:pt-32" aria-labelledby="lp-title">
          <div className="container-x grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div className="lg:pt-8">
              <p className="inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-1.5 text-sm font-semibold text-leaf-300 ring-1 ring-white/15">
                <BrandMark size={16} tone="light" /> {c.eyebrow}
              </p>
              <h1 id="lp-title" className="mt-5 text-[clamp(2rem,1.3rem+3.4vw,3.6rem)] font-bold leading-[1.2]">
                {c.title}
                <br />
                <span className="text-gradient-leaf">{c.highlight}</span>
              </h1>
              <p className="mt-5 max-w-xl text-[1.05rem] leading-9 text-white/75">{c.sub}</p>

              <ul className="mt-7 hidden gap-3 lg:grid">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <span className="grid size-6 place-items-center rounded-full bg-leaf-400/20 text-leaf-300">
                      <Check size={15} aria-hidden />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] bg-mist-50 p-5 text-ink shadow-2xl sm:p-7" data-hide-cta>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">احجز تقييمك في أقل من دقيقة</h2>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted">
                  <Clock size={14} aria-hidden /> 45 ثانية
                </span>
              </div>
              <BookingWizard variant="quick" prefill={{ complaint: c.complaint, placement }} />
            </div>

            <ul className="grid gap-3 lg:hidden">
              {c.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-full bg-leaf-400/20 text-leaf-300">
                    <Check size={15} aria-hidden />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="container-x mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65">
            {site.offer.active ? (
              <span className="inline-flex items-center gap-2 text-leaf-300">
                <Gift size={16} aria-hidden /> {site.offer.label}
              </span>
            ) : null}
            {trust.map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Check size={15} className="text-leaf-400" aria-hidden /> {t}
              </span>
            ))}
          </div>
        </section>

        <TrustStrip />
        {c.device ? <DeviceLab initialDevice={c.device} only={[c.device]} /> : c.area ? <PainMap initialArea={c.area} compact /> : null}
        <Journey />
        <Commitments />
        <FAQ limit={6} />
        <BookingSection
          prefill={{ complaint: c.complaint, placement: `${placement}:bottom` }}
          title={
            <>
              {c.title} <span className="text-gradient-leaf">{c.highlight}</span>
            </>
          }
        />
      </main>
      <Footer />
      <MobileCTABar placement={`${placement}:sticky`} complaint={c.complaint} />
    </>
  );
}
