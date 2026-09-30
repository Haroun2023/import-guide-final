import { ArrowLeft, Download, ExternalLink, LoaderCircle, Plug, Settings2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { PLUGINS, pluginById, type Field, type PluginDef } from "@/cms/plugins";
import { update, useCms } from "@/cms/store";
import { Area, Badge, Btn, Card, Empty, Filters, Icon, LinkBtn, PageHeader, SearchBox, Select, Text, Toggle, useToast } from "../ui";

function setActive(p: PluginDef, active: boolean) {
  update(
    (s) => {
      s.plugins[p.id] = { ...(s.plugins[p.id] ?? { settings: structuredClone(p.settings) }), installed: true, active };
    },
    { action: active ? "فعّل إضافة" : "عطّل إضافة", target: p.name },
  );
}

function PluginRow({ p }: { p: PluginDef }) {
  const state = useCms((s) => s.plugins[p.id]);
  const toast = useToast();
  const active = !!state?.active;
  return (
    <li className={`flex flex-wrap items-start gap-4 border-b border-mist-100 px-4 py-3.5 last:border-0 ${active ? "bg-white" : "bg-mist-50/60"}`}>
      <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${active ? "bg-gradient-to-br from-brand-50 to-white text-brand-700 ring-1 ring-brand-100" : "bg-mist-100 text-muted"}`}>
        <Icon name={p.icon} size={20} />
      </span>
      <div className="min-w-0 flex-1 basis-64">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-bold">{p.name}</span>
          <span className="text-[0.75rem] text-muted">مثل {p.like}</span>
          {active ? <Badge tone="green">نشطة</Badge> : <Badge>غير نشطة</Badge>}
        </p>
        <p className="mt-0.5 text-[0.83rem] leading-6 text-muted">{p.description}</p>
        {p.onSite ? <p className="mt-1 text-[0.75rem] font-semibold text-navy-600">في الموقع: {p.onSite}</p> : null}
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[0.8rem] font-semibold">
          <button
            type="button"
            className={active ? "text-coral-600 hover:underline" : "text-brand-700 hover:underline"}
            onClick={() => {
              setActive(p, !active);
              toast(active ? `عُطّلت «${p.name}»` : `فُعّلت «${p.name}»${p.onSite ? ". افتح الموقع لترى أثرها" : ""}`);
            }}
          >
            {active ? "تعطيل" : "تفعيل"}
          </button>
          <Link href={`/plugins/${p.id}`} className="text-brand-700 hover:underline">
            الإعدادات
          </Link>
          {!active && !PLUGINS.find((x) => x.id === p.id)?.installed ? (
            <button type="button" className="text-muted hover:underline" onClick={() => update((s) => void (s.plugins[p.id] = { ...s.plugins[p.id], installed: false, active: false }), { action: "حذف إضافة", target: p.name })}>
              حذف
            </button>
          ) : null}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1 text-[0.72rem] text-muted">
        <span dir="ltr">v{p.version}</span>
        <Badge tone="blue">{p.category}</Badge>
      </div>
    </li>
  );
}

export function Plugins() {
  const states = useCms((s) => s.plugins);
  const [tab, setTab] = useState<"all" | "active" | "inactive">("all");
  const [q, setQ] = useState("");
  const installed = PLUGINS.filter((p) => states[p.id]?.installed);
  const list = installed.filter((p) => (tab === "all" || (tab === "active") === !!states[p.id]?.active) && (!q || `${p.name} ${p.like} ${p.description}`.toLowerCase().includes(q.toLowerCase())));
  const activeN = installed.filter((p) => states[p.id]?.active).length;
  return (
    <>
      <PageHeader
        title="الإضافات"
        sub="كل ميزة في لوحة التحكم إضافة تفعّلها أو تعطّلها، كما في ووردبريس."
        actions={
          <LinkBtn href="/plugins/new" variant="primary">
            <Download size={16} aria-hidden /> أضف إضافة
          </LinkBtn>
        }
      />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Filters
          value={tab}
          onChange={setTab}
          items={[
            { id: "all", label: "الكل", count: installed.length },
            { id: "active", label: "النشطة", count: activeN },
            { id: "inactive", label: "غير النشطة", count: installed.length - activeN },
          ]}
        />
        <div className="w-64">
          <SearchBox value={q} onChange={setQ} placeholder="ابحث في الإضافات المثبّتة" />
        </div>
      </div>
      <Card pad={false}>{list.length ? <ul>{list.map((p) => <PluginRow key={p.id} p={p} />)}</ul> : <Empty title="لا إضافات هنا" />}</Card>
    </>
  );
}

export function PluginCatalog() {
  const states = useCms((s) => s.plugins);
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToast();
  const available = PLUGINS.filter((p) => !p.installed);
  return (
    <>
      <PageHeader back={{ href: "/plugins", label: "الإضافات" }} title="أضف إضافة" sub="إضافات مقترحة لعيادة تريد أن تكبر: الدفع، والتقسيط، والتذكير بالرسائل، والتكامل مع أنظمتكم." />
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {available.map((p) => {
          const st = states[p.id];
          return (
            <li key={p.id} className="flex flex-col rounded-2xl bg-white p-5 ring-1 ring-mist-200">
              <div className="flex items-start gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-navy-50 to-white text-navy-600 ring-1 ring-navy-100">
                  <Icon name={p.icon} size={22} />
                </span>
                <div className="min-w-0">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-[0.75rem] text-muted">مثل {p.like}</p>
                </div>
              </div>
              <p className="mt-3 flex-1 text-[0.85rem] leading-6 text-muted">{p.description}</p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <Badge tone="blue">{p.category}</Badge>
                {st?.installed ? (
                  st.active ? (
                    <LinkBtn href={`/plugins/${p.id}`} className="!h-9">
                      <Settings2 size={15} aria-hidden /> الإعدادات
                    </LinkBtn>
                  ) : (
                    <Btn
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setActive(p, true);
                        toast(`فُعّلت «${p.name}»`);
                      }}
                    >
                      تفعيل
                    </Btn>
                  )
                ) : (
                  <Btn
                    size="sm"
                    disabled={busy === p.id}
                    onClick={() => {
                      setBusy(p.id);
                      setTimeout(() => {
                        update((s) => void (s.plugins[p.id] = { installed: true, active: false, settings: structuredClone(p.settings) }), { action: "ثبّت إضافة", target: p.name });
                        setBusy(null);
                        toast(`ثُبّتت «${p.name}». فعّلها لتبدأ`);
                      }, 1100);
                    }}
                  >
                    {busy === p.id ? <LoaderCircle size={15} className="animate-spin" aria-hidden /> : <Download size={15} aria-hidden />} {busy === p.id ? "جارٍ التثبيت" : "تثبيت الآن"}
                  </Btn>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-[0.8rem] text-muted">في نسخة العرض تُثبَّت الإضافات وتُحفظ إعداداتها، لكنها لا تتصل فعليًا بالخدمات الخارجية حتى تُربط بحسابات المركز.</p>
    </>
  );
}

export function FieldInput({ f, value, onChange }: { f: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (f.type) {
    case "toggle":
      return <Toggle label={f.label} help={f.help} checked={!!value} onChange={onChange} />;
    case "textarea":
      return <Area label={f.label} help={f.help} value={String(value ?? "")} onChange={onChange} rows={3} />;
    case "select":
      return <Select label={f.label} help={f.help} value={String(value ?? "")} onChange={onChange} options={f.options ?? []} />;
    case "number":
      return <Text label={f.label} help={f.help} type="number" dir="ltr" value={String(value ?? "")} onChange={(v) => onChange(Number(v))} />;
    case "list":
      return <Area label={f.label} help={f.help} value={((value as string[]) ?? []).join("\n")} onChange={(v) => onChange(v.split("\n"))} rows={4} />;
    default:
      return <Text label={f.label} help={f.help} type={f.type === "password" ? "password" : "text"} dir={f.dir} placeholder={f.placeholder} value={String(value ?? "")} onChange={onChange} />;
  }
}

export function PluginSettings({ id }: { id: string }) {
  const def = pluginById(id);
  const state = useCms((s) => s.plugins[id]);
  const [draft, setDraft] = useState<Record<string, unknown>>(() => structuredClone(state?.settings ?? def?.settings ?? {}));
  const toast = useToast();
  if (!def || !state?.installed) return <Empty icon={<Plug size={36} />} title="الإضافة غير مثبّتة" action={<LinkBtn href="/plugins/new">أضف إضافة</LinkBtn>} />;
  const dirty = JSON.stringify(draft) !== JSON.stringify(state.settings);
  const save = () => {
    const clean = { ...draft };
    for (const f of def.fields) if (f.type === "list") clean[f.key] = ((clean[f.key] as string[]) ?? []).map((x) => x.trim()).filter(Boolean);
    update((s) => void (s.plugins[id].settings = clean), { action: "حدّث إعدادات إضافة", target: def.name });
    setDraft(clean);
    toast("حُفظت الإعدادات");
  };
  return (
    <>
      <PageHeader
        back={{ href: "/plugins", label: "الإضافات" }}
        title={def.name}
        sub={`${def.description} (مثل ${def.like})`}
        actions={
          <>
            {def.screen ? (
              <LinkBtn href={def.screen}>
                افتح شاشتها <ArrowLeft size={15} aria-hidden />
              </LinkBtn>
            ) : null}
            <Btn variant="primary" disabled={!dirty} onClick={save}>
              حفظ الإعدادات
            </Btn>
          </>
        }
      />
      <div className="grid items-start gap-5 lg:grid-cols-[1fr_18rem]">
        <Card title="الإعدادات">
          <div className="grid gap-5">
            {def.fields.map((f) => (
              <FieldInput key={f.key} f={f} value={draft[f.key]} onChange={(v) => setDraft({ ...draft, [f.key]: v })} />
            ))}
          </div>
        </Card>
        <Card title="الحالة">
          <Toggle label={state.active ? "الإضافة نشطة" : "الإضافة متوقفة"} checked={state.active} onChange={(v) => setActive(def, v)} />
          {def.onSite ? (
            <p className="mt-3 rounded-xl bg-navy-50 px-3 py-2 text-[0.8rem] leading-6 text-navy-700">
              {def.onSite}{" "}
              <a href="/" target="_blank" rel="noopener" className="inline-flex items-center gap-1 font-semibold underline">
                افتح الموقع <ExternalLink size={12} aria-hidden />
              </a>
            </p>
          ) : null}
          <dl className="mt-3 grid gap-1 text-[0.8rem] text-muted">
            <div className="flex justify-between">
              <dt>الإصدار</dt>
              <dd dir="ltr">{def.version}</dd>
            </div>
            <div className="flex justify-between">
              <dt>التصنيف</dt>
              <dd>{def.category}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
