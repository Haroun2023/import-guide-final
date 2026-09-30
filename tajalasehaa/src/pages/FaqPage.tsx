import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { programs } from "@/config/content";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BookingSection } from "@/components/sections/BookingSection";
import { CTABand } from "@/components/sections/CTABand";
import { FAQ } from "@/components/sections/FAQ";
import { PageHero } from "@/components/sections/PageHero";
import { Icon3D } from "@/components/ui/Icon3D";

export default function FaqPage() {
  const withFaqs = programs.filter((p) => p.faqs?.length);
  return (
    <SiteLayout placement="faq:sticky">
      <PageHero
        crumbs={[{ href: "/faq", label: "الأسئلة الشائعة" }]}
        eyebrow="الأسئلة الشائعة"
        title="أسئلة نسمعها كثيرًا قبل الزيارة الأولى"
        lead="جمعنا هنا أكثر ما يسألنا عنه المراجعون. وإن لم تجد سؤالك، فاكتب لنا على واتساب ويرد عليك أحد أخصائيينا."
        booking={{ placement: "faq:hero" }}
        whatsappText="السلام عليكم، عندي سؤال قبل الحجز:"
      />
      <FAQ heading={false} />

      {withFaqs.length ? (
        <section className="curve-t curve-b bg-soft py-16 md:py-24" aria-labelledby="program-faqs-title">
          <div className="container-x max-w-4xl">
            <h2 id="program-faqs-title" className="h-section">
              أسئلة حسب البرنامج
            </h2>
            <div className="mt-8 grid gap-8">
              {withFaqs.map((p) => (
                <div key={p.id}>
                  <h3 className="flex items-center gap-3 text-xl font-bold">
                    <Icon3D name={p.icon3d} size={40} />
                    {p.title}
                  </h3>
                  <div className="mt-4 grid gap-3">
                    {p.faqs!.map((f) => (
                      <details key={f.q} className="card group p-0 [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold">
                          {f.q}
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mist-100 text-brand-700 transition-transform duration-300 group-open:rotate-45" aria-hidden>
                            +
                          </span>
                        </summary>
                        <p className="px-5 pb-5 leading-8 text-muted">{f.a}</p>
                      </details>
                    ))}
                  </div>
                  <Link href={`/programs/${p.id}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-900">
                    صفحة البرنامج <ArrowLeft size={15} aria-hidden />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTABand title="ما زال عندك سؤال؟" text="اكتب لنا سؤالك كما هو، ويرد عليك أحد أخصائيينا في أوقات العمل." booking={{ placement: "faq:band" }} icon="message-circle" />
      <BookingSection prefill={{ placement: "faq:bottom" }} />
    </SiteLayout>
  );
}
