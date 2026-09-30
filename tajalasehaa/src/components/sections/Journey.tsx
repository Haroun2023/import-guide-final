import { journey } from "@/config/content";
import { copy } from "@/config/copy";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const ICONS = ["calendar-check", "scan-search", "clipboard-list", "activity", "sparkles"];

export function Journey() {
  const ref = useScrollProgress<HTMLOListElement>();

  return (
    <section id="journey" className="py-20 md:py-28" aria-labelledby="journey-title">
      <div className="container-x">
        <SectionHeading
          id="journey-title"
          eyebrow={copy.journey.eyebrow}
          title={copy.journey.title}
          lead={copy.journey.lead}
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
              <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-[conic-gradient(from_200deg,var(--color-leaf-300),var(--color-brand-600),var(--color-navy-600),var(--color-leaf-300))] p-[2.5px] shadow-[0_10px_24px_-10px_rgb(12_132_86/0.7)]">
                <span className="grid size-full place-items-center rounded-full bg-white text-lg font-bold text-brand-700">{i + 1}</span>
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
