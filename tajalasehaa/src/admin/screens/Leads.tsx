import { CalendarDays, ChevronLeft, ChevronRight, Download, KanbanSquare, List, MessageCircle, Phone, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { complaints } from "@/config/booking";
import { THERAPISTS, uid } from "@/cms/defaults";
import { update, useCms } from "@/cms/store";
import type { Lead, LeadStatus } from "@/cms/types";
import { displayPhone, STATUS, STATUS_ORDER } from "../leadMeta";
import { ago, Area, Badge, Btn, Card, Drawer, Empty, Filters, fmtDate, PageHeader, SearchBox, Select, Text, useConfirm, useToast } from "../ui";
import { countAr } from "../count";

type View = "list" | "board" | "calendar";
type Folder = "all" | LeadStatus | "spam";

const WEEK_AR = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const THERAPIST_COLORS = ["bg-brand-100 text-brand-900 ring-brand-200", "bg-[#fde7ef] text-[#8a2349] ring-[#f6c3d5]", "bg-navy-100 text-navy-800 ring-navy-200", "bg-[#fff1d6] text-[#7a4f0c] ring-[#f3dcae]"];
const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function setStatus(l: Lead, status: LeadStatus) {
  update(
    (d) => {
      const x = d.leads.find((y) => y.id === l.id);
      if (x) x.status = status;
    },
    { action: `غيّر حالة الطلب إلى «${STATUS[status].label}»`, target: `${l.name} · ${l.ref}` },
  );
}

function csv(leads: Lead[]) {
  const head = ["رقم الطلب", "التاريخ", "الاسم", "الجوال", "الحالة", "السبب", "لمن", "المكان", "الوقت المفضل", "التفضيل", "الدفع", "التأمين", "المصدر", "الحملة", "الموعد"];
  const rows = leads.map((l) => [l.ref, l.createdAt, l.name, l.phone, STATUS[l.status].label, l.complaintLabel, l.forWhom, l.mode === "home" ? "منزلية" : "المركز", l.time, l.therapist, l.payment, l.insurer, l.source, l.campaign ?? "", l.appointment ? `${l.appointment.date} ${l.appointment.time}` : ""]);
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const text = "﻿" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  a.download = `bookings-${isoDate(new Date())}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ------------------------------------------------------------------ */

function LeadDrawer({ lead, onClose }: { lead: Lead; onClose: () => void }) {
  const siteName = useCms((s) => s.site.name);
  const therapists = useCms((s) => (s.plugins.appointments?.settings.therapists as string[] | undefined) ?? THERAPISTS);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(lead.appointment?.date ?? isoDate(new Date(Date.now() + 864e5)));
  const [time, setTime] = useState(lead.appointment?.time ?? "17:00");
  const [who, setWho] = useState(lead.appointment?.therapist ?? therapists[0]);
  const toast = useToast();
  const { confirm, node } = useConfirm();
  const wa = `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`السلام عليكم ${lead.name.split(" ")[0]}، معك ${siteName} بخصوص طلب التقييم رقم ${lead.ref}. متى يناسبك أن نتصل بك؟`)}`;

  const row = (k: string, v?: string) =>
    v ? (
      <div className="flex justify-between gap-4 border-b border-mist-100 py-2 last:border-0">
        <dt className="text-muted">{k}</dt>
        <dd className="text-end font-semibold">{v}</dd>
      </div>
    ) : null;

  return (
    <Drawer
      open
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          {lead.name} <span className="tabular text-[0.8rem] font-normal text-muted">{lead.ref}</span>
        </span>
      }
      footer={
        <>
          <Btn
            variant="danger"
            size="sm"
            onClick={() =>
              confirm(`حذف طلب ${lead.name} نهائيًا؟`, () => {
                update((d) => void (d.leads = d.leads.filter((x) => x.id !== lead.id)), { action: "حذف طلبًا", target: `${lead.name} · ${lead.ref}` });
                onClose();
                toast("حُذف الطلب");
              }, "حذف")
            }
          >
            <Trash2 size={15} aria-hidden /> حذف
          </Btn>
          {lead.spam ? (
            <Btn size="sm" onClick={() => update((d) => void (d.leads.find((x) => x.id === lead.id)!.spam = false), { action: "أعاد طلبًا من المشبوهة", target: lead.name })}>
              ليس مزعجًا
            </Btn>
          ) : null}
        </>
      }
    >
      {node}
      {lead.demo ? <p className="mb-4 rounded-lg bg-mist-100 px-3 py-2 text-[0.8rem] text-muted">طلب تجريبي: الاسم والرقم للعرض فقط، فالاتصال والواتساب معطّلان.</p> : null}

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="حالة الطلب">
        {STATUS_ORDER.map((st) => (
          <button
            key={st}
            type="button"
            aria-pressed={lead.status === st}
            onClick={() => setStatus(lead, st)}
            className={`rounded-full px-3 py-1.5 text-[0.8rem] font-semibold ring-1 transition ${lead.status === st ? "bg-deep text-white ring-deep" : "bg-white text-muted ring-mist-200 hover:text-ink"}`}
          >
            {STATUS[st].label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {lead.demo ? (
          <>
            <Btn disabled title="رقم تجريبي">
              <Phone size={16} aria-hidden /> اتصال
            </Btn>
            <Btn disabled title="رقم تجريبي">
              <MessageCircle size={16} aria-hidden /> واتساب
            </Btn>
          </>
        ) : (
          <>
            <a href={`tel:${lead.phone}`} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-white text-sm font-semibold ring-1 ring-mist-300 hover:ring-brand-300">
              <Phone size={16} aria-hidden /> اتصال
            </a>
            <a href={wa} target="_blank" rel="noopener" className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[#25d366] text-sm font-semibold text-white hover:bg-[#1eb457]">
              <MessageCircle size={16} aria-hidden /> واتساب
            </a>
          </>
        )}
      </div>

      <Card className="mt-4" title="تفاصيل الطلب">
        <dl className="text-[0.85rem]">
          {row("الجوال", displayPhone(lead.phone))}
          {row("السبب", lead.complaintLabel)}
          {row("لمن الحجز", lead.forWhom)}
          {row("المكان", lead.mode === "home" ? "زيارة منزلية" : "في المركز")}
          {row("الوقت المفضل", lead.time)}
          {row("التفضيل", lead.therapist)}
          {row("الدفع", lead.insurer ? `${lead.payment} · ${lead.insurer}` : lead.payment)}
          {row("المصدر", lead.campaign ? `${lead.source} · ${lead.campaign}` : lead.source)}
          {row("من صفحة", lead.placement)}
          {row("وصل", fmtDate(lead.createdAt, true))}
        </dl>
      </Card>

      <Card className="mt-4" title="الموعد">
        <div className="grid gap-3 sm:grid-cols-2">
          <Text label="التاريخ" type="date" value={date} onChange={setDate} dir="ltr" />
          <Text label="الوقت" type="time" value={time} onChange={setTime} dir="ltr" />
        </div>
        <div className="mt-3">
          <Select label="الأخصائي" value={who} onChange={setWho} options={therapists.map((t) => ({ value: t, label: t }))} />
        </div>
        <Btn
          variant="primary"
          className="mt-4"
          onClick={() => {
            update(
              (d) => {
                const x = d.leads.find((y) => y.id === lead.id)!;
                x.appointment = { date, time, therapist: who };
                if (x.status === "new" || x.status === "contacted" || x.status === "no_answer") x.status = "booked";
              },
              { action: "حجز موعدًا", target: `${lead.name} · ${date} ${time}` },
            );
            toast("تأكد الموعد وظهر في التقويم");
          }}
        >
          <CalendarDays size={16} aria-hidden /> {lead.appointment ? "تحديث الموعد" : "تأكيد الموعد"}
        </Btn>
      </Card>

      <Card className="mt-4" title={`الملاحظات (${lead.notes.length})`}>
        <ul className="grid gap-2">
          {lead.notes.map((n, i) => (
            <li key={i} className="rounded-xl bg-mist-50 px-3 py-2 text-[0.85rem]">
              <p className="leading-6">{n.text}</p>
              <p className="mt-1 text-[0.72rem] text-muted">
                {n.by} · {fmtDate(n.at, true)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-3 grid gap-2">
          <Area label="ملاحظة جديدة" value={note} onChange={setNote} rows={2} placeholder="مثال: اتصلنا وطلب موعدًا بعد العصر" />
          <div>
            <Btn
              size="sm"
              disabled={!note.trim()}
              onClick={() => {
                update(
                  (d) => void d.leads.find((y) => y.id === lead.id)!.notes.push({ at: new Date().toISOString(), by: "أنت", text: note.trim() }),
                  { action: "أضاف ملاحظة", target: lead.name },
                );
                setNote("");
              }}
            >
              إضافة الملاحظة
            </Btn>
          </div>
        </div>
      </Card>
    </Drawer>
  );
}

/* ------------------------------------------------------------------ */

function Board({ leads, open }: { leads: Lead[]; open: (id: string) => void }) {
  const [over, setOver] = useState<LeadStatus | null>(null);
  return (
    <div className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-3">
      {STATUS_ORDER.map((st) => {
        const col = leads.filter((l) => l.status === st);
        return (
          <section
            key={st}
            aria-label={STATUS[st].label}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(st);
            }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => {
              e.preventDefault();
              setOver(null);
              const l = leads.find((x) => x.id === e.dataTransfer.getData("text/plain"));
              if (l && l.status !== st) setStatus(l, st);
            }}
            className={`flex w-64 shrink-0 flex-col rounded-2xl p-2 transition ${over === st ? "bg-brand-50 ring-2 ring-brand-300" : "bg-mist-100/80"}`}
          >
            <header className="flex items-center justify-between px-2 py-1.5">
              <Badge tone={STATUS[st].tone}>{STATUS[st].label}</Badge>
              <span className="tabular text-[0.8rem] text-muted">{col.length}</span>
            </header>
            <ul className="grid gap-2">
              {col.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", l.id)}
                    onClick={() => open(l.id)}
                    className="w-full cursor-grab rounded-xl bg-white p-3 text-start shadow-sm ring-1 ring-mist-200 transition hover:ring-brand-300 active:cursor-grabbing"
                  >
                    <span className="block font-semibold">{l.name}</span>
                    <span className="mt-0.5 block text-[0.78rem] text-muted">{l.complaintLabel}</span>
                    <span className="mt-2 flex items-center justify-between text-[0.72rem] text-muted">
                      <span>{l.source}</span>
                      <span>{l.appointment ? `${l.appointment.date.slice(5)} · ${l.appointment.time}` : ago(l.createdAt)}</span>
                    </span>
                  </button>
                </li>
              ))}
              {!col.length ? <li className="rounded-xl border border-dashed border-mist-300 px-3 py-6 text-center text-[0.78rem] text-muted">اسحب طلبًا إلى هنا</li> : null}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Calendar({ leads, open }: { leads: Lead[]; open: (id: string) => void }) {
  const therapists = useCms((s) => (s.plugins.appointments?.settings.therapists as string[] | undefined) ?? THERAPISTS);
  const [offset, setOffset] = useState(0);
  // Weeks start on Saturday
  const start = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - ((d.getDay() + 1) % 7) + offset * 7);
    return d;
  }, [offset]);
  const days = Array.from({ length: 7 }, (_, i) => new Date(start.getTime() + i * 864e5));
  const hours = Array.from({ length: 13 }, (_, i) => 10 + i);
  const appts = leads.filter((l) => l.appointment && (l.status === "booked" || l.status === "attended"));
  const today = isoDate(new Date());
  const color = (t: string) => THERAPIST_COLORS[Math.max(0, therapists.indexOf(t)) % THERAPIST_COLORS.length];

  return (
    <Card pad={false}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-mist-200 px-4 py-3">
        <div className="flex items-center gap-1">
          <Btn size="sm" variant="ghost" onClick={() => setOffset(offset - 1)} aria-label="الأسبوع السابق">
            <ChevronRight size={16} />
          </Btn>
          <Btn size="sm" onClick={() => setOffset(0)}>
            هذا الأسبوع
          </Btn>
          <Btn size="sm" variant="ghost" onClick={() => setOffset(offset + 1)} aria-label="الأسبوع التالي">
            <ChevronLeft size={16} />
          </Btn>
          <span className="ms-2 font-semibold">
            {fmtDate(days[0].toISOString())} – {fmtDate(days[6].toISOString())}
          </span>
        </div>
        <ul className="flex flex-wrap gap-2 text-[0.72rem]">
          {therapists.map((t) => (
            <li key={t} className={`rounded-full px-2 py-0.5 font-semibold ring-1 ${color(t)}`}>
              {t}
            </li>
          ))}
        </ul>
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[760px] grid-cols-[3.5rem_repeat(7,minmax(0,1fr))]">
          <div />
          {days.map((d, i) => (
            <div key={i} className={`border-b border-s border-mist-200 px-2 py-2 text-center text-[0.8rem] ${isoDate(d) === today ? "bg-brand-50 font-bold text-brand-800" : "text-muted"}`}>
              {WEEK_AR[i]}
              <span className="tabular block text-[1.05rem] font-bold text-ink">{d.getDate()}</span>
            </div>
          ))}
          {hours.map((h) => (
            <div key={h} className="contents">
              <div className="tabular border-b border-mist-100 px-2 py-3 text-[0.72rem] text-muted">{h}:00</div>
              {days.map((d, i) => {
                const here = appts.filter((l) => l.appointment!.date === isoDate(d) && Number(l.appointment!.time.slice(0, 2)) === h);
                return (
                  <div key={i} className={`min-h-14 border-b border-s border-mist-100 p-1 ${isoDate(d) === today ? "bg-brand-50/40" : ""}`}>
                    {here.map((l) => (
                      <button key={l.id} type="button" onClick={() => open(l.id)} className={`mb-1 block w-full rounded-lg px-2 py-1 text-start text-[0.72rem] leading-4 ring-1 ${color(l.appointment!.therapist)} ${l.status === "attended" ? "opacity-60" : ""}`}>
                        <span className="tabular font-bold">{l.appointment!.time}</span> {l.name.split(" ")[0]}
                        <span className="block truncate opacity-80">{l.complaintLabel}</span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */

function NewLead({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [complaint, setComplaint] = useState(complaints[0].id as string);
  const toast = useToast();
  return (
    <Drawer
      open
      onClose={onClose}
      title="طلب جديد من مكالمة"
      footer={
        <Btn
          variant="primary"
          disabled={!name.trim() || !phone.trim()}
          onClick={() => {
            const c = complaints.find((x) => x.id === complaint)!;
            const lead: Lead = {
              id: uid("lead-"),
              ref: `TA-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
              createdAt: new Date().toISOString(),
              name: name.trim(),
              phone: phone.trim(),
              complaint: c.id,
              complaintLabel: c.label,
              forWhom: "لنفسي",
              mode: "clinic",
              time: "أقرب موعد متاح",
              therapist: "بدون تفضيل",
              payment: "دفع مباشر",
              insurer: "",
              placement: "admin",
              source: "اتصال هاتفي",
              status: "contacted",
              notes: [],
            };
            update((d) => void d.leads.unshift(lead), { action: "أضاف طلبًا من مكالمة", target: lead.name });
            toast("أُضيف الطلب");
            onClose();
          }}
        >
          حفظ الطلب
        </Btn>
      }
    >
      <div className="grid gap-4">
        <Text label="الاسم" value={name} onChange={setName} />
        <Text label="الجوال" value={phone} onChange={setPhone} dir="ltr" placeholder="05X XXX XXXX" />
        <Select label="سبب الزيارة" value={complaint} onChange={setComplaint} options={complaints.map((c) => ({ value: c.id, label: c.label }))} />
      </div>
    </Drawer>
  );
}

export function Leads() {
  const all = useCms((s) => s.leads);
  const calendarOn = useCms((s) => !!s.plugins.appointments?.active);
  const search = new URLSearchParams(useSearch());
  const [, go] = useLocation();
  const view = (search.get("view") as View) || "list";
  const [folder, setFolder] = useState<Folder>((search.get("folder") as Folder) || "all");
  const [openId, setOpenId] = useState<string | null>(search.get("open"));
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const toast = useToast();

  const sources = [...new Set(all.map((l) => l.source))];
  const base = all.filter((l) => (folder === "spam" ? l.spam : !l.spam));
  const list = base.filter(
    (l) =>
      (folder === "all" || folder === "spam" || l.status === folder) &&
      (!source || l.source === source) &&
      (!q || `${l.name} ${l.phone} ${l.ref} ${l.complaintLabel}`.toLowerCase().includes(q.toLowerCase())),
  );
  const opened = all.find((l) => l.id === openId);
  const setView = (v: View) => go(v === "list" ? "/leads" : `/leads?view=${v}`);

  return (
    <>
      <PageHeader
        title="الحجوزات"
        sub="كل طلبات التقييم من الموقع والإعلانات والمكالمات، في مكان واحد."
        actions={
          <>
            <Btn onClick={() => csv(list)}>
              <Download size={16} aria-hidden /> تصدير Excel
            </Btn>
            <Btn variant="primary" onClick={() => setAdding(true)}>
              <Plus size={16} aria-hidden /> طلب من مكالمة
            </Btn>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-white p-1 ring-1 ring-mist-200" role="tablist" aria-label="طريقة العرض">
          {(
            [
              ["list", "قائمة", List],
              ["board", "لوحة المتابعة", KanbanSquare],
              ...(calendarOn ? [["calendar", "التقويم", CalendarDays]] : []),
            ] as [View, string, typeof List][]
          ).map(([v, label, I]) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.82rem] font-semibold transition ${view === v ? "bg-deep text-white" : "text-muted hover:text-ink"}`}>
              <I size={15} aria-hidden /> {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-56">
            <SearchBox value={q} onChange={setQ} placeholder="اسم، جوال أو رقم طلب" />
          </div>
          <label className="sr-only" htmlFor="src-filter">
            المصدر
          </label>
          <select id="src-filter" value={source} onChange={(e) => setSource(e.target.value)} className="h-10 rounded-lg border border-mist-300 bg-white px-3 text-sm">
            <option value="">كل المصادر</option>
            {sources.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {view === "board" ? (
        <Board leads={list} open={setOpenId} />
      ) : view === "calendar" && calendarOn ? (
        <Calendar leads={all.filter((l) => !l.spam)} open={setOpenId} />
      ) : (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Filters<Folder>
              value={folder}
              onChange={(f) => {
                setFolder(f);
                setPicked([]);
              }}
              items={[
                { id: "all", label: "الكل", count: all.filter((l) => !l.spam).length },
                ...STATUS_ORDER.map((st) => ({ id: st as Folder, label: STATUS[st].label, count: all.filter((l) => !l.spam && l.status === st).length })),
                { id: "spam", label: "مشبوهة", count: all.filter((l) => l.spam).length },
              ]}
            />
            {picked.length ? (
              <div className="flex items-center gap-2">
                <span className="text-[0.8rem] text-muted">{picked.length} محدد</span>
                <Btn
                  size="sm"
                  onClick={() => {
                    update((d) => d.leads.forEach((l) => picked.includes(l.id) && l.status === "new" && (l.status = "contacted")), { action: `علّم ${countAr(picked.length, "طلبًا واحدًا", "طلبين", "طلبات", "طلبًا")} «تواصلنا»` });
                    setPicked([]);
                    toast("حُدّثت الطلبات");
                  }}
                >
                  علّمها «تواصلنا»
                </Btn>
                <Btn
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    update((d) => void (d.leads = d.leads.filter((l) => !picked.includes(l.id))), { action: `حذف ${countAr(picked.length, "طلبًا واحدًا", "طلبين", "طلبات", "طلبًا")}` });
                    setPicked([]);
                    toast("حُذفت الطلبات");
                  }}
                >
                  حذف
                </Btn>
              </div>
            ) : null}
          </div>

          {list.length ? (
            <Card pad={false}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-[0.85rem]">
                  <thead>
                    <tr className="border-b border-mist-200 text-start text-[0.75rem] text-muted">
                      <th className="w-10 px-3 py-2.5">
                        <input type="checkbox" aria-label="تحديد الكل" checked={picked.length === list.length} onChange={(e) => setPicked(e.target.checked ? list.map((l) => l.id) : [])} />
                      </th>
                      <th className="px-3 py-2.5 text-start font-semibold">المراجع</th>
                      <th className="px-3 py-2.5 text-start font-semibold">السبب</th>
                      <th className="px-3 py-2.5 text-start font-semibold">المصدر</th>
                      <th className="px-3 py-2.5 text-start font-semibold">الموعد</th>
                      <th className="px-3 py-2.5 text-start font-semibold">وصل</th>
                      <th className="px-3 py-2.5 text-start font-semibold">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((l) => (
                      <tr key={l.id} className="cursor-pointer border-b border-mist-100 last:border-0 hover:bg-mist-50" onClick={() => setOpenId(l.id)}>
                        <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                          <input type="checkbox" aria-label={`تحديد ${l.name}`} checked={picked.includes(l.id)} onChange={(e) => setPicked(e.target.checked ? [...picked, l.id] : picked.filter((x) => x !== l.id))} />
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="font-semibold">{l.name}</span>
                          {l.demo ? <Badge className="ms-1.5">مثال</Badge> : null}
                          <span dir="ltr" className="tabular block text-end text-[0.75rem] text-muted sm:text-start">
                            {displayPhone(l.phone)}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          {l.complaintLabel}
                          <span className="block text-[0.75rem] text-muted">{l.mode === "home" ? "زيارة منزلية" : "في المركز"}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          {l.source}
                          {l.campaign ? <span className="block text-[0.75rem] text-muted">{l.campaign}</span> : null}
                        </td>
                        <td className="tabular px-3 py-2.5">{l.appointment ? `${l.appointment.date.slice(5).replace("-", "/")} · ${l.appointment.time}` : <span className="text-mist-400">—</span>}</td>
                        <td className="px-3 py-2.5 text-muted">{ago(l.createdAt)}</td>
                        <td className="px-3 py-2.5">
                          {l.spam ? (
                            <Badge tone="red">
                              <ShieldAlert size={12} aria-hidden /> مشبوه
                            </Badge>
                          ) : (
                            <Badge tone={STATUS[l.status].tone}>{STATUS[l.status].label}</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ) : (
            <Empty title={folder === "spam" ? "لا طلبات مشبوهة" : "لا طلبات هنا"} text={folder === "spam" ? "الطلبات التي يوقفها الحقل المخفي أو التي تُملأ في أقل من 3 ثوانٍ تظهر هنا." : "جرّب حالة أو مصدرًا آخر، أو امسح البحث."} />
          )}
        </>
      )}

      {opened ? <LeadDrawer key={opened.id} lead={opened} onClose={() => setOpenId(null)} /> : null}
      {adding ? <NewLead onClose={() => setAdding(false)} /> : null}
    </>
  );
}
