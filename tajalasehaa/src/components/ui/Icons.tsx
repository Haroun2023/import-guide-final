import type { SVGProps } from "react";

/** Brand + custom icons (lucide v1 ships no brand logos). */

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20, rest: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  "aria-hidden": true as const,
  focusable: false as const,
  ...rest,
});

export function WhatsAppIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(size, rest)}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function InstagramIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...base(size, rest)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SnapchatIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(size, rest)}>
      <path d="M12 2.2c2.9 0 5.2 2.2 5.3 5.1l.05 2.2c.3.2.8.2 1.3-.1.5-.2 1 .1 1 .6 0 .6-.9.9-1.5 1.1-.6.2-.8.5-.6 1 .8 1.7 2 3 3.7 3.4.4.1.5.6.2.9-.5.4-1.4.6-2.3.8-.2.3-.2.9-.5 1.1-.4.2-1.2 0-2 0-1.3 0-1.8 1.5-3.6 1.5s-2.3-1.5-3.6-1.5c-.8 0-1.6.2-2-.0-.3-.2-.3-.8-.5-1.1-.9-.2-1.8-.4-2.3-.8-.3-.3-.2-.8.2-.9 1.7-.4 2.9-1.7 3.7-3.4.2-.5 0-.8-.6-1-.6-.2-1.5-.5-1.5-1.1 0-.5.5-.8 1-.6.5.3 1 .3 1.3.1l.05-2.2C6.8 4.4 9.1 2.2 12 2.2z" />
    </svg>
  );
}

export function TikTokIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(size, rest)}>
      <path d="M16.6 2h-3.3v13.2a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9a6.3 6.3 0 1 0 5.3 6.2V8.6a8 8 0 0 0 4.4 1.3V6.6a4.5 4.5 0 0 1-4.4-4.6z" />
    </svg>
  );
}

export function XIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...base(size, rest)}>
      <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.5l11.2 14.5z" />
    </svg>
  );
}

/** Mosque dome + minaret — used for the prayer "life moment". */
export function PrayerIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...base(size, rest)}>
      <path d="M4 21h16" />
      <path d="M6 21v-7h12v7" />
      <path d="M6 14c0-3.3 2.7-5.6 6-6.8 3.3 1.2 6 3.5 6 6.8" />
      <path d="M12 7.2V4.5" />
      <path d="M11 4.5a1.4 1.4 0 1 0 2 0" />
      <path d="M10 21v-3.2a2 2 0 0 1 4 0V21" />
    </svg>
  );
}

/** Padel racket + ball. */
export function PadelIcon({ size, ...rest }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...base(size, rest)}>
      <path d="M14.8 3.5c3.1 0 5.7 2.6 5.7 5.7 0 3.4-3.2 6.3-6.6 6.3-1.3 0-2.5-.3-3.4-1l-5.2 5.2a1.4 1.4 0 0 1-2-2L8.5 12.5c-.6-.9-1-2.1-1-3.4 0-3.3 3.8-5.6 7.3-5.6z" />
      <circle cx="13" cy="8" r=".6" fill="currentColor" />
      <circle cx="16" cy="8" r=".6" fill="currentColor" />
      <circle cx="14.5" cy="10.8" r=".6" fill="currentColor" />
      <circle cx="5.5" cy="5.5" r="2" />
    </svg>
  );
}
