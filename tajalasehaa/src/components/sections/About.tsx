import { team } from "@/config/content";
import { site } from "@/config/site";
import { CrownMark } from "@/components/ui/Icons";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

/** Kuala Lumpur → Madinah arc: the Healife story in one picture. */
function RouteArt() {
  return (
    <svg viewBox="0 0 420 260" className="h-auto w-full" role="img" aria-label={`من ${site.partner.country} إلى ${site.city}`}>
      <defs>
        <linearGradient id="route" x1="1" x2="0">
          <stop offset="0" stopColor="#45d6bf" />
          <stop offset="1" stopColor="#d4af5c" />
        </linearGradient>
      </defs>
      {Array.from({ length: 9 }, (_, r) =>
        Array.from({ length: 16 }, (_, c) => <circle key={`${r}-${c}`} cx={20 + c * 25} cy={30 + r * 25} r="1.3" fill="#ffffff" opacity="0.14" />),
      )}
      <path d="M360 190 C 300 40, 140 40, 70 120" fill="none" stroke="url(#route)" strokeWidth="3" strokeDasharray="7 8" />
      <g transform="translate(360 190)">
        <circle r="18" fill="#45d6bf" opacity="0.18" />
        <circle r="7" fill="#45d6bf" />
        <text y="38" textAnchor="middle" fill="#cfe9e4" fontSize="15" fontWeight="600">
          كوالالمبور
        </text>
      </g>
      <g transform="translate(70 120)">
        <circle r="22" fill="#d4af5c" opacity="0.2" />
        <circle r="8" fill="#d4af5c" />
        <text y="42" textAnchor="middle" fill="#f3e2b0" fontSize="15" fontWeight="600">
          {site.city}
        </text>
      </g>
    </svg>
  );
}

export function About() {
  return (
    <section id="about" className="py-20 md:py-28" aria-labelledby="about-title">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            id="about-title"
            eyebrow="قصتنا"
            title={
              <>
                من {site.partner.country}… <span className="text-gold-600">إلى {site.city}</span>
              </>
            }
          />
          <Reveal>
            <p className="lead-text mt-5">
              {site.name} هو الفرع السعودي لمجموعة {site.partner.name} ({site.partner.nameAr}) للرعاية المتكاملة. نجمع بين العلاج الطبيعي القائم على الدليل العلمي، والتقنيات
              الحديثة، ورعاية إنسانية تهتم بك كشخص لا كحالة.
            </p>
            <p className="mt-4 leading-8 text-muted">
              اسمنا مستوحى من المثل «الصحة تاج على رؤوس الأصحاء لا يراه إلا المرضى» — ومهمتنا أن نساعدك على استعادة هذا التاج: حركة بلا ألم، واستقلالية، وثقة في جسدك.
            </p>
          </Reveal>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {team.map((m, i) => (
              <Reveal as="li" key={m.role} delay={i * 0.06} className="card flex items-start gap-3 p-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold-200 to-gold-400 text-base font-bold text-deep">
                  {m.name.replace("د. ", "").charAt(0)}
                </span>
                <div>
                  <p className="text-xs font-semibold text-brand-600">{m.role}</p>
                  <p className="font-bold">{m.name}</p>
                  <p className="mt-1 text-sm leading-6 text-muted">{m.focus}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal className="grain relative overflow-hidden rounded-[2rem] bg-deep-radial p-8 text-white">
          <div className="flex items-center gap-3">
            <CrownMark size={44} />
            <div>
              <p className="font-bold">{site.name}</p>
              <p className="text-sm text-white/60">
                {site.partner.name} · {site.partner.country}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <RouteArt />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            {site.stats.slice(0, 2).map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/6 p-4 ring-1 ring-white/10">
                <p className="text-2xl font-bold text-gold-300 tabular">{s.value}</p>
                <p className="mt-1 text-sm text-white/65">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
