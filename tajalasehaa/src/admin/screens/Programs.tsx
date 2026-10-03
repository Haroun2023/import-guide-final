import { ArrowDown, ArrowUp, ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { update, useCms } from "@/cms/store";
import type { Faq, ProgramEdit } from "@/cms/types";
import { ICONS_3D } from "../icons3d";
import { SeoBox } from "../SeoBox";
import { Area, Badge, Btn, Card, Empty, Filters, IconBtn, Lines, LinkBtn, PageHeader, Select, slugify, Tabs, Text, useConfirm, useDraft, useToast } from "../ui";

export function Programs() {
  const programs = useCms((s) => s.programs);
  const [track, setTrack] = useState<"all" | ProgramEdit["track"]>("all");
  const list = programs.filter((p) => track === "all" || p.track === track);
  return (
    <>
      <PageHeader
        title="البرامج"
        sub="كل برنامج له صفحة في الموقع، وبطاقة في الرئيسية وصفحة البرامج."
        actions={
          <LinkBtn href="/programs/new" variant="primary">
            <Plus size={16} aria-hidden /> أضف برنامجًا
          </LinkBtn>
        }
      />
      <div className="mb-3">
        <Filters
          value={track}
          onChange={setTrack}
          items={[
            { id: "all", label: "الكل", count: programs.length },
            { id: "rehab", label: "التأهيل الطبي", count: programs.filter((p) => p.track === "rehab").length },
            { id: "wellness", label: "الرعاية التكميلية", count: programs.filter((p) => p.track === "wellness").length },
          ]}
        />
      </div>
      <ul className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((p) => (
          <li key={p.id}>
            <Link href={`/programs/${p.id}`} className="flex h-full gap-3 rounded-2xl bg-white p-4 ring-1 ring-mist-200 transition hover:ring-brand-300">
              <img src={`/icons3d/${p.icon3d}.webp`} alt="" width={56} height={56} className="size-14 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="font-bold">{p.title}</span>
                  {p.status === "draft" ? <Badge>مسودة</Badge> : null}
                  {p.featured ? <Badge tone="green">{p.featured}</Badge> : null}
                </span>
                <span className="mt-1 line-clamp-2 block text-[0.8rem] leading-6 text-muted">{p.short}</span>
                <span className="mt-2 flex flex-wrap gap-1 text-[0.7rem] text-muted">
                  <span>{p.track === "rehab" ? "تأهيل طبي" : "رعاية تكميلية"}</span>
                  <span>·</span>
                  <span>{(p.faqs ?? []).length} أسئلة</span>
                  <span>·</span>
                  <span>{(p.devices ?? []).length} أجهزة</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <ul className="grid grid-cols-6 gap-1.5" role="radiogroup" aria-label="الأيقونة">
      {ICONS_3D.map((n) => (
        <li key={n}>
          <button type="button" role="radio" aria-checked={value === n} aria-label={n} onClick={() => onChange(n)} className={`grid w-full place-items-center rounded-lg p-1 ring-1 transition ${value === n ? "bg-brand-50 ring-2 ring-brand-500" : "ring-mist-200 hover:ring-brand-300"}`}>
            <img src={`/icons3d/${n}.webp`} alt="" width={40} height={40} loading="lazy" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function Steps({ value, onChange }: { value: { title: string; text: string }[]; onChange: (v: { title: string; text: string }[]) => void }) {
  const set = (i: number, k: "title" | "text", v: string) => onChange(value.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const move = (i: number, d: -1 | 1) => {
    const n = [...value];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    onChange(n);
  };
  return (
    <div className="grid gap-3">
      {value.map((st, i) => (
        <div key={i} className="grid gap-2 rounded-xl bg-mist-50 p-3 ring-1 ring-mist-200">
          <div className="flex items-center justify-between">
            <span className="tabular text-[0.8rem] font-bold text-brand-700">الخطوة {i + 1}</span>
            <span className="flex">
              <IconBtn label="أعلى" onClick={() => move(i, -1)} disabled={i === 0} className="!size-8">
                <ArrowUp size={14} />
              </IconBtn>
              <IconBtn label="أسفل" onClick={() => move(i, 1)} disabled={i === value.length - 1} className="!size-8">
                <ArrowDown size={14} />
              </IconBtn>
              <IconBtn label="حذف" onClick={() => onChange(value.filter((_, j) => j !== i))} className="!size-8">
                <Trash2 size={14} />
              </IconBtn>
            </span>
          </div>
          <Text label="العنوان" value={st.title} onChange={(v) => set(i, "title", v)} />
          <Area label="الشرح" value={st.text} onChange={(v) => set(i, "text", v)} rows={2} />
        </div>
      ))}
      <Btn onClick={() => onChange([...value, { title: "", text: "" }])}>
        <Plus size={15} aria-hidden /> أضف خطوة
      </Btn>
    </div>
  );
}

export function FaqList({ value, onChange }: { value: Faq[]; onChange: (v: Faq[]) => void }) {
  return (
    <div className="grid gap-3">
      {value.map((f, i) => (
        <div key={i} className="grid gap-2 rounded-xl bg-mist-50 p-3 ring-1 ring-mist-200">
          <div className="flex items-start gap-2">
            <div className="grid flex-1 gap-2">
              <Text label="السؤال" value={f.q} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, q: v } : x)))} />
              <Area label="الإجابة" value={f.a} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, a: v } : x)))} rows={3} />
            </div>
            <IconBtn label="حذف السؤال" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              <Trash2 size={15} />
            </IconBtn>
          </div>
        </div>
      ))}
      <Btn onClick={() => onChange([...value, { q: "", a: "" }])}>
        <Plus size={15} aria-hidden /> أضف سؤالًا
      </Btn>
    </div>
  );
}

const blank = (): ProgramEdit => ({ id: "", title: "", short: "", points: [], icon3d: "stethoscope", track: "rehab", intro: "", signs: [], approach: [], devices: [], faqs: [], status: "draft", custom: true });

type Tab = "content" | "signs" | "approach" | "faqs" | "devices" | "seo";

export function ProgramEditor({ id }: { id: string }) {
  const existing = useCms((s) => s.programs.find((p) => p.id === id));
  const devices = useCms((s) => s.devices);
  const isNew = id === "new";
  const { draft, set, dirty, clean } = useDraft<ProgramEdit>(existing ?? blank());
  const [tab, setTab] = useState<Tab>("content");
  const [, go] = useLocation();
  const toast = useToast();
  const { confirm, node } = useConfirm();

  if (!isNew && !existing) return <Empty title="البرنامج غير موجود" action={<LinkBtn href="/programs">كل البرامج</LinkBtn>} />;

  const save = (status: ProgramEdit["status"]) => {
    if (!draft.title.trim()) return toast("اكتب اسم البرنامج", "warn");
    const next: ProgramEdit = { ...draft, status, id: draft.id || slugify(draft.title) };
    update(
      (d) => {
        const i = d.programs.findIndex((p) => p.id === next.id);
        if (i >= 0) d.programs[i] = next;
        else d.programs.push(next);
      },
      { action: isNew ? "أضاف برنامجًا" : "حدّث برنامجًا", target: next.title },
    );
    clean();
    toast(status === "published" ? "حُفظ البرنامج وهو ظاهر في الموقع" : "حُفظ البرنامج مسودة (مخفي من الموقع)");
    if (isNew) go(`/programs/${next.id}`, { replace: true });
  };

  const body = [draft.short, draft.intro, ...(draft.signs ?? []), ...(draft.approach ?? []).map((a) => `${a.title} ${a.text}`), ...(draft.faqs ?? []).map((f) => `${f.q} ${f.a}`)].join("\n");

  return (
    <>
      {node}
      <PageHeader
        back={{ href: "/programs", label: "البرامج" }}
        title={isNew ? "برنامج جديد" : draft.title}
        actions={
          <>
            {dirty ? <span className="text-[0.8rem] font-semibold text-[#8a5a12]">تغييرات غير محفوظة</span> : null}
            {!isNew ? (
              <LinkBtn href={`/programs/${draft.id}`} external>
                <ExternalLink size={15} aria-hidden /> عرض في الموقع
              </LinkBtn>
            ) : null}
          </>
        }
      />
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_20rem]">
        <Card pad={false}>
          <div className="px-4 pt-2">
            <Tabs<Tab>
              value={tab}
              onChange={setTab}
              items={[
                { id: "content", label: "المحتوى" },
                { id: "signs", label: "هل هو لك؟" },
                { id: "approach", label: "الخطوات" },
                { id: "faqs", label: "الأسئلة" },
                { id: "devices", label: "الأجهزة" },
                { id: "seo", label: "البحث" },
              ]}
            />
          </div>
          <div className="grid gap-4 p-4">
            {tab === "content" ? (
              <>
                <Text label="اسم البرنامج" value={draft.title} onChange={(v) => set("title", v)} />
                <Area label="الوصف المختصر (في البطاقة)" value={draft.short} onChange={(v) => set("short", v)} rows={3} max={200} />
                <Lines label="نقاط البطاقة" value={draft.points} onChange={(v) => set("points", v)} help="ثلاث نقاط قصيرة تظهر في البطاقة." />
                <Area label="مقدمة صفحة البرنامج" value={draft.intro ?? ""} onChange={(v) => set("intro", v)} rows={5} help="جملتان أو ثلاث: نفهم ما تمر به، وماذا سنفعل معًا." />
              </>
            ) : tab === "signs" ? (
              <Lines label="علامات يتعرّف فيها الزائر على نفسه" value={draft.signs ?? []} onChange={(v) => set("signs", v)} help="مثل: «ألم يمتد من الظهر إلى الساق». تظهر في قسم «هل هذا البرنامج لك؟»." />
            ) : tab === "approach" ? (
              <Steps value={draft.approach ?? []} onChange={(v) => set("approach", v)} />
            ) : tab === "faqs" ? (
              <FaqList value={draft.faqs ?? []} onChange={(v) => set("faqs", v)} />
            ) : tab === "devices" ? (
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-[0.82rem] font-semibold">أجهزة تظهر في صفحة البرنامج</legend>
                {devices.map((d) => (
                  <label key={d.id} className="flex cursor-pointer items-center gap-3 rounded-xl bg-mist-50 px-3 py-2.5 ring-1 ring-mist-200 has-[:checked]:bg-brand-50 has-[:checked]:ring-brand-300">
                    <input
                      type="checkbox"
                      checked={(draft.devices ?? []).includes(d.id)}
                      onChange={(e) => set("devices", e.target.checked ? [...(draft.devices ?? []), d.id] : (draft.devices ?? []).filter((x) => x !== d.id))}
                    />
                    <span className="font-semibold">{d.name}</span>
                    <span dir="ltr" className="ms-auto text-[0.75rem] text-muted">
                      {d.model}
                    </span>
                  </label>
                ))}
              </fieldset>
            ) : (
              <SeoBox
                seo={{ title: draft.seoTitle ?? "", description: draft.seoDescription ?? "", focus: "" }}
                onChange={(v) => {
                  set("seoTitle", v.title);
                  set("seoDescription", v.description);
                }}
                path={`/programs/${draft.id || slugify(draft.title || "program")}`}
                body={body}
              />
            )}
          </div>
        </Card>

        <aside className="grid gap-4 xl:sticky xl:top-16">
          <Card title="النشر">
            <p className="text-[0.83rem] text-muted">
              الحالة: <b className="text-ink">{draft.status === "published" ? "ظاهر في الموقع" : "مسودة مخفية"}</b>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Btn onClick={() => save("draft")}>{draft.status === "published" ? "إخفاء" : "حفظ مسودة"}</Btn>
              <Btn variant="primary" className="flex-1" onClick={() => save("published")}>
                {draft.status === "published" ? "تحديث" : "نشر"}
              </Btn>
            </div>
          </Card>
          <Card title="التصنيف">
            <div className="grid gap-3">
              <Select
                label="المسار"
                value={draft.track}
                onChange={(v) => set("track", v as ProgramEdit["track"])}
                options={[
                  { value: "rehab", label: "التأهيل الطبي" },
                  { value: "wellness", label: "الرعاية التكميلية" },
                ]}
              />
              <Text label="شارة مميزة (اختياري)" value={draft.featured ?? ""} onChange={(v) => set("featured", v || undefined)} placeholder="مثال: خاص بالمدينة المنورة" />
            </div>
          </Card>
          <Card title="الأيقونة">
            <IconPicker value={draft.icon3d} onChange={(v) => set("icon3d", v)} />
          </Card>
          {existing?.custom ? (
            <Btn
              variant="danger"
              size="sm"
              onClick={() =>
                confirm(`حذف برنامج «${draft.title}»؟`, () => {
                  update((d) => void (d.programs = d.programs.filter((p) => p.id !== draft.id)), { action: "حذف برنامجًا", target: draft.title });
                  go("/programs");
                }, "حذف")
              }
            >
              <Trash2 size={14} aria-hidden /> حذف البرنامج
            </Btn>
          ) : null}
        </aside>
      </div>
    </>
  );
}
