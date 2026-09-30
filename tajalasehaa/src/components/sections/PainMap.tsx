import { ArrowLeft, RotateCcw, RotateCw, ScanSearch, SwitchCamera } from "lucide-react";
import { lazy, useRef, useState } from "react";
import { Link } from "wouter";
import { areaToComplaint } from "@/config/booking";
import { bodyAreas, bodyAreaById, type BodyAreaId } from "@/config/body";
import { programById } from "@/config/content";
import { deviceById } from "@/config/devices";
import { whatsappLink } from "@/config/site";
import { trackContact, trackEngagement } from "@/lib/tracking";
import { useBooking } from "@/components/booking/BookingContext";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import { LazyCanvas } from "@/components/three/LazyCanvas";
import { HotspotOverlay, type HotspotDomRef } from "@/components/three/HotspotOverlay";
import { BodyPoster } from "@/components/three/Posters";

const BodyScene = lazy(() => import("@/three/BodyScene"));

/**
 * «أين يؤلمك؟»: pick the painful area on the 3D body (or the list) to see the
 * usual conditions, the matching program and devices, and book for it.
 * `heading`: "full" (section heading), "compact" (title only) or "none" (the page has its own H1).
 */
export function PainMap({ initialArea = null, heading = "full" }: { initialArea?: BodyAreaId | null; heading?: "full" | "compact" | "none" }) {
  const [selected, setSelected] = useState<BodyAreaId | null>(initialArea);
  const [view, setView] = useState<"front" | "back">(initialArea ? bodyAreaById(initialArea).view : "front");
  const [spin, setSpin] = useState(0);
  const { openBooking } = useBooking();
  const hotspotDom: HotspotDomRef = useRef({});
  const area = selected ? bodyAreaById(selected) : null;

  const select = (id: BodyAreaId) => {
    setSelected(id);
    setView(bodyAreaById(id).view);
    setSpin(0);
    trackEngagement("pain_area_select", { area: id });
  };

  return (
    <section
      id="pain-map"
      className={`relative overflow-hidden ${heading === "none" ? "py-12 md:py-16" : "py-20 md:py-28"}`}
      aria-labelledby={heading === "none" ? undefined : "painmap-title"}
      aria-label={heading === "none" ? "خريطة الألم" : undefined}
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-[radial-gradient(60%_50%_at_20%_30%,rgb(143_227_180/0.22),transparent_70%)]" aria-hidden />
      <div className="container-x">
        {heading === "full" ? (
          <SectionHeading
            id="painmap-title"
            eyebrow="ابدأ من موضع الألم"
            title="أين *يؤلمك*؟"
            accent="coral"
            lead="اضغط على موضع الألم في المجسّم أو اختره من القائمة. ستجد الحالات التي نراها كثيرًا في هذه المنطقة، وكيف نبدأ معك."
          />
        ) : heading === "compact" ? (
          <h2 id="painmap-title" className="h-section">
            أين <span className="text-coral-500">يؤلمك</span>؟
          </h2>
        ) : null}

        <div className={`grid items-start gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 ${heading === "none" ? "" : "mt-10"}`}>
          {/* 3D stage */}
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-white to-mist-100 ring-1 ring-mist-200">
            <LazyCanvas className="relative h-[430px] sm:h-[520px] lg:h-[600px]" poster={<BodyPoster className="mx-auto h-full w-auto py-8" />}>
              {(base) => (
                <>
                  <BodyScene {...base} selected={selected} view={view} spin={spin} hotspotDom={hotspotDom} />
                  <HotspotOverlay
                    items={bodyAreas.map((a) => ({ id: a.id, label: a.label }))}
                    active={selected}
                    onSelect={(id) => select(id as BodyAreaId)}
                    domRef={hotspotDom}
                    tone="coral"
                  />
                </>
              )}
            </LazyCanvas>
            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
              <button type="button" className="stage-btn stage-btn-light" aria-label="تدوير لليمين" onClick={() => setSpin((s) => s - Math.PI / 4)}>
                <RotateCw size={18} aria-hidden />
              </button>
              <button
                type="button"
                className="btn btn-ghost min-h-11 px-4 text-sm"
                onClick={() => {
                  setView((v) => (v === "front" ? "back" : "front"));
                  setSpin(0);
                }}
              >
                <SwitchCamera size={17} aria-hidden /> {view === "front" ? "عرض الظهر" : "عرض الأمام"}
              </button>
              <button type="button" className="stage-btn stage-btn-light" aria-label="تدوير لليسار" onClick={() => setSpin((s) => s + Math.PI / 4)}>
                <RotateCcw size={18} aria-hidden />
              </button>
            </div>
            <p className="pointer-events-none absolute start-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs text-muted backdrop-blur">
              اسحب للتدوير · اضغط على النقاط
            </p>
          </Reveal>

          {/* Panel */}
          <div>
            <fieldset>
              <legend className="text-sm font-semibold text-ink">اختر المنطقة</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {bodyAreas.map((a, i) => (
                  <button
                    key={a.id}
                    type="button"
                    aria-pressed={selected === a.id}
                    onClick={() => select(a.id)}
                    className="chip justify-center gap-2 px-2 py-2.5 text-[0.9rem] aria-pressed:border-coral-500 aria-pressed:bg-coral-500 aria-pressed:text-white"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-coral-500/12 text-[0.7rem] font-bold text-coral-600 [[aria-pressed=true]_&]:bg-white/25 [[aria-pressed=true]_&]:text-white">
                      {i + 1}
                    </span>
                    {a.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="card mt-5 p-6" aria-live="polite">
              {area ? (
                <div key={area.id} className="animate-rise">
                  <p className="text-sm font-semibold text-coral-600">المنطقة المختارة</p>
                  <h3 className="mt-1 text-2xl font-bold">{area.label}</h3>
                  <p className="mt-3 leading-8 text-muted">{area.insight}</p>

                  <h4 className="mt-5 text-sm font-semibold">حالات نراها كثيرًا هنا</h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {area.conditions.map((c) => (
                      <li key={c} className="rounded-full bg-mist-100 px-3 py-1.5 text-sm">
                        {c}
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-5 text-sm font-semibold">أجهزة قد نستعين بها</h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {area.devices.map((d) => (
                      <li key={d}>
                        <Link href={`/devices/${d}`} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100">
                          {deviceById(d).name} <ArrowLeft size={14} aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-muted">* يحدد الأخصائي خطتك بعد التقييم، والتمارين هي الأساس في أغلب الحالات.</p>
                  {programById(area.program) ? (
                    <Link href={`/programs/${area.program}`} className="mt-4 inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-900">
                      اقرأ عن برنامج «{programById(area.program)!.title}» <ArrowLeft size={16} aria-hidden />
                    </Link>
                  ) : null}

                  <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <button
                      type="button"
                      className="btn btn-primary btn-shine"
                      onClick={() => openBooking({ placement: `pain-map:${area.id}`, complaint: areaToComplaint[area.id] })}
                    >
                      احجز تقييمًا لـ{area.label} <ArrowLeft size={18} aria-hidden />
                    </button>
                    <a
                      className="btn btn-ghost"
                      href={whatsappLink(`السلام عليكم، عندي ألم في ${area.label} وأرغب في استشارة أخصائي.`)}
                      target="_blank"
                      rel="noopener"
                      onClick={() => trackContact("whatsapp", `pain-map:${area.id}`)}
                    >
                      <WhatsAppIcon size={19} /> اسأل أخصائيًا
                    </a>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-coral-500/10 text-coral-500">
                    <ScanSearch size={28} aria-hidden />
                  </div>
                  <p className="mt-4 text-lg font-semibold">من أين يبدأ الألم؟</p>
                  <p className="mt-1 text-muted">أكثر ما نراه عندنا:</p>
                  <div className="mt-4 flex justify-center gap-2">
                    {(["lowerBack", "knee", "neck"] as BodyAreaId[]).map((id) => (
                      <button key={id} type="button" className="chip" onClick={() => select(id)}>
                        {bodyAreaById(id).label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
