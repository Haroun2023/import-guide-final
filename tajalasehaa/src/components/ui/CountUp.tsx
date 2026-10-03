import { useEffect, useRef, useState } from "react";

/** "+5000" → ["+5000", "+", "5000", ""]; null when there is no number to count. */
const parts = (value: string) => value.match(/^(\D*)(\d+)(\D*)$/);

/**
 * A stat like "+5000" that counts up the first time it scrolls into view.
 * The prerendered page (and anything without a number) shows the final value.
 */
export function CountUp({ value, duration = 1400 }: { value: string; duration?: number }) {
  const m = parts(value);
  const [shown, setShown] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const target = parts(value)?.[2];
    if (target === undefined || !el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Fully on screen when the page wakes up: leave the number alone.
    const r = el.getBoundingClientRect();
    if (r.top >= 0 && r.bottom <= window.innerHeight) return;

    setShown(0);
    let frame = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - t0) / duration);
        setShown(Math.round(Number(target) * (1 - Math.pow(1 - k, 3))));
        if (k < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular">
      {m && shown !== null ? `${m[1]}${shown}${m[3]}` : value}
    </span>
  );
}
