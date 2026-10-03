import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { lazy } from "react";
import { minutesAr } from "@/admin/count";
import { copy, fill } from "@/config/copy";
import { site } from "@/config/site";
import { useBooking } from "@/components/booking/BookingContext";
import { WhatsAppLink } from "@/components/layout/ContactLinks";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { HeroMark, RichText } from "@/components/ui/Kinetic";
import { Note } from "@/components/ui/Note";
import { greeting, useOpenState } from "@/components/ui/OpenStatus";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { SpinePoster } from "@/components/three/Posters";

const SpineScene = lazy(() => import("@/three/SpineScene"));

/** 15 → «ربع ساعة»: the way you would say it. */
const spoken = (m: number) => (m === 15 ? "ربع ساعة" : m === 30 ? "نصف ساعة" : m === 60 ? "ساعة" : minutesAr(m));

/**
 * A note from the team under the buttons: good morning or evening in Madinah
 * time, and how soon we answer (or that we answer once we open). The
 * prerendered page has no clock, so it says hello until the page knows the time.
 */
function Greeting() {
  const state = useOpenState();
  const hello = state ? greeting() : "حيّاك الله";
  const reply = state && !state.open ? "اترك رسالتك ونرد عليك أول ما نفتح" : `نرد عليك خلال ${spoken(site.responseTimeMinutes)}`;
  return (
    <Note
      tone="light"
      arrow="loop"
      delay={1.2}
      className="relative max-w-[15rem] self-start md:me-6 md:mt-1"
      arrowClassName="-top-10 left-[-1.6rem] md:left-auto md:right-[-3.4rem]"
    >
      {hello}، {reply}
    </Note>
  );
}

export function Hero() {
  const { openBooking } = useBooking();
  const vars = { city: site.city, response: site.responseTimeMinutes };
  const trust = [
    `نرد عليك خلال ${site.responseTimeMinutes} دقيقة`,
    site.features.femaleTherapists ? "أخصائيات للسيدات" : null,
    site.features.homeVisits ? "نزورك في بيتك عند الحاجة" : null,
    `خبرة ${site.partner.name} من ${site.partner.country}`,
  ].filter(Boolean) as string[];

  return (
    <section
      id="top"
      className="curve-b curve-hero grain relative isolate min-h-[100svh] overflow-hidden bg-deep-radial text-white"
      aria-labelledby="hero-title"
    >
      <LazyCanvas
        className="absolute inset-0 -z-10"
        rootMargin="0px"
        poster={
          <div className="absolute inset-y-[14%] start-auto end-[-18%] w-[70%] opacity-70 sm:end-[2%] sm:w-[44%] md:end-[6%]">
            <SpinePoster className="h-full w-full" />
          </div>
        }
      >
        {(base) => <SpineScene {...base} />}
      </LazyCanvas>

      {/* Legibility scrim: strong behind the text (right in RTL), clear over the spine */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(270deg,rgb(16_40_58/0.92)_0%,rgb(16_40_58/0.7)_45%,rgb(16_40_58/0)_75%)] md:bg-[linear-gradient(270deg,rgb(16_40_58/0.75)_0%,rgb(16_40_58/0.35)_45%,rgb(16_40_58/0)_62%)]" />

      <div className="container-x relative flex min-h-[calc(100svh-var(--curve-h))] flex-col justify-center pb-24 pt-32 md:pt-36">
        <div className="max-w-[40rem]">
          <p className="animate-rise text-[0.95rem] font-medium text-leaf-300/90">{copy.hero.eyebrow}</p>
          <h1 id="hero-title" className="h-display mt-4 animate-rise [animation-delay:120ms]">
            <RichText text={copy.hero.title} hl={(part, key) => <HeroMark key={key} text={part} />} />
          </h1>
          {/* Phones get a shorter line that leaves the left strip to the 3D spine. */}
          <p className="mt-5 animate-rise pe-[22%] text-[1.05rem] leading-8 text-white/80 [animation-delay:240ms] md:hidden">{fill(copy.hero.leadShort, vars)}</p>
          <p className="mt-6 hidden max-w-[34rem] animate-rise text-[1.15rem] leading-9 text-white/78 [animation-delay:240ms] md:block">{fill(copy.hero.lead, vars)}</p>

          <div className="mt-9 flex animate-rise flex-wrap gap-3 [animation-delay:360ms]">
            <button type="button" className="btn btn-leaf btn-shine text-[1.02rem]" onClick={() => openBooking({ placement: "hero" })}>
              {site.offer.active ? "احجز تقييمك المجاني" : "احجز تقييمك الآن"}
              <ArrowLeft size={19} aria-hidden />
            </button>
            <WhatsAppLink placement="hero" className="btn btn-ghost-dark">
              <WhatsAppIcon size={20} /> اسألنا على واتساب
            </WhatsAppLink>
          </div>
          <div className="mt-3 flex flex-col gap-y-3 md:flex-row-reverse md:items-start md:justify-between md:gap-x-4">
            <Greeting />
            {site.offer.active ? (
              <p className="animate-rise pe-[22%] text-sm text-white/60 [animation-delay:420ms] md:pe-0">{site.offer.note} · لفترة محدودة</p>
            ) : null}
          </div>

          <ul className="mt-8 grid animate-rise gap-x-6 gap-y-2.5 pe-[22%] text-[0.92rem] text-white/75 [animation-delay:480ms] sm:grid-cols-2 md:mt-9 md:pe-0">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-leaf-400/20 text-leaf-300">
                  <Check size={13} aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Legend for the 3D story (desktop) */}
        <div className="glass-dark absolute bottom-12 end-6 hidden rounded-2xl px-5 py-4 text-xs text-white/75 lg:block">
          <p className="mb-2 font-semibold text-white">من الألم… إلى التوازن</p>
          <ul className="grid gap-1.5">
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-coral-500" /> ضغط وألم
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-leaf-400" /> توازن وحركة
            </li>
            <li className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-leaf-400" /> تاج الصحة
            </li>
          </ul>
        </div>

        <a href="#pain-map" className="absolute bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs text-white/60 hover:text-white md:flex">
          أين يؤلمك؟
          <ChevronDown size={18} className="animate-[float_2.4s_ease-in-out_infinite]" aria-hidden />
        </a>
      </div>
    </section>
  );
}
