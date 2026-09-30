import { useCms } from "@/cms/store";
import type { Seo } from "@/cms/types";
import { analyze, LIGHT_DOT, LIGHT_LABEL } from "./seoAnalysis";
import { Area, Card, Text } from "./ui";

/** How the page could look in Google's results (mobile style). */
export function Snippet({ title, description, path }: { title: string; description: string; path: string }) {
  const name = useCms((s) => s.site.name);
  const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-mist-200" aria-label="معاينة نتيجة البحث">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-mist-100">
          <img src="/brand/mark.svg" alt="" width={16} height={14} />
        </span>
        <span className="min-w-0 leading-4">
          <span className="block text-[0.8rem] font-semibold">{name}</span>
          <span dir="ltr" className="block truncate text-start text-[0.72rem] text-muted">
            tajalasehaa.sa{path === "/" ? "" : ` › ${path.split("/").filter(Boolean).join(" › ")}`}
          </span>
        </span>
      </div>
      <p className="mt-2 text-[1.05rem] leading-6 text-[#1a0dab]">{cut(title || "بلا عنوان", 62)}</p>
      <p className="mt-1 text-[0.82rem] leading-6 text-[#4d5156]">{cut(description || "سيختار Google نصًا من الصفحة إن لم تكتب وصفًا.", 160)}</p>
    </div>
  );
}

/** Search title, description, focus phrase, preview and analysis (the SEO plugin's box under the editor). */
export function SeoBox({
  seo,
  onChange,
  path,
  body,
  firstParagraph,
  headings,
  hasCta,
}: {
  seo: Seo;
  onChange: (v: Seo) => void;
  path: string;
  body: string;
  firstParagraph?: string;
  headings?: number;
  hasCta?: boolean;
}) {
  const on = useCms((s) => !!s.plugins.seo?.active);
  if (!on) return null;
  const { checks, score } = analyze({ title: seo.title, description: seo.description, focus: seo.focus, body, firstParagraph, headings, hasCta });
  return (
    <Card
      title="تحسين محركات البحث"
      actions={
        <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold">
          <span className={`size-2.5 rounded-full ${LIGHT_DOT[score]}`} /> {LIGHT_LABEL[score]}
        </span>
      }
    >
      <div className="grid gap-4">
        <Snippet title={seo.title} description={seo.description} path={path} />
        <Text label="العبارة المفتاحية" value={seo.focus} onChange={(v) => onChange({ ...seo, focus: v })} placeholder="مثال: علاج آلام الظهر في المدينة" />
        <Text label="عنوان البحث" value={seo.title} onChange={(v) => onChange({ ...seo, title: v })} max={60} />
        <Area label="الوصف" value={seo.description} onChange={(v) => onChange({ ...seo, description: v })} max={160} rows={3} />
        <ul className="grid gap-1.5" aria-label="تحليل">
          {checks.map((c) => (
            <li key={c.id} className="flex items-start gap-2 text-[0.8rem] leading-6">
              <span className={`mt-2 size-2 shrink-0 rounded-full ${LIGHT_DOT[c.light]}`} aria-hidden />
              <span>
                <span className="sr-only">{LIGHT_LABEL[c.light]}: </span>
                {c.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
