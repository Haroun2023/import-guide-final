import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileCTABar } from "./MobileCTABar";
import { WhatsAppFab } from "./WhatsAppFab";

/** Header + page + footer, with the sticky phone CTA and the WhatsApp button. */
export function SiteLayout({
  children,
  overDark = true,
  placement = "sticky-bar",
  complaint,
}: {
  children: ReactNode;
  /** the page starts with a dark hero (transparent header until scrolled) */
  overDark?: boolean;
  placement?: string;
  complaint?: string;
}) {
  return (
    <>
      <Header overDark={overDark} />
      <main id="main">{children}</main>
      <Footer />
      <MobileCTABar placement={placement} complaint={complaint} />
      <WhatsAppFab />
    </>
  );
}
