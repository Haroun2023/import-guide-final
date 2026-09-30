import { ArrowLeft, Gauge, LayoutDashboard, PencilLine, Plus, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { site, whatsappLink } from "@/config/site";
import { useBooking } from "@/components/booking/BookingContext";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { BrandMark } from "@/components/ui/Logo";
import { CMS_KEY } from "./flag";
import { readSession } from "./session";
import { getState } from "./store";

/**
 * What the demo CMS adds to the site in this browser: WordPress's front-end
 * admin bar (when signed in), the offer popup, the cookie banner and a notice
 * when the content changes in another tab.
 */

const plugin = (id: string) => {
  const p = getState().plugins[id];
  return p?.installed && p.active ? p.settings : null;
};

/** The admin screen that edits what this page shows. */
function editPath(path: string) {
  const s = getState();
  if (path === "/") return "/admin/pages/home";
  const prog = path.match(/^\/programs\/([^/]+)$/);
  if (prog) return `/admin/programs/${prog[1]}`;
  const dev = path.match(/^\/devices\/([^/]+)$/);
  if (dev) return `/admin/devices/${dev[1]}`;
  const post = path.match(/^\/blog\/([^/]+)$/);
  if (post) {
    const p = s.posts.find((x) => x.slug === post[1]);
    return p ? `/admin/posts/${p.id}` : "/admin/posts";
  }
  const map: Record<string, string> = { "/programs": "/admin/programs", "/devices": "/admin/devices", "/faq": "/admin/faqs", "/blog": "/admin/posts", "/visit": "/admin/settings" };
  return map[path] ?? `/admin/seo?path=${encodeURIComponent(path)}`;
}

function AdminBar() {
  const [path] = useLocation();
  const session = readSession();
  const newLeads = getState().leads.filter((l) => l.status === "new" && !l.spam).length;
  useEffect(() => {
    if (!session) return;
    document.documentElement.classList.add("cms-bar");
    return () => document.documentElement.classList.remove("cms-bar");
  }, [session]);
  if (!session) return null;
  const item = "inline-flex h-full items-center gap-1.5 px-2.5 text-[0.8rem] text-white/85 transition-colors hover:bg-white/10 hover:text-white";
  return (
    <div dir="rtl" className="fixed inset-x-0 top-0 z-[70] flex h-9 items-stretch justify-between bg-[#10202b] text-white shadow-[0_1px_0_rgb(255_255_255/0.06)]" role="navigation" aria-label="شريط الإدارة">
      <div className="flex items-stretch">
        <a href="/admin" className={`${item} font-semibold`}>
          <BrandMark size={18} tone="light" /> <span className="hidden sm:inline">لوحة التحكم</span>
        </a>
        <a href={editPath(path)} className={item}>
          <PencilLine size={15} aria-hidden /> تحرير هذه الصفحة
        </a>
        <a href="/admin/posts/new" className={`${item} hidden sm:inline-flex`}>
          <Plus size={15} aria-hidden /> جديد
        </a>
        <a href="/admin/leads" className={item}>
          <LayoutDashboard size={15} aria-hidden /> الحجوزات
          {newLeads ? <span className="rounded-full bg-leaf-400 px-1.5 text-[0.7rem] font-bold leading-5 text-deep">{newLeads}</span> : null}
        </a>
        <a href="/admin/performance" className={`${item} hidden md:inline-flex`}>
          <Gauge size={15} aria-hidden /> الأداء
        </a>
      </div>
      <span className="hidden items-center px-3 text-[0.78rem] text-white/60 sm:flex">مرحبًا، {session.name} · نسخة عرض</span>
    </div>
  );
}

/** Another tab (the admin) saved changes: offer to show them. */
function UpdatePill() {
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    const on = (e: StorageEvent) => e.key === CMS_KEY && setChanged(true);
    addEventListener("storage", on);
    return () => removeEventListener("storage", on);
  }, []);
  if (!changed) return null;
  return (
    <div className="fixed inset-x-0 top-24 z-[65] flex justify-center px-4" role="status">
      <button
        type="button"
        onClick={() => location.reload()}
        className="inline-flex items-center gap-2 rounded-full bg-deep px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgb(0_0_0/0.5)] ring-1 ring-white/10 hover:bg-navy-800"
      >
        <RefreshCw size={16} aria-hidden /> حُدِّث المحتوى من لوحة التحكم · اعرض التحديث
      </button>
    </div>
  );
}

function OfferPopup() {
  const settings = plugin("popups");
  const { openBooking } = useBooking();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!settings) return;
    try {
      if (sessionStorage.getItem("taj_popup_seen")) return;
    } catch {
      /* show it anyway */
    }
    const t = window.setTimeout(() => setOpen(true), Math.max(1, Number(settings.delay) || 6) * 1000);
    return () => window.clearTimeout(t);
  }, [settings]);
  if (!settings || !open) return null;
  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem("taj_popup_seen", "1");
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-deep/55 p-4 backdrop-blur-sm [animation:fade-in_0.25s_ease]" role="dialog" aria-modal="true" aria-labelledby="offer-popup-title" onClick={close}>
      <div className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] bg-white p-7 text-center shadow-[0_30px_80px_-20px_rgb(0_0_0/0.5)] [animation:sheet-in_0.4s_cubic-bezier(0.2,0.7,0.2,1)]" onClick={(e) => e.stopPropagation()}>
        <div className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(143_227_180/0.55),transparent)]" aria-hidden />
        <button type="button" onClick={close} className="absolute end-4 top-4 grid size-9 place-items-center rounded-full text-muted hover:bg-mist-100" aria-label="إغلاق">
          <X size={18} />
        </button>
        <img src="/icons3d/gift.webp" alt="" width={84} height={84} className="relative mx-auto" />
        <h2 id="offer-popup-title" className="relative mt-3 text-2xl font-bold">
          {String(settings.title)}
        </h2>
        <p className="relative mt-2 leading-8 text-muted">{String(settings.text)}</p>
        <button
          type="button"
          className="btn btn-primary btn-shine relative mt-6 w-full"
          onClick={() => {
            close();
            openBooking({ placement: "offer-popup" });
          }}
        >
          {String(settings.button)} <ArrowLeft size={18} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function CookieBanner() {
  const settings = plugin("cookies");
  const [choice, setChoice] = useState<string | null>(() => {
    try {
      return localStorage.getItem("taj_cookie_choice");
    } catch {
      return null;
    }
  });
  if (!settings || choice) return null;
  const decide = (v: string) => {
    setChoice(v);
    try {
      localStorage.setItem("taj_cookie_choice", v);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="fixed inset-x-3 bottom-3 z-[75] mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl bg-deep p-4 text-sm text-white shadow-[0_20px_50px_-15px_rgb(0_0_0/0.6)] sm:flex-row sm:items-center" role="region" aria-label="ملفات تعريف الارتباط">
      <p className="flex-1 leading-7 text-white/85">{String(settings.text)}</p>
      <div className="flex shrink-0 gap-2">
        <button type="button" className="rounded-full px-4 py-2 font-semibold text-white/80 ring-1 ring-white/25 hover:bg-white/10" onClick={() => decide("essential")}>
          {String(settings.decline)}
        </button>
        <button type="button" className="rounded-full bg-leaf-300 px-4 py-2 font-semibold text-deep hover:bg-leaf-200" onClick={() => decide("all")}>
          {String(settings.accept)}
        </button>
      </div>
    </div>
  );
}

export default function SiteExtras() {
  // Inside the admin's live preview: no admin bar or update notice
  const framed = window.self !== window.top;
  return (
    <>
      {framed ? null : <AdminBar />}
      {framed ? null : <UpdatePill />}
      <OfferPopup />
      <CookieBanner />
    </>
  );
}

/** «نعود قريبًا» while the maintenance plugin is on; the admin keeps working. */
export function MaintenancePage() {
  const settings = plugin("maintenance") ?? {};
  return (
    <main dir="rtl" className="grain relative isolate grid min-h-[100svh] place-items-center overflow-hidden bg-deep-radial px-4 text-center text-white">
      <div className="max-w-lg">
        <BrandMark size={64} tone="light" className="mx-auto" />
        <p className="eyebrow eyebrow-light mt-8 justify-center">{site.name}</p>
        <h1 className="h-section mt-3">{String(settings.title ?? "نحدّث موقعنا")}</h1>
        <p className="lead-text mt-4 !text-white/75">{String(settings.text ?? "")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={whatsappLink()} target="_blank" rel="noopener" className="btn btn-whatsapp">
            <WhatsAppIcon size={20} /> راسلنا على واتساب
          </a>
          <a href="/admin/plugins" className="btn btn-ghost-dark">
            دخول الإدارة
          </a>
        </div>
      </div>
    </main>
  );
}
