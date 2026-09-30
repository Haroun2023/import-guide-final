import { ClipboardCheck, FileText, ShieldCheck, Timer, TrendingUp, UserRoundCheck } from "lucide-react";
import { commitments } from "@/config/content";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const ICONS = [ClipboardCheck, FileText, TrendingUp, UserRoundCheck, ShieldCheck, Timer];

export function Commitments() {
  return (
    <section className="bg-mist-100/70 py-20 md:py-24" aria-labelledby="commit-title">
      <div className="container-x">
        <SectionHeading id="commit-title" eyebrow="التزاماتنا" title="ما نعدك به… ونلتزم به في كل زيارة" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {commitments.map((c, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal as="li" key={c.title} delay={(i % 3) * 0.06} className="card flex gap-4 p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-navy-700 to-brand-600 text-white shadow-[0_8px_20px_-8px_rgb(12_132_86/0.6)]">
                  <Icon size={22} aria-hidden />
                </span>
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
