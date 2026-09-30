import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileCTABar } from "@/components/layout/MobileCTABar";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { About } from "@/components/sections/About";
import { BookingSection } from "@/components/sections/BookingSection";
import { Commitments } from "@/components/sections/Commitments";
import { DeviceLab } from "@/components/sections/DeviceLab";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { InsuranceCheck } from "@/components/sections/InsuranceCheck";
import { Journey } from "@/components/sections/Journey";
import { Moments } from "@/components/sections/Moments";
import { PainMap } from "@/components/sections/PainMap";
import { Programs } from "@/components/sections/Programs";
import { Stories } from "@/components/sections/Stories";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Visit } from "@/components/sections/Visit";
import { showStories } from "@/config/content";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <TrustStrip />
        <Moments />
        <PainMap />
        <Programs />
        <DeviceLab />
        <Journey />
        <Commitments />
        {showStories ? <Stories /> : null}
        <About />
        <Visit />
        <InsuranceCheck />
        <FAQ />
        <BookingSection />
      </main>
      <Footer />
      <MobileCTABar />
      <WhatsAppFab />
    </>
  );
}
