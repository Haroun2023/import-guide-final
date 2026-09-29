/**
 * Safe wrappers around Web Storage and cookies. Storage can be unavailable
 * (private mode, in-app browsers, blocked site data) — every call is guarded
 * and the site keeps working without it.
 */

type Area = "local" | "session";

function area(kind: Area): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

export function readJSON<T>(key: string, kind: Area = "local"): T | null {
  try {
    const raw = area(kind)?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown, kind: Area = "local") {
  try {
    area(kind)?.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — ignore */
  }
}

export function removeKey(key: string, kind: Area = "local") {
  try {
    area(kind)?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  try {
    const match = document.cookie.split("; ").find((c) => c.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
  } catch {
    return undefined;
  }
}

export function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  try {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax${secure}`;
  } catch {
    /* ignore */
  }
}
