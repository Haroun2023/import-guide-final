import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSearch } from "wouter";
import { update, useCms } from "@/cms/store";
import type { Faq } from "@/cms/types";
import { Area, Btn, Card, Drawer, Empty, IconBtn, PageHeader, SearchBox, Text, useConfirm, useToast } from "../ui";
import { countAr } from "../count";

/** The site-wide FAQ (programs keep their own questions in their editor). */
export function Faqs() {
  const faqs = useCms((s) => s.faqs);
  const [editing, setEditing] = useState<number | "new" | null>(new URLSearchParams(useSearch()).has("new") ? "new" : null);
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState<Faq>({ q: "", a: "" });
  const toast = useToast();
  const { confirm, node } = useConfirm();

  const open = (i: number | "new") => {
    setDraft(i === "new" ? { q: "", a: "" } : { ...faqs[i] });
    setEditing(i);
  };
  const move = (i: number, d: -1 | 1) =>
    update(
      (s) => {
        const j = i + d;
        [s.faqs[i], s.faqs[j]] = [s.faqs[j], s.faqs[i]];
      },
      { action: "أعاد ترتيب الأسئلة الشائعة" },
    );
  const list = faqs.map((f, i) => ({ f, i })).filter(({ f }) => !q || `${f.q} ${f.a}`.includes(q));

  return (
    <>
      {node}
      <PageHeader
        title="الأسئلة الشائعة"
        sub={`${countAr(faqs.length, "سؤال واحد", "سؤالان", "أسئلة", "سؤالًا")} في صفحة الأسئلة، وأول خمسة تظهر في الرئيسية. الترتيب هنا هو ترتيبها في الموقع.`}
        actions={
          <Btn variant="primary" onClick={() => open("new")}>
            <Plus size={16} aria-hidden /> أضف سؤالًا
          </Btn>
        }
      />
      <div className="mb-3 w-72 max-w-full">
        <SearchBox value={q} onChange={setQ} placeholder="ابحث في الأسئلة" />
      </div>
      {list.length ? (
        <Card pad={false}>
          <ol className="divide-y divide-mist-100">
            {list.map(({ f, i }) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3">
                <span className={`tabular mt-0.5 grid size-7 shrink-0 place-items-center rounded-full text-[0.75rem] font-bold ${i < 5 ? "bg-brand-50 text-brand-700 ring-1 ring-brand-100" : "bg-mist-100 text-muted"}`} title={i < 5 ? "يظهر في الرئيسية" : undefined}>
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{f.q}</p>
                  <p className="mt-0.5 line-clamp-2 text-[0.82rem] leading-6 text-muted">{f.a}</p>
                </div>
                <div className="flex shrink-0">
                  <IconBtn label="أعلى" onClick={() => move(i, -1)} disabled={i === 0 || !!q}>
                    <ArrowUp size={15} />
                  </IconBtn>
                  <IconBtn label="أسفل" onClick={() => move(i, 1)} disabled={i === faqs.length - 1 || !!q}>
                    <ArrowDown size={15} />
                  </IconBtn>
                  <IconBtn label="تحرير" onClick={() => open(i)}>
                    <Pencil size={15} />
                  </IconBtn>
                  <IconBtn label="حذف" onClick={() => confirm(`حذف السؤال «${f.q}»؟`, () => update((s) => void s.faqs.splice(i, 1), { action: "حذف سؤالًا شائعًا", target: f.q }), "حذف")}>
                    <Trash2 size={15} />
                  </IconBtn>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      ) : (
        <Empty title="لا نتائج" />
      )}

      <Drawer
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "سؤال جديد" : "تحرير السؤال"}
        footer={
          <Btn
            variant="primary"
            disabled={!draft.q.trim() || !draft.a.trim()}
            onClick={() => {
              update(
                (s) => {
                  if (editing === "new") s.faqs.push(draft);
                  else if (typeof editing === "number") s.faqs[editing] = draft;
                },
                { action: editing === "new" ? "أضاف سؤالًا شائعًا" : "حدّث سؤالًا شائعًا", target: draft.q },
              );
              setEditing(null);
              toast("حُفظ السؤال");
            }}
          >
            حفظ
          </Btn>
        }
      >
        <div className="grid gap-4">
          <Text label="السؤال" value={draft.q} onChange={(v) => setDraft({ ...draft, q: v })} />
          <Area label="الإجابة" value={draft.a} onChange={(v) => setDraft({ ...draft, a: v })} rows={6} help="إجابة قصيرة بلغة المراجع. تظهر أيضًا في نتائج Google (بيانات FAQ)." />
        </div>
      </Drawer>
    </>
  );
}
