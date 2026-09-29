/**
 * ملف إعدادات الموقع — كل بيانات المركز في مكان واحد.
 *
 * مصدر البيانات: نتائج محركات البحث للموقع الحالي tajalasehaa.sa (لم يكن
 * الوصول المباشر للموقع متاحًا وقت البناء). كل قيمة معلّمة بـ «تحقق» يجب
 * مراجعتها مع إدارة المركز، ثم اجعل `isDemo: false` ليختفي شريط «نسخة عرض».
 * شغّل `npm run check:content` قبل النشر.
 */

export type Branch = {
  id: string;
  name: string;
  city: string;
  address: string;
  mapsUrl: string;
  geo?: { lat: number; lng: number };
};

export type Stat = { value: string; label: string };

export const site = {
  /** يُظهر شريط «نسخة عرض». اجعلها false بعد مراجعة البيانات. */
  isDemo: true,

  url: "https://tajalasehaa.sa",
  name: "تاج الأصحاء",
  fullName: "مركز تاج الأصحاء للعلاج الطبيعي والتأهيل",
  nameEn: "Taj Al-Asehaa Physiotherapy & Rehabilitation",
  tagline: "علاج طبيعي وتأهيل طبي متكامل",
  city: "المدينة المنورة",
  /** مستوحى من المثل: «الصحة تاج على رؤوس الأصحاء لا يراه إلا المرضى» */
  proverb: "الصحة تاجٌ على رؤوس الأصحاء",
  /** الشراكة الدولية — تحقق من الصياغة المعتمدة */
  partner: { name: "Healife", nameAr: "هي لايف", country: "ماليزيا" },

  contact: {
    /** تحقق: الرقم ظاهر في نتائج البحث للموقع الحالي */
    phoneDisplay: "057 399 8384",
    phoneE164: "+966573998384",
    /** رقم واتساب بصيغة دولية أرقام فقط — تحقق */
    whatsapp: "966573998384",
    /** اتركه فارغًا ليُخفى — لم نعثر على بريد رسمي مؤكد */
    email: "",
  },

  /** الوعد بسرعة التواصل بعد إرسال الطلب (بالدقائق، خلال أوقات العمل). */
  responseTimeMinutes: 15,

  /** أوقات العمل — تحقق: وردت هكذا في النسخة الإنجليزية من الموقع وقد تكون منسوخة من فرع ماليزيا */
  hours: [
    { days: "الإثنين – السبت", time: "10:00 ص – 7:00 م" },
    { days: "الأحد", time: "مغلق" },
  ],
  /** بصيغة schema.org لمحركات البحث — عدّلها لتطابق الأوقات أعلاه */
  openingHoursSpec: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "19:00" },
  ],

  /** الفروع — تحقق: أضف العنوان الدقيق ورابط خرائط Google والإحداثيات */
  branches: [
    {
      id: "madinah",
      name: "فرع المدينة المنورة",
      city: "المدينة المنورة",
      address: "المدينة المنورة، المملكة العربية السعودية",
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=%D8%AA%D8%A7%D8%AC+%D8%A7%D9%84%D8%A3%D8%B5%D8%AD%D8%A7%D8%A1+%D8%A7%D9%84%D9%85%D8%AF%D9%8A%D9%86%D8%A9+%D8%A7%D9%84%D9%85%D9%86%D9%88%D8%B1%D8%A9",
    },
  ] as Branch[],

  /** التراخيص — ضع رقم ترخيص وزارة الصحة (إلزامي في الإعلانات الصحية) أو اتركه فارغًا ليُخفى */
  license: {
    moh: "",
    cbahi: false,
  },

  features: {
    /** أخصائيات لصحة المرأة — تحقق (المركز أعلن عن توظيف أخصائية صحة المرأة) */
    femaleTherapists: true,
    /** علاج طبيعي منزلي — مذكور في الموقع الحالي */
    homeVisits: true,
    /** خيارات التقسيط (مثل: تابي، تمارا) — اتركها فارغة إن لم تكن متاحة */
    installments: [] as string[],
  },

  /** شركات التأمين المتعاقد معها — ضعها عند توفرها؛ القائمة الفارغة تُظهر «استفسر عن تغطية تأمينك» */
  insurers: [] as string[],

  /** أرقام الثقة — ادعاءات واردة في الموقع الحالي (تحقق من دقتها قبل النشر) */
  stats: [
    { value: "+10", label: "سنوات خبرة دولية" },
    { value: "+5000", label: "مراجع سعيد" },
    { value: "2", label: "فرعان: السعودية وماليزيا" },
    { value: "الأول", label: "بجهاز AlterG في المدينة" },
  ] as Stat[],

  /** تقييم Google — ضع القيم الحقيقية أو اتركه null ليُخفى */
  rating: null as null | { value: number; count: number; source: string; url: string },

  /** عرض الحملة الحالي — ورد «تقييم مجاني لفترة محدودة» ضمن عروض الافتتاح. تحقق من سريانه. */
  offer: {
    active: true,
    label: "تقييم مجاني لفترة محدودة",
    note: "يشمل تقييمًا شاملًا وخطة علاج مكتوبة",
  },

  social: {
    instagram: "",
    snapchat: "",
    tiktok: "",
    x: "",
  },

  /**
   * معرّفات التتبع — ضعها لتفعيل البكسلات تلقائيًا (فارغ = معطّل).
   * يُفضّل أيضًا ضبط Conversions API على الخادم (انظر api/lead.ts و README).
   */
  tracking: {
    metaPixelId: "",
    snapPixelId: "",
    tiktokPixelId: "",
    ga4Id: "",
    googleAdsId: "",
    /** مثال: AW-123456789/AbCdEfGh — تسمية تحويل «Lead» في Google Ads */
    googleAdsLeadSendTo: "",
  },

  lead: {
    /** نقطة استقبال الطلبات (دالة Vercel المضمنة). */
    endpoint: "/api/lead",
    /** إن فشل الإرسال يُفتح واتساب برسالة جاهزة حتى لا يضيع الطلب. */
    fallbackToWhatsApp: true,
  },
};

export type Site = typeof site;

export function whatsappLink(message?: string) {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${site.contact.whatsapp}${text}`;
}

export function telLink() {
  return `tel:${site.contact.phoneE164}`;
}
