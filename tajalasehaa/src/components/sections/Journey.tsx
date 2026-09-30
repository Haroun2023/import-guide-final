import { useEffect, useRef } from "react";
import { journey } from "@/config/content";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const ICONS = ["calendar-check", "scan-search", "clipboard-list", "activity", "sparkles"];

/** Writes scroll progress through the element (0–1) to the --p CSS variable. */
function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.2)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return ref;
}

export function Journey() {
  const ref = useScrollProgress<HTMLOListElement>();

  return (
    <section id="journey" className="py-20 md:py-28" aria-labelledby="journey-title">
      <div className="container-x">
        <SectionHeading
          id="journey-title"
          eyebrow="رحلة التعافي"
          title="كيف تسير رحلتك معنا؟"
          lead="تعرف من اليوم الأول ماذا سنفعل ولماذا. خطوات واضحة، وأهداف مكتوبة، ونراجع تقدّمك معك أولًا بأول."
          center
        />

        <ol ref={ref} className="relative mx-auto mt-14 grid max-w-5xl gap-8 md:grid-cols-5 md:gap-4">
          {/* progress line: vertical on phones, horizontal on desktop */}
          <div className="absolute bottom-6 start-[1.35rem] top-6 w-0.5 bg-mist-200 md:hidden" aria-hidden>
            <div className="h-full w-full origin-top scale-y-[var(--p,0)] bg-gradient-to-b from-brand-500 to-leaf-400 transition-transform duration-300 ease-out" />
          </div>
          <div className="absolute inset-x-[10%] top-[1.35rem] hidden h-0.5 bg-mist-200 md:block" aria-hidden>
            <div className="h-full origin-right scale-x-[var(--p,0)] bg-gradient-to-l from-brand-500 to-leaf-400 transition-transform duration-300 ease-out" />
          </div>

          {journey.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-white text-lg font-bold text-brand-700 shadow-[var(--shadow-soft)] ring-2 ring-brand-500">
                {i + 1}
              </span>
              <div>
                <Icon3D name={ICONS[i % ICONS.length]} size={52} className="mb-1 hidden md:mx-auto md:mt-4 md:block" />
                <h3 className="text-lg font-bold md:mt-2">{s.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-7 text-muted">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
