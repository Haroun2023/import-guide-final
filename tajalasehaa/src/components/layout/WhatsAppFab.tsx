import { WhatsAppIcon } from "@/components/ui/Icons";
import { WhatsAppLink } from "./ContactLinks";

/** Floating WhatsApp button on tablets/desktops (phones use the sticky CTA bar). */
export function WhatsAppFab() {
  return (
    <WhatsAppLink
      placement="fab"
      className="fixed bottom-6 end-6 z-40 hidden size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgb(18_140_74/0.8)] transition-transform hover:scale-105 md:grid"
    >
      <WhatsAppIcon size={28} />
      <span className="sr-only">تواصل معنا عبر واتساب</span>
    </WhatsAppLink>
  );
}
