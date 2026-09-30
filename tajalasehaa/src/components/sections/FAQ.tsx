import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "wouter";
import { faqs } from "@/config/content";
import { WhatsAppLink } from "@/components/layout/ContactLinks";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { SectionHeading } from "@/components/ui/Reveal";

type QA = { q: string; a: string };

/** Native <details> accordion: works without JS and in the prerendered HTML. */
export function FAQ({
  limit,
  items,
  title = "أسئلة نسمعها كثيرًا",
  heading = true,
  moreLink = false,
}: {
  limit?: number;
  /** custom questions (e.g. a program's own); defaults to the site FAQ */
  items?: QA[];
  title?: string;
  heading?: boolean;
  /** show «كل الأسئلة» (for teasers) */
  moreLink?: boolean;
}) {
  const all = items ?? faqs;
  const list = limit ? all.slice(0, limit) : all;
  return (
    <section id="faq" className={heading ? "py-20 md:py-28" : "py-12 md:py-16"} aria-labelledby={heading ? "faq-title" : undefined} aria-label={heading ? undefined : "الأسئلة الشائعة"}>
      <div className={`container-x grid gap-10 ${heading ? "lg:grid-cols-[0.8fr_1.2fr]" : "max-w-4xl"}`}>
        {heading ? (
          <div>
            <SectionHeading id="faq-title" eyebrow="الأسئلة الشائعة" title={title} lead="ما وجدت سؤالك؟ اكتب لنا على واتساب، ويرد عليك أحد أخصائيينا." />
            <div className="mt-6 flex flex-wrap gap-3">
              <WhatsAppLink placement="faq" message="السلام عليكم، عندي سؤال قبل الحجز:" className="btn btn-whatsapp">
                <WhatsAppIcon size={20} /> اسأل سؤالك
              </WhatsAppLink>
              {moreLink ? (
                <Link href="/faq" className="btn btn-ghost">
                  كل الأسئلة <ArrowLeft size={18} aria-hidden />
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="grid content-start gap-3">
          {list.map((f) => (
            <details key={f.q} className="card group p-0 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[1.02rem] font-semibold">
                {f.q}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mist-100 text-brand-700 transition-transform duration-300 group-open:rotate-45">
                  <Plus size={17} aria-hidden />
                </span>
              </summary>
              <p className="px-5 pb-5 leading-8 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
