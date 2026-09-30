import { ArrowDown, ArrowUp, Copy, ExternalLink, Heading2, Heading3, ImageIcon, Info, List, MousePointerClick, Pilcrow, Plus, Quote, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { uid } from "@/cms/defaults";
import { currentUserName, update, useCms } from "@/cms/store";
import type { Block, BlockType, Post } from "@/cms/types";
import { analyze, LIGHT_DOT, LIGHT_LABEL } from "../seoAnalysis";
import { SeoBox } from "../SeoBox";
import { Area, Badge, Btn, Card, Empty, Filters, fmtDate, IconBtn, Lines, LinkBtn, PageHeader, SearchBox, Select, slugify, Text, useConfirm, useDraft, useToast } from "../ui";
import { MediaPicker, MediaThumb } from "./Media";

const BLOCKS: { type: BlockType; label: string; icon: typeof Pilcrow }[] = [
  { type: "p", label: "فقرة", icon: Pilcrow },
  { type: "h2", label: "عنوان", icon: Heading2 },
  { type: "h3", label: "عنوان فرعي", icon: Heading3 },
  { type: "list", label: "قائمة", icon: List },
  { type: "quote", label: "اقتباس", icon: Quote },
  { type: "callout", label: "تنبيه", icon: Info },
  { type: "image", label: "صورة", icon: ImageIcon },
  { type: "cta", label: "زر حجز", icon: MousePointerClick },
];
const CATEGORIES = ["الظهر والرقبة", "المفاصل", "الإصابات الرياضية", "صحة المرأة", "قبل زيارتك", "الأجهزة", "المعتمرون والزوار", "عام"];

export const bodyText = (blocks: Block[]) => blocks.map((b) => (b.type === "list" ? (b.items ?? []).join(" ") : b.text ?? "")).join("\n");

function postScore(p: Post) {
  const blocks = p.blocks;
  return analyze({
    title: p.seo.title || p.title,
    description: p.seo.description,
    focus: p.seo.focus,
    body: bodyText(blocks),
    firstParagraph: blocks.find((b) => b.type === "p")?.text ?? "",
    headings: blocks.filter((b) => b.type === "h2" || b.type === "h3").length,
    hasCta: blocks.some((b) => b.type === "cta"),
  }).score;
}

export function Posts() {
  const posts = useCms((s) => s.posts);
  const [tab, setTab] = useState<"all" | Post["status"]>("all");
  const [q, setQ] = useState("");
  const toast = useToast();
  const { confirm, node } = useConfirm();
  const list = posts.filter((p) => (tab === "all" || p.status === tab) && (!q || p.title.includes(q)));

  return (
    <>
      {node}
      <PageHeader
        title="المقالات"
        sub="نصائح يكتبها فريقك، تظهر في /blog وتجلب زيارات من البحث."
        actions={
          <LinkBtn href="/posts/new" variant="primary">
            <Plus size={16} aria-hidden /> أضف مقالًا
          </LinkBtn>
        }
      />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Filters
          value={tab}
          onChange={setTab}
          items={[
            { id: "all", label: "الكل", count: posts.length },
            { id: "published", label: "منشورة", count: posts.filter((p) => p.status === "published").length },
            { id: "draft", label: "مسودات", count: posts.filter((p) => p.status === "draft").length },
          ]}
        />
        <div className="w-60">
          <SearchBox value={q} onChange={setQ} placeholder="ابحث في المقالات" />
        </div>
      </div>
      {list.length ? (
        <Card pad={false}>
          <ul className="divide-y divide-mist-200">
            {list.map((p) => {
              const score = postScore(p);
              return (
                <li key={p.id} className="group flex items-center gap-4 px-4 py-3">
                  <span className="hidden size-16 shrink-0 overflow-hidden rounded-lg bg-mist-100 sm:block">
                    {p.cover ? <MediaThumb m={{ id: p.id, name: "", src: p.cover, kind: "photo", alt: "", createdAt: "", builtIn: true }} className="size-full" /> : null}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/posts/${p.id}`} className="font-bold hover:text-brand-700">
                      {p.title}
                    </Link>
                    {p.status === "draft" ? <span className="ms-1.5 text-[0.8rem] font-semibold text-muted">— مسودة</span> : null}
                    {p.demo ? <Badge className="ms-1.5">مثال</Badge> : null}
                    <p className="mt-0.5 text-[0.78rem] text-muted">
                      {p.category} · {p.author} · {fmtDate(p.updatedAt)}
                    </p>
                    <div className="mt-1 flex gap-3 text-[0.78rem] font-semibold opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                      <Link href={`/posts/${p.id}`} className="text-brand-700 hover:underline">
                        تحرير
                      </Link>
                      <a href={`/blog/${p.slug}${p.status === "published" ? "" : `?preview=${p.id}`}`} target="_blank" rel="noopener" className="text-brand-700 hover:underline">
                        {p.status === "published" ? "عرض" : "معاينة"}
                      </a>
                      <button
                        type="button"
                        className="text-brand-700 hover:underline"
                        onClick={() => {
                          const now = new Date().toISOString();
                          update((d) => void d.posts.unshift({ ...structuredClone(p), id: uid("post-"), slug: `${p.slug}-2`, title: `${p.title} (نسخة)`, status: "draft", createdAt: now, updatedAt: now, demo: false }), { action: "نسخ مقالًا", target: p.title });
                          toast("أُنشئت نسخة مسودة");
                        }}
                      >
                        نسخ
                      </button>
                      <button type="button" className="text-coral-600 hover:underline" onClick={() => confirm(`حذف «${p.title}»؟`, () => update((d) => void (d.posts = d.posts.filter((x) => x.id !== p.id)), { action: "حذف مقالًا", target: p.title }), "حذف")}>
                        حذف
                      </button>
                    </div>
                  </div>
                  <span className="hidden items-center gap-1.5 text-[0.75rem] text-muted md:inline-flex" title="تقييم تحسين البحث">
                    <span className={`size-2.5 rounded-full ${LIGHT_DOT[score]}`} /> {LIGHT_LABEL[score]}
                  </span>
                  <Badge tone={p.status === "published" ? "green" : "gray"}>{p.status === "published" ? "منشور" : "مسودة"}</Badge>
                </li>
              );
            })}
          </ul>
        </Card>
      ) : (
        <Empty title="لا مقالات هنا" action={<LinkBtn href="/posts/new">اكتب أول مقال</LinkBtn>} />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */

function Inserter({ onAdd, compact }: { onAdd: (t: BlockType) => void; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${compact ? "my-1 flex justify-center" : "mt-3"}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={compact ? "grid size-7 place-items-center rounded-full bg-white text-brand-700 opacity-40 ring-1 ring-mist-300 transition hover:opacity-100" : "inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-mist-300 text-sm font-semibold text-muted hover:border-brand-400 hover:text-brand-700"}
        aria-label="أضف كتلة"
      >
        <Plus size={16} aria-hidden /> {compact ? null : "أضف كتلة"}
      </button>
      {open ? (
        <div className="absolute top-full z-20 mt-1 grid w-72 grid-cols-4 gap-1 rounded-xl bg-white p-2 shadow-2xl ring-1 ring-mist-200">
          {BLOCKS.map((b) => (
            <button
              key={b.type}
              type="button"
              onClick={() => {
                onAdd(b.type);
                setOpen(false);
              }}
              className="grid place-items-center gap-1 rounded-lg px-1 py-2 text-[0.7rem] font-semibold text-muted hover:bg-brand-50 hover:text-brand-800"
            >
              <b.icon size={18} aria-hidden /> {b.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BlockEditor({ block, onChange, onMove, onRemove, first, last }: { block: Block; onChange: (b: Block) => void; onMove: (d: -1 | 1) => void; onRemove: () => void; first: boolean; last: boolean }) {
  const [picking, setPicking] = useState(false);
  const meta = BLOCKS.find((b) => b.type === block.type)!;
  const input = "w-full resize-none rounded-lg border border-transparent bg-transparent px-2 py-1.5 focus:border-mist-300 focus:bg-white focus:outline-none";
  return (
    <div className="group relative rounded-xl px-2 py-1 ring-1 ring-transparent transition hover:bg-white hover:ring-mist-200 focus-within:bg-white focus-within:ring-brand-200">
      <div className="absolute -top-3.5 end-2 z-10 hidden items-center gap-0.5 rounded-lg bg-white px-1 shadow ring-1 ring-mist-200 group-focus-within:flex group-hover:flex">
        <select value={block.type} onChange={(e) => onChange({ ...block, type: e.target.value as BlockType })} className="h-7 rounded-md bg-transparent px-1 text-[0.72rem] font-semibold" aria-label="نوع الكتلة">
          {BLOCKS.map((b) => (
            <option key={b.type} value={b.type}>
              {b.label}
            </option>
          ))}
        </select>
        <IconBtn label="أعلى" onClick={() => onMove(-1)} disabled={first} className="!size-7">
          <ArrowUp size={14} />
        </IconBtn>
        <IconBtn label="أسفل" onClick={() => onMove(1)} disabled={last} className="!size-7">
          <ArrowDown size={14} />
        </IconBtn>
        <IconBtn label="حذف" onClick={onRemove} className="!size-7">
          <Trash2 size={14} />
        </IconBtn>
      </div>
      <span className="sr-only">{meta.label}</span>
      {block.type === "list" ? (
        <Lines label={<span className="text-[0.75rem] text-muted">قائمة</span>} value={block.items ?? []} onChange={(items) => onChange({ ...block, items })} />
      ) : block.type === "image" ? (
        <div className="grid gap-2 py-1">
          {block.src ? (
            <div className="overflow-hidden rounded-xl">
              <MediaThumb m={{ id: block.id, name: "", src: block.src, kind: "photo", alt: block.alt ?? "", createdAt: "", builtIn: false }} className="max-h-64 w-full" />
            </div>
          ) : null}
          <div className="flex gap-2">
            <Btn size="sm" onClick={() => setPicking(true)}>
              <ImageIcon size={14} aria-hidden /> {block.src ? "تغيير الصورة" : "اختر صورة"}
            </Btn>
          </div>
          <input value={block.text ?? ""} onChange={(e) => onChange({ ...block, text: e.target.value })} placeholder="تعليق تحت الصورة (اختياري)" className={`${input} text-[0.85rem]`} />
          <MediaPicker open={picking} onClose={() => setPicking(false)} onPick={(src, alt) => onChange({ ...block, src, alt })} />
        </div>
      ) : block.type === "cta" ? (
        <div className="flex items-center justify-between gap-3 rounded-xl bg-deep px-4 py-3 text-white">
          <span className="text-[0.85rem] text-white/70">زر يفتح نموذج الحجز</span>
          <input value={block.text ?? ""} onChange={(e) => onChange({ ...block, text: e.target.value })} className="w-44 rounded-full bg-leaf-300 px-3 py-1.5 text-center text-sm font-bold text-deep focus:outline-none" aria-label="نص الزر" />
        </div>
      ) : (
        <textarea
          rows={block.type === "p" ? 3 : 1}
          value={block.text ?? ""}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          placeholder={block.type === "p" ? "اكتب فقرة…" : meta.label}
          className={`${input} ${block.type === "h2" ? "text-xl font-bold" : block.type === "h3" ? "text-lg font-bold" : block.type === "quote" ? "border-s-4 !border-s-brand-400 text-lg font-semibold text-brand-900" : block.type === "callout" ? "rounded-lg !bg-[#fff7e6] text-[#6b4a10]" : "leading-8"}`}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = "auto";
            t.style.height = `${t.scrollHeight}px`;
          }}
        />
      )}
    </div>
  );
}

const blank = (): Post => {
  const now = new Date().toISOString();
  return { id: "", slug: "", title: "", excerpt: "", category: "عام", tags: [], blocks: [{ id: uid("b"), type: "p", text: "" }], status: "draft", author: "", createdAt: now, updatedAt: now, seo: { title: "", description: "", focus: "" } };
};

export function PostEditor({ id }: { id: string }) {
  const existing = useCms((s) => s.posts.find((p) => p.id === id));
  const isNew = id === "new";
  const { draft, set, dirty, clean } = useDraft<Post>(existing ?? blank());
  const [picking, setPicking] = useState(false);
  const [, go] = useLocation();
  const toast = useToast();

  if (!isNew && !existing) return <Empty title="المقال غير موجود" action={<LinkBtn href="/posts">كل المقالات</LinkBtn>} />;

  const blocks = draft.blocks;
  const setBlocks = (b: Block[]) => set("blocks", b);
  const addAt = (i: number, type: BlockType) => setBlocks([...blocks.slice(0, i), { id: uid("b"), type, text: type === "cta" ? "احجز تقييمك" : "", items: type === "list" ? [] : undefined }, ...blocks.slice(i)]);
  const words = bodyText(blocks).split(/\s+/).filter(Boolean).length;

  const save = (status: Post["status"]) => {
    if (!draft.title.trim()) return toast("اكتب عنوانًا للمقال", "warn");
    const now = new Date().toISOString();
    const post: Post = { ...draft, status, id: draft.id || uid("post-"), slug: draft.slug || slugify(draft.title), author: draft.author || currentUserName(), updatedAt: now, excerpt: draft.excerpt || (blocks.find((b) => b.type === "p")?.text ?? "").slice(0, 150) };
    update(
      (d) => {
        const i = d.posts.findIndex((p) => p.id === post.id);
        if (i >= 0) d.posts[i] = post;
        else d.posts.unshift(post);
      },
      { action: status === "published" ? (existing?.status === "published" ? "حدّث مقالًا" : "نشر مقالًا") : "حفظ مسودة", target: post.title },
    );
    clean();
    toast(status === "published" ? "نُشر المقال، وهو الآن في /blog" : "حُفظت المسودة");
    if (isNew) go(`/posts/${post.id}`, { replace: true });
  };

  return (
    <>
      <PageHeader
        back={{ href: "/posts", label: "المقالات" }}
        title={isNew ? "مقال جديد" : "تحرير المقال"}
        actions={
          <>
            {dirty ? <span className="text-[0.8rem] font-semibold text-[#8a5a12]">تغييرات غير محفوظة</span> : null}
            {draft.slug ? (
              <LinkBtn href={`/blog/${draft.slug}${draft.status === "published" && !dirty ? "" : `?preview=${draft.id}`}`} external>
                <ExternalLink size={15} aria-hidden /> معاينة
              </LinkBtn>
            ) : null}
          </>
        }
      />
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="min-w-0">
          <Card>
            <label htmlFor="post-title" className="sr-only">
              العنوان
            </label>
            <input id="post-title" value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="أضف عنوانًا" className="w-full rounded-lg px-2 py-1 text-[1.7rem] font-bold leading-snug focus:bg-mist-50 focus:outline-none" />
            <p className="mt-1 flex flex-wrap items-center gap-1 px-2 text-[0.8rem] text-muted">
              الرابط:
              <span dir="ltr" className="tabular">
                tajalasehaa.sa/blog/
              </span>
              <input dir="ltr" value={draft.slug} onChange={(e) => set("slug", slugify(e.target.value))} placeholder={slugify(draft.title || "slug")} className="w-48 rounded border border-mist-200 px-1.5 py-0.5 text-[0.8rem] focus:border-brand-400 focus:outline-none" aria-label="الرابط" />
            </p>
            <div className="mt-5 grid gap-1">
              {blocks.map((b, i) => (
                <div key={b.id}>
                  <BlockEditor
                    block={b}
                    first={i === 0}
                    last={i === blocks.length - 1}
                    onChange={(nb) => setBlocks(blocks.map((x) => (x.id === b.id ? nb : x)))}
                    onRemove={() => setBlocks(blocks.filter((x) => x.id !== b.id))}
                    onMove={(d) => {
                      const next = [...blocks];
                      const j = i + d;
                      [next[i], next[j]] = [next[j], next[i]];
                      setBlocks(next);
                    }}
                  />
                  {i < blocks.length - 1 ? <Inserter compact onAdd={(t) => addAt(i + 1, t)} /> : null}
                </div>
              ))}
            </div>
            <Inserter onAdd={(t) => addAt(blocks.length, t)} />
            <p className="mt-3 text-[0.75rem] text-muted">{words} كلمة · مرّر فوق أي كتلة لتغيير نوعها أو ترتيبها</p>
          </Card>
          <div className="mt-5">
            <SeoBox
              seo={draft.seo}
              onChange={(v) => set("seo", v)}
              path={`/blog/${draft.slug || slugify(draft.title || "post")}`}
              body={bodyText(blocks)}
              firstParagraph={blocks.find((b) => b.type === "p")?.text ?? ""}
              headings={blocks.filter((b) => b.type === "h2" || b.type === "h3").length}
              hasCta={blocks.some((b) => b.type === "cta")}
            />
          </div>
        </div>

        <aside className="grid gap-4 xl:sticky xl:top-16">
          <Card title="النشر">
            <dl className="grid gap-2 text-[0.83rem]">
              <div className="flex justify-between">
                <dt className="text-muted">الحالة</dt>
                <dd className="font-semibold">{draft.status === "published" ? "منشور" : "مسودة"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">آخر تعديل</dt>
                <dd className="font-semibold">{fmtDate(draft.updatedAt, true)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <Btn onClick={() => save("draft")}>{draft.status === "published" ? "إلغاء النشر" : "حفظ مسودة"}</Btn>
              <Btn variant="primary" className="flex-1" onClick={() => save("published")}>
                {draft.status === "published" ? "تحديث" : "نشر"}
              </Btn>
            </div>
          </Card>
          <Card title="الصورة البارزة">
            {draft.cover ? (
              <div className="overflow-hidden rounded-xl">
                <MediaThumb m={{ id: "cover", name: "", src: draft.cover, kind: "photo", alt: "", createdAt: "", builtIn: false }} className="aspect-[16/9] w-full" />
              </div>
            ) : null}
            <div className="mt-2 flex gap-2">
              <Btn size="sm" onClick={() => setPicking(true)}>
                {draft.cover ? "تغيير" : "اختر صورة"}
              </Btn>
              {draft.cover ? (
                <Btn size="sm" variant="ghost" onClick={() => set("cover", undefined)}>
                  إزالة
                </Btn>
              ) : null}
            </div>
            <MediaPicker open={picking} onClose={() => setPicking(false)} onPick={(src) => set("cover", src)} />
          </Card>
          <Card title="التصنيف والوسوم">
            <div className="grid gap-3">
              <Select label="التصنيف" value={draft.category} onChange={(v) => set("category", v)} options={CATEGORIES.map((c) => ({ value: c, label: c }))} />
              <Text label="الوسوم" value={draft.tags.join("، ")} onChange={(v) => set("tags", v.split(/[،,]\s*/).filter(Boolean))} help="افصل بينها بفاصلة." />
            </div>
          </Card>
          <Card title="المقتطف">
            <Area label={<span className="sr-only">المقتطف</span>} value={draft.excerpt} onChange={(v) => set("excerpt", v)} rows={3} max={180} help="يظهر في بطاقة المقال وفي المشاركة." />
          </Card>
          {!isNew ? (
            <Btn
              size="sm"
              variant="ghost"
              onClick={() => {
                const now = new Date().toISOString();
                const copy = { ...structuredClone(draft), id: uid("post-"), slug: `${draft.slug}-2`, title: `${draft.title} (نسخة)`, status: "draft" as const, createdAt: now, updatedAt: now };
                update((d) => void d.posts.unshift(copy), { action: "نسخ مقالًا", target: draft.title });
                go(`/posts/${copy.id}`);
              }}
            >
              <Copy size={14} aria-hidden /> إنشاء نسخة
            </Btn>
          ) : null}
        </aside>
      </div>
    </>
  );
}
