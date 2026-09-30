import { Check, EyeOff, Plus, ShieldAlert, Star, Trash2 } from "lucide-react";
import { useState } from "react";
import { uid } from "@/cms/defaults";
import { update, useCms } from "@/cms/store";
import type { Review } from "@/cms/types";
import { Area, Badge, Btn, Card, Drawer, Empty, Filters, fmtDate, PageHeader, Select, Text, Toggle, useToast } from "../ui";

const SOURCE: Record<Review["source"], string> = { google: "Google", site: "الموقع", whatsapp: "واتساب" };
const STATUS: Record<Review["status"], { label: string; tone: "green" | "amber" | "gray" }> = { approved: { label: "معتمد", tone: "green" }, pending: { label: "بانتظار المراجعة", tone: "amber" }, hidden: { label: "مخفي", tone: "gray" } };

function Stars({ n }: { n: number }) {
  return (
    <span className="inline-flex" aria-label={`${n} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className={i <= n ? "fill-[#f5b301] text-[#f5b301]" : "text-mist-300"} aria-hidden />
      ))}
    </span>
  );
}

export function Reviews() {
  const reviews = useCms((s) => s.reviews);
  const settings = useCms((s) => s.plugins.reviews?.settings ?? {});
  const [tab, setTab] = useState<"all" | Review["status"]>("all");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Review>({ id: "", name: "", context: "", text: "", rating: 5, status: "pending", source: "whatsapp", consent: false, createdAt: "" });
  const toast = useToast();
  const list = reviews.filter((r) => tab === "all" || r.status === tab);
  const setStatus = (r: Review, status: Review["status"]) => {
    if (status === "approved" && settings.requireConsent && !r.consent) return toast("لا يُعتمد رأي دون موافقة موثقة من صاحبه", "warn");
    update((s) => void (s.reviews.find((x) => x.id === r.id)!.status = status), { action: status === "approved" ? "اعتمد رأيًا" : "أخفى رأيًا", target: r.name });
  };

  return (
    <>
      <PageHeader
        title="آراء المراجعين"
        sub="تصل من واتساب وGoogle والموقع، ولا يظهر رأي قبل اعتماده."
        actions={
          <Btn variant="primary" onClick={() => setAdding(true)}>
            <Plus size={16} aria-hidden /> أضف رأيًا
          </Btn>
        }
      />
      <div className="mb-4 flex items-start gap-3 rounded-2xl bg-[#fff7e6] px-4 py-3 text-[0.85rem] leading-7 text-[#6b4a10] ring-1 ring-[#f2dfb3]">
        <ShieldAlert size={20} className="mt-1 shrink-0" aria-hidden />
        <p>قد تقيّد أنظمة الإعلان الصحي في المملكة استخدام شهادات المرضى في إعلانات المنشآت. لذلك قسم الآراء في الموقع معطّل حتى تفعّله هنا بعد مراجعة نظامية، ولا يُعتمد رأي دون موافقة موثقة من صاحبه.</p>
      </div>
      <div className="mb-3">
        <Filters
          value={tab}
          onChange={setTab}
          items={[
            { id: "all", label: "الكل", count: reviews.length },
            { id: "pending", label: "بانتظار المراجعة", count: reviews.filter((r) => r.status === "pending").length },
            { id: "approved", label: "معتمدة", count: reviews.filter((r) => r.status === "approved").length },
            { id: "hidden", label: "مخفية", count: reviews.filter((r) => r.status === "hidden").length },
          ]}
        />
      </div>
      {list.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {list.map((r) => (
            <Card key={r.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">
                    {r.name} <span className="font-normal text-muted">· {r.context}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-[0.75rem] text-muted">
                    <Stars n={r.rating} /> {SOURCE[r.source]} · {fmtDate(r.createdAt)}
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  <Badge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</Badge>
                  {r.demo ? <Badge>مثال</Badge> : null}
                  {r.consent ? <Badge tone="blue">بموافقة</Badge> : null}
                </div>
              </div>
              <p className="mt-3 leading-7">«{r.text}»</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.status !== "approved" ? (
                  <Btn size="sm" onClick={() => setStatus(r, "approved")}>
                    <Check size={14} aria-hidden /> اعتماد
                  </Btn>
                ) : null}
                {r.status !== "hidden" ? (
                  <Btn size="sm" variant="ghost" onClick={() => setStatus(r, "hidden")}>
                    <EyeOff size={14} aria-hidden /> إخفاء
                  </Btn>
                ) : null}
                {!r.consent ? (
                  <Btn size="sm" variant="ghost" onClick={() => update((s) => void (s.reviews.find((x) => x.id === r.id)!.consent = true), { action: "سجّل موافقة صاحب رأي", target: r.name })}>
                    سجّل الموافقة
                  </Btn>
                ) : null}
                <Btn size="sm" variant="ghost" className="ms-auto text-coral-600" onClick={() => update((s) => void (s.reviews = s.reviews.filter((x) => x.id !== r.id)), { action: "حذف رأيًا", target: r.name })}>
                  <Trash2 size={14} aria-hidden /> حذف
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Empty title="لا آراء هنا" />
      )}

      <Drawer
        open={adding}
        onClose={() => setAdding(false)}
        title="رأي جديد"
        footer={
          <Btn
            variant="primary"
            disabled={!draft.text.trim()}
            onClick={() => {
              const r = { ...draft, id: uid("rv-"), createdAt: new Date().toISOString(), name: draft.name || "مراجع" };
              update((s) => void s.reviews.unshift(r), { action: "أضاف رأيًا", target: r.name });
              setAdding(false);
              toast("أُضيف الرأي بانتظار المراجعة");
            }}
          >
            حفظ
          </Btn>
        }
      >
        <div className="grid gap-4">
          <Text label="الاسم كما يظهر" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} placeholder="مثال: مراجعة، أو الاسم الأول" />
          <Text label="الحالة" value={draft.context} onChange={(v) => setDraft({ ...draft, context: v })} placeholder="مثال: آلام الرقبة" />
          <Area label="الرأي" value={draft.text} onChange={(v) => setDraft({ ...draft, text: v })} rows={4} />
          <Select label="التقييم" value={String(draft.rating)} onChange={(v) => setDraft({ ...draft, rating: Number(v) })} options={[5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} من 5` }))} />
          <Select
            label="المصدر"
            value={draft.source}
            onChange={(v) => setDraft({ ...draft, source: v as Review["source"] })}
            options={Object.entries(SOURCE).map(([value, label]) => ({ value, label }))}
          />
          <Toggle label="لدينا موافقة موثقة من صاحب الرأي" checked={draft.consent} onChange={(v) => setDraft({ ...draft, consent: v })} />
        </div>
      </Drawer>
    </>
  );
}
