import { ArrowLeft, Check } from "lucide-react";
import { Link } from "wouter";
import { programToComplaint } from "@/config/booking";
import { bodyAreaById } from "@/config/body";
import { programById, programs } from "@/config/content";
import { deviceById } from "@/config/devices";
import { useBooking, type BookingPrefill } from "@/components/booking/BookingContext";
import { WhatsAppLink } from "@/components/layout/ContactLinks";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { AlterGSimulator } from "@/components/sections/AlterGSimulator";
import { BookingSection } from "@/components/sections/BookingSection";
import { FAQ } from "@/components/sections/FAQ";
import { PageHero } from "@/components/sections/PageHero";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";
import NotFound from "./NotFound";

export default function ProgramPage({ id }: { id: string }) {
  const { openBooking } = useBooking();
  const p = programById(id);
  if (!p) return <NotFound />;

  const complaint = programToComplaint[p.id];
  const booking: BookingPrefill = { placement: `program:${p.id}`, complaint, mode: p.id === "home" ? "home" : undefined };
  const whatsappText = `السلام عليكم، عندي سؤال عن برنامج ${p.title}.`;
  const related = (p.devices ?? []).map(deviceById).filter(Boolean);
  const area = p.area ? bodyAreaById(p.area) : null;
  const signs = p.signs?.length ? p.signs : p.points;
  const others = programs.filter((o) => o.id !== p.id && o.track === p.track).slice(0, 4);

  return (
    <SiteLayout placement={`program:${p.id}:sticky`} complaint={complaint}>
      <PageHero
        crumbs={[
          { href: "/programs", label: "البرامج" },
          { href: `/programs/${p.id}`, label: p.title },
        ]}
        eyebrow={p.track === "rehab" ? "برنامج تأهيل" : "رعاية تكميلية"}
        title={p.title}
        lead={p.intro ?? p.short}
        booking={{ ...booking, placement: `program:${p.id}:hero` }}
        whatsappText={whatsappText}
        aside={
          <div className="relative mx-auto grid size-80 place-items-center">
            <div className="absolute inset-4 rounded-full bg-[radial-gradient(closest-side,rgb(90_206_144/0.3),transparent)]" aria-hidden />
            <Icon3D name={p.icon3d} size={230} className="relative animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_30px_40px_rgb(0_0_0/0.35)]" />
          </div>
        }
      />

      {/* Is this for me? */}
      <section className="py-16 md:py-24" aria-labelledby="signs-title">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading id="signs-title" eyebrow="هل هذا البرنامج لك؟" title="إن كان شيء من هذا يشبه يومك، *فنحن هنا*" />
            <p className="mt-4 leading-8 text-muted">هذه علامات نسمعها كثيرًا من مراجعينا. التقييم وحده يؤكد السبب ويحدد ما تحتاجه فعلًا.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary btn-shine" onClick={() => openBooking({ ...booking, placement: `program:${p.id}:signs` })}>
                احجز تقييمك <ArrowLeft size={18} aria-hidden />
              </button>
              <WhatsAppLink placement={`program:${p.id}:signs`} message={whatsappText} className="btn btn-ghost">
                <WhatsAppIcon size={20} /> اسأل أخصائيًا
              </WhatsAppLink>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {signs.map((s, i) => (
              <Reveal as="li" key={s} delay={(i % 2) * 0.05} className="glow-card group flex items-start gap-3 p-4">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-[0_6px_14px_-6px_rgb(12_132_86/0.8)] transition-transform duration-300 group-hover:scale-110">
                  <Check size={15} strokeWidth={3} aria-hidden />
                </span>
                <span className="leading-7">{s}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* How we work with you */}
      {p.approach?.length ? (
        <section className="curve-t curve-b bg-soft py-16 md:py-24" aria-labelledby="approach-title">
          <div className="container-x">
            <SectionHeading id="approach-title" eyebrow="ماذا يحدث معنا؟" title="خطوة بخطوة، *وأنت تعرف لماذا*" center />
            <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {p.approach.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 0.07} className="glow-card group relative p-6 pt-20">
                  <span className="num-outline !end-auto !start-5 !top-5" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 leading-7 text-muted">{s.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ) : null}

      {p.devices?.includes("antigravity") ? <AlterGSimulator placement={`program:${p.id}:alterg-sim`} complaint={complaint} /> : null}

      {/* Devices used in this program */}
      {related.length ? (
        <section className="py-16 md:py-24" aria-labelledby="program-devices-title">
          <div className="container-x">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <SectionHeading id="program-devices-title" eyebrow="أجهزة قد نستعين بها" title="أدوات تساعدك، *ضمن خطة تقوم على التمارين*" />
              <Link href="/devices" className="btn btn-ghost shrink-0 self-start md:self-auto">
                كل الأجهزة <ArrowLeft size={18} aria-hidden />
              </Link>
            </div>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((d, i) => (
                <Reveal as="li" key={d.id} delay={i * 0.06} className="glow-card group relative flex items-center gap-4 overflow-hidden p-5">
                  <span className="grid size-24 shrink-0 place-items-center rounded-2xl bg-[radial-gradient(closest-side,rgb(143_227_180/0.35),transparent)]">
                    <img src={`/devices/${d.image.id}-thumb.webp`} alt="" width={Math.round(88 * d.image.aspect)} height={88} loading="lazy" decoding="async" className="max-h-22 w-auto max-w-24 object-contain transition-transform duration-500 group-hover:scale-105" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-lg">
                      <Link href={`/devices/${d.id}`} className="after:absolute after:inset-0 after:z-[2] after:content-['']">
                        {d.name}
                      </Link>
                    </strong>
                    <span className="mt-1 line-clamp-2 text-[0.95rem] leading-7 text-muted">{d.short}</span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700" aria-hidden>
                      شاهد الجهاز <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-1" />
                    </span>
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {area ? (
        <section className="pb-4" aria-label="المنطقة المرتبطة">
          <div className="container-x">
            <Reveal className="glow-card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="leading-8">
                <strong>ألمك في {area.label}؟</strong> <span className="text-muted">جرّب خريطة الألم التفاعلية لترى الحالات الشائعة في هذه المنطقة.</span>
              </p>
              <Link href="/conditions" className="btn btn-ghost shrink-0">
                افتح خريطة الألم <ArrowLeft size={18} aria-hidden />
              </Link>
            </Reveal>
          </div>
        </section>
      ) : null}

      {p.faqs?.length ? <FAQ items={p.faqs} title={`أسئلة عن *${p.title}*`} /> : null}

      {others.length ? (
        <section className="pb-16" aria-labelledby="others-title">
          <div className="container-x">
            <h2 id="others-title" className="text-xl font-bold">
              برامج أخرى قد تهمك
            </h2>
            <ul className="mt-5 flex flex-wrap gap-3">
              {others.map((o) => (
                <li key={o.id}>
                  <Link href={`/programs/${o.id}`} className="glow-card inline-flex items-center gap-3 !rounded-full py-2 pe-5 ps-2.5 font-semibold">
                    <Icon3D name={o.icon3d} size={36} />
                    {o.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <BookingSection
        prefill={{ ...booking, placement: `program:${p.id}:bottom` }}
        title={
          <>
            احجز تقييمك <span className="text-gradient-leaf">لبرنامج {p.title}</span>
          </>
        }
      />
    </SiteLayout>
  );
}
