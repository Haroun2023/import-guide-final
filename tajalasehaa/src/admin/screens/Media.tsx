import { Copy, ImagePlus, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { useSearch } from "wouter";
import { uid } from "@/cms/defaults";
import { compressImage, deleteFile, putFile, useMediaSrc } from "@/cms/media";
import { getState, update, useCms } from "@/cms/store";
import type { MediaItem } from "@/cms/types";
import { Area, Badge, Btn, Drawer, Empty, Filters, fmtDate, Modal, PageHeader, SearchBox, Stat, useConfirm, useToast } from "../ui";
import { countAr } from "../count";

type Kind = "all" | MediaItem["kind"];
const KIND_LABEL: Record<MediaItem["kind"], string> = { photo: "صور المركز", device: "الأجهزة", icon: "الأيقونات", upload: "المرفوعة" };
const kb = (n?: number) => (n ? (n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`) : "—");

/** Upload image files: compressed to WebP when the image plugin says so. */
export async function uploadFiles(files: FileList | File[]) {
  const s = getState();
  const img = s.plugins.images;
  const auto = !!img?.active && !!img.settings.autoOnUpload;
  const maxW = Number(img?.settings.maxWidth ?? 1600);
  const q = Number(img?.settings.quality ?? 80) / 100;
  const added: MediaItem[] = [];
  for (const f of Array.from(files)) {
    if (!f.type.startsWith("image/")) continue;
    const id = uid("up-");
    let blob: Blob = f;
    let width: number | undefined;
    let height: number | undefined;
    let optimizedFrom: number | undefined;
    try {
      if (auto) {
        const r = await compressImage(f, maxW, q);
        if (r.blob.size < f.size) {
          blob = r.blob;
          optimizedFrom = f.size;
        }
        width = r.width;
        height = r.height;
      } else {
        const b = await createImageBitmap(f);
        width = b.width;
        height = b.height;
        b.close?.();
      }
      await putFile(id, blob);
    } catch {
      continue;
    }
    added.push({ id, name: f.name, src: `idb:${id}`, kind: "upload", width, height, size: blob.size, optimizedFrom, alt: "", createdAt: new Date().toISOString(), builtIn: false });
  }
  if (added.length) update((d) => void d.media.unshift(...added), { action: `رفع ${countAr(added.length, "ملفًا", "ملفين", "ملفات", "ملفًا")}`, target: added.map((a) => a.name).join("، ") });
  return added;
}

function Thumb({ m, className = "" }: { m: MediaItem; className?: string }) {
  const url = useMediaSrc(m.src);
  return url ? <img src={url} alt={m.alt} loading="lazy" className={`${m.kind === "photo" || m.kind === "upload" ? "object-cover" : "object-contain p-3"} ${className}`} /> : <div className={`animate-pulse bg-mist-100 ${className}`} />;
}

function Details({ m, onClose }: { m: MediaItem; onClose: () => void }) {
  const [alt, setAlt] = useState(m.alt);
  const url = useMediaSrc(m.src);
  const toast = useToast();
  const { confirm, node } = useConfirm();
  return (
    <Drawer
      open
      onClose={onClose}
      title={m.name}
      footer={
        <>
          <Btn
            variant="primary"
            onClick={() => {
              update((d) => void (d.media.find((x) => x.id === m.id)!.alt = alt), { action: "حدّث النص البديل", target: m.name });
              toast("حُفظ النص البديل");
            }}
          >
            حفظ
          </Btn>
          {!m.builtIn ? (
            <Btn
              variant="danger"
              onClick={() =>
                confirm(`حذف «${m.name}» من الوسائط؟`, async () => {
                  await deleteFile(m.id).catch(() => {});
                  update((d) => void (d.media = d.media.filter((x) => x.id !== m.id)), { action: "حذف ملفًا", target: m.name });
                  onClose();
                }, "حذف")
              }
            >
              <Trash2 size={15} aria-hidden /> حذف
            </Btn>
          ) : null}
        </>
      }
    >
      {node}
      <div className="grid place-items-center overflow-hidden rounded-xl bg-[repeating-conic-gradient(#eef3f3_0_25%,#fff_0_50%)] bg-[length:18px_18px] ring-1 ring-mist-200">
        <Thumb m={m} className="max-h-72 w-full" />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.82rem]">
        <div>
          <dt className="text-muted">النوع</dt>
          <dd className="font-semibold">{KIND_LABEL[m.kind]}</dd>
        </div>
        <div>
          <dt className="text-muted">الأبعاد</dt>
          <dd className="tabular font-semibold">{m.width ? `${m.width}${m.height ? ` × ${m.height}` : ""} px` : "—"}</dd>
        </div>
        <div>
          <dt className="text-muted">الحجم</dt>
          <dd className="tabular font-semibold">
            {m.builtIn ? "من ملفات الموقع" : kb(m.size)}
            {m.optimizedFrom ? <span className="ms-1 text-brand-700">(كان {kb(m.optimizedFrom)})</span> : null}
          </dd>
        </div>
        <div>
          <dt className="text-muted">أضيف</dt>
          <dd className="font-semibold">{fmtDate(m.createdAt)}</dd>
        </div>
      </dl>
      <div className="mt-4">
        <Area label="النص البديل" value={alt} onChange={setAlt} rows={2} help="صِف الصورة لمن لا يراها ولمحركات البحث. اتركه فارغًا للصور الزخرفية." />
      </div>
      {url && !m.src.startsWith("idb:") ? (
        <Btn
          size="sm"
          className="mt-3"
          onClick={() =>
            navigator.clipboard
              ?.writeText(location.origin + url)
              .then(() => toast("نُسخ الرابط"))
              .catch(() => toast("انسخ الرابط يدويًا", "warn"))
          }
        >
          <Copy size={14} aria-hidden /> نسخ الرابط
        </Btn>
      ) : null}
    </Drawer>
  );
}

export function Media() {
  const media = useCms((s) => s.media);
  const imagesOn = useCms((s) => !!s.plugins.images?.active);
  const highlight = new URLSearchParams(useSearch()).has("upload");
  const [kind, setKind] = useState<Kind>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const list = media.filter((m) => (kind === "all" || m.kind === kind) && (!q || `${m.name} ${m.alt}`.toLowerCase().includes(q.toLowerCase())));
  const uploads = media.filter((m) => !m.builtIn);
  const saved = uploads.reduce((n, m) => n + (m.optimizedFrom ? m.optimizedFrom - (m.size ?? 0) : 0), 0);
  const opened = media.find((m) => m.id === open);

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const added = await uploadFiles(files);
    setBusy(false);
    if (added.length) toast(`رُفعت ${countAr(added.length, "صورة", "صورتان", "صور", "صورة")}${imagesOn ? " وضُغطت" : ""}`);
    else toast("اختر ملفات صور (JPG أو PNG أو WebP)", "warn");
  };

  return (
    <>
      <PageHeader
        title="الوسائط"
        sub="صور المركز والأجهزة والأيقونات، وما ترفعه للمقالات والصفحات."
        actions={
          <Btn variant="primary" onClick={() => input.current?.click()} disabled={busy}>
            <UploadCloud size={16} aria-hidden /> {busy ? "جارٍ الرفع…" : "رفع صور"}
          </Btn>
        }
      />
      <input ref={input} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />

      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <Stat label="كل الملفات" value={media.length} icon={<ImagePlus size={20} />} />
        <Stat label="مرفوعة" value={uploads.length} tone="navy" icon={<UploadCloud size={20} />} />
        <Stat label="وفّره ضغط الصور" value={kb(saved)} hint={imagesOn ? "إضافة ضغط الصور مفعّلة" : "إضافة ضغط الصور متوقفة"} tone="amber" icon={<Sparkles size={20} />} />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(e.dataTransfer.files);
        }}
        className={`mb-4 grid place-items-center rounded-2xl border-2 border-dashed px-4 py-7 text-center transition ${drag || highlight ? "border-brand-400 bg-brand-50" : "border-mist-300 bg-white/60"}`}
      >
        <UploadCloud size={28} className="text-brand-600" aria-hidden />
        <p className="mt-2 font-semibold">اسحب الصور إلى هنا</p>
        <p className="text-[0.8rem] text-muted">{imagesOn ? "تُحوَّل إلى WebP ويُصغَّر عرضها تلقائيًا." : "تُحفظ كما هي (فعّل إضافة ضغط الصور لتصغيرها)."}</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Filters<Kind>
          value={kind}
          onChange={setKind}
          items={[{ id: "all", label: "الكل", count: media.length }, ...(["photo", "device", "icon", "upload"] as const).map((k) => ({ id: k as Kind, label: KIND_LABEL[k], count: media.filter((m) => m.kind === k).length }))]}
        />
        <div className="w-60">
          <SearchBox value={q} onChange={setQ} placeholder="ابحث في الوسائط" />
        </div>
      </div>

      {list.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {list.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => setOpen(m.id)} className="group relative block w-full overflow-hidden rounded-xl bg-white ring-1 ring-mist-200 transition hover:ring-2 hover:ring-brand-400">
                <Thumb m={m} className="aspect-square w-full bg-mist-50 transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-gradient-to-t from-deep/75 to-transparent px-2 pb-1.5 pt-6 text-[0.7rem] text-white">
                  <span className="truncate">{m.name}</span>
                  {m.optimizedFrom ? <Badge tone="green">−{Math.round((1 - (m.size ?? 0) / m.optimizedFrom) * 100)}%</Badge> : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title="لا ملفات هنا" text="ارفع صورة أو اختر نوعًا آخر." />
      )}
      {opened ? <Details key={opened.id} m={opened} onClose={() => setOpen(null)} /> : null}
    </>
  );
}

/** Choose an image for an article, a block or a program. */
export function MediaPicker({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (src: string, alt: string) => void }) {
  const media = useCms((s) => s.media.filter((m) => m.kind !== "icon"));
  const input = useRef<HTMLInputElement>(null);
  return (
    <Modal open={open} onClose={onClose} title="اختر صورة" footer={<Btn onClick={() => input.current?.click()}>رفع صورة</Btn>}>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const added = e.target.files ? await uploadFiles(e.target.files) : [];
          if (added[0]) {
            onPick(added[0].src, added[0].alt);
            onClose();
          }
        }}
      />
      <ul className="grid max-h-[60vh] grid-cols-3 gap-2 overflow-y-auto">
        {media.map((m) => (
          <li key={m.id}>
            <button
              type="button"
              className="block w-full overflow-hidden rounded-lg ring-1 ring-mist-200 hover:ring-2 hover:ring-brand-400"
              onClick={() => {
                onPick(m.src, m.alt);
                onClose();
              }}
            >
              <Thumb m={m} className="aspect-square w-full bg-mist-50" />
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

export { Thumb as MediaThumb };
