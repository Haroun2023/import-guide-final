import { ArrowLeft, ArrowRight, Check, Gift, LoaderCircle, Lock, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  complaintLabel,
  complaints,
  forWhomOptions,
  paymentOptions,
  therapistOptions,
  timeOptions,
} from "@/config/booking";
import { site, whatsappLink } from "@/config/site";
import { leadWhatsAppText, submitLead, type LeadInput } from "@/lib/lead";
import { formatPhoneInput, parsePhone } from "@/lib/phone";
import { readJSON, removeKey, writeJSON } from "@/lib/storage";
import { trackContact, trackEngagement, trackLead } from "@/lib/tracking";
import { WhatsAppIcon } from "@/components/ui/Icons";
import type { BookingPrefill } from "./BookingContext";

type Draft = {
  complaint: string;
  forWhom: string;
  mode: "clinic" | "home";
  time: string;
  therapist: string;
  payment: string;
  insurer: string;
  name: string;
  phone: string;
  consent: boolean;
  consentMarketing: boolean;
};

type StepId = "need" | "prefs" | "contact";

const DRAFT_KEY = "ta_booking_draft";
const STEP_LABELS: Record<StepId, string> = { need: "حالتك", prefs: "موعدك", contact: "بياناتك" };

function initialDraft(prefill?: BookingPrefill): Draft {
  return {
    complaint: prefill?.complaint ?? "",
    forWhom: "لنفسي",
    mode: prefill?.mode ?? "clinic",
    time: timeOptions[0],
    therapist: therapistOptions[0],
    payment: paymentOptions[0],
    insurer: "",
    name: "",
    phone: "",
    consent: false,
    consentMarketing: false,
  };
}

export function BookingWizard({
  prefill,
  variant = "full",
  onDone,
  title,
}: {
  prefill?: BookingPrefill;
  variant?: "full" | "quick";
  onDone?: () => void;
  title?: ReactNode;
}) {
  const steps: StepId[] = variant === "quick" ? ["need", "contact"] : ["need", "prefs", "contact"];
  const [data, setData] = useState<Draft>(() => initialDraft(prefill));
  const [stepIndex, setStepIndex] = useState(() => (prefill?.complaint ? 1 : 0));
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState<Partial<Record<"name" | "phone" | "consent" | "complaint", string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "failed">("idle");
  const [failedRef, setFailedRef] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const startedAt = useRef(0);
  const [, navigate] = useLocation();
  const uid = useId();
  const placement = prefill?.placement ?? "booking";

  // Restore an unsent draft (client only, after hydration). Explicit prefill wins.
  useEffect(() => {
    startedAt.current = Date.now();
    const saved = readJSON<Partial<Draft>>(DRAFT_KEY, "session");
    if (saved) {
      setData((d) => ({
        ...d,
        ...saved,
        complaint: prefill?.complaint ?? saved.complaint ?? d.complaint,
        mode: prefill?.mode ?? saved.mode ?? d.mode,
        consent: false,
        consentMarketing: false,
      }));
    }
  }, []);

  // Keep an unsent draft for this tab (consents are never persisted).
  useEffect(() => {
    const draft: Partial<Draft> = { ...data };
    delete draft.consent;
    delete draft.consentMarketing;
    writeJSON(DRAFT_KEY, draft, "session");
  }, [data]);

  const step = steps[stepIndex];
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => {
    setData((d) => ({ ...d, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const go = (to: number) => {
    setDirection(to > stepIndex ? 1 : -1);
    setStepIndex(Math.max(0, Math.min(steps.length - 1, to)));
    if (to > stepIndex) trackEngagement("booking_step", { step: steps[to] ?? "done", placement });
  };

  const next = () => {
    if (step === "need" && !data.complaint) {
      setErrors({ complaint: "اختر الأقرب لحالتك للمتابعة" });
      return;
    }
    go(stepIndex + 1);
  };

  const buildInput = (): LeadInput => {
    const parsed = parsePhone(data.phone);
    return {
      name: data.name.trim(),
      phone: parsed.valid ? parsed.e164 : data.phone,
      complaint: data.complaint || "other",
      complaintLabel: complaintLabel(data.complaint || "other"),
      forWhom: data.forWhom,
      mode: data.mode,
      time: data.time,
      therapist: data.therapist,
      payment: data.payment,
      insurer: data.payment === "تأمين طبي" ? data.insurer.trim() : "",
      consentMarketing: data.consentMarketing,
      placement,
    };
  };

  const submit = async () => {
    const e: typeof errors = {};
    if (data.name.trim().length < 2) e.name = "اكتب اسمك (حرفان على الأقل)";
    if (!parsePhone(data.phone).valid) e.phone = "أدخل رقم جوال صحيحًا مثل 05X XXX XXXX، أو رقمًا دوليًا يبدأ بـ +";
    if (!data.consent) e.consent = "الموافقة مطلوبة لنتمكن من التواصل معك";
    setErrors(e);
    if (Object.keys(e).length) {
      const firstId = e.name ? `${uid}-name` : e.phone ? `${uid}-phone` : `${uid}-consent`;
      document.getElementById(firstId)?.focus();
      return;
    }

    setStatus("sending");
    const input = buildInput();
    const result = await submitLead(input, { startedAt: startedAt.current, honeypot });
    if (result.ok) {
      trackLead(result.eventId, { source: placement });
      writeJSON(
        "ta_last_lead",
        { name: input.name, ref: result.ref, complaintLabel: input.complaintLabel, mode: input.mode, time: input.time, therapist: input.therapist, forWhom: input.forWhom },
        "session",
      );
      removeKey(DRAFT_KEY, "session");
      onDone?.();
      navigate("/thank-you");
    } else {
      setFailedRef(result.ref);
      setStatus("failed");
    }
  };

  if (status === "failed") {
    const input = buildInput();
    return (
      <div className="text-center" role="alert">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-leaf-100 text-leaf-700">
          <WhatsAppIcon size={26} />
        </div>
        <h3 className="mt-4 text-xl font-bold">أكمل طلبك عبر واتساب</h3>
        <p className="mt-2 text-muted">
          لم نتمكن من إرسال الطلب آليًا الآن. أرسل التفاصيل الجاهزة عبر واتساب وسنؤكد موعدك فورًا.
        </p>
        <div className="mt-6 grid gap-3">
          <a
            className="btn btn-whatsapp w-full"
            href={whatsappLink(leadWhatsAppText(input, failedRef))}
            target="_blank"
            rel="noopener"
            onClick={() => trackContact("whatsapp", `${placement}:fallback`)}
          >
            <WhatsAppIcon size={20} /> إرسال الطلب عبر واتساب
          </a>
          <button type="button" className="btn btn-ghost w-full" onClick={() => setStatus("idle")}>
            <RotateCcw size={18} aria-hidden /> إعادة المحاولة
          </button>
        </div>
        <p className="mt-4 text-xs text-muted tabular">رقم الطلب: {failedRef}</p>
      </div>
    );
  }

  return (
    <div>
      {title ? <div className="mb-5">{title}</div> : null}

      {site.offer.active ? (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-leaf-100 px-3 py-1.5 text-sm font-semibold text-leaf-700">
          <Gift size={16} aria-hidden /> {site.offer.label}
        </p>
      ) : null}

      {/* Progress */}
      <ol className="mb-6 flex items-center gap-2" aria-label="خطوات الحجز">
        {steps.map((s, i) => (
          <li key={s} className="flex flex-1 flex-col gap-1.5">
            <span
              className={`h-1.5 rounded-full transition-colors duration-500 ${i <= stepIndex ? "bg-brand-500" : "bg-mist-200"}`}
              aria-hidden
            />
            <span className={`text-xs font-medium ${i === stepIndex ? "text-brand-700" : "text-muted"}`} aria-current={i === stepIndex ? "step" : undefined}>
              {i < stepIndex ? <Check size={12} className="me-1 inline" aria-hidden /> : null}
              {STEP_LABELS[s]}
            </span>
          </li>
        ))}
      </ol>

      <div className="relative">
        <div key={step} className={direction > 0 ? "animate-[step-fwd_0.3s_cubic-bezier(0.2,0.7,0.2,1)]" : "animate-[step-back_0.3s_cubic-bezier(0.2,0.7,0.2,1)]"}>
          {step === "need" ? (
            <fieldset>
              <legend className="text-lg font-bold text-ink">ما الذي تحتاج المساعدة فيه؟</legend>
              <p className="mt-1 text-sm text-muted">اختر الأقرب لحالتك — يحدد الأخصائي التفاصيل في التقييم.</p>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {complaints.map((c) => (
                  <label
                    key={c.id}
                    className="chip cursor-pointer justify-center py-2.5 text-center text-[0.92rem] leading-snug has-checked:border-brand-700 has-checked:bg-brand-700 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-leaf-400"
                  >
                    <input
                      type="radio"
                      name={`${uid}-complaint`}
                      value={c.id}
                      checked={data.complaint === c.id}
                      onChange={() => {
                        set("complaint", c.id);
                        window.setTimeout(() => go(stepIndex + 1), 240);
                      }}
                      className="sr-only"
                    />
                    {c.label}
                  </label>
                ))}
              </div>
              {errors.complaint ? <p className="mt-3 text-sm text-coral-600">{errors.complaint}</p> : null}
            </fieldset>
          ) : null}

          {step === "prefs" ? (
            <div className="grid gap-5">
              <ChoiceGroup legend="لمن الحجز؟" name={`${uid}-who`} options={forWhomOptions} value={data.forWhom} onChange={(v) => set("forWhom", v)} cols="grid-cols-2 sm:grid-cols-4" />
              {site.features.homeVisits ? (
                <ChoiceGroup
                  legend="أين تفضّل الجلسات؟"
                  name={`${uid}-mode`}
                  options={["في المركز", "زيارة منزلية"]}
                  value={data.mode === "home" ? "زيارة منزلية" : "في المركز"}
                  onChange={(v) => set("mode", v === "زيارة منزلية" ? "home" : "clinic")}
                  cols="grid-cols-2"
                />
              ) : null}
              <ChoiceGroup legend="الوقت المفضّل" name={`${uid}-time`} options={timeOptions} value={data.time} onChange={(v) => set("time", v)} cols="grid-cols-2 sm:grid-cols-4" />
              <ChoiceGroup legend="تفضّل أخصائيًا أم أخصائية؟" name={`${uid}-therapist`} options={therapistOptions} value={data.therapist} onChange={(v) => set("therapist", v)} cols="grid-cols-3" />
              <ChoiceGroup legend="طريقة الدفع" name={`${uid}-pay`} options={paymentOptions} value={data.payment} onChange={(v) => set("payment", v)} cols="grid-cols-2" />
              {data.payment === "تأمين طبي" ? (
                <div>
                  <label htmlFor={`${uid}-insurer`} className="mb-1.5 block text-sm font-semibold">
                    شركة التأمين <span className="font-normal text-muted">(اختياري)</span>
                  </label>
                  <input
                    id={`${uid}-insurer`}
                    className="field"
                    value={data.insurer}
                    onChange={(e) => set("insurer", e.target.value)}
                    placeholder="مثال: بوبا، التعاونية…"
                    autoComplete="off"
                  />
                </div>
              ) : null}
            </div>
          ) : null}

          {step === "contact" ? (
            <div className="grid gap-4">
              {data.complaint ? (
                <p className="flex flex-wrap items-center gap-2 text-sm text-muted">
                  <span className="rounded-full bg-brand-50 px-3 py-1 font-semibold text-brand-700">{complaintLabel(data.complaint)}</span>
                  <button type="button" className="text-brand-700 underline underline-offset-4" onClick={() => go(0)}>
                    تغيير
                  </button>
                </p>
              ) : null}
              <div>
                <label htmlFor={`${uid}-name`} className="mb-1.5 block text-sm font-semibold">
                  الاسم
                </label>
                <input
                  id={`${uid}-name`}
                  className="field"
                  value={data.name}
                  onChange={(e) => set("name", e.target.value)}
                  autoComplete="name"
                  placeholder="اسمك الكريم"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? `${uid}-name-err` : undefined}
                />
                {errors.name ? <p id={`${uid}-name-err`} className="mt-1.5 text-sm text-coral-600">{errors.name}</p> : null}
              </div>
              <div>
                <label htmlFor={`${uid}-phone`} className="mb-1.5 block text-sm font-semibold">
                  رقم الجوال <span className="font-normal text-muted">(ونتواصل عبر واتساب أيضًا)</span>
                </label>
                <input
                  id={`${uid}-phone`}
                  className="field text-start tabular"
                  dir="ltr"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="05X XXX XXXX"
                  value={data.phone}
                  onChange={(e) => set("phone", formatPhoneInput(e.target.value))}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
                />
                {errors.phone ? <p id={`${uid}-phone-err`} className="mt-1.5 text-sm text-coral-600">{errors.phone}</p> : null}
              </div>

              {/* Honeypot — invisible to people, tempting to bots */}
              <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
                <label>
                  لا تملأ هذا الحقل
                  <input tabIndex={-1} autoComplete="off" name="website" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </label>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
                <input
                  id={`${uid}-consent`}
                  type="checkbox"
                  className="mt-1 size-5 shrink-0 accent-brand-600"
                  checked={data.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  aria-invalid={!!errors.consent}
                  aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
                />
                <span>
                  أوافق على معالجة بياناتي للتواصل معي بخصوص طلبي وفق{" "}
                  <a href="/privacy" target="_blank" className="font-semibold text-brand-700 underline underline-offset-4">
                    سياسة الخصوصية
                  </a>
                  .
                </span>
              </label>
              {errors.consent ? <p id={`${uid}-consent-err`} className="-mt-2 text-sm text-coral-600">{errors.consent}</p> : null}
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
                <input
                  type="checkbox"
                  className="mt-1 size-5 shrink-0 accent-brand-600"
                  checked={data.consentMarketing}
                  onChange={(e) => set("consentMarketing", e.target.checked)}
                />
                <span>(اختياري) أرغب باستلام نصائح صحية وعروض المركز، وأوافق على استخدام رقمي بشكل مشفّر لقياس فعالية الإعلانات.</span>
              </label>
            </div>
          ) : null}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center gap-3">
        {stepIndex > 0 ? (
          <button type="button" className="btn btn-ghost px-4" onClick={() => go(stepIndex - 1)} aria-label="الخطوة السابقة">
            <ArrowRight size={18} aria-hidden />
          </button>
        ) : null}
        {step === "contact" ? (
          <button type="button" className="btn btn-primary btn-shine flex-1" onClick={submit} disabled={status === "sending"}>
            {status === "sending" ? <LoaderCircle size={20} className="animate-spin" aria-hidden /> : <Check size={20} aria-hidden />}
            {status === "sending" ? "جارٍ الإرسال…" : "أرسل طلب الحجز"}
          </button>
        ) : (
          <button type="button" className="btn btn-primary flex-1" onClick={next}>
            التالي <ArrowLeft size={18} aria-hidden />
          </button>
        )}
      </div>

      {step === "contact" ? (
        <div className="mt-4 space-y-1.5 text-center text-xs text-muted">
          <p className="flex items-center justify-center gap-1.5">
            <Lock size={13} aria-hidden /> بياناتك سرّية وتُستخدم لتنسيق موعدك فقط.
          </p>
          <p>
            نتواصل معك خلال <strong className="text-ink">{site.responseTimeMinutes} دقيقة</strong> في أوقات العمل.
          </p>
        </div>
      ) : null}
    </div>
  );
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  cols,
}: {
  legend: string;
  name: string;
  options: readonly T[];
  value: string;
  onChange: (v: T) => void;
  cols: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-ink">{legend}</legend>
      <div className={`grid gap-2 ${cols}`}>
        {options.map((opt) => (
          <label
            key={opt}
            className="chip cursor-pointer justify-center px-2 py-2 text-center text-[0.9rem] has-checked:border-brand-700 has-checked:bg-brand-700 has-checked:text-white has-focus-visible:ring-2 has-focus-visible:ring-leaf-400"
          >
            <input type="radio" name={name} value={opt} checked={value === opt} onChange={() => onChange(opt)} className="sr-only" />
            {opt}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
