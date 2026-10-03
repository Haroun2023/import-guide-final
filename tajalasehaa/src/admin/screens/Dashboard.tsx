import { ArrowLeft, CalendarCheck, CircleAlert, CircleCheck, Clock, FileText, Inbox, Palette, PencilLine, Timer, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { openState } from "@/components/ui/OpenStatus";
import { uid } from "@/cms/defaults";
import { update, useCms } from "@/cms/store";
import type { CmsState } from "@/cms/types";
import { healthChecks, healthScore } from "../health";
import { firstReply, isReal, STATUS } from "../leadMeta";
import { ago, Badge, Btn, Card, fmtDate, LinkBtn, Stat, useToast } from "../ui";
import { countAr, leadsAr, minutesAr } from "../count";

const DAY = 864e5;

function BookingsChart({ s }: { s: CmsState }) {
  // Bookings per day for the last 14 days, today on the left (RTL reads right to left)
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 14 }, (_, i) => {
      const start = today.getTime() - (13 - i) * DAY;
      const n = s.leads.filter((l) => isReal(l) && new Date(l.createdAt).getTime() >= start && new Date(l.createdAt).getTime() < start + DAY).length;
      return { start, n };
    });
  }, [s.leads]);
  const max = Math.max(4, ...days.map((d) => d.n));
  const W = 560;
  const H = 150;
  const bw = W / days.length;
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H + 26}`} className="h-auto w-full" role="img" aria-label="الطلبات في آخر 14 يومًا">
        {[0, 0.5, 1].map((t) => (
          <line key={t} x1={0} x2={W} y1={H - t * (H - 12)} y2={H - t * (H - 12)} stroke="#dee7e7" strokeDasharray={t ? "3 4" : undefined} />
        ))}
        {days.map((d, i) => {
          const h = (d.n / max) * (H - 12);
          const x = W - (i + 1) * bw + bw * 0.2;
          const isToday = i === days.length - 1;
          return (
            <g key={d.start}>
              <rect x={x} y={H - h} width={bw * 0.6} height={Math.max(h, 1.5)} rx={4} fill={isToday ? "#0c8456" : "#9fd3b9"}>
                <title>{`${new Date(d.start).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", { weekday: "long", day: "numeric", month: "short" })}: ${d.n ? leadsAr(d.n) : "لا طلبات"}`}</title>
              </rect>
              {d.n ? (
                <text x={x + bw * 0.3} y={H - h - 5} textAnchor="middle" fontSize="10" fontWeight="700" fill={isToday ? "#0a6644" : "#51646f"}>
                  {d.n}
                </text>
              ) : null}
              {i % 2 === 1 || isToday ? (
                <text x={x + bw * 0.3} y={H + 17} textAnchor="middle" fontSize="10" fill="#8a9aa0">
                  {isToday ? "اليوم" : new Date(d.start).getDate()}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

function Sources({ s }: { s: CmsState }) {
  const rows = useMemo(() => {
    const m = new Map<string, { n: number; booked: number }>();
    for (const l of s.leads.filter(isReal)) {
      const r = m.get(l.source) ?? { n: 0, booked: 0 };
      r.n++;
      if (l.status === "booked" || l.status === "attended") r.booked++;
      m.set(l.source, r);
    }
    return [...m.entries()].sort((a, b) => b[1].n - a[1].n);
  }, [s.leads]);
  const max = Math.max(1, ...rows.map(([, r]) => r.n));
  return (
    <ul className="grid gap-2.5">
      {rows.map(([src, r]) => (
        <li key={src} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-3 text-[0.85rem]">
          <span className="truncate font-semibold">{src}</span>
          <span className="relative h-2.5 overflow-hidden rounded-full bg-mist-100">
            <span className="absolute inset-y-0 start-0 rounded-full bg-navy-300" style={{ width: `${(r.n / max) * 100}%` }} />
            <span className="absolute inset-y-0 start-0 rounded-full bg-brand-600" style={{ width: `${(r.booked / max) * 100}%` }} />
          </span>
          <span className="tabular text-muted">
            {r.n} <span className="text-[0.72rem]">· {r.booked} موعد</span>
          </span>
        </li>
      ))}
      <li className="flex gap-4 pt-1 text-[0.72rem] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-navy-300" /> كل الطلبات
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-brand-600" /> صارت مواعيد
        </span>
      </li>
    </ul>
  );
}

function QuickDraft() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const toast = useToast();
  const save = () => {
    if (!title.trim()) return;
    const now = new Date().toISOString();
    update(
      (d) =>
        void d.posts.unshift({
          id: uid("post-"),
          slug: `draft-${Date.now().toString(36)}`,
          title: title.trim(),
          excerpt: body.trim().slice(0, 140),
          category: "عام",
          tags: [],
          blocks: body.trim() ? [{ id: uid("b"), type: "p", text: body.trim() }] : [],
          status: "draft",
          author: "إدارة المركز",
          createdAt: now,
          updatedAt: now,
          seo: { title: "", description: "", focus: "" },
        }),
      { action: "حفظ مسودة سريعة", target: title.trim() },
    );
    setTitle("");
    setBody("");
    toast("حُفظت المسودة في «المقالات»");
  };
  return (
    <div className="grid gap-2.5">
      <label className="sr-only" htmlFor="qd-title">
        العنوان
      </label>
      <input id="qd-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="العنوان" className="rounded-lg border border-mist-300 px-3 py-2 focus:border-brand-500 focus:outline-none" />
      <label className="sr-only" htmlFor="qd-body">
        المحتوى
      </label>
      <textarea id="qd-body" rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="ما الذي تريد الكتابة عنه؟" className="resize-y rounded-lg border border-mist-300 px-3 py-2 focus:border-brand-500 focus:outline-none" />
      <div>
        <Btn variant="primary" size="sm" onClick={save} disabled={!title.trim()}>
          حفظ المسودة
        </Btn>
      </div>
    </div>
  );
}

export function Dashboard({ userName }: { userName: string }) {
  const s = useCms((x) => x);
  const real = s.leads.filter(isReal);
  const weekAgo = Date.now() - 7 * DAY;
  const thisWeek = real.filter((l) => new Date(l.createdAt).getTime() >= weekAgo);
  const prevWeek = real.filter((l) => new Date(l.createdAt).getTime() >= weekAgo - 7 * DAY && new Date(l.createdAt).getTime() < weekAgo);
  const booked = real.filter((l) => l.status === "booked" || l.status === "attended");
  const conv = real.length ? Math.round((booked.length / real.length) * 100) : 0;
  const replies = real.map(firstReply).filter((m): m is number => m !== null);
  const avgReply = replies.length ? Math.round(replies.reduce((a, b) => a + b, 0) / replies.length) : null;
  const today = new Date().toISOString().slice(0, 10);
  const fresh = real.filter((l) => l.status === "new").length;
  const todays = real.filter((l) => l.appointment?.date === today).sort((a, b) => a.appointment!.time.localeCompare(b.appointment!.time));
  const checks = healthChecks(s);
  const score = healthScore(checks);
  const open = openState([{ days: s.site.hours.days, opens: s.site.hours.opens, closes: s.site.hours.closes }]);
  const trend = thisWeek.length - prevWeek.length;

  return (
    <>
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-[radial-gradient(90%_140%_at_100%_0%,rgb(90_206_144/0.35),transparent_55%),linear-gradient(135deg,#16344a,#0b1923)] p-6 text-white sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-white/60">{new Date().toLocaleDateString("ar-SA-u-ca-gregory-nu-latn", { weekday: "long", day: "numeric", month: "long" })}</p>
            <h1 className="mt-1 text-[1.6rem] font-bold">مرحبًا، {userName}</h1>
            <p className="mt-1 max-w-xl text-white/70">
              {[
                fresh ? `عندك ${countAr(fresh, "طلب جديد واحد", "طلبان جديدان", "طلبات جديدة", "طلبًا جديدًا")} بانتظار الاتصال` : "لا طلبات جديدة الآن",
                todays.length ? `وفي جدول اليوم ${countAr(todays.length, "موعد واحد", "موعدان", "مواعيد", "موعدًا")}` : "",
              ]
                .filter(Boolean)
                .join("، ")}
              .
            </p>
          </div>
          {open ? (
            <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1 ${open.open ? "bg-leaf-400/15 text-leaf-200 ring-leaf-400/30" : "bg-white/10 text-white/70 ring-white/15"}`}>
              <span className={`size-2 rounded-full ${open.open ? "bg-leaf-400" : "bg-mist-400"}`} /> {open.label}
            </span>
          ) : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            ["/leads", "راجع الحجوزات", Inbox],
            ["/posts/new", "اكتب مقالًا", PencilLine],
            ["/pages/home", "حرّر الصفحة الرئيسية", FileText],
            ["/appearance", "غيّر الألوان", Palette],
          ].map(([href, label, Icon]) => {
            const I = Icon as typeof Inbox;
            return (
              <Link key={href as string} href={href as string} className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold ring-1 ring-white/15 transition hover:bg-white/20">
                <I size={16} aria-hidden /> {label as string}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="طلبات هذا الأسبوع"
          value={thisWeek.length}
          hint={
            <span className={trend >= 0 ? "text-brand-700" : "text-coral-600"}>
              {trend >= 0 ? "+" : ""}
              {trend} عن الأسبوع الماضي
            </span>
          }
          icon={<Inbox size={20} />}
        />
        <Stat label="صارت مواعيد" value={`${conv}%`} hint={`${booked.length} من ${leadsAr(real.length)}`} icon={<TrendingUp size={20} />} tone="navy" />
        <Stat label="متوسط أول رد" value={avgReply !== null ? `${avgReply} د` : "—"} hint={`الوعد في الموقع: ${minutesAr(s.site.responseTimeMinutes)}`} icon={<Timer size={20} />} tone="amber" />
        <Stat label="صحة الموقع" value={`${score}%`} hint={`${checks.filter((c) => c.level === "critical").length} مهم · ${checks.filter((c) => c.level === "recommended").length} مقترح`} icon={<CircleCheck size={20} />} tone={score > 80 ? "green" : "coral"} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card title="الطلبات في آخر 14 يومًا" actions={<LinkBtn href="/leads" className="!h-8 !px-3 !text-[0.8rem]">كل الطلبات</LinkBtn>}>
          <BookingsChart s={s} />
        </Card>
        <Card title="من أين تأتي الطلبات؟">
          <Sources s={s} />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card title="أحدث الطلبات" pad={false}>
          <ul className="divide-y divide-mist-200">
            {real.slice(0, 6).map((l) => (
              <li key={l.id}>
                <Link href={`/leads?open=${l.id}`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-mist-50">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mist-100 font-bold text-navy-600">{l.name.charAt(0)}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{l.name}</span>
                    <span className="block truncate text-[0.78rem] text-muted">
                      {l.complaintLabel} · {l.source} · {ago(l.createdAt)}
                    </span>
                  </span>
                  <Badge tone={STATUS[l.status].tone}>{STATUS[l.status].label}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="مواعيد اليوم" actions={<LinkBtn href="/leads?view=calendar" className="!h-8 !px-3 !text-[0.8rem]">التقويم</LinkBtn>}>
          {todays.length ? (
            <ul className="grid gap-2">
              {todays.map((l) => (
                <li key={l.id} className="flex items-center gap-3 rounded-xl bg-mist-50 px-3 py-2.5">
                  <span className="tabular w-12 shrink-0 font-bold text-brand-700">{l.appointment!.time}</span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{l.name}</span>
                    <span className="block truncate text-[0.78rem] text-muted">{l.appointment!.therapist}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="flex items-center gap-2 text-muted">
              <CalendarCheck size={18} aria-hidden /> لا مواعيد مؤكدة اليوم.
            </p>
          )}
        </Card>

        <Card title="صحة الموقع" actions={<LinkBtn href="/tools" className="!h-8 !px-3 !text-[0.8rem]">التفاصيل</LinkBtn>}>
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 36 36" className="size-20 shrink-0 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e6eef0" strokeWidth="3.2" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={score > 80 ? "#0c8456" : "#ee5d52"} strokeWidth="3.2" strokeLinecap="round" strokeDasharray={`${score} 100`} />
            </svg>
            <div>
              <p className="text-2xl font-bold">{score}%</p>
              <p className="text-muted">{score > 80 ? "جيد، ويمكن تحسينه" : "يحتاج انتباهًا"}</p>
            </div>
          </div>
          <ul className="mt-3 grid gap-1.5">
            {checks
              .filter((c) => c.level !== "good")
              .slice(0, 3)
              .map((c) => (
                <li key={c.id} className="flex items-start gap-2 text-[0.83rem]">
                  <CircleAlert size={16} className={`mt-0.5 shrink-0 ${c.level === "critical" ? "text-coral-500" : "text-[#c28a2c]"}`} aria-hidden />
                  {c.title}
                </li>
              ))}
          </ul>
        </Card>

        <Card title="نظرة سريعة">
          <ul className="grid grid-cols-2 gap-2 text-[0.85rem]">
            {[
              [countAr(s.programs.filter((p) => p.status === "published").length, "برنامج واحد", "برنامجان", "برامج", "برنامجًا"), "/programs"],
              [countAr(s.devices.length, "جهاز واحد", "جهازان", "أجهزة", "جهازًا"), "/devices"],
              [countAr(s.posts.filter((p) => p.status === "published").length, "مقال منشور", "مقالان منشوران", "مقالات منشورة", "مقالًا منشورًا"), "/posts"],
              [countAr(s.faqs.length, "سؤال شائع", "سؤالان شائعان", "أسئلة شائعة", "سؤالًا شائعًا"), "/faqs"],
              [`${countAr(s.media.length, "ملف واحد", "ملفان", "ملفات", "ملفًا")} في الوسائط`, "/media"],
              [countAr(Object.values(s.plugins).filter((p) => p.installed && p.active).length, "إضافة نشطة", "إضافتان نشطتان", "إضافات نشطة", "إضافة نشطة"), "/plugins"],
            ].map(([t, href]) => (
              <li key={href}>
                <Link href={href} className="flex items-center justify-between rounded-lg bg-mist-50 px-3 py-2 font-semibold hover:bg-brand-50 hover:text-brand-800">
                  {t} <ArrowLeft size={14} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="مسودة سريعة">
          <QuickDraft />
        </Card>

        <Card title="آخر النشاط" actions={<LinkBtn href="/activity" className="!h-8 !px-3 !text-[0.8rem]">السجل</LinkBtn>}>
          <ul className="grid gap-2.5">
            {s.activity.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-start gap-2.5 text-[0.83rem]">
                <Clock size={15} className="mt-1 shrink-0 text-mist-400" aria-hidden />
                <span className="min-w-0">
                  <b>{a.user}</b> {a.action}
                  {a.target ? <span className="text-muted"> · {a.target}</span> : null}
                  <span className="block text-[0.72rem] text-muted">{fmtDate(a.at, true)}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
