import type { CSSProperties, ReactNode } from "react";
import { Kinetic, type Accent } from "@/components/ui/Kinetic";

/**
 * Fade-up on first view. Driven by the inline observer in index.html (no JS
 * bundle needed), so prerendered content reveals even before hydration.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  style,
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "li" | "section" | "article";
} & { [data: `data-${string}`]: string | undefined }) {
  return (
    <Tag data-reveal="" className={className} style={delay ? ({ ...style, "--reveal-delay": `${delay}s` } as CSSProperties) : style} {...rest}>
      {children}
    </Tag>
  );
}

/**
 * Eyebrow, title and lead. A string title animates word by word (Kinetic):
 * wrap words in *stars* to highlight them and use "\n" for a line break.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  light = false,
  center = false,
  accent,
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  light?: boolean;
  center?: boolean;
  /** highlight color for *starred* words (defaults to leaf, or the dark style when `light`) */
  accent?: Accent;
  id?: string;
}) {
  const kinetic = typeof title === "string";
  return (
    <Reveal className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${kinetic ? "kinetic" : ""}`}>
      <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>{eyebrow}</p>
      <h2 id={id} className={`h-section mt-3 ${light ? "text-white" : "text-ink"}`}>
        {kinetic ? <Kinetic text={title} accent={accent ?? (light ? "dark" : "leaf")} /> : title}
      </h2>
      {lead ? <p className={`lead-text mt-4 ${light ? "!text-white/70" : ""}`}>{lead}</p> : null}
    </Reveal>
  );
}
