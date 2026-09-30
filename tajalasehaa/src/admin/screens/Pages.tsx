import { ChevronDown, Eye, EyeOff, GripVertical, Monitor, RefreshCw, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { campaigns } from "@/config/campaigns";
import { routeMeta } from "@/seo";
import { update, useCms } from "@/cms/store";
import type { CmsState, CopyEntry } from "@/cms/types";
import { analyze, LIGHT_DOT, LIGHT_LABEL } from "../seoAnalysis";
import { Area, Badge, Btn, Card, IconBtn, Lines, LinkBtn, PageHeader, Text, useToast } from "../ui";

export const SITE_PAGES: { path: string; label: string; kind: "page" | "campaign" | "blog" }[] = [
  { path: "/", label: "الرئيسية", kind: "page" },
  { path: "/programs", label: "البرامج", kind: "page" },
  { path: "/devices", label: "الأجهزة", kind: "page" },
  { path: "/conditions", label: "أين يؤلمك؟", kind: "page" },
  { path: "/about", label: "من نحن", kind: "page" },
  { path: "/visit", label: "زُر مركزنا", kind: "page" },
  { path: "/faq", label: "الأسئلة الشائعة", kind: "page" },
  { path: "/book", label: "احجز تقييمك", kind: "page" },
  { path: "/privacy", label: "سياسة الخصوصية", kind: "page" },
  { path: "/blog", label: "المقالات", kind: "blog" },
  ...campaigns.map((c) => ({ path: `/lp/${c.slug}`, label: `حملة: ${c.eyebrow}`, kind: "campaign" as const })),
];

/** The page's search title and description: the SEO plugin's override, else the site's default. */
export function pageMeta(s: CmsState, path: string) {
  const base = routeMeta(path);
  const o = s.seo[path] ?? {};
  return { title: o.title || base.title, description: o.description || base.description, focus: o.focus ?? "", custom: !!(o.title || o.description) };
}

export function Pages() {
  const s = useCms((x) => x);
  return (
    <>
      <PageHeader title="الصفحات" sub="صفحات الموقع وصفحات الحملات. حرّر الرئيسية بالمنشئ، وعناوين البحث من «تحسين البحث»." actions={<LinkBtn href="/pages/home" variant="primary">منشئ الرئيسية</LinkBtn>} />
      <Card pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[0.85rem]">
            <thead>
              <tr className="border-b border-mist-200 text-[0.75rem] text-muted">
                <th className="px-4 py-2.5 text-start font-semibold">الصفحة</th>
                <th className="px-4 py-2.5 text-start font-semibold">النوع</th>
                <th className="px-4 py-2.5 text-start font-semibold">البحث</th>
                <th className="px-4 py-2.5 text-start font-semibold" />
              </tr>
            </thead>
            <tbody>
              {SITE_PAGES.map((p) => {
                const m = pageMeta(s, p.path);
                const light = analyze({ title: m.title, description: m.description, focus: m.focus, body: m.description }).score;
                return (
                  <tr key={p.path} className="border-b border-mist-100 last:border-0">
                    <td className="px-4 py-3">
                      <span className="font-semibold">{p.label}</span>
                      <span dir="ltr" className="block text-end text-[0.75rem] text-muted sm:text-start">
                        {p.path}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={p.kind === "campaign" ? "amber" : p.kind === "blog" ? "blue" : "gray"}>{p.kind === "campaign" ? "حملة إعلانية" : p.kind === "blog" ? "أرشيف المقالات" : "صفحة"}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[0.78rem]">
                        <span className={`size-2.5 rounded-full ${LIGHT_DOT[light]}`} /> {m.custom ? "عنوان مخصص" : LIGHT_LABEL[light]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3 text-[0.8rem] font-semibold">
                        {p.path === "/" ? (
                          <Link href="/pages/home" className="text-brand-700 hover:underline">
                            المنشئ
                          </Link>
                        ) : null}
                        <Link href={`/seo?path=${encodeURIComponent(p.path)}`} className="text-brand-700 hover:underline">
                          البحث
                        </Link>
                        <a href={p.path} target="_blank" rel="noopener" className="text-brand-700 hover:underline">
                          عرض
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Home builder: order, visibility and text of each section             */
/* ------------------------------------------------------------------ */

const EDITABLE: Record<string, { fields: (keyof CopyEntry)[]; note?: string }> = {
  hero: { fields: ["eyebrow", "title", "lead", "leadShort"], note: "أول ما يراه الزائر. العنوان بخط كبير، والكلمات بين النجمتين بلون الهوية وتحتها خط مرسوم." },
  quickPaths: { fields: ["eyebrow", "title", "lead"] },
  moments: { fields: ["eyebrow", "title", "phrases", "lead"], note: "آخر العنوان يتبدّل بين العبارات." },
  painMap: { fields: ["eyebrow", "title", "lead"] },
  programs: { fields: ["eyebrow", "title", "lead"], note: "البطاقات نفسها تُحرَّر من «البرامج»." },
  devices: { fields: ["eyebrow", "title", "lead"], note: "الأجهزة تُحرَّر من «الأجهزة»." },
  manifesto: { fields: ["eyebrow", "text"], note: "فقرة تضيء كلماتها مع التمرير." },
  journey: { fields: ["eyebrow", "title", "lead"] },
  visit: { fields: ["eyebrow", "title", "lead"] },
  faq: { fields: ["eyebrow", "title", "lead"], note: "الأسئلة تُحرَّر من «الأسئلة الشائعة»." },
  booking: { fields: ["eyebrow", "title", "lead"], note: "{response} تُستبدل بوقت الرد من الإعدادات." },
};
const LABELS: Record<string, string> = { eyebrow: "العنوان الصغير", title: "العنوان", lead: "النص", leadShort: "نص الجوال (أقصر)", phrases: "العبارات المتبدلة", text: "الفقرة" };

function Preview({ path = "/", nonce }: { path?: string; nonce: number }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const box = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const frameW = device === "desktop" ? 1280 : 390;
  const scale = Math.min(1, w / frameW);
  return (
    <Card
      title="معاينة حية"
      actions={
        <div className="flex gap-1">
          <IconBtn label="حاسوب" onClick={() => setDevice("desktop")} className={device === "desktop" ? "bg-mist-100 text-ink" : ""}>
            <Monitor size={16} />
          </IconBtn>
          <IconBtn label="جوال" onClick={() => setDevice("mobile")} className={device === "mobile" ? "bg-mist-100 text-ink" : ""}>
            <Smartphone size={16} />
          </IconBtn>
        </div>
      }
    >
      <div ref={box} className="relative w-full max-w-full overflow-hidden rounded-xl bg-mist-100 ring-1 ring-mist-200" style={{ height: 760 * scale }}>
        <iframe
          key={`${nonce}-${device}`}
          title="معاينة الموقع"
          src={path}
          style={{ width: frameW, height: 760, transform: `scale(${scale})`, transformOrigin: "top right", insetInlineStart: device === "mobile" ? Math.max(0, (w - frameW * scale) / 2) : 0 }}
          className="absolute top-0 border-0 bg-white"
        />
      </div>
      <p className="mt-2 text-[0.75rem] text-muted">المعاينة هي الموقع نفسه، وتتحدث بعد كل حفظ.</p>
    </Card>
  );
}

export function HomeBuilder() {
  const saved = useCms((s) => ({ sections: s.homeSections, copy: s.copy }));
  const [sections, setSections] = useState(saved.sections);
  const [copy, setCopy] = useState(saved.copy);
  const [open, setOpen] = useState<string | null>("hero");
  const [dirty, setDirty] = useState(false);
  const [nonce, setNonce] = useState(0);
  const [dragId, setDragId] = useState<string | null>(null);
  const toast = useToast();

  const setField = (key: string, field: keyof CopyEntry, value: string | string[]) => {
    setCopy((c) => ({ ...c, [key]: { ...c[key], [field]: value } }));
    setDirty(true);
  };
  const move = (from: number, to: number) => {
    if (to < 0 || to >= sections.length) return;
    const next = [...sections];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    setSections(next);
    setDirty(true);
  };
  const save = () => {
    update(
      (d) => {
        d.homeSections = sections;
        d.copy = copy;
      },
      { action: "حدّث الصفحة الرئيسية", target: "منشئ الرئيسية" },
    );
    setDirty(false);
    setNonce((n) => n + 1);
    toast("حُفظت الرئيسية وتحدّثت المعاينة");
  };

  return (
    <>
      <PageHeader
        back={{ href: "/pages", label: "الصفحات" }}
        title="منشئ الصفحة الرئيسية"
        sub="اسحب الأقسام لترتيبها، وأخفِ ما لا تحتاجه، وعدّل نصوصها."
        actions={
          <>
            {dirty ? <span className="text-[0.8rem] font-semibold text-[#8a5a12]">تغييرات غير محفوظة</span> : null}
            <Btn onClick={() => setNonce((n) => n + 1)}>
              <RefreshCw size={15} aria-hidden /> تحديث المعاينة
            </Btn>
            <Btn variant="primary" onClick={save} disabled={!dirty}>
              حفظ ونشر
            </Btn>
          </>
        }
      />
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,26rem)_1fr]">
        <Card title={`الأقسام (${sections.filter((x) => x.visible).length} ظاهرة من ${sections.length})`} pad={false}>
          <ul className="divide-y divide-mist-100">
            {sections.map((sec, i) => {
              const ed = EDITABLE[sec.id];
              const isOpen = open === sec.id;
              return (
                <li
                  key={sec.id}
                  draggable
                  onDragStart={() => setDragId(sec.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragId) move(sections.findIndex((x) => x.id === dragId), i);
                    setDragId(null);
                  }}
                  className={`${dragId === sec.id ? "opacity-40" : ""} ${sec.visible ? "" : "bg-mist-50"}`}
                >
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <GripVertical size={16} className="shrink-0 cursor-grab text-mist-400" aria-hidden />
                    <span className="tabular w-5 text-center text-[0.75rem] text-muted">{i + 1}</span>
                    <button type="button" className={`flex min-w-0 flex-1 items-center gap-1.5 text-start font-semibold ${sec.visible ? "" : "text-muted line-through"}`} onClick={() => setOpen(isOpen ? null : sec.id)} aria-expanded={isOpen} disabled={!ed}>
                      {sec.label}
                      {ed ? <ChevronDown size={15} className={`shrink-0 text-muted transition ${isOpen ? "rotate-180" : ""}`} aria-hidden /> : null}
                    </button>
                    <IconBtn label="أعلى" onClick={() => move(i, i - 1)} disabled={i === 0} className="!size-8">
                      <span aria-hidden>↑</span>
                    </IconBtn>
                    <IconBtn label="أسفل" onClick={() => move(i, i + 1)} disabled={i === sections.length - 1} className="!size-8">
                      <span aria-hidden>↓</span>
                    </IconBtn>
                    <IconBtn
                      label={sec.visible ? "إخفاء" : "إظهار"}
                      onClick={() => {
                        setSections(sections.map((x) => (x.id === sec.id ? { ...x, visible: !x.visible } : x)));
                        setDirty(true);
                      }}
                      className="!size-8"
                    >
                      {sec.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </IconBtn>
                  </div>
                  {isOpen && ed ? (
                    <div className="grid gap-3 bg-mist-50/70 px-4 pb-4 pt-1">
                      {ed.note ? <p className="text-[0.75rem] leading-5 text-muted">{ed.note}</p> : null}
                      {ed.fields.map((f) =>
                        f === "phrases" ? (
                          <Lines key={f} label={LABELS[f]} value={(copy[sec.id]?.phrases as string[]) ?? []} onChange={(v) => setField(sec.id, f, v)} />
                        ) : f === "eyebrow" ? (
                          <Text key={f} label={LABELS[f]} value={String(copy[sec.id]?.[f] ?? "")} onChange={(v) => setField(sec.id, f, v)} />
                        ) : (
                          <Area
                            key={f}
                            label={LABELS[f]}
                            rows={f === "title" ? 2 : 3}
                            value={String(copy[sec.id]?.[f] ?? "")}
                            onChange={(v) => setField(sec.id, f, v)}
                            help={f === "title" || f === "text" ? "ضع الكلمات بين *نجمتين* لتمييزها بلون الهوية، وسطرًا جديدًا لكسر العنوان." : undefined}
                          />
                        ),
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </Card>
        <div className="min-w-0 xl:sticky xl:top-16">
          <Preview nonce={nonce} />
        </div>
      </div>
    </>
  );
}

export { Preview as SitePreview };
