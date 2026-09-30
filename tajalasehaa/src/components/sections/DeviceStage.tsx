import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { deviceSrc, deviceSrcSet, type Device, type DeviceImage } from "@/config/devices";

/**
 * Pseudo-3D product stage for real device photos (no WebGL): a perspective
 * floor, podium and spotlight; devices swing in and out like a turntable,
 * tilt toward the pointer (drag on touch, swipe far to switch), and floating
 * stat chips parallax at different depths. Numbered hotspots open callouts.
 */

type Props = {
  devices: Device[];
  activeId: string;
  hotspot: string | null;
  onHotspot: (id: string | null) => void;
  /** Swipe on touch: +1 = next device, -1 = previous (reading direction aware). */
  onSwipe?: (dir: 1 | -1) => void;
  paused: boolean;
};

const MAX_RY = 16; // degrees
const MAX_RX = 7;
const DRAG_RY = 40;
const SWIPE = 0.22; // share of the stage width that switches devices

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Pointer tilt + touch drag/swipe + idle sway, written to CSS vars on `target`. */
function useStageMotion(stage: RefObject<HTMLDivElement | null>, target: RefObject<HTMLDivElement | null>, still: boolean, onSwipe: RefObject<Props["onSwipe"]>) {
  useEffect(() => {
    const el = stage.current;
    const t = target.current;
    if (!el || !t) return;
    let goalY = 0;
    let goalX = 0;
    // Resume from the current pose (e.g. when pausing) instead of snapping.
    let curY = parseFloat(t.style.getPropertyValue("--ry")) || 0;
    let curX = parseFloat(t.style.getPropertyValue("--rx")) || 0;
    let lastInput = -1e9;
    let dragging = false;
    let dragStartX = 0;
    let dragDx = 0;
    let dragBase = 0;
    let visible = false;
    let raf = 0;
    const t0 = performance.now();

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const idle = !still && !dragging && now - lastInput > 2200;
      const gy = idle ? Math.sin((now - t0) / 1700) * 11 : goalY;
      const gx = idle ? Math.sin((now - t0) / 2300) * 2.5 : goalX;
      curY += (gy - curY) * (dragging ? 0.35 : 0.075);
      curX += (gx - curX) * 0.075;
      t.style.setProperty("--ry", `${curY.toFixed(2)}deg`);
      t.style.setProperty("--rx", `${curX.toFixed(2)}deg`);
      // Paused/reduced motion: settle, then stop the loop.
      if (still && !dragging && Math.abs(gy - curY) < 0.05 && Math.abs(gx - curX) < 0.05) return;
      raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      lastInput = performance.now();
      if (dragging) {
        dragDx = e.clientX - dragStartX;
        goalY = Math.max(-DRAG_RY, Math.min(DRAG_RY, dragBase + (dragDx / r.width) * 70));
      } else if (e.pointerType === "mouse" && !still) {
        goalY = (((e.clientX - r.left) / r.width) * 2 - 1) * MAX_RY;
        goalX = -(((e.clientY - r.top) / r.height) * 2 - 1) * MAX_RX;
      }
      kick();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || (e.target as HTMLElement).closest("button")) return;
      dragging = true;
      dragStartX = e.clientX;
      dragDx = 0;
      dragBase = curY;
      lastInput = performance.now();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      goalY = 0;
      lastInput = performance.now();
      kick();
      if (e.type === "pointerup" && Math.abs(dragDx) > el.clientWidth * SWIPE) {
        // RTL: the next device waits on the left, so dragging right brings it in.
        const rtl = getComputedStyle(el).direction === "rtl";
        onSwipe.current?.((dragDx > 0) === rtl ? 1 : -1);
      }
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      goalY = 0;
      goalX = 0;
      kick();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    io.observe(el);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [stage, target, still, onSwipe]);
}

function DeviceImg({
  img,
  alt,
  className,
  sizes,
  onLoad,
}: {
  img: DeviceImage;
  alt: string;
  className?: string;
  sizes: string;
  onLoad?: (src: string) => void;
}) {
  const ref = useRef<HTMLImageElement>(null);
  // A cached image can finish before hydration attaches onLoad.
  useEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth) onLoad?.(el.currentSrc || el.src);
  }, []);
  return (
    <img
      ref={ref}
      src={deviceSrc(img)}
      srcSet={deviceSrcSet(img)}
      sizes={sizes}
      width={Math.round(img.aspect * 100)}
      height={100}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={className}
      onLoad={onLoad ? (e) => onLoad(e.currentTarget.currentSrc || e.currentTarget.src) : undefined}
    />
  );
}

const FIG_SIZES = "(min-width: 1024px) 36vw, 76vw";

function StageFigure({
  device: d,
  state,
  load,
  hotspot,
  onHotspot,
  still,
}: {
  device: Device;
  state: "is-active" | "is-before" | "is-after";
  load: boolean;
  hotspot: string | null;
  onHotspot: (id: string | null) => void;
  still: boolean;
}) {
  const active = state === "is-active";
  // The scan light is masked by the photo the browser actually picked from srcset.
  const [mask, setMask] = useState<string | null>(null);
  return (
    <figure
      className={`dstage-fig ${state}`}
      style={{ "--ar": d.image.aspect, "--fit": d.image.fit ?? 1, "--glow": d.glow } as CSSProperties}
      aria-hidden={!active}
    >
      <div className="dstage-halo" aria-hidden />
      <div className="dstage-shadow" aria-hidden />
      {load ? (
        <>
          <DeviceImg img={d.image} alt={active ? `${d.name} (${d.model}) — صورة من الشركة المصنّعة` : ""} className="dstage-img" sizes={FIG_SIZES} onLoad={setMask} />
          <DeviceImg img={d.image} alt="" className="dstage-reflect" sizes={FIG_SIZES} />
        </>
      ) : null}
      {active && mask && !still ? (
        <span className="dstage-scan" aria-hidden style={{ WebkitMaskImage: `url("${mask}")`, maskImage: `url("${mask}")` } as CSSProperties} />
      ) : null}

      {active ? (
        <>
          {d.stats.map((st, n) => (
            <span key={st.text} className={`dstage-chip ${n ? "dstage-chip-b" : ""}`} style={{ "--x": `${st.x}%`, "--y": `${st.y}%` } as CSSProperties} aria-hidden>
              {st.text}
            </span>
          ))}
          {d.hotspots.map((h, n) => {
            const on = hotspot === h.id;
            return (
              <div key={h.id} className="dstage-hot" style={{ left: `${h.x}%`, top: `${h.y}%` }} data-active={on || undefined}>
                <button
                  type="button"
                  className="hotspot"
                  data-active={on}
                  aria-expanded={on}
                  aria-label={`${n + 1}. ${h.title}`}
                  onClick={() => onHotspot(on ? null : h.id)}
                >
                  {!on && !still ? <span className="hotspot-ring" aria-hidden /> : null}
                  <span className="relative">{n + 1}</span>
                </button>
                {on ? (
                  <div role="note" className={`dstage-callout ${h.x > 50 ? "to-left" : "to-right"}`}>
                    <strong>{h.title}</strong>
                    <span>{h.text}</span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </>
      ) : null}
    </figure>
  );
}

export function DeviceStage({ devices, activeId, hotspot, onHotspot, onSwipe, paused }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef(onSwipe);
  swipeRef.current = onSwipe;
  const reduced = usePrefersReducedMotion();
  const still = reduced || paused;
  useStageMotion(stageRef, tiltRef, still, swipeRef);

  const activeIndex = Math.max(0, devices.findIndex((d) => d.id === activeId));
  const active = devices[activeIndex];
  const activeHotspot = active.hotspots.find((h) => h.id === hotspot);
  // Every device keeps a shell (so it can swing in), but photos load only once
  // shown or when next to the active one.
  const [seen, setSeen] = useState<ReadonlySet<string>>(() => new Set([activeId]));
  useEffect(() => {
    setSeen((prev) => {
      const next = new Set(prev);
      for (const d of [devices[activeIndex], devices[activeIndex - 1], devices[activeIndex + 1]]) if (d) next.add(d.id);
      return next.size === prev.size ? prev : next;
    });
  }, [activeIndex, devices]);

  return (
    <div
      ref={stageRef}
      className={`dstage ${still ? "is-still" : ""}`}
      style={{ "--glow": active.glow } as CSSProperties}
      role="group"
      aria-roledescription="معرض ثلاثي الأبعاد"
      aria-label={`${active.name} — ${active.model}`}
    >
      <div className="dstage-spot" aria-hidden />
      <div className="dstage-floor" aria-hidden />
      <div className="dstage-podium" aria-hidden>
        <span className="dstage-ring" />
        <span className="dstage-ring dstage-ring-2" />
      </div>

      <div ref={tiltRef} className="dstage-tilt">
        {devices.map((d, i) => (
          <StageFigure
            key={d.id}
            device={d}
            state={i === activeIndex ? "is-active" : i < activeIndex ? "is-before" : "is-after"}
            load={i === activeIndex || seen.has(d.id)}
            hotspot={hotspot}
            onHotspot={onHotspot}
            still={still}
          />
        ))}
      </div>

      {/* Phones: the open part's note docks at the bottom of the stage instead */}
      {activeHotspot ? (
        <div key={activeHotspot.id} role="note" className="dstage-caption">
          <strong>{activeHotspot.title}</strong>
          <span>{activeHotspot.text}</span>
        </div>
      ) : null}

      {active.detail ? (
        <figure key={`detail-${active.id}`} className="dstage-detail" aria-hidden>
          <DeviceImg img={active.detail.image} alt="" className="h-full w-auto" sizes="160px" />
          <figcaption>{active.detail.caption}</figcaption>
        </figure>
      ) : null}
    </div>
  );
}
