import { showStories } from "./content";

/**
 * نصوص أقسام الصفحة الرئيسية وترتيبها — تُحرَّر من هنا أو من لوحة التحكم.
 * في العناوين: ضع *الكلمات* بين نجمتين لتمييزها، و\n لبدء سطر جديد.
 */

export type SectionCopy = { eyebrow: string; title: string; lead: string };

export const copy = {
  hero: {
    eyebrow: "«الصحة تاجٌ على رؤوس الأصحاء»",
    title: "الصحة تاج…\n*نستعيده معًا*",
    lead: "ألم الظهر أو الركبة لا ينبغي أن يصبح جزءًا من يومك. نبدأ بتقييم هادئ نفهم فيه سبب الألم، ثم نمشي معك بخطة مكتوبة وأجهزة حديثة، منها جهاز AlterG® للمشي بجزء من وزنك.",
    leadShort: "علاج طبيعي في {city} يبدأ بتقييم هادئ وخطة مكتوبة لك، مع أجهزة حديثة منها AlterG®.",
  },
  quickPaths: {
    eyebrow: "من أين تبدأ؟",
    title: "اختر ما *يشبه حالتك*",
    lead: "كل بطاقة تأخذك إلى صفحة تشرح خطوتك التالية بهدوء، ومنها تحجز تقييمك متى شئت.",
  },
  moments: {
    eyebrow: "ما الذي نعمل من أجله؟",
    title: "نريدك أن تعود إلى",
    lead: "الألم يأخذ منك أشياء صغيرة: سجدة مريحة، ومشوارًا إلى الحرم، ولعبًا مع أطفالك. نكتب هذه التفاصيل أهدافًا في خطتك من أول زيارة.",
    /** آخر العنوان يتبدّل بين هذه العبارات */
    phrases: ["تفاصيل يومك التي تحبها", "ركوعك وسجودك براحة", "طريقك إلى المسجد النبوي", "ملعبك من جديد", "حمل أطفالك واللعب معهم", "يوم عملك كاملًا"],
  },
  painMap: {
    eyebrow: "ابدأ من موضع الألم",
    title: "أين *يؤلمك*؟",
    lead: "اضغط على موضع الألم في المجسّم أو اختره من القائمة. ستجد الحالات التي نراها كثيرًا في هذه المنطقة، وكيف نبدأ معك.",
  },
  programs: {
    eyebrow: "البرامج العلاجية",
    title: "لكل حالة برنامج، *ولكل شخص خطته*",
    lead: "نبدأ دائمًا بالتأهيل الطبي، ونضيف الرعاية التكميلية فقط حين تخدم هدفك.",
  },
  devices: {
    eyebrow: "أجهزتنا",
    title: "تعرّف على أجهزتنا\n*قبل أن تزورنا*",
    lead: "هذه صور الأجهزة كما صنعتها شركاتها. أدِر الجهاز بإصبعك أو بالمؤشر، واضغط الأرقام لتعرف عمل كل جزء. الجهاز يساعدك، وخطتك تبدأ دائمًا من التقييم والتمارين.",
  },
  manifesto: {
    eyebrow: "طريقتنا في العلاج",
    /** الكلمات بين نجمتين تبقى بلون الهوية */
    text: "لا نبدأ بالجهاز، ولا بعدد الجلسات. *نبدأ بك:* بما يؤلمك، وبما تريد أن تعود إليه. نفحصك بهدوء، ونشرح لك ما وجدناه، ثم نكتب معك *خطة تعرفها من اليوم الأول،* ونمشي فيها معك *خطوة بخطوة.*",
  },
  journey: {
    eyebrow: "رحلة التعافي",
    title: "كيف تسير *رحلتك معنا*؟",
    lead: "تعرف من اليوم الأول ماذا سنفعل ولماذا. خطوات واضحة، وأهداف مكتوبة، ونراجع تقدّمك معك أولًا بأول.",
  },
  visit: {
    eyebrow: "زُر مركزنا",
    title: "مكان هادئ في {city}، وفريق ينتظرك",
    lead: "صالات انتظار مريحة، وخصوصية في غرف العلاج، واستقبال يرتّب معك كل شيء قبل أن تصل.",
  },
  faq: {
    eyebrow: "الأسئلة الشائعة",
    title: "أسئلة *نسمعها كثيرًا*",
    lead: "ما وجدت سؤالك؟ اكتب لنا على واتساب، ويرد عليك أحد أخصائيينا.",
  },
  booking: {
    eyebrow: "احجز تقييمك",
    title: "خذ الخطوة الأولى، *ونكمل الطريق معك*",
    lead: "اترك بياناتك في أقل من دقيقة، ويتصل بك منسّق المرضى خلال {response} دقيقة في أوقات العمل ليختار معك الموعد المناسب.",
  },
};

export type HomeSectionId =
  | "hero"
  | "trust"
  | "quickPaths"
  | "moments"
  | "marquee"
  | "painMap"
  | "programs"
  | "devices"
  | "manifesto"
  | "journey"
  | "visit"
  | "faq"
  | "booking";

/** ترتيب أقسام الرئيسية وظهورها (يعدّله «منشئ الصفحة» في لوحة التحكم). */
export const homeSections: { id: HomeSectionId; label: string; visible: boolean }[] = [
  { id: "hero", label: "الواجهة", visible: true },
  { id: "trust", label: "الأرقام وما يميزنا", visible: true },
  { id: "quickPaths", label: "من أين تبدأ؟", visible: true },
  { id: "moments", label: "لحظات الحياة", visible: true },
  { id: "marquee", label: "شريط الحالات", visible: true },
  { id: "painMap", label: "أين يؤلمك؟", visible: true },
  { id: "programs", label: "البرامج", visible: true },
  { id: "devices", label: "الأجهزة", visible: true },
  { id: "manifesto", label: "طريقتنا في العلاج", visible: true },
  { id: "journey", label: "رحلة التعافي", visible: true },
  { id: "visit", label: "زُر مركزنا", visible: true },
  { id: "faq", label: "الأسئلة الشائعة", visible: true },
  { id: "booking", label: "نموذج الحجز", visible: true },
];

/** Switches that lead the site to show or hide optional blocks (the CMS can flip them). */
export const display = {
  stories: showStories,
  /** the floating WhatsApp button (tablets and desktops) */
  whatsappFab: true,
  whatsappSide: "end" as "end" | "start",
  whatsappMessage: "",
};

/** Fills {response} and similar placeholders from the site settings. */
export const fill = (text: string, vars: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
