import { Bell, ChevronDown, ExternalLink, LogOut, Menu, Plus, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { setUser, useCms } from "@/cms/store";
import { writeSession } from "@/cms/session";
import type { User } from "@/cms/types";
import { MENU, pluginOn, ROLES, type MenuItem } from "./nav";

/** Is this menu entry (or its child `href`, which may carry ?query) the current screen? */
function useActive() {
  const [path] = useLocation();
  const search = useSearch();
  return {
    path,
    item: (m: MenuItem) => (m.href === "/" ? path === "/" : path === m.href || path.startsWith(`${m.href}/`) || (m.children ?? []).some((c) => c.href.split("?")[0] === path)),
    child: (href: string) => {
      const [p, q = ""] = href.split("?");
      return p === path && q === search;
    },
  };
}

function Dropdown({ label, children, align = "start" }: { label: ReactNode; children: (close: () => void) => ReactNode; align?: "start" | "end" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const off = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    addEventListener("mousedown", off);
    return () => removeEventListener("mousedown", off);
  }, [open]);
  return (
    <div ref={ref} className="relative h-full">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="inline-flex h-full items-center gap-1.5 px-3 text-[0.82rem] text-white/85 transition hover:bg-white/10 hover:text-white">
        {label}
      </button>
      {open ? (
        <div className={`absolute top-full z-50 mt-1 min-w-56 overflow-hidden rounded-xl bg-white py-1.5 text-ink shadow-2xl ring-1 ring-mist-200 [animation:admin-pop_0.15s_ease] ${align === "start" ? "start-0" : "end-0"}`}>
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}

const menuLink = "flex items-center gap-2 px-3.5 py-2 text-[0.85rem] hover:bg-mist-50";

function Sidebar({ user, onNavigate }: { user: User; onNavigate?: () => void }) {
  const s = useCms((x) => x);
  const active = useActive();
  const caps = ROLES[user.role].caps;
  const items = MENU.filter((m) => caps.includes(m.cap) && pluginOn(s, m.plugin));
  const groups: { id: MenuItem["group"]; label?: string }[] = [{ id: "main" }, { id: "site", label: "الموقع" }, { id: "plugins", label: "الإضافات النشطة" }];

  return (
    <nav aria-label="قائمة لوحة التحكم" className="flex h-full flex-col gap-4 overflow-y-auto px-3 py-4">
      {groups.map((g) => {
        const list = items.filter((m) => m.group === g.id);
        if (!list.length) return null;
        return (
          <div key={g.id}>
            {g.label ? <p className="mb-1.5 px-3 text-[0.7rem] font-semibold tracking-wide text-white/40">{g.label}</p> : null}
            <ul className="grid gap-0.5">
              {list.map((m) => {
                const on = active.item(m);
                const n = m.badge?.(s) ?? 0;
                const Icon = m.icon;
                const kids = (m.children ?? []).filter((c) => pluginOn(s, c.plugin));
                return (
                  <li key={m.href}>
                    <Link
                      href={m.href}
                      onClick={onNavigate}
                      aria-current={on ? "page" : undefined}
                      className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.88rem] transition ${on ? "bg-white/12 font-semibold text-white" : "text-white/70 hover:bg-white/6 hover:text-white"}`}
                    >
                      {on ? <span className="absolute inset-y-1.5 start-0 w-[3px] rounded-full bg-leaf-400" aria-hidden /> : null}
                      <Icon size={18} aria-hidden className={on ? "text-leaf-300" : ""} />
                      <span className="flex-1">{m.label}</span>
                      {n ? <span className="tabular rounded-full bg-leaf-400 px-1.5 text-[0.7rem] font-bold leading-5 text-deep">{n}</span> : null}
                    </Link>
                    {on && kids.length > 1 ? (
                      <ul className="mb-1 mt-0.5 grid gap-0.5 border-s border-white/10 ps-3 ms-5">
                        {kids.map((c) => (
                          <li key={c.href}>
                            <Link href={c.href} onClick={onNavigate} className={`block rounded-md px-2.5 py-1.5 text-[0.8rem] transition ${active.child(c.href) ? "font-semibold text-leaf-300" : "text-white/60 hover:text-white"}`}>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <p className="mt-auto px-3 text-[0.7rem] leading-5 text-white/35">نسخة عرض · البيانات تُحفظ في هذا المتصفح فقط</p>
    </nav>
  );
}

export function Shell({ user, children }: { user: User; children: ReactNode }) {
  const users = useCms((s) => s.users);
  const newLeads = useCms((s) => s.leads.filter((l) => l.status === "new" && !l.spam).length);
  const siteName = useCms((s) => s.site.name);
  const [nav, setNav] = useState(false);
  const [, go] = useLocation();

  const signIn = (u: User) => {
    writeSession({ userId: u.id, name: u.name, at: new Date().toISOString() });
    setUser(u.name);
    location.reload();
  };

  return (
    <div dir="rtl" className="grid min-h-full grid-rows-[auto_1fr] lg:grid-cols-[15rem_1fr]">
      {/* Admin bar */}
      <header className="sticky top-0 z-40 col-span-full flex h-12 items-stretch justify-between bg-[#0b1923] text-white shadow-[0_1px_0_rgb(255_255_255/0.06)]">
        <div className="flex items-stretch">
          <button type="button" className="grid w-12 place-items-center text-white/80 hover:bg-white/10 lg:hidden" onClick={() => setNav(true)} aria-label="فتح القائمة">
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2 px-3 hover:bg-white/10">
            <img src="/brand/mark-light.svg" alt="" width={24} height={20} />
            <span className="hidden text-[0.9rem] font-bold sm:inline">{siteName}</span>
          </Link>
          <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 px-3 text-[0.82rem] text-white/80 hover:bg-white/10 hover:text-white">
            <ExternalLink size={15} aria-hidden /> <span className="hidden md:inline">زيارة الموقع</span>
          </a>
          <Dropdown
            label={
              <>
                <Plus size={16} aria-hidden /> <span className="hidden sm:inline">جديد</span>
              </>
            }
          >
            {(close) =>
              [
                ["/posts/new", "مقال"],
                ["/programs/new", "برنامج"],
                ["/faqs?new=1", "سؤال شائع"],
                ["/media?upload=1", "صورة"],
                ["/users?new=1", "مستخدم"],
              ].map(([href, label]) => (
                <button
                  key={href}
                  type="button"
                  className={`${menuLink} w-full`}
                  onClick={() => {
                    close();
                    go(href);
                  }}
                >
                  <Plus size={15} className="text-brand-600" aria-hidden /> {label}
                </button>
              ))
            }
          </Dropdown>
          <Link href="/leads" className="inline-flex items-center gap-1.5 px-3 text-[0.82rem] text-white/80 hover:bg-white/10 hover:text-white" aria-label={`الحجوزات الجديدة: ${newLeads}`}>
            <Bell size={16} aria-hidden />
            {newLeads ? <span className="tabular rounded-full bg-leaf-400 px-1.5 text-[0.7rem] font-bold leading-5 text-deep">{newLeads}</span> : null}
          </Link>
        </div>
        <div className="flex items-stretch">
          <span className="my-auto me-2 hidden rounded-full bg-leaf-400/15 px-2.5 py-1 text-[0.72rem] font-semibold text-leaf-300 ring-1 ring-leaf-400/30 md:inline">نسخة عرض</span>
          <Dropdown
            align="end"
            label={
              <>
                <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-leaf-300 to-brand-600 text-deep">
                  <UserRound size={15} aria-hidden />
                </span>
                <span className="hidden sm:inline">مرحبًا، {user.name}</span>
                <ChevronDown size={14} aria-hidden />
              </>
            }
          >
            {() => (
              <>
                <div className="border-b border-mist-200 px-3.5 pb-2.5 pt-1.5">
                  <p className="font-bold">{user.name}</p>
                  <p className="text-[0.78rem] text-muted">
                    {ROLES[user.role].label} · <span dir="ltr">{user.email}</span>
                  </p>
                </div>
                <p className="px-3.5 pb-1 pt-2 text-[0.72rem] font-semibold text-muted">جرّب صلاحيات مستخدم آخر</p>
                {users
                  .filter((u) => u.id !== user.id)
                  .map((u) => (
                    <button key={u.id} type="button" className={`${menuLink} w-full`} onClick={() => signIn(u)}>
                      <UserRound size={15} className="text-muted" aria-hidden /> {u.name}
                      <span className="ms-auto text-[0.72rem] text-muted">{ROLES[u.role].label}</span>
                    </button>
                  ))}
                <button
                  type="button"
                  className={`${menuLink} w-full border-t border-mist-200 text-coral-600`}
                  onClick={() => {
                    writeSession(null);
                    location.href = "/admin";
                  }}
                >
                  <LogOut size={15} aria-hidden /> تسجيل الخروج
                </button>
              </>
            )}
          </Dropdown>
        </div>
      </header>

      {/* Sidebar: fixed column on large screens, a drawer on smaller ones */}
      <aside className="sticky top-12 hidden h-[calc(100vh-3rem)] bg-gradient-to-b from-[#12293a] to-[#0b1923] lg:block">
        <Sidebar user={user} />
      </aside>
      {nav ? (
        <div className="fixed inset-0 z-50 bg-deep/50 lg:hidden" onClick={() => setNav(false)} role="presentation">
          <aside className="h-full w-72 max-w-[85vw] bg-gradient-to-b from-[#12293a] to-[#0b1923] [animation:admin-fade_0.2s_ease]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end p-2">
              <button type="button" className="grid size-10 place-items-center rounded-lg text-white/80 hover:bg-white/10" onClick={() => setNav(false)} aria-label="إغلاق القائمة">
                <X size={20} />
              </button>
            </div>
            <Sidebar user={user} onNavigate={() => setNav(false)} />
          </aside>
        </div>
      ) : null}

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1320px]">{children}</div>
      </main>
    </div>
  );
}
