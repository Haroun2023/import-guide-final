import { site } from "@/config/site";

/*
 * Official brand artwork, vectorised from the logo file (public/brand/*.svg):
 * traced outlines + the logo's own navy→green colour field, so it stays crisp
 * at any size. "dark" = colour logo for light surfaces, "light" = light logo
 * for dark surfaces.
 */
type Tone = "dark" | "light";

const LOCKUPS = {
  horizontal: { src: "/brand/logo-h", w: 835, h: 205 },
  stacked: { src: "/brand/logo", w: 557, h: 448 },
} as const;

export function Logo({
  tone = "dark",
  variant = "horizontal",
  crossfade = false,
  className = "h-10",
}: {
  tone?: Tone;
  variant?: keyof typeof LOCKUPS;
  /** Render both tones and fade between them (header over the dark hero). */
  crossfade?: boolean;
  /** Size via height utilities; width follows the artwork's ratio. */
  className?: string;
}) {
  const l = LOCKUPS[variant];
  const img = (t: Tone, extra = "") => (
    <img
      src={`${l.src}${t === "light" ? "-light" : ""}.svg`}
      width={l.w}
      height={l.h}
      alt={t === tone ? site.fullName : ""}
      aria-hidden={t === tone ? undefined : true}
      decoding="async"
      className={`w-auto ${className} ${extra}`}
    />
  );
  if (!crossfade) return img(tone);
  return (
    <span className="relative inline-block align-middle">
      {img("dark", `transition-opacity duration-300 ${tone === "dark" ? "opacity-100" : "opacity-0"}`)}
      {img("light", `absolute inset-0 transition-opacity duration-300 ${tone === "light" ? "opacity-100" : "opacity-0"}`)}
    </span>
  );
}

/** The leaf-crown symbol on its own (decorative). `size` is its height in px. */
export function BrandMark({ size = 40, tone = "dark", className = "" }: { size?: number; tone?: Tone; className?: string }) {
  return (
    <img
      src={tone === "light" ? "/brand/mark-light.svg" : "/brand/mark.svg"}
      width={Math.round((size * 261) / 219)}
      height={size}
      alt=""
      aria-hidden
      decoding="async"
      className={`shrink-0 ${className}`}
    />
  );
}
