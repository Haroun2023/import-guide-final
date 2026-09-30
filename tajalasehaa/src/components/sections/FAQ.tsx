import { Plus } from "lucide-react";
import { faqs } from "@/config/content";
import { SectionHeading } from "@/components/ui/Reveal";

/** Native <details> accordion: works without JS and in the prerendered HTML. */
export function FAQ({ limit }: { limit?: number }) {
  const items = limit ? faqs.slice(0, limit) : faqs;
  return (
    <section id="faq" className="py-20 md:py-28" aria-labelledby="faq-title">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading id="faq-title" eyebrow="الأسئلة الشائعة" title="كل ما تريد معرفته قبل زيارتك" lead="لم تجد إجابتك؟ راسلنا عبر واتساب ويجيبك فريقنا مباشرة." />
        <div className="grid gap-3">
          {items.map((f) => (
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
