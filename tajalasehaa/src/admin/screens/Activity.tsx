import { Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { update, useCms } from "@/cms/store";
import { Btn, Card, Empty, fmtDate, PageHeader, SearchBox, useConfirm } from "../ui";

/** Who changed what and when (the activity log plugin). */
export function Activity() {
  const activity = useCms((s) => s.activity);
  const [who, setWho] = useState("");
  const [q, setQ] = useState("");
  const { confirm, node } = useConfirm();
  const users = [...new Set(activity.map((a) => a.user))];
  const list = activity.filter((a) => (!who || a.user === who) && (!q || `${a.action} ${a.target ?? ""}`.includes(q)));

  const exportCsv = () => {
    const rows = [["الوقت", "المستخدم", "الإجراء", "العنصر"], ...list.map((a) => [a.at, a.user, a.action, a.target ?? ""])];
    const text = "﻿" + rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
    const el = document.createElement("a");
    el.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    el.download = "activity-log.csv";
    el.click();
  };

  return (
    <>
      {node}
      <PageHeader
        title="سجل النشاط"
        sub="كل تغيير في لوحة التحكم، ومن قام به."
        actions={
          <>
            <Btn onClick={exportCsv}>
              <Download size={16} aria-hidden /> تصدير
            </Btn>
            <Btn variant="danger" onClick={() => confirm("مسح سجل النشاط كله؟", () => update((s) => void (s.activity = []), { action: "مسح سجل النشاط" }), "مسح")}>
              <Trash2 size={16} aria-hidden /> مسح السجل
            </Btn>
          </>
        }
      />
      <div className="mb-3 flex flex-wrap gap-2">
        <div className="w-64">
          <SearchBox value={q} onChange={setQ} placeholder="ابحث في الإجراءات" />
        </div>
        <label className="sr-only" htmlFor="who">
          المستخدم
        </label>
        <select id="who" value={who} onChange={(e) => setWho(e.target.value)} className="h-10 rounded-lg border border-mist-300 bg-white px-3 text-sm">
          <option value="">كل المستخدمين</option>
          {users.map((u) => (
            <option key={u}>{u}</option>
          ))}
        </select>
      </div>
      {list.length ? (
        <Card pad={false}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-[0.85rem]">
              <thead>
                <tr className="border-b border-mist-200 text-[0.75rem] text-muted">
                  <th className="px-4 py-2.5 text-start font-semibold">الوقت</th>
                  <th className="px-4 py-2.5 text-start font-semibold">المستخدم</th>
                  <th className="px-4 py-2.5 text-start font-semibold">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {list.map((a) => (
                  <tr key={a.id} className="border-b border-mist-100 last:border-0">
                    <td className="tabular whitespace-nowrap px-4 py-2.5 text-muted">{fmtDate(a.at, true)}</td>
                    <td className="px-4 py-2.5 font-semibold">{a.user}</td>
                    <td className="px-4 py-2.5">
                      {a.action}
                      {a.target ? <span className="text-muted"> · {a.target}</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Empty title="السجل فارغ" />
      )}
    </>
  );
}
