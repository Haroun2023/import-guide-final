import { SiteLayout } from "@/components/layout/SiteLayout";
import { BookingSection } from "@/components/sections/BookingSection";
import { ConditionsIndex } from "@/components/sections/ConditionsIndex";
import { CTABand } from "@/components/sections/CTABand";
import { PageHero } from "@/components/sections/PageHero";
import { PainMap } from "@/components/sections/PainMap";

export default function ConditionsPage() {
  return (
    <SiteLayout placement="conditions:sticky">
      <PageHero
        crumbs={[{ href: "/conditions", label: "أين يؤلمك؟" }]}
        eyebrow="ابدأ من موضع الألم"
        title={
          <>
            أين <span className="text-coral-400">يؤلمك</span>؟
          </>
        }
        lead="اضغط على موضع الألم في المجسّم، واقرأ ما نراه عادةً في هذه المنطقة وكيف نبدأ. وحين تكون جاهزًا، احجز تقييمك من نفس المكان."
        booking={{ placement: "conditions:hero" }}
        whatsappText="السلام عليكم، عندي ألم وأريد أن أعرف من أين أبدأ."
      />
      <PainMap heading="none" />
      <ConditionsIndex />
      <CTABand
        title="ألمك لا يشبه أي حالة هنا؟"
        text="كل جسم يختلف. صف لنا ما تشعر به على واتساب، أو احجز تقييمًا ونفهم السبب معك."
        booking={{ placement: "conditions:band", complaint: "other" }}
        icon="scan-search"
        whatsappText="السلام عليكم، سأصف لكم الألم الذي أشعر به:"
      />
      <BookingSection prefill={{ placement: "conditions:bottom" }} />
    </SiteLayout>
  );
}
