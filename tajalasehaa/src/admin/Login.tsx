import { ArrowLeft, KeyRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { getState, setUser, update, useCms } from "@/cms/store";
import { writeSession } from "@/cms/session";
import type { User } from "@/cms/types";
import { ROLES } from "./nav";
import { attemptsAr, minutesAr } from "./count";

const DEMO_PASSWORD = "demo";
const DEMO_CODE = "246810";

/** The demo sign-in: any listed account with the password «demo». Nothing here is real security. */
export function Login({ onDone }: { onDone: () => void }) {
  const users = useCms((s) => s.users);
  const siteName = useCms((s) => s.site.name);
  const security = useCms((s) => (s.plugins.security?.active ? s.plugins.security.settings : null));
  const [email, setEmail] = useState(users[0]?.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fails, setFails] = useState(0);
  const [pending, setPending] = useState<User | null>(null);
  const [code, setCode] = useState("");
  const limit = Number(security?.loginLimit ?? 5);
  const locked = !!security && fails >= limit;

  const finish = (u: User) => {
    writeSession({ userId: u.id, name: u.name, at: new Date().toISOString() });
    setUser(u.name);
    update((d) => {
      const x = d.users.find((y) => y.id === u.id);
      if (x) x.lastLogin = new Date().toISOString();
    }, { action: "سجّل الدخول" });
    onDone();
  };

  const start = (u: User) => (security?.twoFactor && u.twoFactor ? setPending(u) : finish(u));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    const u = getState().users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() || (email.trim() === "admin" && x.role === "admin"));
    if (!u || password !== DEMO_PASSWORD) {
      const n = fails + 1;
      setFails(n);
      setError(security && n >= limit ? `حُظرت المحاولات لمدة ${minutesAr(Number(security.lockoutMinutes))} بعد ${attemptsAr(limit)} خاطئة (إضافة الأمان).` : "البريد أو كلمة المرور غير صحيحة.");
      setUser("زائر لوحة التحكم");
      update(() => {}, { action: "محاولة دخول فاشلة", target: email.trim() || "بدون بريد" });
      return;
    }
    setError("");
    start(u);
  };

  return (
    <div dir="rtl" className="grid min-h-full lg:grid-cols-[1.1fr_1fr]">
      <div className="relative hidden overflow-hidden bg-[radial-gradient(120%_80%_at_15%_20%,rgb(12_132_86/0.35),transparent_60%),linear-gradient(180deg,#16344a,#0b1923)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <img src="/brand/mark-light.svg" alt="" width={48} height={40} />
          <div>
            <p className="text-lg font-bold">{siteName}</p>
            <p className="text-sm text-white/60">لوحة التحكم</p>
          </div>
        </div>
        <div>
          <p className="text-[2.1rem] font-bold leading-snug">
            موقعك كله
            <br />
            <span className="text-leaf-300">من مكان واحد</span>
          </p>
          <ul className="mt-6 grid gap-2.5 text-white/75">
            {["الحجوزات من الإعلانات والموقع في صندوق واحد", "البرامج والأجهزة والمقالات وأسعار العروض", "إضافات للبحث والأمان والنسخ الاحتياطي والأداء"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-leaf-300" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-white/45">نسخة عرض للإدارة. البيانات تُحفظ في هذا المتصفح فقط.</p>
      </div>

      <div className="grid place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <img src="/brand/mark.svg" alt="" width={40} height={34} />
            <p className="text-lg font-bold">{siteName} · لوحة التحكم</p>
          </div>

          {pending ? (
            <form
              className="rounded-2xl bg-white p-6 shadow-[0_20px_50px_-25px_rgb(11_25_35/0.35)] ring-1 ring-mist-200"
              onSubmit={(e) => {
                e.preventDefault();
                if (code.replace(/\s/g, "") === DEMO_CODE) finish(pending);
                else setError("الرمز غير صحيح.");
              }}
            >
              <KeyRound size={28} className="text-brand-600" aria-hidden />
              <h1 className="mt-3 text-xl font-bold">التحقق بخطوتين</h1>
              <p className="mt-1 text-muted">أدخل الرمز من تطبيق المصادقة على جوالك.</p>
              <label htmlFor="otp" className="sr-only">
                الرمز
              </label>
              <input id="otp" inputMode="numeric" autoComplete="one-time-code" dir="ltr" value={code} onChange={(e) => setCode(e.target.value)} className="mt-5 w-full rounded-xl border border-mist-300 px-4 py-3 text-center text-2xl tracking-[0.5em] focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15" placeholder="000000" />
              {error ? <p className="mt-2 text-sm font-semibold text-coral-600">{error}</p> : null}
              <button type="submit" className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 font-bold text-white hover:bg-brand-700">
                تحقق <ArrowLeft size={18} aria-hidden />
              </button>
              <p className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-mist-50 px-3 py-2 text-[0.8rem] text-muted">
                في نسخة العرض الرمز هو <b dir="ltr">246 810</b>
                <button type="button" className="font-semibold text-brand-700 hover:underline" onClick={() => setCode(DEMO_CODE)}>
                  املأه عني
                </button>
              </p>
            </form>
          ) : (
            <>
              <form onSubmit={submit} className="rounded-2xl bg-white p-6 shadow-[0_20px_50px_-25px_rgb(11_25_35/0.35)] ring-1 ring-mist-200">
                <LockKeyhole size={28} className="text-brand-600" aria-hidden />
                <h1 className="mt-3 text-xl font-bold">تسجيل الدخول</h1>
                <div className="mt-5 grid gap-4">
                  <div className="grid gap-1.5">
                    <label htmlFor="login-email" className="text-[0.82rem] font-semibold">
                      البريد الإلكتروني
                    </label>
                    <input id="login-email" dir="ltr" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-mist-300 px-3.5 py-2.5 text-left focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15" />
                  </div>
                  <div className="grid gap-1.5">
                    <label htmlFor="login-pass" className="text-[0.82rem] font-semibold">
                      كلمة المرور
                    </label>
                    <input id="login-pass" type="password" dir="ltr" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border border-mist-300 px-3.5 py-2.5 text-left focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15" />
                  </div>
                </div>
                {error ? <p className="mt-3 rounded-lg bg-coral-300/15 px-3 py-2 text-sm font-semibold text-coral-600">{error}</p> : null}
                <button type="submit" disabled={locked} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 font-bold text-white hover:bg-brand-700 disabled:opacity-50">
                  دخول <ArrowLeft size={18} aria-hidden />
                </button>
                <p className="mt-3 text-center text-[0.8rem] text-muted">
                  كلمة المرور في نسخة العرض: <b dir="ltr">demo</b>
                </p>
              </form>

              <p className="mb-2 mt-6 text-[0.82rem] font-semibold text-muted">أو ادخل مباشرة بأحد الحسابات التجريبية:</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {users.map((u) => (
                  <li key={u.id}>
                    <button type="button" onClick={() => start(u)} className="w-full rounded-xl bg-white p-3 text-start ring-1 ring-mist-200 transition hover:ring-brand-300">
                      <span className="block font-bold">{u.name}</span>
                      <span className="block text-[0.78rem] text-muted">{ROLES[u.role].label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
