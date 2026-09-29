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
    conditions: ["آلام وتيبّس الرقبة", "الانزلاق الغضروفي العنقي", "الصداع التوتري", "تنميل الذراعين"],
    insight: "ساعات الجوال والمكتب تضاعف الحمل على الرقبة — لذلك نعالج الوضعية المسبّبة لا الألم وحده.",
    program: "spine",
    devices: ["combo", "ems"],
  },
  {
    id: "shoulder",
    label: "الكتف",
    view: "front",
    conditions: ["الكتف المتجمّد", "التهاب أوتار الكتف", "تمزّق الكفة المدوّرة", "انحشار الكتف"],
    insight: "الألم الليلي وصعوبة رفع الذراع علامتان تستحقان التقييم مبكرًا قبل أن يتيبّس المفصل.",
    program: "joints",
    devices: ["shockwave", "combo"],
  },
  {
    id: "upperBack",
    label: "أعلى الظهر",
    view: "back",
    conditions: ["تشنّج عضلات الظهر", "آلام القوام والانحناء", "ألم بين الكتفين"],
    insight: "الجلوس الطويل وضعف عضلات الظهر العلوي يسببان ألمًا بين الكتفين يستجيب جيدًا للتمارين الموجّهة.",
    program: "spine",
    devices: ["combo", "ems"],
  },
  {
    id: "lowerBack",
    label: "أسفل الظهر",
    view: "back",
    conditions: ["الانزلاق الغضروفي القطني", "عرق النسا", "آلام أسفل الظهر المزمنة", "الشد العضلي"],
    insight: "أغلب حالات آلام أسفل الظهر تتحسن بالعلاج التحفّظي المنظّم — والتقييم الدقيق هو أول خطوة.",
    program: "spine",
    devices: ["combo", "antigravity"],
  },
  {
    id: "elbow",
    label: "المرفق",
    view: "front",
    conditions: ["مرفق التنس", "مرفق لاعب الجولف", "التهاب الأوتار"],
    insight: "ألم المرفق عند الإمساك أو رفع الأشياء كثيرًا ما يكون اعتلالًا في الأوتار يستجيب للتأهيل الموجّه.",
    program: "sports",
    devices: ["shockwave", "combo"],
  },
  {
    id: "wrist",
    label: "اليد والرسغ",
    view: "front",
    conditions: ["متلازمة النفق الرسغي", "التهاب أوتار الإبهام", "تيبّس ما بعد الكسور"],
    insight: "التنميل الليلي في الأصابع قد يكون علامة ضغط على العصب — والتدخل المبكر يصنع الفرق.",
    program: "postop",
    devices: ["combo"],
  },
  {
    id: "hip",
    label: "الورك",
    view: "front",
    conditions: ["آلام مفصل الورك", "التهاب الجراب", "التأهيل بعد تغيير المفصل"],
    insight: "ألم الورك قد ينتقل للفخذ أو الركبة — لذلك نقيّم سلسلة الحركة كاملة لا نقطة الألم فقط.",
    program: "joints",
    devices: ["antigravity", "combo"],
  },
  {
    id: "knee",
    label: "الركبة",
    view: "front",
    conditions: ["خشونة الركبة", "إصابة الرباط الصليبي", "الغضروف الهلالي", "آلام صابونة الركبة"],
    insight: "سواء كانت خشونة أو إصابة رباط، نقوّي العضلات الداعمة ونخفف الحمل عن المفصل تدريجيًا.",
    program: "joints",
    devices: ["antigravity", "shockwave", "ems"],
  },
  {
    id: "ankle",
    label: "الكاحل والقدم",
    view: "front",
    conditions: ["التواء الكاحل", "الشوك العظمي واللفافة الأخمصية", "التهاب وتر أكيلس"],
    insight: "ألم الخطوات الأولى صباحًا علامة شائعة لالتهاب اللفافة الأخمصية — ومن أكثر الحالات استجابة للموجات التصادمية.",
    program: "sports",
    devices: ["shockwave", "antigravity"],
  },
];

export const bodyAreaById = (id: BodyAreaId) => bodyAreas.find((a) => a.id === id)!;
