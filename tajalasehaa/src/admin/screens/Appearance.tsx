import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { update, useCms } from "@/cms/store";
import type { NavItem, Theme } from "@/cms/types";
import { Btn, Card, IconBtn, PageHeader, useToast } from "../ui";
import { SitePreview, SITE_PAGES } from "./Pages";

const PRESETS: { id: string; label: string; brand: string; navy: string }[] = [
  { id: "logo", label: "ألوان الشعار", brand: "#0c8456", navy: "#24475d" },
  { id: "teal", label: "فيروزي هادئ", brand: "#0f8b8d", navy: "#1d4e5f" },
  { id: "blue", label: "أزرق طبي", brand: "#2167ae", navy: "#1e3a5f" },
  { id: "violet", label: "بنفسجي ناعم", brand: "#6a4fa0", navy: "#2e2a4f" },
  { id: "sand", label: "رملي دافئ", brand: "#a2702a", navy: "#3b3530" },
];

export function Appearance() {
  const saved = useCms((s) => s.theme);
  const [t, setT] = useState<Theme>(saved);
  const [nonce, setNonce] = useState(0);
  const toast = useToast();
  const dirty = JSON.stringify(t) !== JSON.stringify(saved);
  const save = () => {
    update((s) => void (s.theme = t), { action: "غيّر ألوان الموقع", target: PRESETS.find((p) => p.id === t.preset)?.label ?? "ألوان مخصصة" });
    setNonce((n) => n + 1);
    toast("حُفظت الألوان وتحدّثت المعاينة");
  };

  return (
    <>
      <PageHeader
        title="المظهر"
        sub="ألوان الموقع وشكل البطاقات. ترى التغيير في المعاينة بعد الحفظ."
        actions={
          <>
            <Btn onClick={() => setT({ preset: "logo", brand: "#0c8456", navy: "#24475d", radius: 1.5 })}>ألوان الشعار</Btn>
            <Btn variant="primary" disabled={!dirty} onClick={save}>
              حفظ ونشر
            </Btn>
          </>
        }
      />
      <div className="grid items-start gap-5 xl:grid-cols-[22rem_1fr]">
        <div className="grid gap-4">
          <Card title="مجموعات الألوان">
            <ul className="grid gap-2">
              {PRESETS.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={t.preset === p.id}
                    onClick={() => setT({ ...t, preset: p.id, brand: p.brand, navy: p.navy })}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start ring-1 transition ${t.preset === p.id ? "bg-brand-50 ring-2 ring-brand-500" : "ring-mist-200 hover:ring-brand-300"}`}
                  >
                    <span className="flex -space-x-2 rtl:space-x-reverse">
                      <span className="size-7 rounded-full ring-2 ring-white" style={{ background: p.brand }} />
                      <span className="size-7 rounded-full ring-2 ring-white" style={{ background: p.navy }} />
                    </span>
                    <span className="flex-1 font-semibold">{p.label}</span>
                    {t.preset === p.id ? <Check size={16} className="text-brand-700" aria-hidden /> : null}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="ألوان مخصصة">
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  ["brand", "اللون الأساسي"],
                  ["navy", "اللون الداكن"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="grid gap-1.5 text-[0.82rem] font-semibold">
                  {label}
                  <span className="flex items-center gap-2 rounded-lg border border-mist-300 px-2 py-1.5">
                    <input type="color" value={t[k]} onChange={(e) => setT({ ...t, preset: "custom", [k]: e.target.value })} className="size-8 cursor-pointer rounded border-0 bg-transparent" />
                    <span dir="ltr" className="tabular text-[0.8rem] font-normal text-muted">
                      {t[k]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </Card>
          <Card title="شكل البطاقات">
            <label htmlFor="radius" className="text-[0.82rem] font-semibold">
              استدارة الزوايا
            </label>
            <input id="radius" type="range" min={0.5} max={2.25} step={0.25} value={t.radius} onChange={(e) => setT({ ...t, radius: Number(e.target.value) })} className="mt-2 w-full accent-[var(--color-brand-600)]" />
            <div className="mt-3 flex gap-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-16 flex-1 bg-white shadow ring-1 ring-mist-200" style={{ borderRadius: `${t.radius}rem` }} />
              ))}
            </div>
          </Card>
        </div>
        <div className="min-w-0 xl:sticky xl:top-16">
          <SitePreview nonce={nonce} />
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */

export function Menus() {
  const saved = useCms((s) => s.menus.header);
  const [items, setItems] = useState<NavItem[]>(saved);
  const [nonce, setNonce] = useState(0);
  const toast = useToast();
  const dirty = JSON.stringify(items) !== JSON.stringify(saved);
  const setAt = (i: number, v: Partial<NavItem>) => setItems(items.map((x, j) => (j === i ? { ...x, ...v } : x)));
  const move = (i: number, d: -1 | 1) => {
    const n = [...items];
    [n[i], n[i + d]] = [n[i + d], n[i]];
    setItems(n);
  };
  return (
    <>
      <PageHeader
        title="القوائم"
        sub="روابط القائمة الرئيسية في أعلى الموقع وقائمة الجوال."
        actions={
          <Btn
            variant="primary"
            disabled={!dirty}
            onClick={() => {
              update((s) => void (s.menus.header = items), { action: "حدّث القائمة الرئيسية" });
              setNonce((n) => n + 1);
              toast("حُفظت القائمة");
            }}
          >
            حفظ القائمة
          </Btn>
        }
      />
      <div className="grid items-start gap-5 xl:grid-cols-[26rem_1fr]">
        <Card title="القائمة الرئيسية">
          <ul className="grid gap-2">
            {items.map((it, i) => (
              <li key={i} className="grid grid-cols-2 items-center gap-2 rounded-xl bg-mist-50 p-2 ring-1 ring-mist-200 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                <input value={it.label} onChange={(e) => setAt(i, { label: e.target.value })} className="min-w-0 rounded-lg border border-mist-300 bg-white px-2.5 py-1.5" aria-label="النص" />
                <select value={it.href} onChange={(e) => setAt(i, { href: e.target.value })} className="min-w-0 rounded-lg border border-mist-300 bg-white px-2 py-1.5 text-[0.8rem]" aria-label="الرابط">
                  {SITE_PAGES.filter((p) => p.kind !== "campaign").map((p) => (
                    <option key={p.path} value={p.path}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span className="col-span-2 flex justify-end sm:col-span-1">
                  <IconBtn label="أعلى" onClick={() => move(i, -1)} disabled={i === 0} className="!size-8">
                    <ArrowUp size={14} />
                  </IconBtn>
                  <IconBtn label="أسفل" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="!size-8">
                    <ArrowDown size={14} />
                  </IconBtn>
                  <IconBtn label="حذف" onClick={() => setItems(items.filter((_, j) => j !== i))} className="!size-8">
                    <Trash2 size={14} />
                  </IconBtn>
                </span>
              </li>
            ))}
          </ul>
          <Btn className="mt-3" onClick={() => setItems([...items, { href: "/visit", label: "رابط جديد" }])}>
            <Plus size={15} aria-hidden /> أضف رابطًا
          </Btn>
          <p className="mt-3 text-[0.75rem] leading-5 text-muted">رابط «المقالات» يظهر فقط حين يكون في الموقع مقال منشور.</p>
        </Card>
        <div className="min-w-0 xl:sticky xl:top-16">
          <SitePreview nonce={nonce} />
        </div>
      </div>
    </>
  );
}
