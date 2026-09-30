import * as L from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Link } from "wouter";
import { countAr } from "./count";

/* ------------------------------------------------------------------ */
/* Icons by name (plugins and menus refer to them as strings)          */
/* ------------------------------------------------------------------ */

const ICONS: Record<string, L.LucideIcon> = {
  search: L.Search,
  "clipboard-list": L.ClipboardList,
  "calendar-check": L.CalendarCheck,
  "message-circle": L.MessageCircle,
  "chart-line": L.ChartLine,
  "shield-check": L.ShieldCheck,
  archive: L.Archive,
  gauge: L.Gauge,
  image: L.Image,
  shuffle: L.Shuffle,
  gift: L.Gift,
  star: L.Star,
  cookie: L.Cookie,
  wrench: L.Wrench,
  languages: L.Languages,
  bell: L.Bell,
  "shield-alert": L.ShieldAlert,
  history: L.History,
  table: L.Table,
  "credit-card": L.CreditCard,
  wallet: L.Wallet,
  "message-square": L.MessageSquare,
  calendar: L.Calendar,
  "badge-check": L.BadgeCheck,
  users: L.Users,
};
export function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  const C = ICONS[name] ?? L.Puzzle;
  return <C size={size} className={className} aria-hidden />;
}

/* ------------------------------------------------------------------ */
/* Buttons, badges, cards                                               */
/* ------------------------------------------------------------------ */

const BTN = {
  primary: "bg-brand-600 text-white shadow-[0_6px_16px_-8px_rgb(12_132_86/0.9)] hover:bg-brand-700",
  secondary: "bg-white text-ink ring-1 ring-mist-300 hover:ring-brand-300 hover:text-brand-800",
  ghost: "text-ink hover:bg-mist-100",
  danger: "bg-white text-coral-600 ring-1 ring-coral-300/70 hover:bg-coral-500 hover:text-white",
  dark: "bg-deep text-white hover:bg-navy-800",
};
export function Btn({
  children,
  variant = "secondary",
  size = "md",
  className = "",
  ...rest
}: { variant?: keyof typeof BTN; size?: "sm" | "md" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-semibold transition disabled:pointer-events-none disabled:opacity-50 ${size === "sm" ? "h-8 px-3 text-[0.8rem]" : "h-10 px-4 text-sm"} ${BTN[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/** A button-looking link: admin paths stay inside the admin, `external` opens a new tab (e.g. the site). */
export function LinkBtn({ href, children, variant = "secondary", className = "", external }: { href: string; children: ReactNode; variant?: keyof typeof BTN; className?: string; external?: boolean }) {
  const cls = `inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition ${BTN[variant]} ${className}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

const TONES = {
  green: "bg-brand-50 text-brand-700 ring-brand-100",
  amber: "bg-[#fff4e0] text-[#8a5a12] ring-[#f3dcae]",
  red: "bg-coral-300/20 text-coral-600 ring-coral-300/50",
  gray: "bg-mist-100 text-muted ring-mist-200",
  blue: "bg-navy-50 text-navy-600 ring-navy-100",
  dark: "bg-deep text-white ring-deep",
};
export type Tone = keyof typeof TONES;
export function Badge({ tone = "gray", children, className = "" }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.72rem] font-semibold ring-1 ${TONES[tone]} ${className}`}>{children}</span>;
}

export function Card({ title, actions, children, className = "", pad = true }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={`min-w-0 rounded-2xl bg-white shadow-[0_1px_2px_rgb(11_25_35/0.04)] ring-1 ring-mist-200 ${className}`}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-mist-200 px-4 py-3">
          <h2 className="text-[0.95rem] font-bold">{title}</h2>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={pad ? "p-4" : ""}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, sub, actions, back }: { title: ReactNode; sub?: ReactNode; actions?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {back ? (
          <Link href={back.href} className="mb-1 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-brand-700 hover:underline">
            <L.ChevronRight size={14} aria-hidden /> {back.label}
          </Link>
        ) : null}
        <h1 className="text-[1.45rem] font-bold leading-snug">{title}</h1>
        {sub ? <p className="mt-0.5 text-muted">{sub}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Stat({ label, value, hint, icon, tone = "green" }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode; tone?: "green" | "navy" | "amber" | "coral" }) {
  const ring = { green: "from-brand-50 to-white text-brand-700", navy: "from-navy-50 to-white text-navy-600", amber: "from-[#fff4e0] to-white text-[#8a5a12]", coral: "from-coral-300/20 to-white text-coral-600" }[tone];
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-mist-200">
      {icon ? <span className={`grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${ring}`}>{icon}</span> : null}
      <div className="min-w-0">
        <p className="text-[0.8rem] text-muted">{label}</p>
        <p className="tabular text-[1.55rem] font-bold leading-tight">{value}</p>
        {hint ? <p className="mt-0.5 text-[0.75rem] text-muted">{hint}</p> : null}
      </div>
    </div>
  );
}

export function Empty({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-mist-300 bg-white/60 px-6 py-12 text-center">
      {icon ? <div className="mb-3 text-mist-400">{icon}</div> : null}
      <p className="font-bold">{title}</p>
      {text ? <p className="mt-1 max-w-md text-muted">{text}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form fields                                                          */
/* ------------------------------------------------------------------ */

const INPUT = "w-full rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm text-ink transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 disabled:bg-mist-50";

export function Field({ label, help, children, htmlFor, extra }: { label: ReactNode; help?: ReactNode; children: ReactNode; htmlFor?: string; extra?: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-[0.82rem] font-semibold text-ink">
          {label}
        </label>
        {extra}
      </div>
      {children}
      {help ? <p className="text-[0.75rem] leading-5 text-muted">{help}</p> : null}
    </div>
  );
}

export function Text({ label, value, onChange, help, placeholder, dir, type = "text", max, extra }: { label: ReactNode; value: string; onChange: (v: string) => void; help?: ReactNode; placeholder?: string; dir?: "ltr"; type?: string; max?: number; extra?: ReactNode }) {
  const id = useId();
  return (
    <Field label={label} help={help} htmlFor={id} extra={extra ?? (max ? <Counter n={value.length} max={max} /> : null)}>
      <input id={id} type={type} dir={dir} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${INPUT} ${dir === "ltr" ? "text-left" : ""}`} />
    </Field>
  );
}

export function Area({ label, value, onChange, help, rows = 3, max, placeholder }: { label: ReactNode; value: string; onChange: (v: string) => void; help?: ReactNode; rows?: number; max?: number; placeholder?: string }) {
  const id = useId();
  return (
    <Field label={label} help={help} htmlFor={id} extra={max ? <Counter n={value.length} max={max} /> : null}>
      <textarea id={id} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${INPUT} resize-y leading-7`} />
    </Field>
  );
}

export function Counter({ n, max }: { n: number; max: number }) {
  const tone = n === 0 ? "text-mist-400" : n > max ? "text-coral-600" : n > max * 0.85 ? "text-[#8a5a12]" : "text-brand-700";
  return (
    <span className={`tabular text-[0.72rem] font-semibold ${tone}`}>
      {n} / {max}
    </span>
  );
}

export function Select({ label, value, onChange, options, help }: { label: ReactNode; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; help?: ReactNode }) {
  const id = useId();
  return (
    <Field label={label} help={help} htmlFor={id}>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={INPUT}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({ label, checked, onChange, help, disabled }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; help?: ReactNode; disabled?: boolean }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-[0.85rem] font-semibold">
          {label}
        </label>
        {help ? <p className="text-[0.75rem] leading-5 text-muted">{help}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${checked ? "bg-brand-600" : "bg-mist-300"}`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "start-[1.375rem]" : "start-0.5"}`} />
      </button>
    </div>
  );
}

/** Edit a list of short lines (points, conditions, therapists). */
export function Lines({ label, value, onChange, help, placeholder = "أضف سطرًا" }: { label: ReactNode; value: string[]; onChange: (v: string[]) => void; help?: ReactNode; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    if (!draft.trim()) return;
    onChange([...value, draft.trim()]);
    setDraft("");
  };
  const move = (i: number, d: -1 | 1) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <Field label={label} help={help}>
      <ul className="grid gap-1.5">
        {value.map((v, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <input value={v} onChange={(e) => onChange(value.map((x, k) => (k === i ? e.target.value : x)))} className={INPUT} aria-label={`السطر ${i + 1}`} />
            <IconBtn label="أعلى" onClick={() => move(i, -1)} disabled={i === 0}>
              <L.ArrowUp size={15} />
            </IconBtn>
            <IconBtn label="أسفل" onClick={() => move(i, 1)} disabled={i === value.length - 1}>
              <L.ArrowDown size={15} />
            </IconBtn>
            <IconBtn label="حذف" onClick={() => onChange(value.filter((_, k) => k !== i))}>
              <L.Trash2 size={15} />
            </IconBtn>
          </li>
        ))}
      </ul>
      <div className="flex gap-1.5">
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className={INPUT}
        />
        <Btn onClick={add} size="md">
          <L.Plus size={16} aria-hidden /> إضافة
        </Btn>
      </div>
    </Field>
  );
}

export function IconBtn({ label, children, onClick, disabled, className = "" }: { label: string; children: ReactNode; onClick?: () => void; disabled?: boolean; className?: string }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled} className={`grid size-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-mist-100 hover:text-ink disabled:opacity-30 ${className}`}>
      {children}
    </button>
  );
}

export function SearchBox({ value, onChange, placeholder = "بحث" }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <L.Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
      <input type="search" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`${INPUT} ps-9`} />
    </label>
  );
}

/** WordPress-style status filters: «الكل (24) | جديدة (5) | …» */
export function Filters<T extends string>({ items, value, onChange }: { items: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1" role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          role="tab"
          aria-selected={value === it.id}
          onClick={() => onChange(it.id)}
          className={`rounded-full px-3 py-1.5 text-[0.8rem] font-semibold transition ${value === it.id ? "bg-deep text-white" : "text-muted hover:bg-white hover:text-ink"}`}
        >
          {it.label}
          {it.count !== undefined ? <span className={`tabular ms-1.5 ${value === it.id ? "text-white/70" : "text-mist-400"}`}>{it.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

export function Tabs<T extends string>({ items, value, onChange }: { items: { id: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-mist-200" role="tablist">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          role="tab"
          aria-selected={value === it.id}
          onClick={() => onChange(it.id)}
          className={`-mb-px shrink-0 border-b-2 px-3 py-2.5 text-sm font-semibold transition ${value === it.id ? "border-brand-600 text-brand-800" : "border-transparent text-muted hover:text-ink"}`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overlays                                                             */
/* ------------------------------------------------------------------ */

export function Drawer({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-deep/40 backdrop-blur-[2px]" onClick={onClose} role="presentation">
      <aside
        role="dialog"
        aria-modal="true"
        className={`flex h-full w-full flex-col bg-[#f6f8f8] shadow-2xl [animation:admin-slide_0.25s_ease] ${wide ? "max-w-2xl" : "max-w-lg"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between gap-3 border-b border-mist-200 bg-white px-5 py-3.5">
          <h2 className="min-w-0 truncate text-base font-bold">{title}</h2>
          <IconBtn label="إغلاق" onClick={onClose}>
            <L.X size={18} />
          </IconBtn>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer ? <footer className="flex flex-wrap items-center gap-2 border-t border-mist-200 bg-white px-5 py-3">{footer}</footer> : null}
      </aside>
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; footer?: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-deep/45 p-4 backdrop-blur-[2px]" onClick={onClose} role="presentation">
      <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-mist-200 px-5 py-3.5">
          <h2 className="font-bold">{title}</h2>
          <IconBtn label="إغلاق" onClick={onClose}>
            <L.X size={18} />
          </IconBtn>
        </header>
        <div className="p-5">{children}</div>
        {footer ? <footer className="flex justify-end gap-2 border-t border-mist-200 px-5 py-3">{footer}</footer> : null}
      </div>
    </div>
  );
}

/** Asks inside the page (the browser's confirm() may be blocked). */
export function useConfirm() {
  const [ask, setAsk] = useState<{ text: string; yes: string; run: () => void } | null>(null);
  const confirm = useCallback((text: string, run: () => void, yes = "تأكيد") => setAsk({ text, run, yes }), []);
  const node = (
    <Modal
      open={!!ask}
      onClose={() => setAsk(null)}
      title="تأكيد"
      footer={
        <>
          <Btn onClick={() => setAsk(null)}>إلغاء</Btn>
          <Btn
            variant="danger"
            onClick={() => {
              ask?.run();
              setAsk(null);
            }}
          >
            {ask?.yes}
          </Btn>
        </>
      }
    >
      <p className="leading-7">{ask?.text}</p>
    </Modal>
  );
  return { confirm, node };
}

/* ------------------------------------------------------------------ */
/* Toasts                                                               */
/* ------------------------------------------------------------------ */

type ToastItem = { id: number; text: string; tone: "ok" | "warn" };
const ToastCtx = createContext<(text: string, tone?: ToastItem["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const n = useRef(0);
  const push = useCallback((text: string, tone: ToastItem["tone"] = "ok") => {
    const id = ++n.current;
    setItems((x) => [...x, { id, text, tone }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 start-1/2 z-[60] grid -translate-x-1/2 gap-2" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-xl [animation:admin-pop_0.25s_ease] ${t.tone === "ok" ? "bg-deep" : "bg-[#8a5a12]"}`}>
            {t.tone === "ok" ? <L.CircleCheck size={17} className="text-leaf-300" aria-hidden /> : <L.TriangleAlert size={17} aria-hidden />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                        */
/* ------------------------------------------------------------------ */

export const fmtDate = (iso: string, withTime = false) =>
  new Date(iso).toLocaleString("ar-SA-u-ca-gregory-nu-latn", withTime ? { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" } : { day: "numeric", month: "short", year: "numeric" });

export function ago(iso: string) {
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "الآن";
  if (m < 60) return `قبل ${countAr(m, "دقيقة", "دقيقتين", "دقائق", "دقيقة")}`;
  const h = Math.round(m / 60);
  if (h < 24) return `قبل ${countAr(h, "ساعة", "ساعتين", "ساعات", "ساعة")}`;
  const d = Math.round(h / 24);
  return d === 1 ? "أمس" : `قبل ${countAr(d, "يوم", "يومين", "أيام", "يومًا", "يوم")}`;
}

export const slugify = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || `item-${Date.now().toString(36)}`;

/** A local copy of a record for an editor, with «unsaved changes» tracking. */
export function useDraft<T>(source: T) {
  const [draft, setDraft] = useState<T>(source);
  const [dirty, setDirty] = useState(false);
  const set = useCallback(<K extends keyof T>(k: K, v: T[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setDirty(true);
  }, []);
  const reset = useCallback((v: T) => {
    setDraft(v);
    setDirty(false);
  }, []);
  return { draft, set, setDraft: (v: T) => (setDraft(v), setDirty(true)), dirty, reset, clean: () => setDirty(false) };
}
