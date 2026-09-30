import type { CSSProperties, ReactNode } from "react";

export type Accent = "leaf" | "coral" | "dark";

const HL_CLASS: Record<Accent, string> = { leaf: "hl", coral: "hl hl-coral", dark: "hl-dark" };

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
        <span key={`${key}-${k}`} className="kw" style={{ "--i": i++ } as CSSProperties}>
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
          out.push(
            <mark key={key} className={HL_CLASS[accent]} style={{ "--hl-i": start } as CSSProperties}>
              {words(seg.slice(1, -1), key)}
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

/** A hand-drawn line under the highlighted words, drawn from the right after load (.swoosh in index.css). */
export function Swoosh({ coral = false }: { coral?: boolean }) {
  return (
    <svg className={`swoosh ${coral ? "swoosh-coral" : ""}`} viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
      <path d="M296 15C220 5 120 4 6 13" pathLength={1} />
    </svg>
  );
}
