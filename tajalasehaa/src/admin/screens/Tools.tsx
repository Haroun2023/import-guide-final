import { CircleAlert, CircleCheck, Download, RotateCcw, Upload } from "lucide-react";
import { useRef } from "react";
import { Link } from "wouter";
import { getState, replaceState, resetDemo, storageBytes, useCms } from "@/cms/store";
import type { CmsState } from "@/cms/types";
import { healthChecks, healthScore, type Check } from "../health";
import { Btn, Card, PageHeader, useConfirm, useToast } from "../ui";

const LEVEL: Record<Check["level"], { label: string; cls: string }> = {
  critical: { label: "مهم", cls: "text-coral-600" },
  recommended: { label: "مقترح", cls: "text-[#b07a1c]" },
  good: { label: "سليم", cls: "text-brand-700" },
};

export function Health() {
  const s = useCms((x) => x);
  const checks = healthChecks(s);
  const score = healthScore(checks);
  const groups: Check["level"][] = ["critical", "recommended", "good"];
  return (
    <>
      <PageHeader title="صحة الموقع" sub="فحص حي للمحتوى والإعدادات والإضافات، مرتب حسب الأهمية." />
      <div className="grid items-start gap-5 lg:grid-cols-[18rem_1fr]">
        <Card>
          <div className="grid place-items-center py-2 text-center">
            <svg viewBox="0 0 36 36" className="size-36 -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e6eef0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={score > 80 ? "#0c8456" : "#ee5d52"} strokeWidth="3" strokeLinecap="round" strokeDasharray={`${score} 100`} />
            </svg>
            <p className="-mt-24 mb-16 text-3xl font-bold">{score}%</p>
            <p className="font-semibold">{score > 80 ? "الموقع بحالة جيدة" : "يحتاج انتباهًا"}</p>
            <p className="mt-1 text-[0.8rem] text-muted">
              {checks.filter((c) => c.level === "critical").length} مهم · {checks.filter((c) => c.level === "recommended").length} مقترح
            </p>
          </div>
        </Card>
        <div className="grid gap-4">
          {groups.map((g) => {
            const list = checks.filter((c) => c.level === g);
            if (!list.length) return null;
            return (
              <Card key={g} title={`${LEVEL[g].label} (${list.length})`} pad={false}>
                <ul className="divide-y divide-mist-100">
                  {list.map((c) => (
                    <li key={c.id} className="flex items-start gap-3 px-4 py-3">
                      {g === "good" ? <CircleCheck size={18} className="mt-0.5 shrink-0 text-brand-600" aria-hidden /> : <CircleAlert size={18} className={`mt-0.5 shrink-0 ${LEVEL[g].cls}`} aria-hidden />}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{c.title}</p>
                        <p className="text-[0.82rem] text-muted">{c.text}</p>
                      </div>
                      {c.fix ? (
                        <Link href={c.fix} className="shrink-0 text-[0.8rem] font-semibold text-brand-700 hover:underline">
                          أصلحه
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
          <Card title="عن هذه النسخة">
            <dl className="grid gap-2 text-[0.83rem] sm:grid-cols-2">
              <div className="flex justify-between gap-3 rounded-lg bg-mist-50 px-3 py-2">
                <dt className="text-muted">حجم البيانات في المتصفح</dt>
                <dd className="tabular font-semibold">{Math.round(storageBytes() / 1024)} KB</dd>
              </div>
              <div className="flex justify-between gap-3 rounded-lg bg-mist-50 px-3 py-2">
                <dt className="text-muted">أُعدّت</dt>
                <dd className="font-semibold">{new Date(s.createdAt).toLocaleDateString("ar-SA-u-ca-gregory-nu-latn")}</dd>
              </div>
            </dl>
            <p className="mt-3 text-[0.78rem] leading-6 text-muted">هذه نسخة عرض: كل ما تغيّره يُحفظ في هذا المتصفح فقط، ولا يراه غيرك. في النسخة الفعلية تُحفظ البيانات في قاعدة بيانات، ويُعاد توليد الصفحات عند النشر.</p>
          </Card>
        </div>
      </div>
    </>
  );
}

/** Download everything as JSON, bring it back, or start the demo over. */
export function Export() {
  const file = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const { confirm, node } = useConfirm();
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" }));
    a.download = `tajalasehaa-cms-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  return (
    <>
      {node}
      <PageHeader title="تصدير واستيراد" sub="انقل محتوى لوحة التحكم إلى متصفح آخر، أو احتفظ بنسخة على جهازك." />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="تصدير">
          <p className="text-[0.85rem] leading-6 text-muted">ملف JSON فيه كل المحتوى والإعدادات والحجوزات (دون الصور المرفوعة).</p>
          <Btn className="mt-4" variant="primary" onClick={download}>
            <Download size={16} aria-hidden /> تنزيل الملف
          </Btn>
        </Card>
        <Card title="استيراد">
          <p className="text-[0.85rem] leading-6 text-muted">يستبدل كل ما في هذا المتصفح بمحتوى الملف.</p>
          <input
            ref={file}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const data = JSON.parse(await f.text()) as CmsState;
                if (data.v !== 1 || !Array.isArray(data.programs)) throw new Error("bad");
                confirm("استبدال كل المحتوى الحالي بمحتوى الملف؟", () => {
                  replaceState(data, { action: "استورد نسخة من ملف", target: f.name });
                  toast("استُورد المحتوى");
                }, "استيراد");
              } catch {
                toast("الملف ليس نسخة من لوحة التحكم", "warn");
              }
              e.target.value = "";
            }}
          />
          <Btn className="mt-4" onClick={() => file.current?.click()}>
            <Upload size={16} aria-hidden /> اختر ملفًا
          </Btn>
        </Card>
        <Card title="إعادة ضبط العرض">
          <p className="text-[0.85rem] leading-6 text-muted">يعيد المحتوى إلى ما في الموقع الآن، ويمسح الطلبات والتعديلات في هذا المتصفح.</p>
          <Btn
            className="mt-4"
            variant="danger"
            onClick={() =>
              confirm("إعادة ضبط نسخة العرض؟ ستفقد كل التعديلات في هذا المتصفح.", () => {
                resetDemo();
                toast("أُعيد ضبط العرض");
              }, "إعادة الضبط")
            }
          >
            <RotateCcw size={16} aria-hidden /> إعادة الضبط
          </Btn>
        </Card>
      </div>
    </>
  );
}
