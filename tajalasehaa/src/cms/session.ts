/** Who is signed in to the demo CMS in this browser (no real authentication: it is a demo). */
export const SESSION_KEY = "taj_cms_session";

export type Session = { userId: string; name: string; at: string };

export function readSession(): Session | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function writeSession(s: Session | null) {
  try {
    if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* the demo still works for this tab */
  }
}
