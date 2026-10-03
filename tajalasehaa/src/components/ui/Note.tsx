import type { CSSProperties, ReactNode } from "react";

/**
 * Hand-drawn strokes. The arrows run from the bottom left (by the words) to
 * a head at the top right; the flourish is a pen swash drawn from the right.
 */
const STROKES = {
  curve: { box: "0 0 60 64", shaft: "M6 58C17 56 31 48 39 35C44 27 47 19 49 9", head: "M42.5 17.2L49.2 8.6L52.4 18.3" },
  loop: {
    box: "0 0 60 64",
    shaft: "M3 57C14 58 25 53 28 44C30 37 24 33 20 38C15 45 25 50 34 44C42 39 47 24 49 10",
    head: "M42.6 17.6L49.1 9.2L52.6 18.6",
  },
  flourish: { box: "0 0 220 34", shaft: "M216 7C186 19 140 26 98 24C66 22 42 15 24 18C11 20 7 29 16 30C26 31 33 21 29 13", head: "" },
};

export type NoteStroke = keyof typeof STROKES;

/**
 * A handwritten aside from the team (Aref Ruqaa): it writes itself in from
 * the right when it scrolls into view, then draws its arrow. Place the note
 * with `className` and the arrow with `arrowClassName` (an arrow points up
 * and to the right; turn it with transforms such as -scale-x-100 or rotate-*).
 */
export function Note({
  children,
  tone = "ink",
  arrow,
  arrowClassName = "",
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  /** ink on light surfaces, light on dark ones, coral to stand out */
  tone?: "ink" | "light" | "coral";
  arrow?: NoteStroke;
  arrowClassName?: string;
  className?: string;
  /** seconds to wait after it comes into view */
  delay?: number;
}) {
  const stroke = arrow ? STROKES[arrow] : null;
  return (
    <p data-reveal="" className={`note note-${tone} ${className}`} style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}>
      {stroke ? (
        <svg className={`note-arrow ${arrowClassName}`} viewBox={stroke.box} fill="none" aria-hidden>
          <path d={stroke.shaft} pathLength={1} />
          {stroke.head ? <path className="note-arrow-head" d={stroke.head} pathLength={1} /> : null}
        </svg>
      ) : null}
      <span className="note-text">{children}</span>
    </p>
  );
}
