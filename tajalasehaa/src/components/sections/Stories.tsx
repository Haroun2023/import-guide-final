import { Quote } from "lucide-react";
import { stories } from "@/config/content";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

/**
 * Patient stories — rendered only when `showStories` is enabled in
 * config/content.ts (after legal review). Sample entries always carry a
 * visible badge so they can never pass as real reviews.
 */
export function Stories() {
  return (
    <section className="py-20 md:py-24" aria-labelledby="stories-title">
      <div className="container-x">
        <SectionHeading id="stories-title" eyebrow="تجارب المراجعين" title="ماذا يقول من سبقوك؟" />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {stories.map((s, i) => (
            <Reveal as="li" key={i} delay={i * 0.06} className="card relative p-6">
              {s.sample ? (
                <span className="absolute end-5 top-5 rounded-full bg-leaf-100 px-2.5 py-1 text-xs font-semibold text-leaf-700">نموذج توضيحي</span>
              ) : null}
              <Quote size={28} className="text-brand-300" aria-hidden />
              <blockquote className="mt-3 leading-8">{s.quote}</blockquote>
              <p className="mt-4 text-sm text-muted">
                <strong className="text-ink">{s.name}</strong> · {s.context}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
