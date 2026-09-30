import { ArrowLeft, Check, ChevronLeft, ChevronRight, Clock, ExternalLink, Pause, Play, Repeat, Waves } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { Link } from "wouter";
import { devices, type Device, type DeviceId } from "@/config/devices";
import { whatsappLink } from "@/config/site";
import { trackContact, trackEngagement } from "@/lib/tracking";
import { useBooking } from "@/components/booking/BookingContext";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/Reveal";
import { DeviceStage } from "./DeviceStage";

const PANEL_ID = "device-panel";
const tabId = (id: DeviceId) => `device-tab-${id}`;

/** Device switcher: a tablist of photo cards (roving focus, RTL-aware arrows). */
function DeviceDock({ list, activeId, onChoose }: { list: Device[]; activeId: DeviceId; onChoose: (id: DeviceId) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Partial<Record<DeviceId, HTMLButtonElement | null>>>({});
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = list.findIndex((d) => d.id === activeId);
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    const step = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1 }[e.key as "ArrowLeft" | "ArrowRight"];
    let next = -1;
    if (step) next = (i + step + list.length) % list.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = list.length - 1;
    if (next < 0) return;
    e.preventDefault();
    const id = list[next].id;
    onChoose(id);
    refs.current[id]?.focus();
  };

  // Keep the selected card in view (phones) when the device changes by swipe,
  // arrows or the pain map. Scrolls the strip only, never the page.
  const mounted = useRef(false);
  useEffect(() => {
    const box = boxRef.current;
    const card = refs.current[activeId];
    if (!mounted.current || !box || !card) {
      mounted.current = true;
      return;
    }
    const b = box.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    if (c.left < b.left) box.scrollBy({ left: c.left - b.left - 16, behavior: "smooth" });
    else if (c.right > b.right) box.scrollBy({ left: c.right - b.right + 16, behavior: "smooth" });
  }, [activeId]);

  return (
    <div
      ref={boxRef}
      role="tablist"
      aria-label="الأجهزة"
      onKeyDown={onKeyDown}
      className="no-scrollbar -mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 pb-3 pt-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:auto-cols-fr lg:grid-flow-col lg:overflow-visible lg:px-0"
    >
      {list.map((d) => {
        const selected = d.id === activeId;
        return (
          <button
            key={d.id}
            ref={(el) => {
              refs.current[d.id] = el;
            }}
            id={tabId(d.id)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={PANEL_ID}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChoose(d.id)}
            className="ddock-card snap-start lg:min-w-0"
            style={{ "--glow": d.glow } as CSSProperties}
          >
            <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-[radial-gradient(closest-side,rgb(255_255_255/0.14),transparent)]">
              <img src={`/devices/${d.image.id}-thumb.webp`} alt="" width={Math.round(56 * d.image.aspect)} height={56} loading="lazy" decoding="async" className="max-h-12 w-auto max-w-14 object-contain" />
            </span>
            <span className="min-w-0">
              <span className="line-clamp-2 text-[0.9rem] font-semibold leading-snug">{d.name}</span>
              <span className="mt-0.5 block text-xs text-white/55">
                {d.brand} · {d.origin}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * The device showcase. `full`: every detail (devices page). `teaser`: the
 * stage with a short summary that links to the device's own page (home).
 */
export function DeviceLab({
  initialDevice = "antigravity",
  only,
  heading = true,
  variant = "full",
  onChange,
}: {
  initialDevice?: DeviceId;
  only?: DeviceId[];
  heading?: boolean;
  variant?: "full" | "teaser";
  /** called when the visitor picks another device (the devices page keeps its URL in sync) */
  onChange?: (id: DeviceId) => void;
}) {
  const onlyKey = only?.join(",");
  const list = useMemo(() => (onlyKey ? devices.filter((d) => onlyKey.split(",").includes(d.id)) : devices), [onlyKey]);
  const [deviceId, setDeviceId] = useState<DeviceId>(list.some((d) => d.id === initialDevice) ? initialDevice : list[0].id);
  const [hotspot, setHotspot] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const { openBooking } = useBooking();
  const index = Math.max(0, list.findIndex((d) => d.id === deviceId));
  const device = list[index];
  const multi = list.length > 1;

  const choose = (id: DeviceId) => {
    if (id !== deviceId) {
      trackEngagement("device_view", { device: id });
      onChange?.(id);
    }
    setDeviceId(id);
    setHotspot(null);
  };
  const step = (dir: 1 | -1) => choose(list[(index + dir + list.length) % list.length].id);

  return (
    <section
      id="devices"
      className={`curve-t curve-b grain relative overflow-hidden bg-deep-radial text-white ${heading ? "py-20 md:py-28" : "py-12 md:py-16"}`}
      aria-labelledby={heading ? "devices-title" : undefined}
      aria-label={heading ? undefined : "معرض الأجهزة"}
    >
      <div className="container-x">
        {heading ? (
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              light
              id="devices-title"
              eyebrow="أجهزتنا"
              title={
                <>
                  {multi ? "تعرّف على أجهزتنا" : "تعرّف على الجهاز"}
                  <br />
                  <span className="text-gradient-leaf">قبل أن تزورنا</span>
                </>
              }
              lead={
                multi
                  ? "هذه صور الأجهزة كما صنعتها شركاتها. أدِر الجهاز بإصبعك أو بالمؤشر، واضغط الأرقام لتعرف عمل كل جزء. الجهاز يساعدك، وخطتك تبدأ دائمًا من التقييم والتمارين."
                  : "أدِر الجهاز بإصبعك أو بالمؤشر، واضغط الأرقام لتعرف عمل كل جزء. الجهاز يساعدك، وخطتك تبدأ دائمًا من التقييم والتمارين."
              }
            />
            {variant === "teaser" ? (
              <Link href="/devices" className="btn btn-ghost-dark shrink-0 self-start md:self-auto">
                كل الأجهزة بالتفصيل <ArrowLeft size={18} aria-hidden />
              </Link>
            ) : null}
          </div>
        ) : null}

        {multi ? <DeviceDock list={list} activeId={deviceId} onChoose={choose} /> : null}

        <div
          id={PANEL_ID}
          role={multi ? "tabpanel" : undefined}
          aria-labelledby={multi ? tabId(device.id) : undefined}
          className="mt-6 grid items-start gap-8 lg:mt-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12"
        >
          {/* Stage */}
          <div className="lg:sticky lg:top-24">
            <div className="relative">
              <DeviceStage devices={list} activeId={deviceId} hotspot={hotspot} onHotspot={setHotspot} onSwipe={multi ? step : undefined} paused={paused} />
              {device.badge ? (
                <p
                  className={`pointer-events-none absolute start-4 top-4 z-10 rounded-full bg-leaf-300 px-3 py-1 text-xs font-bold text-deep shadow-lg transition-opacity duration-300 ${
                    hotspot ? "opacity-0" : ""
                  }`}
                >
                  ★ {device.badge}
                </p>
              ) : null}
            </div>

            <div className="mt-4 flex items-center gap-2">
              {multi ? (
                <>
                  <button type="button" className="stage-btn stage-btn-dark" aria-label="الجهاز السابق" onClick={() => step(-1)}>
                    <ChevronRight size={20} aria-hidden />
                  </button>
                  <span className="min-w-12 text-center text-sm tabular-nums text-white/60" aria-live="polite">
                    {index + 1} / {list.length}
                  </span>
                  <button type="button" className="stage-btn stage-btn-dark" aria-label="الجهاز التالي" onClick={() => step(1)}>
                    <ChevronLeft size={20} aria-hidden />
                  </button>
                </>
              ) : null}
              <p className="ms-auto hidden text-[0.8rem] text-white/50 sm:block">
                <span className="pointer-coarse:hidden">حرّك المؤشر فوق الجهاز لتدويره</span>
                <span className="hidden pointer-coarse:inline">{multi ? "اسحب يمينًا أو يسارًا لتبديل الجهاز" : "اسحب لتدوير الجهاز"}</span>
              </p>
              <button
                type="button"
                className="stage-btn stage-btn-dark ms-auto sm:ms-0"
                aria-pressed={paused}
                aria-label={paused ? "تشغيل الحركة" : "إيقاف الحركة"}
                onClick={() => setPaused((p) => !p)}
              >
                {paused ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
              </button>
            </div>

            <ul className="mt-4 flex flex-wrap gap-2" aria-label="أجزاء الجهاز">
              {device.hotspots.map((h, n) => {
                const on = hotspot === h.id;
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      aria-expanded={on}
                      onClick={() => setHotspot(on ? null : h.id)}
                      className={`inline-flex items-center gap-2 rounded-full py-1.5 pe-3.5 ps-1.5 text-sm font-medium transition-colors ${
                        on ? "bg-leaf-300 text-deep" : "bg-white/7 text-white/85 ring-1 ring-white/12 hover:bg-white/12"
                      }`}
                    >
                      <span className={`grid size-6 place-items-center rounded-full text-xs font-bold ${on ? "bg-deep text-leaf-300" : "bg-white/14"}`}>{n + 1}</span>
                      {h.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Info panel */}
          {variant === "teaser" ? (
            <div key={device.id} className="animate-rise lg:pt-6" style={{ "--glow": device.glow } as CSSProperties}>
              <p className="text-xs font-semibold">
                <span className="rounded-full bg-white/8 px-3 py-1 text-white/80 ring-1 ring-white/12">
                  {device.brand} · {device.origin}
                </span>
              </p>
              <h3 className="mt-3 text-[1.75rem] font-bold leading-tight sm:text-[2rem]">{device.name}</h3>
              <p dir="ltr" className="mt-2 text-end text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-leaf-300/80">
                {device.model}
              </p>
              <p className="mt-4 text-lg leading-8 text-white/85">{device.short}</p>
              <ul className="mt-6 grid gap-3">
                {device.features.slice(0, 3).map((f) => (
                  <li key={f.title} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-deep" style={{ background: "color-mix(in srgb, var(--glow) 85%, white)" }}>
                      <Check size={14} aria-hidden />
                    </span>
                    <span>
                      <strong className="block">{f.title}</strong>
                      <span className="text-[0.95rem] leading-7 text-white/65">{f.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Link href={`/devices/${device.id}`} className="btn btn-leaf btn-shine">
                  تفاصيل الجهاز <ArrowLeft size={18} aria-hidden />
                </Link>
                <button type="button" className="btn btn-ghost-dark" onClick={() => openBooking({ placement: `device-teaser:${device.id}` })}>
                  احجز تقييمك
                </button>
              </div>
              <p className="mt-4 text-xs leading-6 text-white/45">* يحدد الأخصائي بعد التقييم إن كان الجهاز مناسبًا لحالتك.</p>
            </div>
          ) : (
          <div key={device.id} className="animate-rise" style={{ "--glow": device.glow } as CSSProperties}>
            <p className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="rounded-full bg-white/8 px-3 py-1 text-white/80 ring-1 ring-white/12">
                {device.brand} · {device.origin}
              </span>
            </p>
            <h3 className="mt-3 text-[1.75rem] font-bold leading-tight sm:text-[2rem]">{device.name}</h3>
            <p dir="ltr" className="mt-2 text-end text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-leaf-300/80">
              {device.model}
            </p>
            <p className="mt-4 text-lg leading-8 text-white/85">{device.short}</p>

            <h4 className="mt-7 text-sm font-semibold text-white/60">المزايا</h4>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {device.features.map((f, i) => (
                <li
                  key={f.title}
                  className="animate-rise flex gap-3 rounded-2xl bg-white/[0.045] p-4 ring-1 ring-white/10 sm:block"
                  style={{ animationDelay: `${0.08 + i * 0.07}s` }}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg text-sm font-bold text-deep" style={{ background: "color-mix(in srgb, var(--glow) 85%, white)" }} aria-hidden>
                    {i + 1}
                  </span>
                  <span className="block">
                    <strong className="block text-[1.02rem] leading-snug sm:mt-3">{f.title}</strong>
                    <span className="mt-1.5 block text-[0.92rem] leading-7 text-white/65">{f.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <details className="group mt-5 rounded-2xl bg-white/[0.035] ring-1 ring-white/10 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 font-semibold">
                كيف يعمل؟
                <ChevronLeft size={18} className="text-leaf-300 transition-transform group-open:-rotate-90" aria-hidden />
              </summary>
              <p className="px-4 pb-4 leading-8 text-white/70">{device.how}</p>
            </details>

            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Clock, k: "مدة الجلسة", v: device.session },
                { icon: Repeat, k: "عدد الجلسات", v: device.course },
                { icon: Waves, k: "الإحساس", v: device.feel },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="rounded-2xl bg-white/6 px-2 py-3 ring-1 ring-white/10">
                  <Icon size={18} className="mx-auto text-leaf-300" aria-hidden />
                  <dt className="mt-1.5 text-[0.72rem] text-white/55">{k}</dt>
                  <dd className="mt-0.5 text-[0.82rem] font-semibold leading-snug">{v}</dd>
                </div>
              ))}
            </dl>

            <h4 className="mt-6 text-sm font-semibold text-white/60">نستخدمه غالبًا مع</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {device.treats.map((t) => (
                <li key={t} className="rounded-full bg-leaf-400/12 px-3 py-1.5 text-sm text-leaf-300 ring-1 ring-leaf-400/25">
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button type="button" className="btn btn-leaf btn-shine" onClick={() => openBooking({ placement: `device:${device.id}` })}>
                احجز تقييمك <ArrowLeft size={18} aria-hidden />
              </button>
              <a
                className="btn btn-ghost-dark"
                href={whatsappLink(`السلام عليكم، عندي سؤال عن جلسات ${device.name}.`)}
                target="_blank"
                rel="noopener"
                onClick={() => trackContact("whatsapp", `device:${device.id}`)}
              >
                <WhatsAppIcon size={19} /> اسأل عن الجهاز
              </a>
            </div>
            <p className="mt-4 text-xs leading-6 text-white/45">
              * يحدد الأخصائي بعد التقييم إن كان الجهاز مناسبًا لحالتك. الصورة من{" "}
              <a href={device.credit.url} target="_blank" rel="noopener nofollow" className="inline-flex items-center gap-1 underline decoration-white/25 underline-offset-4 hover:text-white/70">
                {device.credit.label}
                <ExternalLink size={11} aria-hidden />
              </a>{" "}
              للتوضيح.
            </p>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
