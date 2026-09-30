import { useRef, useSyncExternalStore } from "react";
import { buildDefaults, uid } from "./defaults";
import { CMS_KEY } from "./flag";
import type { CmsState } from "./types";

/**
 * The demo CMS's data: one JSON document in this browser's localStorage.
 * Every change is saved at once, logged in the activity log and announced
 * to other tabs (an open site tab offers to reload).
 */

let state: CmsState | null = null;
const listeners = new Set<() => void>();
let currentUser = "إدارة المركز";

function read(): CmsState | null {
  try {
    const raw = localStorage.getItem(CMS_KEY);
    return raw ? (JSON.parse(raw) as CmsState) : null;
  } catch {
    return null;
  }
}

/** Fills keys added to the demo after this browser saved its copy. */
function migrate(saved: CmsState): CmsState {
  const d = buildDefaults();
  const out = { ...d, ...saved } as CmsState;
  out.plugins = { ...d.plugins, ...saved.plugins };
  out.copy = { ...d.copy, ...saved.copy };
  return out;
}

export function getState(): CmsState {
  if (!state) {
    const saved = read();
    state = saved ? migrate(saved) : buildDefaults();
    if (!saved) persist(state);
  }
  return state;
}

function persist(s: CmsState) {
  try {
    localStorage.setItem(CMS_KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function setUser(name: string) {
  currentUser = name;
}

export const currentUserName = () => currentUser;

/**
 * Change the data: `mutate` edits a copy, which is then saved and logged.
 * Returns false when the browser refused to save (storage full or blocked).
 */
export function update(mutate: (draft: CmsState) => void, log?: { action: string; target?: string }) {
  const next = structuredClone(getState());
  mutate(next);
  if (log) {
    next.activity.unshift({ id: uid("a"), at: new Date().toISOString(), user: currentUser, ...log });
    next.activity = next.activity.slice(0, 300);
  }
  state = next;
  const ok = persist(next);
  emit();
  return ok;
}

export function replaceState(next: CmsState, log?: { action: string; target?: string }) {
  state = next;
  if (log) next.activity.unshift({ id: uid("a"), at: new Date().toISOString(), user: currentUser, ...log });
  persist(next);
  emit();
}

/** Start the demo over from the site's current content. */
export function resetDemo() {
  replaceState(buildDefaults(), { action: "أعاد ضبط نسخة العرض" });
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== CMS_KEY) return;
    const saved = read();
    if (saved) {
      state = migrate(saved);
      fn();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * Read part of the data and re-render when it changes. The selected value is
 * cached per state and selector, so selectors may build new arrays or objects.
 */
export function useCms<T>(select: (s: CmsState) => T): T {
  const cache = useRef<{ s?: CmsState; f?: (s: CmsState) => T; v?: T }>({});
  return useSyncExternalStore(subscribe, () => {
    const s = getState();
    const c = cache.current;
    if (c.s !== s || c.f !== select) cache.current = { s, f: select, v: select(s) };
    return cache.current.v as T;
  });
}

export function storageBytes() {
  try {
    return new Blob([localStorage.getItem(CMS_KEY) ?? ""]).size;
  } catch {
    return 0;
  }
}
