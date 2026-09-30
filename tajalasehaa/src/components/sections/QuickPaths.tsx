import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { site } from "@/config/site";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

const PATHS = [
  { href: "/conditions", icon: "scan-search", title: "عندي ألم ولا أعرف سببه", text: "حدّد موضع الألم على المجسّم، ونريك الحالات الشائعة فيه وكيف نبدأ معك." },
  { href: "/programs/postop", icon: "bandage", title: "أجريت عملية مؤخرًا", text: "برنامج على مراحل بالتنسيق مع جرّاحك، من أول خطوة بعد العملية." },
  { href: "/programs/sports", icon: "dumbbell", title: "إصابة في الملعب", text: "خطة تتدرج معك، واختبارات جاهزية قبل أن تعود إلى البادل أو الكرة." },
  { href: "/programs/umrah", icon: "footprints", title: "أنا زائر أو معتمر", text: "برنامج قصير يناسب أيام إقامتك في المدينة، وتمارين تكملها بعد عودتك." },
  { href: "/programs/women", icon: "heart-pulse", title: "آلام الحمل وما بعد الولادة", text: "رعاية مع أخصائيات، بخصوصية تامة وخطة تناسب مرحلتكِ." },
  { href: "/programs/home", icon: "house", title: "أحتاج العلاج في البيت", text: "لكبار السن ومن يصعب عليهم الحضور، بمواعيد تناسب الأسرة." },
];

/** Home: "where do I start?" — the six most common reasons people contact the center. */
export function QuickPaths() {
  const paths = site.features.homeVisits ? PATHS : PATHS.filter((p) => p.href !== "/programs/home");
  return (
    <section className="py-20 md:py-24" aria-labelledby="paths-title">
      <div className="container-x">
        <SectionHeading
          id="paths-title"
          eyebrow="من أين تبدأ؟"
          title="اختر ما *يشبه حالتك*"
          lead="كل بطاقة تأخذك إلى صفحة تشرح خطوتك التالية بهدوء، ومنها تحجز تقييمك متى شئت."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((p, i) => (
            <Reveal as="li" key={p.href} delay={(i % 3) * 0.06} className="glow-card group relative flex items-start gap-4 p-5">
              <Icon3D name={p.icon} size={64} className="shrink-0 drop-shadow-[0_10px_12px_rgb(16_40_58/0.16)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-[-6deg]" />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold">
                  <Link href={p.href} className="after:absolute after:inset-0 after:z-[2] after:rounded-[inherit] after:content-['']">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-1.5 text-[0.95rem] leading-7 text-muted">{p.text}</p>
              </div>
              <span className="arrow-dot mt-0.5" aria-hidden>
                <ArrowLeft size={16} />
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
