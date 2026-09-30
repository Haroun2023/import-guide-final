import { Archive, CloudUpload, Download, RotateCcw } from "lucide-react";
import { useState } from "react";
import { buildDefaults, uid } from "@/cms/defaults";
import { getFile, putFile } from "@/cms/media";
import { getState, replaceState, update, useCms } from "@/cms/store";
import type { CmsState } from "@/cms/types";
import { Badge, Btn, Card, fmtDate, PageHeader, Stat, useConfirm, useToast } from "../ui";
import { countAr } from "../count";

const kb = (n: number) => `${Math.round(n / 1024)} KB`;

/** Next scheduled run: daily or weekly at 03:00 Madinah time. */
function nextRun(schedule: string) {
  if (schedule === "manual") return "يدويًا فقط";
  const d = new Date();
  d.setHours(3, 0, 0, 0);
  if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
  if (schedule === "weekly") d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7));
  return fmtDate(d.toISOString(), true);
}

export function Backups() {
  const backups = useCms((s) => s.backups);
  const settings = useCms((s) => s.plugins.backups?.settings ?? {});
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const { confirm, node } = useConfirm();

  const backupNow = async () => {
    setBusy(true);
    const snapshot = JSON.stringify(getState());
    const id = uid("bk-");
    try {
      await putFile(`backup:${id}`, new Blob([snapshot], { type: "application/json" }));
    } catch {
      setBusy(false);
      return toast("تعذّر حفظ النسخة في هذا المتصفح", "warn");
    }
    const keep = Number(settings.keep ?? 7);
    update((s) => void (s.backups = [{ id, at: new Date().toISOString(), size: snapshot.length, kind: "manual" as const }, ...s.backups].slice(0, keep)), { action: "أنشأ نسخة احتياطية" });
    setTimeout(() => {
      setBusy(false);
      toast(`اكتملت النسخة، ورُفعت إلى ${settings.destination ?? "التخزين"}`);
    }, 900);
  };

  const load = async (id: string): Promise<CmsState> => {
    const blob = await getFile(`backup:${id}`).catch(() => undefined);
    return blob ? (JSON.parse(await blob.text()) as CmsState) : buildDefaults();
  };

  return (
    <>
      {node}
      <PageHeader
        title="النسخ الاحتياطي"
        sub="نسخة كاملة من المحتوى والإعدادات والحجوزات، تستعيدها بضغطة."
        actions={
          <Btn variant="primary" onClick={backupNow} disabled={busy}>
            <CloudUpload size={16} aria-hidden /> {busy ? "جارٍ النسخ…" : "نسخة الآن"}
          </Btn>
        }
      />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <Stat label="آخر نسخة" value={backups[0] ? fmtDate(backups[0].at, true) : "—"} icon={<Archive size={20} />} />
        <Stat label="النسخة القادمة" value={nextRun(String(settings.schedule ?? "daily"))} hint={`تُحفظ في ${settings.destination ?? "Google Drive"}`} tone="navy" icon={<CloudUpload size={20} />} />
        <Stat label="نحتفظ بآخر" value={countAr(Number(settings.keep ?? 7), "نسخة واحدة", "نسختين", "نسخ", "نسخة")} tone="amber" icon={<RotateCcw size={20} />} />
      </div>
      <Card title="النسخ المحفوظة" pad={false}>
        <ul className="divide-y divide-mist-100">
          {backups.map((b) => (
            <li key={b.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <Archive size={18} className="text-muted" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{fmtDate(b.at, true)}</span>
                <span className="tabular block text-[0.75rem] text-muted">{kb(b.size)} · المحتوى والإعدادات والحجوزات</span>
              </span>
              <Badge tone={b.kind === "manual" ? "blue" : "gray"}>{b.kind === "manual" ? "يدوية" : "تلقائية"}</Badge>
              <Btn
                size="sm"
                onClick={async () => {
                  const data = await load(b.id);
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
                  a.download = `backup-${b.at.slice(0, 10)}.json`;
                  a.click();
                }}
              >
                <Download size={14} aria-hidden /> تنزيل
              </Btn>
              <Btn
                size="sm"
                onClick={() =>
                  confirm(`استعادة نسخة ${fmtDate(b.at, true)}؟ يُستبدل المحتوى الحالي بها.`, async () => {
                    const data = await load(b.id);
                    data.backups = getState().backups;
                    replaceState(data, { action: "استعاد نسخة احتياطية", target: fmtDate(b.at, true) });
                    toast("استُعيدت النسخة");
                  }, "استعادة")
                }
              >
                <RotateCcw size={14} aria-hidden /> استعادة
              </Btn>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
