import { Phone } from "lucide-react";
import type { ReactNode } from "react";
import { site, telLink, whatsappLink } from "@/config/site";
import { trackContact } from "@/lib/tracking";
import { WhatsAppIcon } from "@/components/ui/Icons";

const DEFAULT_WA_TEXT = `مرحبًا ${site.name}، أرغب بالاستفسار عن حجز موعد تقييم.`;

export function WhatsAppLink({
  placement,
  message = DEFAULT_WA_TEXT,
  className = "btn btn-whatsapp",
  children,
}: {
  placement: string;
  message?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={() => trackContact("whatsapp", placement)}
    >
      {children ?? (
        <>
          <WhatsAppIcon size={20} /> تواصل واتساب
        </>
      )}
    </a>
  );
}

export function CallLink({ placement, className = "btn btn-ghost", children }: { placement: string; className?: string; children?: ReactNode }) {
  return (
    <a href={telLink()} className={className} onClick={() => trackContact("call", placement)}>
      {children ?? (
        <>
          <Phone size={18} aria-hidden /> <span dir="ltr" className="tabular">{site.contact.phoneDisplay}</span>
        </>
      )}
    </a>
  );
}
