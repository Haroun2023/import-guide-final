import { display } from "@/config/copy";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { WhatsAppLink } from "./ContactLinks";

/** Floating WhatsApp button on tablets/desktops (phones use the sticky CTA bar). */
export function WhatsAppFab() {
  if (!display.whatsappFab) return null;
  return (
    <WhatsAppLink
      placement="fab"
      message={display.whatsappMessage || undefined}
      className={`float-cta fixed bottom-6 z-40 hidden size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgb(18_140_74/0.8)] transition-[transform,opacity,translate] duration-300 hover:scale-105 md:grid ${display.whatsappSide === "start" ? "start-6" : "end-6"}`}
    >
      <WhatsAppIcon size={28} />
      <span className="sr-only">تواصل معنا عبر واتساب</span>
    </WhatsAppLink>
  );
}
