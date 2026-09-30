import { ExternalLink, FileCode2, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import { Link, useSearch } from "wouter";
import { jsonLd } from "@/seo";
import { update, useCms } from "@/cms/store";
import type { Seo as SeoData } from "@/cms/types";
import { SeoBox } from "../SeoBox";
import { Badge, Btn, Card, LinkBtn, PageHeader, useToast } from "../ui";
import { pageMeta, SITE_PAGES } from "./Pages";
import { countAr } from "../count";

/** The SEO plugin's screen: search title and description for every page, the sitemap and the clinic's structured data. */
export function Seo() {
  const s = useCms((x) => x);
  const initial = new URLSearchParams(useSearch()).get("path") ?? "/";
  const [path, setPath] = useState(SITE_PAGES.some((p) => p.path === initial) ? initial : "/");
  const meta = pageMeta(s, path);
  const [draft, setDraft] = useState<SeoData>({ title: meta.title, description: meta.description, focus: meta.focus });
  const [shown, setShown] = useState(path);
  const toast = useToast();
  if (shown !== path) {
    const m = pageMeta(s, path);
    setDraft({ title: m.title, description: m.description, focus: m.focus });
    setShown(path);
  }
  const sitemap = [...SITE_PAGES.filter((p) => p.kind !== "blog").map((p) => p.path), ...s.programs.filter((p) => p.status === "published").map((p) => `/programs/${p.id}`), ...s.devices.map((d) => `/devices/${d.id}`), ...s.posts.filter((p) => p.status === "published").map((p) => `/blog/${p.slug}`)];
  const on = !!s.plugins.seo?.active;

  return (
    <>
      <PageHeader title="تحسين محركات البحث" sub="كيف تظهر كل صفحة في نتائج Google." actions={<LinkBtn href="/plugins/seo">إعدادات الإضافة</LinkBtn>} />
      {!on ? <p className="mb-4 rounded-xl bg-[#fff7e6] px-4 py-3 text-[0.85rem] text-[#6b4a10] ring-1 ring-[#f2dfb3]">إضافة تحسين البحث متوقفة، فالعناوين المخصصة لا تُطبَّق. فعّلها من «الإضافات».</p> : null}
      <div className="grid items-start gap-5 xl:grid-cols-[17rem_1fr]">
        <Card title="الصفحات" pad={false}>
          <ul className="max-h-[70vh] overflow-y-auto py-1">
            {SITE_PAGES.filter((p) => p.kind !== "blog").map((p) => {
              const m = pageMeta(s, p.path);
              return (
                <li key={p.path}>
                  <button type="button" onClick={() => setPath(p.path)} aria-current={path === p.path} className={`flex w-full items-center justify-between gap-2 px-4 py-2 text-start text-[0.85rem] ${path === p.path ? "bg-brand-50 font-semibold text-brand-800" : "hover:bg-mist-50"}`}>
                    <span className="truncate">{p.label}</span>
                    {m.custom ? <Badge tone="green">مخصص</Badge> : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-mist-200 px-4 py-3 text-[0.75rem] leading-5 text-muted">
            عناوين البرامج والمقالات تُحرَّر من{" "}
            <Link href="/programs" className="font-semibold text-brand-700">
              البرامج
            </Link>{" "}
            و
            <Link href="/posts" className="font-semibold text-brand-700">
              المقالات
            </Link>
            .
          </p>
        </Card>
        <div className="grid gap-5">
          <SeoBox seo={draft} onChange={setDraft} path={path} body={`${draft.title} ${draft.description}`} />
          <div className="flex flex-wrap gap-2">
            <Btn
              variant="primary"
              onClick={() => {
                update((d) => void (d.seo[path] = { ...draft }), { action: "حدّث عنوان البحث", target: path });
                toast("حُفظ، ويظهر العنوان الجديد في تبويب المتصفح");
              }}
            >
              حفظ
            </Btn>
            <Btn
              onClick={() => {
                update((d) => void delete d.seo[path], { action: "أعاد عنوان البحث الافتراضي", target: path });
                setShown("");
              }}
            >
              العودة للافتراضي
            </Btn>
            <LinkBtn href={path} external>
              <ExternalLink size={15} aria-hidden /> افتح الصفحة
            </LinkBtn>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Card title={`خريطة الموقع (${countAr(sitemap.length, "رابط واحد", "رابطان", "روابط", "رابطًا")})`} actions={<MapIcon size={16} className="text-muted" aria-hidden />}>
              <ul dir="ltr" className="max-h-64 overflow-y-auto text-start font-mono text-[0.75rem] leading-6 text-muted">
                {sitemap.map((u) => (
                  <li key={u}>https://tajalasehaa.sa{u === "/" ? "/" : u}</li>
                ))}
              </ul>
            </Card>
            <Card title="بيانات المنشأة الطبية (Schema)" actions={<FileCode2 size={16} className="text-muted" aria-hidden />}>
              <pre dir="ltr" className="max-h-64 overflow-auto rounded-lg bg-deep p-3 text-start text-[0.7rem] leading-5 text-leaf-200">
                {JSON.stringify(jsonLd(), null, 2)}
              </pre>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
