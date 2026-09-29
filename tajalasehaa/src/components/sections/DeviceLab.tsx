import { ArrowLeft, Clock, Pause, Play, Repeat, RotateCcw, RotateCw, Waves } from "lucide-react";
import { lazy, useEffect, useRef, useState } from "react";
import { devices, deviceById, type DeviceId } from "@/config/devices";
import { whatsappLink } from "@/config/site";
import { trackContact, trackEngagement } from "@/lib/tracking";
import { useBooking } from "@/components/booking/BookingContext";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/Reveal";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { HotspotOverlay, type HotspotDomRef } from "@/components/three/HotspotOverlay";
import { StagePoster } from "@/components/three/Posters";

const DeviceScene = lazy(() => import("@/three/DeviceScene"));

export function DeviceLab({ initialDevice = "antigravity", only }: { initialDevice?: DeviceId; only?: DeviceId[] }) {
  const list = only ? devices.filter((d) => only.includes(d.id)) : devices;
  const [deviceId, setDeviceId] = useState<DeviceId>(initialDevice);
  const [hotspot, setHotspot] = useState<string | null>(null);
  const [spin, setSpin] = useState(0);
  const [paused, setPaused] = useState(false);
  const { openBooking } = useBooking();
  const hotspotDom: HotspotDomRef = useRef({});
  const device = deviceById(deviceId);

  const choose = (id: DeviceId) => {
    setDeviceId(id);
    setHotspot(null);
    trackEngagement("device_view", { device: id });
  };

  // The pain map can ask us to show a specific device.
  useEffect(() => {
    const onDevice = (e: Event) => {
      const id = (e as CustomEvent<string>).detail as DeviceId;
      if (devices.some((d) => d.id === id)) choose(id);
    };
    window.addEventListener("ta:device", onDevice);
    return () => window.removeEventListener("ta:device", onDevice);
  }, []);

  return (
    <section id="devices" className="grain relative overflow-hidden bg-deep-radial py-20 text-white md:py-28" aria-labelledby="devices-title">
      <div className="container-x">
        <SectionHeading
          light
          id="devices-title"
          eyebrow="مختبر التقنيات"
          title={
            <>
              أجهزة عالمية…
              <br />
              <span className="text-gradient-mint">أمامك بتقنية ثلاثية الأبعاد</span>
            </>
          }
          lead="اسحب لتدوير الجهاز واضغط النقاط المرقّمة لتعرف كيف يعمل. الأجهزة عندنا أدوات ضمن خطة تعتمد على التقييم والتمارين العلاجية — لا بديلًا عنها."
        />

        {list.length > 1 ? (
          <div role="tablist" aria-label="الأجهزة" className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1">
            {list.map((d) => (
              <button
                key={d.id}
                type="button"
                role="tab"
                aria-selected={d.id === deviceId}
                aria-controls="device-panel"
                onClick={() => choose(d.id)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-[0.93rem] font-semibold transition-colors ${
                  d.id === deviceId ? "bg-gold-300 text-deep" : "bg-white/8 text-white/80 ring-1 ring-white/15 hover:bg-white/14"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>
        ) : null}

        <div id="device-panel" role="tabpanel" className="mt-6 grid items-start gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
          {/* Stage */}
          <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(80%_60%_at_50%_35%,rgb(26_141_136/0.28),transparent_70%)] ring-1 ring-white/10">
            <LazyCanvas className="relative h-[400px] sm:h-[500px] lg:h-[580px]" poster={<StagePoster className="h-full w-full p-6" />}>
              {(base) => (
                <>
                  <DeviceScene {...base} device={deviceId} selected={hotspot} spin={spin} paused={paused} hotspotDom={hotspotDom} />
                  <HotspotOverlay
                    items={device.hotspots.map((h) => ({ id: h.id, label: h.title }))}
                    active={hotspot}
                    onSelect={(id) => setHotspot((cur) => (cur === id ? null : id))}
                    domRef={hotspotDom}
                  />
                </>
              )}
            </LazyCanvas>
            {device.badge ? (
              <p className="absolute start-4 top-4 rounded-full bg-gold-300 px-3 py-1 text-xs font-bold text-deep">★ {device.badge}</p>
            ) : null}
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
              <button type="button" className="stage-btn stage-btn-dark" aria-label="تدوير لليمين" onClick={() => setSpin((s) => s - Math.PI / 3)}>
                <RotateCw size={18} aria-hidden />
              </button>
              <button type="button" className="stage-btn stage-btn-dark" aria-label={paused ? "تشغيل الحركة" : "إيقاف الحركة"} onClick={() => setPaused((p) => !p)}>
                {paused ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
              </button>
              <button type="button" className="stage-btn stage-btn-dark" aria-label="تدوير لليسار" onClick={() => setSpin((s) => s + Math.PI / 3)}>
                <RotateCcw size={18} aria-hidden />
              </button>
            </div>
          </div>

          {/* Info panel */}
          <div key={device.id} className="animate-rise">
            <p dir="ltr" className="text-end text-xs font-semibold uppercase tracking-[0.18em] text-mint-300/80">
              {device.nameEn}
            </p>
            <h3 className="mt-2 text-[1.9rem] font-bold leading-tight">{device.name}</h3>
            <p className="mt-3 text-lg text-white/80">{device.short}</p>
            <p className="mt-3 leading-8 text-white/65">{device.how}</p>

            <ol className="mt-6 grid gap-2">
              {device.hotspots.map((h, i) => {
                const active = hotspot === h.id;
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      aria-expanded={active}
                      onClick={() => setHotspot(active ? null : h.id)}
                      className={`w-full rounded-2xl px-4 py-3 text-start transition-colors ${active ? "bg-white/12 ring-1 ring-gold-300/60" : "bg-white/5 hover:bg-white/9"}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`grid size-7 shrink-0 place-items-center rounded-full text-sm font-bold ${active ? "bg-gold-300 text-deep" : "bg-white/12 text-white"}`}>{i + 1}</span>
                        <span className="font-semibold">{h.title}</span>
                      </span>
                      {active ? <span className="mt-2 block ps-10 text-[0.95rem] leading-7 text-white/70">{h.text}</span> : null}
                    </button>
                  </li>
                );
              })}
            </ol>

            <dl className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Clock, k: "مدة الجلسة", v: device.session },
                { icon: Repeat, k: "عدد الجلسات", v: device.course },
                { icon: Waves, k: "الإحساس", v: device.feel },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="rounded-2xl bg-white/6 px-2 py-3 ring-1 ring-white/10">
                  <Icon size={18} className="mx-auto text-mint-300" aria-hidden />
                  <dt className="mt-1.5 text-[0.72rem] text-white/55">{k}</dt>
                  <dd className="mt-0.5 text-[0.82rem] font-semibold leading-snug">{v}</dd>
                </div>
              ))}
            </dl>

            <h4 className="mt-6 text-sm font-semibold text-white/80">يُستخدم ضمن خطط علاج</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {device.treats.map((t) => (
                <li key={t} className="rounded-full bg-mint-400/12 px-3 py-1.5 text-sm text-mint-300 ring-1 ring-mint-400/25">
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button type="button" className="btn btn-gold btn-shine" onClick={() => openBooking({ placement: `device:${device.id}` })}>
                احجز تقييمك الآن <ArrowLeft size={18} aria-hidden />
              </button>
              <a
                className="btn btn-ghost-dark"
                href={whatsappLink(`مرحبًا، أرغب بالاستفسار عن جلسات ${device.name}.`)}
                target="_blank"
                rel="noopener"
                onClick={() => trackContact("whatsapp", `device:${device.id}`)}
              >
                <WhatsAppIcon size={19} /> اسأل عن الجهاز
              </a>
            </div>
            <p className="mt-3 text-xs text-white/45">* يحدد الأخصائي مدى ملاءمة أي جهاز لحالتك بعد التقييم.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
