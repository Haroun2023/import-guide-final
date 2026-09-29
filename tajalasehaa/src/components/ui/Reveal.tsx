import type { CSSProperties, ReactNode } from "react";

/**
 * Fade-up on first view. Driven by the inline observer in index.html (no JS
 * bundle needed), so prerendered content reveals even before hydration.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  return (
    <Tag data-reveal="" className={className} style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  light = false,
  center = false,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  light?: boolean;
  center?: boolean;
  id?: string;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>
      <h2 id={id} className={`h-section mt-3 ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {lead ? <p className={`lead-text mt-4 ${light ? "!text-white/70" : ""}`}>{lead}</p> : null}
    </Reveal>
  );
}
