import { Check, ClipboardList, MapPin, PhoneCall, Shirt } from "lucide-react";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/config/site";
import { leadWhatsAppText } from "@/lib/lead";
import { readJSON } from "@/lib/storage";
import { trackContact } from "@/lib/tracking";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppIcon } from "@/components/ui/Icons";

type LastLead = {
  name: string;
  ref: string;
  complaintLabel: string;
  mode: "clinic" | "home";
  time: string;
  therapist: string;
  forWhom: string;
};

/** /thank-you — also usable as a URL-based conversion page in ad platforms. */
export default function ThankYou() {
  const [lead, setLead] = useState<LastLead | null>(null);
  useEffect(() => setLead(readJSON<LastLead>("ta_last_lead", "session")), []);
  const firstName = lead?.name?.trim().split(/\s+/)[0];
  const branch = site.branches[0];

  const steps = [
    { icon: PhoneCall, title: "مكالمة تأكيد", text: `يتصل بك منسّق المرضى خلال ${site.responseTimeMinutes} دقيقة في أوقات العمل لاختيار الموعد.` },
    { icon: ClipboardList, title: "جهّز تقاريرك", text: "أحضر أي تقارير أو أشعة أو وصفات سابقة — تساعدنا على دقة التقييم." },
    { icon: Shirt, title: "ملابس مريحة", text: "ارتدِ ملابس رياضية تسمح بالحركة، ونوفّر ما يلزم لخصوصيتك." },
  ];

  return (
    <>
      <Header overDark={false} minimal />
      <main id="main" className="min-h-[80vh] bg-mist-50 pb-20 pt-32">
        <div className="container-x max-w-2xl text-center">
          <div className="mx-auto grid size-24 animate-rise place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white shadow-[var(--shadow-glow)]">
            <Check size={48} strokeWidth={2.5} aria-hidden />
          </div>
          <h1 className="mt-8 text-[clamp(1.8rem,1.3rem+2vw,2.6rem)] font-bold">
            شكرًا{firstName ? `، ${firstName}` : ""}! استلمنا طلبك
          </h1>
          <p className="lead-text mx-auto mt-3 max-w-lg">
            سيتواصل معك فريق {site.name} قريبًا لتأكيد موعد {lead?.complaintLabel ? `تقييم «${lead.complaintLabel}»` : "التقييم"}.
          </p>
          {lead?.ref ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm ring-1 ring-mist-200">
              رقم طلبك: <strong dir="ltr" className="tabular">{lead.ref}</strong>
            </p>
          ) : null}

          <div className="card mt-10 p-6 text-start">
            <h2 className="text-lg font-bold">تريد تأكيدًا أسرع؟</h2>
            <p className="mt-1 text-muted">أرسل طلبك الجاهز عبر واتساب وسنرد عليك مباشرة.</p>
            <a
              className="btn btn-whatsapp mt-4 w-full"
              href={whatsappLink(
                lead
                  ? leadWhatsAppText(lead, lead.ref)
                  : `مرحبًا ${site.name}، أرسلت طلب حجز عبر الموقع وأرغب بتأكيد الموعد.`,
              )}
              target="_blank"
              rel="noopener"
              onClick={() => trackContact("whatsapp", "thank-you")}
            >
              <WhatsAppIcon size={20} /> أكّد عبر واتساب
            </a>
          </div>

          <ol className="mt-8 grid gap-3 text-start">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="card flex items-start gap-4 p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon size={21} aria-hidden />
                </span>
                <div>
                  <p className="font-bold">
                    {i + 1}. {title}
                  </p>
                  <p className="mt-1 text-[0.95rem] leading-7 text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>

          {branch ? (
            <a href={branch.mapsUrl} target="_blank" rel="noopener" className="btn btn-ghost mt-8">
              <MapPin size={18} aria-hidden /> موقعنا على الخريطة
            </a>
          ) : null}
          <p className="mt-6">
            <a href="/" className="text-brand-700 underline underline-offset-4">
              العودة إلى الصفحة الرئيسية
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
