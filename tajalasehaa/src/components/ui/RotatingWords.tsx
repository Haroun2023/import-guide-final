import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/useClient";
import { useInView } from "@/hooks/useInView";

/**
 * A phrase that changes in place every few seconds while it is on screen.
 * Screen readers get the first phrase only; the prerendered page shows it too.
 */
export function RotatingWords({
  words,
  interval = 2800,
  className = "",
  itemClassName,
}: {
  words: string[];
  interval?: number;
  className?: string;
  /** on an inline span around each phrase (e.g. the marker highlight) */
  itemClassName?: string;
}) {
  const [i, setI] = useState(0);
  const reduce = usePrefersReducedMotion();
  const { ref, visible } = useInView<HTMLSpanElement>("0px");

  useEffect(() => {
    if (reduce || !visible || words.length < 2) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [reduce, visible, words.length, interval]);

  const prev = (i - 1 + words.length) % words.length;
  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span ref={ref} className={`rotator ${className}`} aria-hidden>
        {words.map((w, k) => (
          <span key={w} data-state={k === i ? "in" : k === prev ? "out" : "wait"}>
            <span className={itemClassName}>{w}</span>
          </span>
        ))}
      </span>
    </>
  );
}
