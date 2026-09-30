import { CircleCheck, CircleDashed, Radio } from "lucide-react";
import { useMemo } from "react";
import { useCms } from "@/cms/store";
import { isReal, STATUS, STATUS_ORDER } from "../leadMeta";
import { Card, LinkBtn, PageHeader } from "../ui";

const CONNECTIONS: { key: string; label: string; hint: string }[] = [
  { key: "ga4Id", label: "Google Analytics 4", hint: "الزيارات ومصادرها وسلوك الزوار" },
  { key: "metaPixelId", label: "Meta (إنستغرام وفيسبوك)", hint: "تحويلات إعلانات إنستغرام" },
  { key: "snapPixelId", label: "Snapchat", hint: "تحويلات إعلانات سناب شات" },
  { key: "tiktokPixelId", label: "TikTok", hint: "تحويلات إعلانات تيك توك" },
  { key: "googleAdsId", label: "Google Ads", hint: "تحويلات إعلانات البحث" },
];

/** What the site already measures (src/lib/tracking.ts), in plain words. */
const EVENTS = [
  ["generate_lead · Lead", "إرسال طلب حجز، بالرقم نفسه في المتصفح والخادم لمنع العدّ مرتين"],
  ["contact_whatsapp", "الضغط على أي زر واتساب، مع مكانه في الصفحة"],
  ["contact_call", "الضغط على زر الاتصال"],
  ["booking_open", "فتح نموذج الحجز"],
  ["booking_step", "كل خطوة في النموذج، لمعرفة أين يتوقف الزوار"],
  ["pain_area_select", "اختيار موضع الألم على المجسّم"],
  ["device_view", "عرض جهاز في المعرض"],
  ["get_directions · open_map", "طلب الاتجاهات أو فتح الخريطة"],
];

export function Analytics() {
  const settings = useCms((s) => s.plugins.analytics?.settings ?? {});
  const leads = useCms((s) => s.leads.filter(isReal));
  const byCampaign = useMemo(() => {
    const m = new Map<string, { n: number; booked: number; source: string }>();
    for (const l of leads) {
      const k = l.campaign ?? "بدون حملة";
      const r = m.get(k) ?? { n: 0, booked: 0, source: l.source };
      r.n++;
      if (l.status === "booked" || l.status === "attended") r.booked++;
      m.set(k, r);
    }
    return [...m.entries()].sort((a, b) => b[1].n - a[1].n);
  }, [leads]);
  const byPage = useMemo(() => {
    const m = new Map<string, number>();
    for (const l of leads) m.set(l.placement, (m.get(l.placement) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [leads]);
  const max = Math.max(1, ...STATUS_ORDER.map((st) => leads.filter((l) => l.status === st).length));

  return (
    <>
      <PageHeader title="التحليلات" sub="من أين تأتي الطلبات، وأي حملة تصير مواعيد. الأرقام من الحجوزات المسجلة في لوحة التحكم." actions={<LinkBtn href="/plugins/analytics">ربط الحسابات</LinkBtn>} />
      <div className="grid gap-5 xl:grid-cols-3">
        <Card title="الحسابات المربوطة" className="xl:col-span-1">
          <ul className="grid gap-2">
            {CONNECTIONS.map((c) => {
              const on = !!String(settings[c.key] ?? "");
              return (
                <li key={c.key} className="flex items-center gap-3 rounded-xl bg-mist-50 px-3 py-2.5">
                  {on ? <CircleCheck size={18} className="shrink-0 text-brand-600" aria-hidden /> : <CircleDashed size={18} className="shrink-0 text-mist-400" aria-hidden />}
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{c.label}</span>
                    <span className="block text-[0.75rem] text-muted">{on ? <span dir="ltr">{String(settings[c.key])}</span> : c.hint}</span>
                  </span>
                  <span className={`text-[0.72rem] font-semibold ${on ? "text-brand-700" : "text-muted"}`}>{on ? "مربوط" : "غير مربوط"}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[0.75rem] leading-5 text-muted">الزيارات تظهر هنا بعد ربط GA4. في نسخة العرض تُحفظ المعرّفات دون تشغيل البكسلات.</p>
        </Card>

        <Card title="مسار الطلب" className="xl:col-span-2">
          <ul className="grid gap-2.5">
            {STATUS_ORDER.map((st) => {
              const n = leads.filter((l) => l.status === st).length;
              return (
                <li key={st} className="grid grid-cols-[6.5rem_1fr_2.5rem] items-center gap-3 text-[0.85rem]">
                  <span className="font-semibold">{STATUS[st].label}</span>
                  <span className="h-3 overflow-hidden rounded-full bg-mist-100">
                    <span className="block h-full rounded-full bg-gradient-to-l from-brand-600 to-leaf-400" style={{ width: `${(n / max) * 100}%` }} />
                  </span>
                  <span className="tabular text-end text-muted">{n}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title="الحملات" pad={false} className="xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-[0.85rem]">
              <thead>
                <tr className="border-b border-mist-200 text-[0.75rem] text-muted">
                  <th className="px-4 py-2.5 text-start font-semibold">الحملة</th>
                  <th className="px-4 py-2.5 text-start font-semibold">المصدر</th>
                  <th className="px-4 py-2.5 text-start font-semibold">الطلبات</th>
                  <th className="px-4 py-2.5 text-start font-semibold">مواعيد</th>
                  <th className="px-4 py-2.5 text-start font-semibold">التحويل</th>
                </tr>
              </thead>
              <tbody>
                {byCampaign.map(([k, r]) => (
                  <tr key={k} className="border-b border-mist-100 last:border-0">
                    <td className="px-4 py-2.5 font-semibold">{k}</td>
                    <td className="px-4 py-2.5 text-muted">{r.source}</td>
                    <td className="tabular px-4 py-2.5">{r.n}</td>
                    <td className="tabular px-4 py-2.5">{r.booked}</td>
                    <td className="tabular px-4 py-2.5 font-semibold text-brand-700">{Math.round((r.booked / r.n) * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="الصفحات التي تأتي منها الطلبات">
          <ul className="grid gap-2 text-[0.85rem]">
            {byPage.map(([p, n]) => (
              <li key={p} className="flex items-center justify-between gap-3 rounded-lg bg-mist-50 px-3 py-2">
                <span dir="ltr" className="truncate text-[0.8rem]">
                  {p}
                </span>
                <span className="tabular font-bold">{n}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="ما يقيسه الموقع الآن" className="xl:col-span-3">
          <ul className="grid gap-2 md:grid-cols-2">
            {EVENTS.map(([k, v]) => (
              <li key={k} className="flex items-start gap-3 rounded-xl bg-mist-50 px-3 py-2.5 text-[0.83rem]">
                <Radio size={16} className="mt-1 shrink-0 text-brand-600" aria-hidden />
                <span>
                  <code dir="ltr" className="text-[0.75rem] font-semibold text-navy-600">
                    {k}
                  </code>
                  <span className="block text-muted">{v}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[0.75rem] text-muted">لا تُرسل أي بيانات صحية للمنصات الإعلانية: الحالة ونوع الشكوى تبقى في لوحة التحكم فقط.</p>
        </Card>
      </div>
    </>
  );
}
