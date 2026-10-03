import { Fragment, type ReactNode } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BookingSection } from "@/components/sections/BookingSection";
import { ConditionsMarquee } from "@/components/sections/ConditionsMarquee";
import { DeviceLab } from "@/components/sections/DeviceLab";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Manifesto } from "@/components/sections/Manifesto";
import { Moments } from "@/components/sections/Moments";
import { PainMap } from "@/components/sections/PainMap";
import { Programs } from "@/components/sections/Programs";
import { QuickPaths } from "@/components/sections/QuickPaths";
import { Stories } from "@/components/sections/Stories";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { VisitTeaser } from "@/components/sections/VisitTeaser";
import { display, homeSections, type HomeSectionId } from "@/config/copy";

const SECTIONS: Record<HomeSectionId, () => ReactNode> = {
  hero: () => <Hero />,
  trust: () => <TrustStrip />,
  quickPaths: () => <QuickPaths />,
  moments: () => <Moments />,
  marquee: () => <ConditionsMarquee />,
  painMap: () => <PainMap />,
  programs: () => <Programs />,
  devices: () => <DeviceLab variant="teaser" />,
  manifesto: () => <Manifesto />,
  journey: () => (
    <>
      <Journey />
      {display.stories ? <Stories /> : null}
    </>
  ),
  visit: () => <VisitTeaser />,
  faq: () => <FAQ limit={5} moreLink />,
  booking: () => <BookingSection />,
};

/** The overview: each block opens a deeper page. Order and visibility come from config/copy.ts (the CMS page builder). */
export default function Home() {
  return (
    <SiteLayout>
      {homeSections
        .filter((s) => s.visible)
        .map((s) => (
          <Fragment key={s.id}>{SECTIONS[s.id]()}</Fragment>
        ))}
    </SiteLayout>
  );
}
