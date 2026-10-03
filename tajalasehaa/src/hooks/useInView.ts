import { useEffect, useRef, useState } from "react";

/**
 * `near` flips true once the element comes within `rootMargin` of the viewport
 * (used to lazy-mount heavy content); `visible` tracks current visibility
 * (used to pause work while off-screen).
 */
export function useInView<T extends Element>(rootMargin = "300px") {
  const ref = useRef<T | null>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setNear(true);
      setVisible(true);
      return;
    }
    const nearObs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin },
    );
    const visObs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
    nearObs.observe(el);
    visObs.observe(el);
    return () => {
      nearObs.disconnect();
      visObs.disconnect();
    };
  }, [rootMargin]);

  return { ref, near, visible };
}
