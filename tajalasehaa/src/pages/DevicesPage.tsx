import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { bodyAreas } from "@/config/body";
import { programs } from "@/config/content";
import { deviceById, devices, type DeviceId } from "@/config/devices";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BookingSection } from "@/components/sections/BookingSection";
import { CTABand } from "@/components/sections/CTABand";
import { AlterGSimulator } from "@/components/sections/AlterGSimulator";
import { DeviceLab } from "@/components/sections/DeviceLab";
import { PageHero } from "@/components/sections/PageHero";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import NotFound from "./NotFound";

/** Which devices may be used for which area (a guide, not a prescription). */
function DeviceMatch() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="match-title">
      <div className="container-x">
        <SectionHeading id="match-title" eyebrow="دليل سريع" title="أي جهاز قد نستعين به *لحالتك*؟" lead="دليل مبسّط يساعدك على الفهم. الأخصائي هو من يقرر بعد التقييم إن كان الجهاز مناسبًا لك." />
        <ul className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {bodyAreas.map((a, i) => (
            <Reveal as="li" key={a.id} delay={(i % 3) * 0.05} className="glow-card p-5">
              <p className="font-bold">{a.label}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {a.devices.map((id) => (
                  <li key={id}>
                    <Link href={`/devices/${id}`} className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100">
                      {deviceById(id).name} <ArrowLeft size={14} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** /devices and /devices/<id>: the showcase opens on that device and keeps the URL in sync. */
export default function DevicesPage({ id }: { id?: string }) {
  const [, navigate] = useLocation();
  const d = id ? devices.find((x) => x.id === id) : undefined;
  if (id && !d) return <NotFound />;

  const crumbs = [{ href: "/devices", label: "الأجهزة" }, ...(d ? [{ href: `/devices/${d.id}`, label: d.name }] : [])];
  const placement = d ? `device-page:${d.id}` : "devices";

  return (
    <SiteLayout placement={`${placement}:sticky`}>
      <PageHero
        curve={false}
        crumbs={crumbs}
        eyebrow={d ? `${d.brand} · ${d.origin}` : "أجهزتنا"}
        title={d ? d.name : "أجهزة تتعرّف عليها\n*قبل أن تزورنا*"}
        lead={
          d
            ? d.short
            : "أدِر كل جهاز واقترب من أجزائه، واقرأ مزاياه ومدة جلسته وما تشعر به أثناءها. الجهاز أداة تساعد أخصائيك، وخطتك تقوم على التقييم والتمارين."
        }
        booking={{ placement: `${placement}:hero` }}
        whatsappText={d ? `السلام عليكم، عندي سؤال عن جلسات ${d.name}.` : "السلام عليكم، عندي سؤال عن الأجهزة المتوفرة لديكم."}
        aside={
          d ? (
            <div className="relative mx-auto grid size-80 place-items-center">
              <div className="absolute inset-2 rounded-full bg-[radial-gradient(closest-side,rgb(90_206_144/0.3),transparent)]" aria-hidden />
              <img
                src={`/devices/${d.image.id}-${d.image.widths[0]}.webp`}
                alt=""
                width={Math.round(260 * d.image.aspect)}
                height={260}
                className="relative max-h-72 w-auto max-w-80 object-contain drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]"
              />
            </div>
          ) : undefined
        }
      />
      <DeviceLab
        heading={false}
        initialDevice={(d?.id ?? "antigravity") as DeviceId}
        onChange={(next) => navigate(`/devices/${next}`, { replace: true, state: { keepScroll: true } })}
      />
      {(d?.id ?? "antigravity") === "antigravity" ? <AlterGSimulator placement={`${placement}:alterg-sim`} /> : null}
      {d && programs.some((p) => p.devices?.includes(d.id)) ? (
        <section className="pt-16 md:pt-20" aria-labelledby="device-programs-title">
          <div className="container-x">
            <h2 id="device-programs-title" className="text-2xl font-bold">
              برامج نستعين فيها بهذا الجهاز
            </h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {programs
                .filter((p) => p.devices?.includes(d.id))
                .map((p) => (
                  <li key={p.id}>
                    <Link href={`/programs/${p.id}`} className="glow-card inline-flex items-center gap-3 !rounded-full py-2 pe-5 ps-2.5 font-semibold">
                      <Icon3D name={p.icon3d} size={36} />
                      {p.title}
                      <ArrowLeft size={16} className="text-brand-600" aria-hidden />
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      ) : null}
      <DeviceMatch />
      <CTABand
        title="تريد أن تعرف إن كان الجهاز مناسبًا لك؟"
        text="التقييم هو الجواب. نفحص حالتك، ونشرح لك الخيارات، ونبدأ بما يفيدك فعلًا."
        booking={{ placement: `${placement}:band` }}
        icon="stethoscope"
      />
      <BookingSection prefill={{ placement: `${placement}:bottom` }} />
    </SiteLayout>
  );
}
