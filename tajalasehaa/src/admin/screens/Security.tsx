import { CircleAlert, CircleCheck, KeyRound, LoaderCircle, LogIn, ShieldCheck, ShieldHalf } from "lucide-react";
import { useState } from "react";
import { useCms } from "@/cms/store";
import { ago, Btn, Card, LinkBtn, PageHeader, Stat } from "../ui";
import { attemptsAr, minutesAr } from "../count";

type Result = { ok: boolean; label: string; note: string };

/** Real checks against the live site: HTTPS and the security headers it sends. */
async function scan(): Promise<Result[]> {
  const res = await fetch("/", { cache: "no-store" });
  const h = (n: string) => res.headers.get(n);
  return [
    { ok: location.protocol === "https:", label: "اتصال مشفّر HTTPS", note: location.protocol === "https:" ? "كل الصفحات عبر HTTPS." : "الموقع يعمل بلا تشفير في هذه البيئة." },
    { ok: h("x-content-type-options") === "nosniff", label: "منع تخمين نوع الملفات", note: "X-Content-Type-Options" },
    { ok: !!h("referrer-policy"), label: "سياسة الإحالة", note: h("referrer-policy") ?? "Referrer-Policy غير مضبوطة" },
    { ok: !!h("permissions-policy"), label: "منع الكاميرا والميكروفون والموقع", note: "Permissions-Policy" },
    { ok: !!h("strict-transport-security"), label: "إجبار HTTPS دائمًا (HSTS)", note: h("strict-transport-security") ? "مفعّل" : "يُضبط عند ربط النطاق الحقيقي" },
    { ok: !!h("content-security-policy"), label: "سياسة أمان المحتوى (CSP)", note: h("content-security-policy") ? "مفعّلة" : "مقترحة قبل الإطلاق، بعد حصر نطاقات البكسلات" },
  ];
}

export function Security() {
  const settings = useCms((s) => s.plugins.security?.settings ?? {});
  const users = useCms((s) => s.users);
  const activity = useCms((s) => s.activity);
  const [results, setResults] = useState<Result[] | null>(null);
  const [busy, setBusy] = useState(false);
  const logins = activity.filter((a) => a.action === "سجّل الدخول" || a.action === "محاولة دخول فاشلة").slice(0, 8);
  const fails = activity.filter((a) => a.action === "محاولة دخول فاشلة" && Date.now() - new Date(a.at).getTime() < 864e5).length;
  const admins = users.filter((u) => u.role === "admin");
  const admins2fa = admins.filter((u) => u.twoFactor).length;

  return (
    <>
      <PageHeader title="الأمان" sub="جدار الحماية، والدخول، وفحص إعدادات الموقع." actions={<LinkBtn href="/plugins/security">إعدادات الإضافة</LinkBtn>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="جدار الحماية" value={settings.firewall ? "يعمل" : "متوقف"} tone={settings.firewall ? "green" : "coral"} icon={<ShieldCheck size={20} />} />
        <Stat label="محاولات دخول فاشلة (24 ساعة)" value={fails} hint={`الحظر بعد ${attemptsAr(Number(settings.loginLimit ?? 5))} لمدة ${minutesAr(Number(settings.lockoutMinutes ?? 30))}`} tone={fails ? "amber" : "green"} icon={<KeyRound size={20} />} />
        <Stat label="المديرون بالتحقق بخطوتين" value={`${admins2fa} من ${admins.length}`} tone={admins2fa === admins.length ? "green" : "amber"} icon={<ShieldHalf size={20} />} />
        <Stat label="المستخدمون" value={users.length} hint="راجع الأدوار من «المستخدمون»" tone="navy" icon={<LogIn size={20} />} />
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-2">
        <Card
          title="فحص الموقع"
          actions={
            <Btn
              size="sm"
              variant="primary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  setResults(await scan());
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? <LoaderCircle size={14} className="animate-spin" aria-hidden /> : null} افحص الآن
            </Btn>
          }
        >
          {results ? (
            <ul className="grid gap-2">
              {results.map((r) => (
                <li key={r.label} className="flex items-start gap-2.5 rounded-lg bg-mist-50 px-3 py-2 text-[0.83rem]">
                  {r.ok ? <CircleCheck size={17} className="mt-0.5 shrink-0 text-brand-600" aria-hidden /> : <CircleAlert size={17} className="mt-0.5 shrink-0 text-[#c28a2c]" aria-hidden />}
                  <span>
                    <b>{r.label}</b>
                    <span dir="auto" className="block text-[0.75rem] text-muted">
                      {r.note}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[0.85rem] leading-6 text-muted">يفحص الموقع الحي: التشفير ورؤوس الأمان التي يرسلها الخادم مع كل صفحة.</p>
          )}
        </Card>
        <Card title="آخر عمليات الدخول">
          {logins.length ? (
            <ul className="grid gap-2">
              {logins.map((a) => (
                <li key={a.id} className="flex items-center gap-2.5 text-[0.83rem]">
                  {a.action === "سجّل الدخول" ? <CircleCheck size={16} className="text-brand-600" aria-hidden /> : <CircleAlert size={16} className="text-coral-500" aria-hidden />}
                  <span className="min-w-0 flex-1 truncate">
                    <b>{a.user}</b> {a.action}
                    {a.target ? <span dir="ltr" className="text-muted"> · {a.target}</span> : null}
                  </span>
                  <span className="shrink-0 text-[0.75rem] text-muted">{ago(a.at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">لا عمليات دخول مسجلة بعد.</p>
          )}
        </Card>
      </div>
    </>
  );
}
