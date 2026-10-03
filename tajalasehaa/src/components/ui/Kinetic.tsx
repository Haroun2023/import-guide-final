import type { CSSProperties, ReactNode } from "react";

export type Accent = "leaf" | "coral" | "dark";

const HL_CLASS: Record<Accent, string> = { leaf: "hl", coral: "hl hl-coral", dark: "hl-dark" };

/**
 * In Readex Pro, a final or lone ج ح خ ع غ م ي hangs about half an em
 * below the line, twice as deep as the other letters; so does a kasra
 * under ب ي ئ ر ز إ, or under a final ن or ل. (Marks between a letter and
 * the next one are skipped, and the next one must not join it.)
 */
const DEEP_TAIL =
  /[جحخعغمي][\u064B-\u065F\u0670]*(?![\u0622-\u065F\u0670])|[بيئرزإ]\u0651?[\u0650\u064D]|[نل]\u0651?[\u0650\u064D](?![\u0622-\u065F\u0670])/;

/** The pen-stroke classes for these words: the stroke drops below a deep tail (.hl-low in index.css). */
export const penClass = (base: string, text: string) => (DEEP_TAIL.test(text) ? `${base} hl-low` : base);

/** A fixed, uneven offset per word (ms), so a title settles like a phrase being said rather than a metronome. */
const JITTER = [0, 45, -15, 30, 10, -25, 55, 5];

/**
 * Title text whose words rise into place one after another when the block
 * around it is revealed (see .kw in index.css). Whole words only, since
 * Arabic letters join. In the text, *these words* get a highlight and a
 * line break ("\n") starts a new line.
 */
export function Kinetic({ text, accent = "leaf" }: { text: string; accent?: Accent }) {
  let i = 0;
  const words = (s: string, key: string) =>
    s.split(/(\s+)/).map((w, k) =>
      !w ? null : /^\s+$/.test(w) ? (
        " "
      ) : (
        <span key={`${key}-${k}`} className="kw" style={{ "--i": i, "--j": `${JITTER[i++ % JITTER.length]}ms` } as CSSProperties}>
          {w}
        </span>
      ),
    );

  const lines = text.split("\n");
  const out: ReactNode[] = [];
  lines.forEach((line, l) => {
    if (l) out.push(<br key={`br-${l}`} />);
    line
      .split(/(\*[^*]+\*)/)
      .filter(Boolean)
      .forEach((seg, s) => {
        const key = `${l}-${s}`;
        if (seg.length > 2 && seg.startsWith("*") && seg.endsWith("*")) {
          const start = i;
          const part = seg.slice(1, -1);
          out.push(
            <mark key={key} className={penClass(HL_CLASS[accent], part)} style={{ "--hl-i": start } as CSSProperties}>
              {words(part, key)}
            </mark>,
          );
        } else {
          out.push(...words(seg, key));
        }
      });
  });
  return <>{out}</>;
}

/** The plain sentence, without the highlight markers (for titles, alt text and metadata). */
export const plainText = (text: string) => text.replace(/\*/g, "").replace(/\s*\n\s*/g, " ");

/**
 * The same markup without the word animation, for titles that must paint at
 * once (page heroes): `hl` renders each *starred* part.
 */
export function RichText({ text, hl }: { text: string; hl: (part: string, key: string) => ReactNode }) {
  const out: ReactNode[] = [];
  text.split("\n").forEach((line, l) => {
    if (l) out.push(<br key={`br-${l}`} />);
    line
      .split(/(\*[^*]+\*)/)
      .filter(Boolean)
      .forEach((seg, s) => out.push(seg.length > 2 && seg.startsWith("*") && seg.endsWith("*") ? hl(seg.slice(1, -1), `${l}-${s}`) : seg));
  });
  return <>{out}</>;
}

/** Highlighted words in a page title: leaf (or coral) text over a pen stroke drawn once the page has painted. */
export function HeroMark({ text, coral = false }: { text: string; coral?: boolean }) {
  return (
    <span className={penClass(coral ? "hl-hero hl-coral" : "hl-hero", text)}>
      <span className={coral ? "text-coral-400" : "text-gradient-leaf"}>{text}</span>
    </span>
  );
}
