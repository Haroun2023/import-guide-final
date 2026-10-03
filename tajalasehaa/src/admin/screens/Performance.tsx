import { Gauge, LoaderCircle, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { useCms } from "@/cms/store";
import { Badge, Btn, Card, LinkBtn, PageHeader, Stat, useToast } from "../ui";

const PAGES = ["/", "/programs", "/programs/spine", "/devices/antigravity", "/visit", "/book"];
type Row = { path: string; ms: number; kb: number; prerendered: boolean };

/** Real timings: each page's HTML fetched fresh from the server. */
async function measure(): Promise<Row[]> {
  const rows: Row[] = [];
  for (const path of PAGES) {
    const t0 = performance.now();
    const res = await fetch(path, { cache: "no-store" });
    const html = await res.text();
    rows.push({ path, ms: Math.round(performance.now() - t0), kb: Math.round(new Blob([html]).size / 1024), prerendered: html.includes('data-route="') });
  }
  return rows;
}

export function Performance() {
  const settings = useCms((s) => s.plugins.cache?.settings ?? {});
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const on = (k: string) => (settings[k] ? <Badge tone="green">مفعّل</Badge> : <Badge>متوقف</Badge>);

  return (
    <>
      <PageHeader title="الأداء" sub="سرعة الصفحات تعني طلبات أكثر من زوار الإعلانات على الجوال." actions={<LinkBtn href="/plugins/cache">إعدادات الإضافة</LinkBtn>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Stat label="ظهور المحتوى الرئيسي (LCP)" value="2.1 ث" hint="جوال بشبكة بطيئة · كان 16.3 ث في الموقع الحالي" icon={<Zap size={20} />} />
        <Stat label="صفحات مولَّدة مسبقًا" value="33" hint="تصل جاهزة دون انتظار JavaScript" tone="navy" icon={<Gauge size={20} />} />
        <Stat label="حجم الرئيسية" value="≈0.5 MB" hint="كان ≈4.5 MB و211 طلبًا" tone="amber" icon={<Gauge size={20} />} />
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_20rem]">
        <Card
          title="قياس حي"
          actions={
            <Btn
              size="sm"
              variant="primary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  setRows(await measure());
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? <LoaderCircle size={14} className="animate-spin" aria-hidden /> : null} قِس الآن
            </Btn>
          }
          pad={false}
        >
          {rows ? (
            <table className="w-full text-[0.85rem]">
              <thead>
                <tr className="border-b border-mist-200 text-[0.75rem] text-muted">
                  <th className="px-4 py-2.5 text-start font-semibold">الصفحة</th>
                  <th className="px-4 py-2.5 text-start font-semibold">زمن الوصول</th>
                  <th className="px-4 py-2.5 text-start font-semibold">حجم HTML</th>
                  <th className="px-4 py-2.5 text-start font-semibold">جاهزة مسبقًا</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.path} className="border-b border-mist-100 last:border-0">
                    <td dir="ltr" className="px-4 py-2.5 text-end font-mono text-[0.8rem]">
                      {r.path}
                    </td>
                    <td className="tabular px-4 py-2.5">
                      <span className={r.ms < 400 ? "font-semibold text-brand-700" : "font-semibold text-[#b07a1c]"}>{r.ms} ms</span>
                    </td>
                    <td className="tabular px-4 py-2.5">{r.kb} KB</td>
                    <td className="px-4 py-2.5">{r.prerendered ? <Badge tone="green">نعم</Badge> : <Badge>لا</Badge>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-4 text-[0.85rem] leading-6 text-muted">يطلب ست صفحات من الخادم الآن ويقيس زمن وصولها وحجمها. الأرقام أعلاه من قياس مخبري سابق على جوال بشبكة بطيئة.</p>
          )}
        </Card>
        <Card title="التحسينات">
          <ul className="grid gap-2.5 text-[0.85rem]">
            <li className="flex items-center justify-between gap-2">توليد الصفحات مسبقًا {on("prerender")}</li>
            <li className="flex items-center justify-between gap-2">تحميل الصور عند الحاجة {on("lazyImages")}</li>
            <li className="flex items-center justify-between gap-2">تصغير الملفات {on("minify")}</li>
            <li className="flex items-center justify-between gap-2">تحميل الخط العربي مبكرًا {on("preloadFonts")}</li>
          </ul>
          <Btn className="mt-4 w-full" onClick={() => toast("مُسحت الذاكرة المؤقتة. في الموقع الفعلي يعيد الخادم توليد الصفحات عند النشر")}>
            <Trash2 size={15} aria-hidden /> مسح الذاكرة المؤقتة
          </Btn>
        </Card>
      </div>
    </>
  );
}
