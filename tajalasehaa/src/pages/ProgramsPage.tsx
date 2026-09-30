import { SiteLayout } from "@/components/layout/SiteLayout";
import { BookingSection } from "@/components/sections/BookingSection";
import { CTABand } from "@/components/sections/CTABand";
import { PageHero } from "@/components/sections/PageHero";
import { Programs } from "@/components/sections/Programs";
import { Icon3D } from "@/components/ui/Icon3D";

export default function ProgramsPage() {
  return (
    <SiteLayout placement="programs:sticky">
      <PageHero
        crumbs={[{ href: "/programs", label: "البرامج" }]}
        eyebrow="البرامج العلاجية"
        title={
          <>
            برنامج يناسب حالتك،
            <br />
            <span className="text-gradient-leaf">وخطة تُكتب لك أنت</span>
          </>
        }
        lead="كل برنامج يبدأ بتقييم نفهم فيه سبب ألمك وما تريد العودة إليه. بعدها نضع معك خطة مكتوبة بعدد جلسات تقديري، ونراجعها كلما تقدّمت."
        booking={{ placement: "programs:hero" }}
        whatsappText="السلام عليكم، أريد أن أعرف أي برنامج يناسب حالتي."
        aside={
          <div className="relative mx-auto grid size-80 place-items-center">
            <div className="absolute inset-6 rounded-full bg-[radial-gradient(closest-side,rgb(90_206_144/0.28),transparent)]" aria-hidden />
            <Icon3D name="spine" size={170} className="absolute start-2 top-0 animate-[float_6s_ease-in-out_infinite] drop-shadow-[0_24px_30px_rgb(0_0_0/0.35)]" />
            <Icon3D name="bone" variant="light" size={150} className="absolute bottom-2 end-0 animate-[float_7s_ease-in-out_infinite] [animation-delay:-2s]" />
            <Icon3D name="footprints" variant="light" size={130} className="absolute bottom-6 start-10 animate-[float_8s_ease-in-out_infinite] [animation-delay:-4s]" />
          </div>
        }
      />
      <Programs layout="all" />
      <CTABand
        title="لست متأكدًا أي برنامج يناسبك؟"
        text="لا بأس، هذا طبيعي. احجز تقييمك، أو صف لنا حالتك على واتساب، ونرشدك إلى البداية الصحيحة."
        booking={{ placement: "programs:band" }}
        icon="scan-search"
        whatsappText="السلام عليكم، أريد مساعدة في اختيار البرنامج المناسب لحالتي."
      />
      <BookingSection prefill={{ placement: "programs:bottom" }} />
    </SiteLayout>
  );
}
