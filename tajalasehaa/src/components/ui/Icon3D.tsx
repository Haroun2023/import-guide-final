/**
 * Pre-rendered 3D brand icons (public/icons3d/<name>[-glyph|-light].webp,
 * 256px, transparent). "tile" = glossy squircle tile, "glyph" = icon only for
 * light surfaces, "light" = icon only for dark surfaces.
 */
export function Icon3D({
  name,
  variant = "tile",
  size = 64,
  className = "",
}: {
  name: string;
  variant?: "tile" | "glyph" | "light";
  size?: number;
  className?: string;
}) {
  const suffix = variant === "tile" ? "" : `-${variant}`;
  return (
    <img
      src={`/icons3d/${name}${suffix}.webp`}
      width={size}
      height={size}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`select-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
