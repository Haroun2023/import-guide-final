import { SiteLayout } from "@/components/layout/SiteLayout";
import { BookingSection } from "@/components/sections/BookingSection";
import { DeviceLab } from "@/components/sections/DeviceLab";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Moments } from "@/components/sections/Moments";
import { PainMap } from "@/components/sections/PainMap";
import { Programs } from "@/components/sections/Programs";
import { QuickPaths } from "@/components/sections/QuickPaths";
import { Stories } from "@/components/sections/Stories";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { VisitTeaser } from "@/components/sections/VisitTeaser";
import { showStories } from "@/config/content";

/** The overview: each block opens a deeper page (programs, devices, conditions, visit, FAQ). */
export default function Home() {
  return (
    <SiteLayout>
      <Hero />
      <TrustStrip />
      <QuickPaths />
      <Moments />
      <PainMap />
      <Programs />
      <DeviceLab variant="teaser" />
      <Journey />
      {showStories ? <Stories /> : null}
      <VisitTeaser />
      <FAQ limit={5} moreLink />
      <BookingSection />
    </SiteLayout>
  );
}
