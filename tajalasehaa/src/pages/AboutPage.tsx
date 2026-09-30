import { site } from "@/config/site";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { About } from "@/components/sections/About";
import { BookingSection } from "@/components/sections/BookingSection";
import { Commitments } from "@/components/sections/Commitments";
import { Journey } from "@/components/sections/Journey";
import { PageHero } from "@/components/sections/PageHero";
import { VisitTeaser } from "@/components/sections/VisitTeaser";
import { Icon3D } from "@/components/ui/Icon3D";

export default function AboutPage() {
  return (
    <SiteLayout placement="about:sticky">
      <PageHero
        crumbs={[{ href: "/about", label: "من نحن" }]}
        eyebrow="قصتنا"
        title={`من ${site.partner.country}\n*إلى ${site.city}*`}
        lead={`${site.name} هو الفرع السعودي لمجموعة ${site.partner.name}. جئنا بخبرتها في الرعاية، وبنينا فريقًا يسمعك جيدًا قبل أن يعالجك.`}
        booking={{ placement: "about:hero" }}
        aside={
          <div className="relative mx-auto grid size-80 place-items-center">
            <div className="absolute inset-4 rounded-full bg-[radial-gradient(closest-side,rgb(90_206_144/0.3),transparent)]" aria-hidden />
            <Icon3D name="crown" variant="light" size={220} className="relative animate-[float_6s_ease-in-out_infinite]" />
          </div>
        }
      />
      <About heading={false} />
      <Commitments />
      <Journey />
      <VisitTeaser />
      <BookingSection prefill={{ placement: "about:bottom" }} />
    </SiteLayout>
  );
}
