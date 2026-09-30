/** Main site pages, shared by the header, the footer and the mobile menu. */
export const NAV = [
  { href: "/programs", label: "البرامج" },
  { href: "/devices", label: "الأجهزة" },
  { href: "/conditions", label: "أين يؤلمك؟" },
  { href: "/about", label: "من نحن" },
  { href: "/faq", label: "الأسئلة" },
  { href: "/visit", label: "زُر مركزنا" },
] as const;

/** True when `path` is `href` or one of its sub-pages (e.g. /programs/spine). */
export const isCurrent = (path: string, href: string) => path === href || path.startsWith(`${href}/`);
