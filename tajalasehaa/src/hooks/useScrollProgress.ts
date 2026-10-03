import { useEffect, useRef } from "react";

/**
 * Writes the element's scroll progress (0–1) to its --p CSS variable: 0 when
 * its top reaches `start` of the viewport height, 1 when its bottom reaches `end`.
 */
export function useScrollProgress<T extends HTMLElement>(start = 0.8, end = 0.6) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * start - r.top) / (r.height + vh * (start - end))));
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
  }, [start, end]);
  return ref;
}
