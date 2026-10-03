import { useState } from "react";
import { useSearch } from "wouter";
import { openState } from "@/components/ui/OpenStatus";
import { daysLabel, WEEK } from "@/cms/apply";
import { update, useCms } from "@/cms/store";
import type { SiteEdit } from "@/cms/types";
import { Area, Btn, Card, Lines, PageHeader, Tabs, Text, Toggle, useToast } from "../ui";

const DAY_AR: Record<string, string> = { Saturday: "السبت", Sunday: "الأحد", Monday: "الإثنين", Tuesday: "الثلاثاء", Wednesday: "الأربعاء", Thursday: "الخميس", Friday: "الجمعة" };
type Tab = "general" | "contact" | "hours" | "trust" | "offer";

export function Settings() {
  const saved = useCms((s) => s.site);
  const [d, setD] = useState<SiteEdit>(() => structuredClone(saved));
  const search = useSearch();
  const [tab, setTab] = useState<Tab>(() => {
    const t = new URLSearchParams(search).get("tab");
    return t === "contact" || t === "hours" || t === "trust" || t === "offer" ? t : "general";
  });
  const toast = useToast();
  const dirty = JSON.stringify(d) !== JSON.stringify(saved);
  const set = <K extends keyof SiteEdit>(k: K, v: SiteEdit[K]) => setD({ ...d, [k]: v });
  const open = openState([{ days: d.hours.days, opens: d.hours.opens, closes: d.hours.closes }]);

  return (
    <>
      <PageHeader
        title="الإعدادات"
        sub="بيانات المركز التي تظهر في كل صفحة: الاسم والتواصل والعنوان وساعات العمل والثقة والعروض."
        actions={
          <Btn
            variant="primary"
            disabled={!dirty}
            onClick={() => {
              update((s) => void (s.site = d), { action: "حدّث إعدادات الموقع" });
              toast("حُفظت الإعدادات، وتظهر في الموقع الآن");
            }}
          >
            حفظ التغييرات
          </Btn>
        }
      />
      <Card pad={false}>
        <div className="px-4 pt-2">
          <Tabs<Tab>
            value={tab}
            onChange={setTab}
            items={[
              { id: "general", label: "عام" },
              { id: "contact", label: "التواصل والحسابات" },
              { id: "hours", label: "العنوان وساعات العمل" },
              { id: "trust", label: "الثقة والتراخيص" },
              { id: "offer", label: "العرض الحالي" },
            ]}
          />
        </div>
        <div className="grid max-w-3xl gap-5 p-5">
          {tab === "general" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Text label="اسم المركز" value={d.name} onChange={(v) => set("name", v)} />
                <Text label="المدينة" value={d.city} onChange={(v) => set("city", v)} />
              </div>
              <Text label="الاسم الكامل" value={d.fullName} onChange={(v) => set("fullName", v)} />
              <Text label="الشعار اللفظي" value={d.tagline} onChange={(v) => set("tagline", v)} />
              <Text label="وقت الرد على الطلبات (دقيقة)" type="number" dir="ltr" value={String(d.responseTimeMinutes)} onChange={(v) => set("responseTimeMinutes", Number(v) || 15)} help="يظهر في الموقع: «نرد عليك خلال 15 دقيقة في أوقات العمل». اختر رقمًا يستطيع الاستقبال الالتزام به." />
              <Toggle label="شريط «نسخة عرض» أعلى الموقع" checked={d.isDemo} onChange={(v) => set("isDemo", v)} help="أطفئه بعد اعتماد البيانات." />
            </>
          ) : tab === "contact" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Text label="الهاتف كما يُعرض" value={d.contact.phoneDisplay} onChange={(v) => set("contact", { ...d.contact, phoneDisplay: v })} dir="ltr" />
                <Text label="الهاتف بالصيغة الدولية" value={d.contact.phoneE164} onChange={(v) => set("contact", { ...d.contact, phoneE164: v })} dir="ltr" placeholder="+9665XXXXXXXX" />
                <Text label="رقم واتساب" value={d.contact.whatsapp} onChange={(v) => set("contact", { ...d.contact, whatsapp: v.replace(/\D/g, "") })} dir="ltr" help="أرقام فقط، مع مفتاح الدولة: 9665XXXXXXXX" />
                <Text label="البريد" value={d.contact.email} onChange={(v) => set("contact", { ...d.contact, email: v })} dir="ltr" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(["instagram", "tiktok", "x", "snapchat"] as const).map((k) => (
                  <Text key={k} label={{ instagram: "إنستغرام", tiktok: "تيك توك", x: "إكس", snapchat: "سناب شات" }[k]} value={d.social[k]} onChange={(v) => set("social", { ...d.social, [k]: v })} dir="ltr" placeholder="https://" />
                ))}
              </div>
            </>
          ) : tab === "hours" ? (
            <>
              <Area label="العنوان" value={d.address} onChange={(v) => set("address", v)} rows={2} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Text label="يفتح" type="time" dir="ltr" value={d.hours.opens} onChange={(v) => set("hours", { ...d.hours, opens: v })} />
                <Text label="يغلق" type="time" dir="ltr" value={d.hours.closes} onChange={(v) => set("hours", { ...d.hours, closes: v })} />
              </div>
              <fieldset>
                <legend className="mb-2 text-[0.82rem] font-semibold">أيام العمل</legend>
                <div className="flex flex-wrap gap-2">
                  {WEEK.map((day) => {
                    const on = d.hours.days.includes(day);
                    return (
                      <button key={day} type="button" aria-pressed={on} onClick={() => set("hours", { ...d.hours, days: on ? d.hours.days.filter((x) => x !== day) : [...d.hours.days, day] })} className={`rounded-full px-3.5 py-1.5 text-[0.82rem] font-semibold ring-1 transition ${on ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-muted ring-mist-300"}`}>
                        {DAY_AR[day]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
              <p className="rounded-xl bg-mist-50 px-4 py-3 text-[0.85rem] ring-1 ring-mist-200">
                يظهر في الموقع: <b>{daysLabel(d.hours.days)}</b> · الآن: <b>{open?.label ?? "—"}</b>
              </p>
            </>
          ) : tab === "trust" ? (
            <>
              <fieldset className="grid gap-3">
                <legend className="mb-1 text-[0.82rem] font-semibold">أرقام الثقة تحت الواجهة</legend>
                {d.stats.map((st, i) => (
                  <div key={i} className="grid grid-cols-[7rem_1fr] gap-2">
                    <input value={st.value} onChange={(e) => set("stats", d.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} className="rounded-lg border border-mist-300 px-3 py-2 text-center font-bold" aria-label={`الرقم ${i + 1}`} />
                    <input value={st.label} onChange={(e) => set("stats", d.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} className="rounded-lg border border-mist-300 px-3 py-2" aria-label={`وصف الرقم ${i + 1}`} />
                  </div>
                ))}
              </fieldset>
              <Text label="رقم ترخيص وزارة الصحة" value={d.license.moh} onChange={(v) => set("license", { ...d.license, moh: v })} help="إلزامي في الإعلانات الصحية. يظهر تحت أرقام الثقة متى أضفته." />
              <Toggle label="اعتماد CBAHI" checked={d.license.cbahi} onChange={(v) => set("license", { ...d.license, cbahi: v })} />
              <Lines label="شركات التأمين المتعاقد معها" value={d.insurers} onChange={(v) => set("insurers", v)} help="القائمة الفارغة تُظهر «استفسر عن تغطية تأمينك»." />
              <Toggle label="أخصائيات للسيدات" checked={d.features.femaleTherapists} onChange={(v) => set("features", { ...d.features, femaleTherapists: v })} />
              <Toggle label="علاج طبيعي منزلي" checked={d.features.homeVisits} onChange={(v) => set("features", { ...d.features, homeVisits: v })} />
              <div className="grid gap-3 sm:grid-cols-3">
                <Text label="تقييم Google" type="number" dir="ltr" value={d.rating ? String(d.rating.value) : ""} onChange={(v) => set("rating", v ? { value: Number(v), count: d.rating?.count ?? 0, source: "Google", url: d.rating?.url ?? "" } : null)} placeholder="4.8" />
                <Text label="عدد التقييمات" type="number" dir="ltr" value={d.rating ? String(d.rating.count) : ""} onChange={(v) => d.rating && set("rating", { ...d.rating, count: Number(v) })} />
                <Text label="رابط التقييمات" dir="ltr" value={d.rating?.url ?? ""} onChange={(v) => d.rating && set("rating", { ...d.rating, url: v })} />
              </div>
            </>
          ) : (
            <>
              <Toggle label="العرض مفعّل" checked={d.offer.active} onChange={(v) => set("offer", { ...d.offer, active: v })} help="يغيّر أزرار الحجز إلى «احجز تقييمك المجاني» ويُظهر السطر تحت الواجهة." />
              <Text label="نص العرض" value={d.offer.label} onChange={(v) => set("offer", { ...d.offer, label: v })} />
              <Text label="السطر التوضيحي" value={d.offer.note} onChange={(v) => set("offer", { ...d.offer, note: v })} />
              <Text label="رقم موافقة الشؤون الصحية" value={d.offer.approval ?? ""} onChange={(v) => set("offer", { ...d.offer, approval: v })} help="العروض والخصومات، ومنها التقييم المجاني، تحتاج موافقة إدارة التراخيص بالمنطقة قبل الإعلان، وبحد ثلاث موافقات في السنة." />
              <p className="text-[0.78rem] text-muted">للنافذة المنبثقة فعّل إضافة «النوافذ والعروض». وتذكّر موافقة الشؤون الصحية على العرض قبل الحملات.</p>
            </>
          )}
        </div>
      </Card>
    </>
  );
}
