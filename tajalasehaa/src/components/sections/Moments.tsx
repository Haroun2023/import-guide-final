import type { CSSProperties } from "react";
import { moments, type Moment } from "@/config/content";
import { Icon3D } from "@/components/ui/Icon3D";
import { Kinetic } from "@/components/ui/Kinetic";
import { Reveal } from "@/components/ui/Reveal";
import { RotatingWords } from "@/components/ui/RotatingWords";

const ICONS: Record<Moment["icon"], string> = {
  prayer: "prayer",
  walk: "footprints",
  car: "car",
  ball: "padel",
  family: "baby",
  desk: "laptop",
};

/** A soft color for each moment's ripples: mint, sky, sand, leaf, mist, sky. */
const TINTS = ["rgb(143 227 180 / 0.34)", "rgb(162 189 205 / 0.34)", "rgb(233 214 176 / 0.45)", "rgb(90 206 144 / 0.22)", "rgb(200 211 213 / 0.5)", "rgb(106 148 175 / 0.22)"];

/** What the title's last words cycle through, one moment at a time. */
const PHRASES = ["تفاصيل يومك التي تحبها", "ركوعك وسجودك براحة", "طريقك إلى المسجد النبوي", "ملعبك من جديد", "حمل أطفالك واللعب معهم", "يوم عملك كاملًا"];

export function Moments() {
  return (
    <section className="py-20 md:py-28" aria-labelledby="moments-title">
      <div className="container-x">
        <Reveal className="kinetic max-w-3xl">
          <p className="eyebrow">ما الذي نعمل من أجله؟</p>
          <h2 id="moments-title" className="h-section mt-3 text-ink">
            <Kinetic text="نريدك أن تعود إلى" />
            <br />
            <span className="kw" style={{ "--i": 4, "--hl-i": 4 } as CSSProperties}>
              <RotatingWords words={PHRASES} itemClassName="hl" />
            </span>
          </h2>
          <p className="lead-text mt-4">
            الألم يأخذ منك أشياء صغيرة: سجدة مريحة، ومشوارًا إلى الحرم، ولعبًا مع أطفالك. نكتب هذه التفاصيل أهدافًا في خطتك من أول زيارة.
          </p>
        </Reveal>
      </div>
      <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 pt-2 sm:px-6 md:container-x md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-6">
        {moments.map((m, i) => (
          <Reveal
            key={m.id}
            delay={i * 0.06}
            className="glow-card group relative w-[78%] shrink-0 snap-center overflow-hidden p-6 sm:w-[46%] md:w-auto"
            style={{ "--tint": TINTS[i % TINTS.length] } as CSSProperties}
          >
            <span className="ripples" aria-hidden />
            <Icon3D name={ICONS[m.icon]} size={72} className="relative -ms-1 drop-shadow-[0_14px_16px_rgb(16_40_58/0.18)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:rotate-[-5deg]" />
            <h3 className="relative mt-5 text-xl font-bold">{m.title}</h3>
            <p className="relative mt-2 leading-8 text-muted">{m.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
