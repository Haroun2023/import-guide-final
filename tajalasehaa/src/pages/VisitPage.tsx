import { Mail, Phone } from "lucide-react";
import { site, telLink } from "@/config/site";
import { trackContact } from "@/lib/tracking";
import { WhatsAppLink } from "@/components/layout/ContactLinks";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { BookingSection } from "@/components/sections/BookingSection";
import { InsuranceCheck } from "@/components/sections/InsuranceCheck";
import { PageHero } from "@/components/sections/PageHero";
import { Visit } from "@/components/sections/Visit";
import { InstagramIcon, TikTokIcon, WhatsAppIcon, XIcon } from "@/components/ui/Icons";
import { Icon3D } from "@/components/ui/Icon3D";
import { Reveal, SectionHeading } from "@/components/ui/Reveal";

/** Every way to reach the center, each one a single tap. */
function ContactCards() {
  const socials = [
    { key: "instagram", label: "إنستغرام", Icon: InstagramIcon },
    { key: "tiktok", label: "تيك توك", Icon: TikTokIcon },
    { key: "x", label: "إكس", Icon: XIcon },
  ] as const;
  return (
    <section className="curve-t curve-b bg-soft py-16 md:py-24" aria-labelledby="contact-title">
      <div className="container-x">
        <SectionHeading id="contact-title" eyebrow="تواصل معنا" title="اختر الطريقة التي تريحك" lead={`نرد على المكالمات والرسائل خلال ${site.responseTimeMinutes} دقيقة في أوقات العمل.`} />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal as="li" className="card lift-card group relative flex items-center gap-4 p-5">
            <Icon3D name="message-circle" size={60} className="shrink-0" />
            <div>
              <p className="text-lg font-bold">
                <WhatsAppLink placement="visit-page:card" className="after:absolute after:inset-0 after:content-['']">
                  واتساب
                </WhatsAppLink>
              </p>
              <p className="text-muted">أسرع طريقة لسؤال سريع أو لإرسال تقرير.</p>
            </div>
            <WhatsAppIcon size={22} className="ms-auto shrink-0 text-[#25d366]" />
          </Reveal>
          <Reveal as="li" delay={0.06} className="card lift-card group relative flex items-center gap-4 p-5">
            <Icon3D name="phone" size={60} className="shrink-0" />
            <div>
              <p className="text-lg font-bold">
                <a href={telLink()} onClick={() => trackContact("call", "visit-page:card")} className="after:absolute after:inset-0 after:content-['']">
                  اتصل بنا
                </a>
              </p>
              <p dir="ltr" className="text-end text-muted tabular">
                {site.contact.phoneDisplay}
              </p>
            </div>
            <Phone size={20} className="ms-auto shrink-0 text-brand-600" aria-hidden />
          </Reveal>
          {site.contact.email ? (
            <Reveal as="li" delay={0.12} className="card lift-card group relative flex items-center gap-4 p-5">
              <Icon3D name="calendar-check" size={60} className="shrink-0" />
              <div className="min-w-0">
                <p className="text-lg font-bold">
                  <a href={`mailto:${site.contact.email}`} className="after:absolute after:inset-0 after:content-['']">
                    البريد الإلكتروني
                  </a>
                </p>
                <p dir="ltr" className="truncate text-end text-muted">
                  {site.contact.email}
                </p>
              </div>
              <Mail size={20} className="ms-auto shrink-0 text-brand-600" aria-hidden />
            </Reveal>
          ) : null}
        </ul>
        {socials.some((s) => site.social[s.key]) ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <p className="text-sm text-muted">تابعنا:</p>
            {socials
              .filter((s) => site.social[s.key])
              .map(({ key, label, Icon }) => (
                <a key={key} href={site.social[key]} target="_blank" rel="noopener" className="btn btn-ghost min-h-11 px-4 text-sm">
                  <Icon size={17} /> {label}
                </a>
              ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default function VisitPage() {
  const branch = site.branches[0];
  return (
    <SiteLayout placement="visit:sticky">
      <PageHero
        crumbs={[{ href: "/visit", label: "زُر مركزنا" }]}
        eyebrow="زُر مركزنا"
        title={
          <>
            نحن في {branch?.district ? `حي ${branch.district}` : site.city}،
            <br />
            <span className="text-gradient-leaf">وبابنا مفتوح لك</span>
          </>
        }
        lead="العنوان والاتجاهات وأوقات العمل، وصور حقيقية من داخل المركز، وكل طرق التواصل معنا في صفحة واحدة."
        booking={{ placement: "visit:hero" }}
        aside={
          <div className="relative mx-auto grid size-80 place-items-center">
            <div className="absolute inset-4 rounded-full bg-[radial-gradient(closest-side,rgb(90_206_144/0.3),transparent)]" aria-hidden />
            <Icon3D name="map-pin" variant="light" size={210} className="relative animate-[float_6s_ease-in-out_infinite]" />
          </div>
        }
      />
      <Visit heading={false} />
      <ContactCards />
      <InsuranceCheck />
      <BookingSection prefill={{ placement: "visit:bottom" }} />
    </SiteLayout>
  );
}
