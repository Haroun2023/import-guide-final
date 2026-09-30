/**
 * The demo CMS keeps everything in one localStorage entry. Its presence means
 * someone opened /admin in this browser, so the site shows their edits here
 * (and only here). Kept tiny: it ships in the main bundle.
 */
export const CMS_KEY = "taj_cms_v1";

export function hasCmsDemo() {
  try {
    return typeof window !== "undefined" && !!window.localStorage.getItem(CMS_KEY);
  } catch {
    return false;
  }
}

/** Set by the CMS apply step before the site renders (demo browsers only). */
export const cmsRuntime = { active: false };
