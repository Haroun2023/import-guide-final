import { ShieldCheck } from "lucide-react";
import { useId, useState } from "react";
import { site, whatsappLink } from "@/config/site";
import { trackContact } from "@/lib/tracking";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Reveal";

/** "Is my insurance accepted?" → a pre-filled WhatsApp question (eligibility-check pattern). */
export function InsuranceCheck() {
  const uid = useId();
  const [insurer, setInsurer] = useState("");
  const [tier, setTier] = useState("");
  const message = `مرحبًا ${site.name}، أرغب بالتحقق من تغطية التأمين.\nشركة التأمين: ${insurer || "—"}\nفئة البطاقة: ${tier || "—"}`;

  return (
    <section className="py-16 md:py-20" aria-labelledby="ins-title">
      <div className="container-x">
        <Reveal className="card grid gap-8 overflow-hidden p-6 md:grid-cols-[1fr_1.1fr] md:p-10">
          <div>
            <span className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
              <ShieldCheck size={24} aria-hidden />
            </span>
            <h2 id="ins-title" className="mt-4 text-2xl font-bold md:text-3xl">
              هل يغطي تأمينك جلساتك؟
            </h2>
            <p className="mt-3 leading-8 text-muted">
              أرسل اسم شركة التأمين وفئة بطاقتك، ونؤكد لك التغطية قبل موعدك — دون أي التزام.
            </p>
            {site.insurers.length ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {site.insurers.map((i) => (
                  <li key={i} className="rounded-full bg-mist-100 px-3 py-1.5 text-sm font-medium">
                    {i}
                  </li>
                ))}
              </ul>
            ) : null}
            {site.features.installments.length ? (
              <p className="mt-4 text-sm text-muted">التقسيط متاح عبر: {site.features.installments.join("، ")}</p>
            ) : null}
          </div>
          <form
            className="grid content-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              trackContact("whatsapp", "insurance-check");
              window.open(whatsappLink(message), "_blank", "noopener");
            }}
          >
            <label htmlFor={`${uid}-ins`} className="text-sm font-semibold">
              شركة التأمين
            </label>
            <input id={`${uid}-ins`} className="field" value={insurer} onChange={(e) => setInsurer(e.target.value)} placeholder="مثال: بوبا، التعاونية، ميدغلف…" />
            <label htmlFor={`${uid}-tier`} className="mt-1 text-sm font-semibold">
              فئة البطاقة <span className="font-normal text-muted">(اختياري)</span>
            </label>
            <input id={`${uid}-tier`} className="field" value={tier} onChange={(e) => setTier(e.target.value)} placeholder="مثال: VIP، A، B…" />
            <button type="submit" className="btn btn-whatsapp mt-2">
              <WhatsAppIcon size={20} /> تحقق من تغطيتي عبر واتساب
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
