import type { CSSProperties } from "react";
import { copy } from "@/config/copy";
import { site } from "@/config/site";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Icon3D } from "@/components/ui/Icon3D";

/** A large paragraph whose words light up one by one as it scrolls through the view. */
export function Manifesto() {
  const ref = useScrollProgress<HTMLParagraphElement>(0.88, 0.42);
  const words: { w: string; hl: boolean }[] = [];
  copy.manifesto.text.split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .forEach((seg) => {
      const hl = seg.startsWith("*");
      seg
        .replace(/\*/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .forEach((w) => words.push({ w, hl }));
    });

  return (
    <section className="py-20 md:py-28" aria-labelledby="manifesto-title">
      <div className="container-x max-w-4xl text-center">
        <h2 id="manifesto-title" className="eyebrow justify-center">
          {copy.manifesto.eyebrow}
        </h2>
        <p
          ref={ref}
          className="mt-6 text-[clamp(1.5rem,1.05rem+1.9vw,2.6rem)] font-semibold leading-[1.75] text-ink"
          style={{ "--n": words.length } as CSSProperties}
        >
          {words.map(({ w, hl }, i) => (
            <span key={i}>
              <span className={`lit-word ${hl ? "text-brand-600" : ""}`} style={{ "--i": i } as CSSProperties}>
                {w}
              </span>{" "}
            </span>
          ))}
        </p>
        <p className="mt-8 inline-flex items-center gap-2.5 text-muted">
          <Icon3D name="crown" variant="glyph" size={30} />
          فريق {site.name}
        </p>
      </div>
    </section>
  );
}
