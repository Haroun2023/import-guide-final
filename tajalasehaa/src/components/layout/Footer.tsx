import { Clock, MapPin, Phone } from "lucide-react";
import { site, telLink } from "@/config/site";
import { trackContact } from "@/lib/tracking";
import { InstagramIcon, SnapchatIcon, TikTokIcon, WhatsAppIcon, XIcon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { WhatsAppLink } from "./ContactLinks";

const SOCIAL = [
  { key: "instagram", label: "إنستغرام", Icon: InstagramIcon },
  { key: "snapchat", label: "سناب شات", Icon: SnapchatIcon },
  { key: "tiktok", label: "تيك توك", Icon: TikTokIcon },
  { key: "x", label: "إكس", Icon: XIcon },
] as const;

export function Footer() {
  const socials = SOCIAL.filter((s) => site.social[s.key]);
  return (
    <footer className="relative overflow-hidden bg-deep text-white/75 grain">
      <div className="hairline-leaf opacity-60" />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <Logo tone="light" variant="stacked" className="h-28" />
          <p className="mt-5 max-w-sm leading-8">
            «{site.proverb}»
            <br />
            {site.fullName} في {site.city} — امتداد لخبرة {site.partner.name} ({site.partner.nameAr}) في {site.partner.country}.
          </p>
          {socials.length ? (
            <ul className="mt-6 flex gap-2">
              {socials.map(({ key, label, Icon }) => (
                <li key={key}>
                  <a href={site.social[key]} target="_blank" rel="noopener" aria-label={label} className="grid size-11 place-items-center rounded-full bg-white/8 ring-1 ring-white/15 hover:bg-white/15">
                    <Icon size={19} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <nav aria-label="روابط سريعة">
          <h2 className="text-sm font-semibold text-leaf-300">روابط سريعة</h2>
          <ul className="mt-4 grid gap-2.5">
            {[
              ["/#pain-map", "أين يؤلمك؟"],
              ["/#programs", "البرامج العلاجية"],
              ["/#devices", "التقنيات والأجهزة"],
              ["/#journey", "رحلة التعافي"],
              ["/#visit", "موقعنا وصور المركز"],
              ["/#faq", "الأسئلة الشائعة"],
              ["/privacy", "سياسة الخصوصية"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="hover:text-white">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-leaf-300">تواصل وزيارة</h2>
          <ul className="mt-4 grid gap-3.5">
            <li>
              <a href={telLink()} onClick={() => trackContact("call", "footer")} className="flex items-center gap-3 hover:text-white">
                <Phone size={18} className="text-leaf-400" aria-hidden />
                <span dir="ltr" className="tabular">{site.contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <WhatsAppLink placement="footer" className="flex items-center gap-3 hover:text-white">
                <WhatsAppIcon size={18} className="text-leaf-400" /> واتساب مباشر
              </WhatsAppLink>
            </li>
            {site.branches.map((b) => (
              <li key={b.id}>
                <a href={b.mapsUrl} target="_blank" rel="noopener" className="flex items-start gap-3 hover:text-white">
                  <MapPin size={18} className="mt-1 shrink-0 text-leaf-400" aria-hidden />
                  <span>
                    {b.name} — {b.address}
                  </span>
                </a>
              </li>
            ))}
            <li className="flex items-start gap-3">
              <Clock size={18} className="mt-1 shrink-0 text-leaf-400" aria-hidden />
              <span>
                {site.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>
            © {new Date().getFullYear()} {site.fullName}. جميع الحقوق محفوظة.
          </p>
          {site.license.moh ? <p>{site.license.moh}</p> : null}
        </div>
      </div>
    </footer>
  );
}
