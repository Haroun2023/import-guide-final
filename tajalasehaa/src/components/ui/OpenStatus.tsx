import { useEffect, useState } from "react";
import { site } from "@/config/site";

type HoursSpec = { days: string[]; opens: string; closes: string };
export type OpenState = { open: boolean; soon: boolean; label: string };

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** "23:00" → "11:00 م" */
export const clock12 = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "ص" : "م"}`;
};

/** Weekday (0 = Sunday) and minutes since midnight in Madinah, whatever the visitor's own time zone. */
function madinahNow(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Riyadh",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: DAYS.indexOf(part("weekday")), minutes: Number(part("hour")) * 60 + Number(part("minute")) };
}

/** Open or closed right now, from the hours in site.ts. */
export function openState(specs: HoursSpec[] = site.openingHoursSpec, date = new Date()): OpenState | null {
  const { day, minutes } = madinahNow(date);
  if (day < 0) return null;
  const today = specs.find((s) => s.days.includes(DAYS[day]));
  if (today) {
    const opens = toMinutes(today.opens);
    const closes = toMinutes(today.closes);
    if (minutes >= opens && minutes < closes) {
      const soon = closes - minutes <= 45;
      return { open: true, soon, label: soon ? `نغلق قريبًا · ${clock12(today.closes)}` : `مفتوح الآن · حتى ${clock12(today.closes)}` };
    }
    if (minutes < opens) return { open: false, soon: false, label: `مغلق الآن · نفتح اليوم ${clock12(today.opens)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    const next = specs.find((s) => s.days.includes(DAYS[d]));
    if (next) return { open: false, soon: false, label: `مغلق الآن · نفتح ${i === 1 ? "غدًا" : DAYS_AR[d]} ${clock12(next.opens)}` };
  }
  return null;
}

/** «صباح الخير» from 4 am until noon in Madinah, «مساء الخير» the rest of the day. */
export function greeting(date = new Date()) {
  const { minutes } = madinahNow(date);
  return minutes >= 4 * 60 && minutes < 12 * 60 ? "صباح الخير" : "مساء الخير";
}

/** Live status, refreshed every minute. Null on the server and before hydration (a prerendered page has no clock). */
export function useOpenState() {
  const [state, setState] = useState<OpenState | null>(null);
  useEffect(() => {
    const tick = () => setState(openState());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return state;
}

export function OpenDot({ state }: { state: OpenState }) {
  const color = state.open ? (state.soon ? "bg-coral-400" : "bg-leaf-500") : "bg-mist-400";
  return (
    <span className={`relative inline-block size-2.5 shrink-0 rounded-full ${color}`} aria-hidden>
      {state.open && !state.soon ? <span className="absolute inset-0 animate-ping rounded-full bg-leaf-400/60 motion-reduce:hidden" /> : null}
    </span>
  );
}

/** "● مفتوح الآن · حتى 11:00 م" next to the opening hours. */
export function OpenStatus({ className = "" }: { className?: string }) {
  const state = useOpenState();
  if (!state) return null;
  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${className}`}>
      <OpenDot state={state} />
      {state.label}
    </span>
  );
}
