import { commitments } from "@/config/content";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const ICONS = ["stethoscope", "clipboard-list", "chart-line", "user-check", "shield-check", "timer"];

export function Commitments() {
  return (
    <section className="curve-t curve-b bg-soft py-20 md:py-24" aria-labelledby="commit-title">
      <div className="container-x">
        <SectionHeading
          id="commit-title"
          eyebrow="وعدنا لك"
          title="هذا ما ستجده عندنا في كل زيارة"
          lead="وعود صغيرة وواضحة نستطيع الوفاء بها، ونحاسب أنفسنا عليها."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {commitments.map((c, i) => {
            return (
              <Reveal as="li" key={c.title} delay={(i % 3) * 0.06} className="card lift-card group flex gap-4 p-5">
                <Icon3D name={ICONS[i % ICONS.length]} size={58} className="-mt-1 shrink-0 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]" />
                <div>
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-7 text-muted">{c.text}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
