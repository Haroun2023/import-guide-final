import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { devices as original } from "@/config/devices";
import { update, useCms } from "@/cms/store";
import type { DeviceEdit } from "@/cms/types";
import { Area, Badge, Btn, Card, Empty, IconBtn, Lines, LinkBtn, PageHeader, Text, useDraft, useToast } from "../ui";

const photo = (id: string) => {
  const d = original.find((x) => x.id === id);
  return d ? `/devices/${d.image.id}-thumb.webp` : "";
};

export function Devices() {
  const devices = useCms((s) => s.devices);
  return (
    <>
      <PageHeader title="الأجهزة" sub="ما يظهر في معرض الأجهزة وصفحة كل جهاز. الصور والنقاط التفاعلية ثابتة من الشركات المصنّعة." />
      <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((d) => (
          <li key={d.id}>
            <Link href={`/devices/${d.id}`} className="flex h-full items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-mist-200 transition hover:ring-brand-300">
              <span className="grid size-20 shrink-0 place-items-center rounded-xl bg-[radial-gradient(closest-side,rgb(143_227_180/0.35),transparent)]">
                <img src={photo(d.id)} alt="" className="max-h-18 w-auto max-w-20 object-contain" loading="lazy" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold">{d.name}</span>
                <span dir="ltr" className="block text-end text-[0.75rem] text-muted">
                  {d.model}
                </span>
                {d.badge ? <Badge tone="green" className="mt-1.5">{d.badge}</Badge> : null}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export function DeviceEditor({ id }: { id: string }) {
  const existing = useCms((s) => s.devices.find((d) => d.id === id));
  if (!existing) return <Empty title="الجهاز غير موجود" action={<LinkBtn href="/devices">كل الأجهزة</LinkBtn>} />;
  return <DeviceForm device={existing} />;
}

function DeviceForm({ device }: { device: DeviceEdit }) {
  const { draft: d, set: put, dirty, clean } = useDraft<DeviceEdit>(device);
  const toast = useToast();

  return (
    <>
      <PageHeader
        back={{ href: "/devices", label: "الأجهزة" }}
        title={d.name}
        sub={<span dir="ltr">{d.model}</span>}
        actions={
          <>
            {dirty ? <span className="text-[0.8rem] font-semibold text-[#8a5a12]">تغييرات غير محفوظة</span> : null}
            <LinkBtn href={`/devices/${d.id}`} external>
              <ExternalLink size={15} aria-hidden /> عرض في الموقع
            </LinkBtn>
            <Btn
              variant="primary"
              disabled={!dirty}
              onClick={() => {
                update(
                  (s) => {
                    const i = s.devices.findIndex((x) => x.id === d.id);
                    if (i >= 0) s.devices[i] = d;
                  },
                  { action: "حدّث جهازًا", target: d.name },
                );
                clean();
                toast("حُفظ الجهاز");
              }}
            >
              حفظ
            </Btn>
          </>
        }
      />
      <div className="grid items-start gap-5 xl:grid-cols-[1fr_20rem]">
        <div className="grid gap-5">
          <Card title="التعريف">
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Text label="الاسم في الموقع" value={d.name} onChange={(v) => put("name", v)} />
                <Text label="الطراز" value={d.model} onChange={(v) => put("model", v)} dir="ltr" />
              </div>
              <Area label="الوصف المختصر" value={d.short} onChange={(v) => put("short", v)} rows={2} max={180} />
              <Area label="كيف يعمل؟" value={d.how} onChange={(v) => put("how", v)} rows={4} />
            </div>
          </Card>
          <Card title="المزايا الأربع">
            <div className="grid gap-3">
              {d.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2 rounded-xl bg-mist-50 p-3 ring-1 ring-mist-200">
                  <div className="grid flex-1 gap-2">
                    <Text label="الميزة" value={f.title} onChange={(v) => put("features", d.features.map((x, j) => (j === i ? { ...x, title: v } : x)))} />
                    <Area label="الشرح" value={f.text} onChange={(v) => put("features", d.features.map((x, j) => (j === i ? { ...x, text: v } : x)))} rows={2} />
                  </div>
                  <IconBtn label="حذف الميزة" onClick={() => put("features", d.features.filter((_, j) => j !== i))}>
                    <Trash2 size={15} />
                  </IconBtn>
                </div>
              ))}
              <Btn onClick={() => put("features", [...d.features, { title: "", text: "" }])}>
                <Plus size={15} aria-hidden /> أضف ميزة
              </Btn>
            </div>
          </Card>
          <Card title="لمن يناسب؟">
            <Lines label="الحالات" value={d.treats} onChange={(v) => put("treats", v)} />
          </Card>
        </div>
        <aside className="grid gap-4 xl:sticky xl:top-16">
          <Card title="الصورة">
            <img src={photo(d.id)} alt="" className="mx-auto max-h-48 w-auto" />
            <p className="mt-2 text-[0.75rem] leading-5 text-muted">صورة رسمية من الشركة المصنّعة. استبدلها بصورة جهاز المركز متى توفرت.</p>
          </Card>
          <Card title="الجلسة">
            <div className="grid gap-3">
              <Text label="مدة الجلسة" value={d.session} onChange={(v) => put("session", v)} />
              <Text label="عدد الجلسات" value={d.course} onChange={(v) => put("course", v)} />
              <Text label="ما يشعر به المراجع" value={d.feel} onChange={(v) => put("feel", v)} />
            </div>
          </Card>
          <Card title="شارة">
            <Text label="نص الشارة (اختياري)" value={d.badge ?? ""} onChange={(v) => put("badge", v || undefined)} help="ادعاء تفضيلي مثل «الأول في المدينة»: احتفظ بإثباته." />
          </Card>
          <Card title="إذن التسويق">
            <Text label="رقم إذن التسويق (MDMA)" dir="ltr" value={d.mdma ?? ""} onChange={(v) => put("mdma", v)} help="من هيئة الغذاء والدواء. يظهر في صفحة الجهاز، وتشترطه الهيئة مع موافقة مسبقة في أي إعلان يسمّي الجهاز." />
          </Card>
        </aside>
      </div>
    </>
  );
}
