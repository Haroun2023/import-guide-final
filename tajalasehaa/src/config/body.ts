import type { DeviceId } from "./devices";

/** مناطق «أين يؤلمك؟» على المجسّم ثلاثي الأبعاد. */
export type BodyAreaId =
  | "neck"
  | "shoulder"
  | "upperBack"
  | "lowerBack"
  | "elbow"
  | "wrist"
  | "hip"
  | "knee"
  | "ankle";

export type BodyArea = {
  id: BodyAreaId;
  label: string;
  /** الجهة التي يدور إليها المجسّم عند اختيار المنطقة */
  view: "front" | "back";
  conditions: string[];
  insight: string;
  program: string;
  devices: DeviceId[];
};

export const bodyAreas: BodyArea[] = [
  {
    id: "neck",
    label: "الرقبة",
    view: "back",
    conditions: ["ألم وتيبّس في الرقبة", "الانزلاق الغضروفي العنقي", "صداع يبدأ من الرقبة", "تنميل في الذراعين"],
    insight: "انحناء رأسك على الجوال أو الشاشة يحمّل رقبتك أكثر مما تتوقع. لذلك ننظر إلى جلستك وعاداتك اليومية، إلى جانب علاج الألم نفسه.",
    program: "spine",
    devices: ["stimawell", "combo"],
  },
  {
    id: "shoulder",
    label: "الكتف",
    view: "front",
    conditions: ["الكتف المتجمّد", "التهاب أوتار الكتف", "تمزّق الكفة المدوّرة", "ألم عند رفع الذراع"],
    insight: "ألم الكتف الذي يوقظك ليلًا، أو يمنعك من رفع ذراعك إلى الرف، يستحق تقييمًا مبكرًا. نفحص حركة الكتف كاملة، ثم نبدأ بما يريحه.",
    program: "joints",
    devices: ["shockwave", "combo"],
  },
  {
    id: "upperBack",
    label: "أعلى الظهر",
    view: "back",
    conditions: ["شدّ في عضلات الظهر", "انحناء الكتفين والظهر", "ألم بين الكتفين"],
    insight: "الألم بين الكتفين بعد يوم على المكتب أو خلف المقود يرتبط غالبًا بالجلسة وضعف عضلات أعلى الظهر. وكثيرًا ما تفيد فيه التمارين الموجّهة.",
    program: "spine",
    devices: ["stimawell", "combo"],
  },
  {
    id: "lowerBack",
    label: "أسفل الظهر",
    view: "back",
    conditions: ["الانزلاق الغضروفي القطني", "عرق النسا", "ألم أسفل الظهر المزمن", "شدّ عضلي مفاجئ"],
    insight: "كثير من آلام أسفل الظهر تتحسن مع العلاج الطبيعي والحركة المدروسة. ونبدأ معك بتقييم يوضح ما يناسب حالتك.",
    program: "spine",
    devices: ["stimawell", "combo", "antigravity"],
  },
  {
    id: "elbow",
    label: "المرفق",
    view: "front",
    conditions: ["مرفق التنس", "مرفق لاعب الجولف", "ألم المرفق عند الإمساك"],
    insight: "ألم المرفق حين تمسك المضرب أو تحمل أكياس التسوق يأتي غالبًا من الأوتار. وكثيرًا ما يستفيد من التأهيل الموجّه.",
    program: "sports",
    devices: ["shockwave", "ito"],
  },
  {
    id: "wrist",
    label: "اليد والرسغ",
    view: "front",
    conditions: ["متلازمة النفق الرسغي", "ألم أوتار الإبهام", "تيبّس اليد بعد الكسر"],
    insight: "تنميل الأصابع ليلًا قد يكون علامة ضغط على العصب في الرسغ. والتقييم المبكر يساعدنا على اختيار ما يناسبك.",
    program: "postop",
    devices: ["ito", "combo"],
  },
  {
    id: "hip",
    label: "الورك",
    view: "front",
    conditions: ["ألم مفصل الورك", "التهاب الجراب", "التأهيل بعد تغيير المفصل"],
    insight: "قد تشعر بألم الورك في الفخذ أو الركبة. لذلك نفحص طريقة مشيك وحركة الساق كاملة، من الظهر إلى القدم.",
    program: "joints",
    devices: ["antigravity", "combo"],
  },
  {
    id: "knee",
    label: "الركبة",
    view: "front",
    conditions: ["خشونة الركبة", "إصابة الرباط الصليبي", "إصابة الغضروف الهلالي", "ألم صابونة الركبة"],
    insight: "ركبتك تحمل وزنك في كل خطوة وسجدة. سواء كانت خشونة أو إصابة، نقوّي العضلات حولها ونخفف الحِمل عنها تدريجيًا.",
    program: "joints",
    devices: ["antigravity", "shockwave", "ito"],
  },
  {
    id: "ankle",
    label: "الكاحل والقدم",
    view: "front",
    conditions: ["التواء الكاحل", "الشوك العظمي وألم الكعب", "التهاب وتر أكيلس"],
    insight: "ألم الكعب في أول خطوات الصباح علامة شائعة لالتهاب اللفافة الأخمصية. وهو من الحالات التي نستخدم فيها الموجات التصادمية، ضمن خطة تمارين.",
    program: "sports",
    devices: ["shockwave", "antigravity"],
  },
];

export const bodyAreaById = (id: BodyAreaId) => bodyAreas.find((a) => a.id === id)!;
