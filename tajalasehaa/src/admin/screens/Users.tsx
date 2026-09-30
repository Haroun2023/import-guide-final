import { Check, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSearch } from "wouter";
import { uid } from "@/cms/defaults";
import { readSession } from "@/cms/session";
import { update, useCms } from "@/cms/store";
import type { RoleId, User } from "@/cms/types";
import { ROLES, type Cap } from "../nav";
import { ago, Badge, Btn, Card, Drawer, PageHeader, Select, Text, Toggle, useConfirm, useToast } from "../ui";

const CAP_LABEL: Record<Cap, string> = {
  dashboard: "لوحة المعلومات",
  leads: "الحجوزات والمواعيد",
  content: "المقالات والصفحات والبرامج",
  media: "الوسائط",
  design: "المظهر والقوائم",
  marketing: "تحسين البحث والتحليلات والتحويلات",
  plugins: "الإضافات",
  users: "المستخدمون",
  settings: "الإعدادات والأمان والأداء",
  tools: "الأدوات والنسخ الاحتياطي",
};

export function Users() {
  const users = useCms((s) => s.users);
  const me = readSession()?.userId;
  const [edit, setEdit] = useState<User | null>(new URLSearchParams(useSearch()).has("new") ? { id: "", name: "", email: "", role: "editor" } : null);
  const toast = useToast();
  const { confirm, node } = useConfirm();

  return (
    <>
      {node}
      <PageHeader
        title="المستخدمون"
        sub="من يدخل لوحة التحكم، وما يستطيع كل دور فعله."
        actions={
          <Btn variant="primary" onClick={() => setEdit({ id: "", name: "", email: "", role: "editor" })}>
            <Plus size={16} aria-hidden /> أضف مستخدمًا
          </Btn>
        }
      />
      <Card pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-[0.85rem]">
            <thead>
              <tr className="border-b border-mist-200 text-[0.75rem] text-muted">
                <th className="px-4 py-2.5 text-start font-semibold">المستخدم</th>
                <th className="px-4 py-2.5 text-start font-semibold">الدور</th>
                <th className="px-4 py-2.5 text-start font-semibold">التحقق بخطوتين</th>
                <th className="px-4 py-2.5 text-start font-semibold">آخر دخول</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-mist-100 last:border-0">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-leaf-200 to-brand-500 font-bold text-deep">{u.name.charAt(0)}</span>
                      <span>
                        <span className="block font-semibold">
                          {u.name} {u.id === me ? <Badge tone="green">أنت</Badge> : null}
                        </span>
                        <span dir="ltr" className="block text-end text-[0.75rem] text-muted sm:text-start">
                          {u.email}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.role === "admin" ? "dark" : "blue"}>{ROLES[u.role].label}</Badge>
                  </td>
                  <td className="px-4 py-3">{u.twoFactor ? <Badge tone="green"><ShieldCheck size={12} aria-hidden /> مفعّل</Badge> : <span className="text-muted">غير مفعّل</span>}</td>
                  <td className="px-4 py-3 text-muted">{u.lastLogin ? ago(u.lastLogin) : "لم يدخل بعد"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3 text-[0.8rem] font-semibold">
                      <button type="button" className="text-brand-700 hover:underline" onClick={() => setEdit({ ...u })}>
                        تحرير
                      </button>
                      {u.id !== me && u.role !== "admin" ? (
                        <button type="button" className="text-coral-600 hover:underline" onClick={() => confirm(`حذف المستخدم «${u.name}»؟`, () => update((s) => void (s.users = s.users.filter((x) => x.id !== u.id)), { action: "حذف مستخدمًا", target: u.name }), "حذف")}>
                          حذف
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-5" title="الأدوار والصلاحيات" pad={false}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-[0.83rem]">
            <thead>
              <tr className="border-b border-mist-200 text-[0.75rem] text-muted">
                <th className="px-4 py-2.5 text-start font-semibold">الصلاحية</th>
                {(Object.keys(ROLES) as RoleId[]).map((r) => (
                  <th key={r} className="px-3 py-2.5 text-center font-semibold">
                    {ROLES[r].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(CAP_LABEL) as Cap[]).map((c) => (
                <tr key={c} className="border-b border-mist-100 last:border-0">
                  <td className="px-4 py-2.5">{CAP_LABEL[c]}</td>
                  {(Object.keys(ROLES) as RoleId[]).map((r) => (
                    <td key={r} className="px-3 py-2.5 text-center">
                      {ROLES[r].caps.includes(c) ? <Check size={16} className="inline text-brand-600" aria-label="نعم" /> : <Minus size={16} className="inline text-mist-300" aria-label="لا" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-mist-200 px-4 py-3 text-[0.78rem] text-muted">جرّب أي دور من قائمة اسمك أعلى الصفحة: «جرّب صلاحيات مستخدم آخر».</p>
      </Card>

      <Drawer
        open={!!edit}
        onClose={() => setEdit(null)}
        title={edit?.id ? "تحرير المستخدم" : "مستخدم جديد"}
        footer={
          <Btn
            variant="primary"
            disabled={!edit?.name.trim() || !edit?.email.includes("@")}
            onClick={() => {
              if (!edit) return;
              const u = { ...edit, id: edit.id || uid("u-") };
              update(
                (s) => {
                  const i = s.users.findIndex((x) => x.id === u.id);
                  if (i >= 0) s.users[i] = u;
                  else s.users.push(u);
                },
                { action: edit.id ? "حدّث مستخدمًا" : "أضاف مستخدمًا", target: `${u.name} (${ROLES[u.role].label})` },
              );
              setEdit(null);
              toast(edit.id ? "حُفظ المستخدم" : "أُضيف المستخدم. يستطيع الدخول بكلمة مرور العرض");
            }}
          >
            حفظ
          </Btn>
        }
      >
        {edit ? (
          <div className="grid gap-4">
            <Text label="الاسم" value={edit.name} onChange={(v) => setEdit({ ...edit, name: v })} />
            <Text label="البريد الإلكتروني" value={edit.email} onChange={(v) => setEdit({ ...edit, email: v })} dir="ltr" />
            <Select label="الدور" value={edit.role} onChange={(v) => setEdit({ ...edit, role: v as RoleId })} options={(Object.keys(ROLES) as RoleId[]).map((r) => ({ value: r, label: `${ROLES[r].label}: ${ROLES[r].desc}` }))} help={ROLES[edit.role].desc} />
            <Toggle label="التحقق بخطوتين" checked={!!edit.twoFactor} onChange={(v) => setEdit({ ...edit, twoFactor: v })} help="يطلب رمزًا من تطبيق المصادقة عند الدخول." />
            {edit.id && edit.role === "admin" ? (
              <p className="flex items-center gap-2 text-[0.8rem] text-muted">
                <Trash2 size={14} aria-hidden /> لا يُحذف حساب المدير من هنا.
              </p>
            ) : null}
          </div>
        ) : null}
      </Drawer>
    </>
  );
}
