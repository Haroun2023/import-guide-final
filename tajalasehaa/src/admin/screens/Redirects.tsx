import { ArrowLeft, Plus, Server, Trash2 } from "lucide-react";
import { useState } from "react";
import { uid } from "@/cms/defaults";
import { update, useCms } from "@/cms/store";
import type { Redirect } from "@/cms/types";
import { ago, Badge, Btn, Card, Empty, PageHeader, Select, Text, useToast } from "../ui";

const norm = (p: string) => ("/" + p.trim().replace(/^https?:\/\/[^/]+/, "").replace(/^\/+/, "")).replace(/\/+$/, "") || "/";

/** The redirects plugin: old links → new pages, short links, and the 404 log. */
export function Redirects() {
  const redirects = useCms((s) => s.redirects);
  const notFound = useCms((s) => s.notFound ?? []);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [code, setCode] = useState("301");
  const [test, setTest] = useState("/about-us");
  const toast = useToast();
  const hit = redirects.find((r) => r.from === norm(test));

  const add = (f = from, t = to) => {
    if (!f.trim() || !t.trim()) return;
    const r: Redirect = { id: uid("r"), from: norm(f), to: norm(t), code: Number(code) as 301 | 302, hits: 0 };
    if (redirects.some((x) => x.from === r.from)) return toast("يوجد تحويل لهذا الرابط", "warn");
    update((s) => void s.redirects.unshift(r), { action: "أضاف تحويلًا", target: `${r.from} ← ${r.to}` });
    setFrom("");
    setTo("");
    toast("أُضيف التحويل. جرّبه في الموقع من هذا المتصفح");
  };

  return (
    <>
      <PageHeader title="التحويلات" sub="حين يتغير رابط صفحة، حوّل الرابط القديم إلى الجديد حتى لا يضيع زواره وترتيبه في Google." />
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_22rem]">
        <div className="grid gap-5">
          <Card title="أضف تحويلًا">
            <div className="grid items-end gap-3 md:grid-cols-[1fr_auto_1fr_8rem_auto]">
              <Text label="من الرابط" value={from} onChange={setFrom} dir="ltr" placeholder="/old-page" />
              <ArrowLeft size={18} className="mb-3 hidden text-muted md:block" aria-hidden />
              <Text label="إلى" value={to} onChange={setTo} dir="ltr" placeholder="/programs/spine" />
              <Select label="النوع" value={code} onChange={setCode} options={[{ value: "301", label: "دائم 301" }, { value: "302", label: "مؤقت 302" }]} />
              <Btn variant="primary" onClick={() => add()}>
                <Plus size={16} aria-hidden /> إضافة
              </Btn>
            </div>
          </Card>
          <Card title={`التحويلات (${redirects.length})`} pad={false}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-[0.85rem]">
                <thead>
                  <tr className="border-b border-mist-200 text-[0.75rem] text-muted">
                    <th className="px-4 py-2.5 text-start font-semibold">من</th>
                    <th className="px-4 py-2.5 text-start font-semibold">إلى</th>
                    <th className="px-4 py-2.5 text-start font-semibold">النوع</th>
                    <th className="px-4 py-2.5 text-start font-semibold">ملاحظة</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {redirects.map((r) => (
                    <tr key={r.id} className="border-b border-mist-100 last:border-0">
                      <td dir="ltr" className="px-4 py-2.5 text-end font-mono text-[0.8rem]">
                        {r.from}
                      </td>
                      <td dir="ltr" className="px-4 py-2.5 text-end font-mono text-[0.8rem] text-brand-700">
                        {r.to}
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge tone={r.code === 301 ? "blue" : "amber"}>{r.code}</Badge>
                      </td>
                      <td className="px-4 py-2.5 text-[0.78rem] text-muted">
                        {r.server ? (
                          <span className="inline-flex items-center gap-1">
                            <Server size={13} aria-hidden /> على الخادم ·{" "}
                          </span>
                        ) : null}
                        {r.note}
                      </td>
                      <td className="px-4 py-2.5 text-end">
                        {!r.server ? (
                          <button type="button" className="text-coral-600 hover:underline" aria-label={`حذف ${r.from}`} onClick={() => update((s) => void (s.redirects = s.redirects.filter((x) => x.id !== r.id)), { action: "حذف تحويلًا", target: r.from })}>
                            <Trash2 size={15} />
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-mist-200 px-4 py-3 text-[0.75rem] leading-5 text-muted">تحويلات الموقع القديم مفعّلة على الخادم في vercel.json، فتعمل لكل الزوار. ما تضيفه هنا يعمل في هذا المتصفح في نسخة العرض.</p>
          </Card>
        </div>
        <aside className="grid gap-5">
          <Card title="جرّب رابطًا">
            <Text label="الرابط" value={test} onChange={setTest} dir="ltr" />
            <p className="mt-3 rounded-xl bg-mist-50 px-3 py-2.5 text-[0.83rem]">
              {hit ? (
                <>
                  يُحوَّل إلى{" "}
                  <b dir="ltr" className="text-brand-700">
                    {hit.to}
                  </b>{" "}
                  ({hit.code})
                </>
              ) : (
                "لا تحويل لهذا الرابط."
              )}
            </p>
          </Card>
          <Card title="روابط مكسورة (404)">
            {notFound.length ? (
              <ul className="grid gap-2">
                {notFound.map((n) => (
                  <li key={n.path} className="flex items-center gap-2 rounded-lg bg-mist-50 px-3 py-2 text-[0.8rem]">
                    <span dir="ltr" className="min-w-0 flex-1 truncate font-mono">
                      {n.path}
                    </span>
                    <span className="tabular text-muted">
                      {n.hits}× · {ago(n.last)}
                    </span>
                    <Btn size="sm" onClick={() => setFrom(n.path)}>
                      حوّله
                    </Btn>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty title="لا روابط مكسورة" text="حين يفتح أحد في هذا المتصفح رابطًا غير موجود في الموقع، يظهر هنا لتحوّله." />
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}
