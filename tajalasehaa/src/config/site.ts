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
  /** Link that opens the branch's Google Maps listing (web + apps). */
  mapsUrl: string;
  /** Link that starts navigation to the branch in Google Maps. */
  directionsUrl?: string;
  street?: string;
  district?: string;
  postalCode?: string;
  plusCode?: string;
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
  tagline: "علاج طبيعي وتأهيل يبدأ بفهم حالتك",
  city: "المدينة المنورة",
  /** مستوحى من المثل: «الصحة تاج على رؤوس الأصحاء لا يراه إلا المرضى» */
  proverb: "الصحة تاجٌ على رؤوس الأصحاء",
  /** الشراكة الدولية — تحقق من الصياغة المعتمدة */
  partner: { name: "Healife", nameAr: "هي لايف", country: "ماليزيا" },

  contact: {
    /** الرقم المنشور في الموقع الحالي وفي قائمة المركز على خرائط Google */
    phoneDisplay: "057 399 8384",
    phoneE164: "+966573998384",
    /** رقم واتساب بصيغة دولية أرقام فقط — تحقق */
    whatsapp: "966573998384",
    /** البريد المنشور في الموقع الحالي — تحقق (اتركه فارغًا ليُخفى) */
    email: "info@healife-ksa.com",
  },

  /** الوعد بسرعة التواصل بعد إرسال الطلب (بالدقائق، خلال أوقات العمل). */
  responseTimeMinutes: 15,

  /**
   * أوقات العمل — كما في قائمة المركز على خرائط Google: 10:00 ص – 11:00 م
   * (أكّدتها إدارة المركز في 30 سبتمبر 2026). إن تغيّرت هناك فغيّرها هنا.
   */
  hours: [{ days: "يوميًا", time: "10:00 ص – 11:00 م" }],
  /** بصيغة schema.org لمحركات البحث — عدّلها لتطابق الأوقات أعلاه */
  openingHoursSpec: [
    { days: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "23:00" },
  ],

  /** الفروع — العنوان والإحداثيات ورابطا الخريطة من قائمة المركز في خرائط Google (place_id: ChIJ00E183GVvRUR0BmyT7Ls7O8) */
  branches: [
    {
      id: "madinah",
      name: "فرع المدينة المنورة",
      city: "المدينة المنورة",
      address: "طريق الملك عبدالله الفرعي، حي مهزور، المدينة المنورة 42319",
      street: "طريق الملك عبدالله الفرعي",
      district: "مهزور",
      postalCode: "42319",
      plusCode: "CMW8+7F",
      geo: { lat: 24.4456744, lng: 39.6661892 },
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=%D8%AA%D8%A7%D8%AC%20%D8%A7%D9%84%D8%A7%D8%B5%D8%AD%D8%A7%D8%A1&query_place_id=ChIJ00E183GVvRUR0BmyT7Ls7O8",
      directionsUrl:
        "https://www.google.com/maps/dir/?api=1&destination=%D8%AA%D8%A7%D8%AC%20%D8%A7%D9%84%D8%A7%D8%B5%D8%AD%D8%A7%D8%A1&destination_place_id=ChIJ00E183GVvRUR0BmyT7Ls7O8",
    },
  ] as Branch[],

  /** التراخيص — ضع رقم ترخيص وزارة الصحة (إلزامي في الإعلانات الصحية) أو اتركه فارغًا ليُخفى */
  license: {
    moh: "",
    cbahi: false,
  },

  features: {
    /** أخصائيات للسيدات ولصحة المرأة — أكّدته إدارة المركز */
    femaleTherapists: true,
    /** علاج طبيعي منزلي — مذكور في الموقع الحالي */
    homeVisits: true,
    /** خيارات التقسيط (مثل: تابي، تمارا) — اتركها فارغة إن لم تكن متاحة */
    installments: [] as string[],
  },

  /** شركات التأمين المتعاقد معها — ضعها عند توفرها؛ القائمة الفارغة تُظهر «استفسر عن تغطية تأمينك» */
  insurers: [] as string[],

  /**
   * أرقام الثقة — من الموقع الحالي. أكّدت الإدارة أن السنوات وعدد المراجعين
   * لمجموعة Healife كلها (السعودية وماليزيا)، فالعناوين تنسبها للمجموعة.
   */
  stats: [
    { value: "+10", label: "سنوات خبرة لمجموعتنا" },
    { value: "+5000", label: "مراجع خدمتهم مجموعتنا" },
    { value: "2", label: "فرعان: السعودية وماليزيا" },
    { value: "الأول", label: "بجهاز AlterG في المدينة" },
  ] as Stat[],

  /** تقييم Google — ضع القيم الحقيقية أو اتركه null ليُخفى */
  rating: null as null | { value: number; count: number; source: string; url: string },

  /** عرض الحملة الحالي — «تقييم مجاني لفترة محدودة»، معتمد مبدئيًا من الإدارة (سبتمبر 2026). أطفئه بـ active: false عند انتهائه. */
  offer: {
    active: true,
    label: "تقييمك مجاني لفترة محدودة",
    note: "نفحصك بعناية، وتخرج بخطة علاج مكتوبة",
  },

  /** من روابط تذييل الموقع الحالي — تحقق. اترك الحقل فارغًا ليُخفى. */
  social: {
    instagram: "https://www.instagram.com/tajalasehaa/",
    snapchat: "",
    tiktok: "https://www.tiktok.com/@tajalsehaa",
    x: "https://x.com/TajAlSehaa",
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
