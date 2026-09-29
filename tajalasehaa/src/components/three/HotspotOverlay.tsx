/**
 * DOM hotspot buttons laid over a 3D canvas. Their screen position is written
 * every frame by <HotspotProjector> inside the scene (via `domRef`). They are
 * pointer/touch conveniences only — the accessible controls are the lists in
 * the side panels, so these stay out of the tab order.
 */
export type HotspotDomRef = { current: Record<string, HTMLElement | null> };

export function HotspotOverlay({
  items,
  active,
  onSelect,
  domRef,
  tone = "light",
}: {
  items: { id: string; label: string }[];
  active: string | null;
  onSelect: (id: string) => void;
  domRef: HotspotDomRef;
  tone?: "light" | "coral";
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {items.map((it, i) => (
        <button
          key={it.id}
          ref={(el) => {
            domRef.current[it.id] = el;
          }}
          type="button"
          tabIndex={-1}
          title={it.label}
          data-active={active === it.id}
          onClick={() => onSelect(it.id)}
          className={`hotspot hotspot-abs ${tone === "coral" ? "hotspot-coral" : ""}`}
        >
          <span className="hotspot-ring" />
          <span className="relative">{i + 1}</span>
        </button>
      ))}
    </div>
  );
}
