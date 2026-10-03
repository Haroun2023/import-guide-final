import type { BodyAreaId } from "./body";

/** خيارات نموذج الحجز متعدد الخطوات. */

export const complaints = [
  { id: "lowerBack", label: "أسفل الظهر والديسك" },
  { id: "neck", label: "الرقبة وأعلى الظهر" },
  { id: "shoulder", label: "الكتف" },
  { id: "knee", label: "الركبة" },
  { id: "hip", label: "الورك" },
  { id: "ankle", label: "القدم والكاحل" },
  { id: "elbow", label: "المرفق واليد" },
  { id: "sports", label: "إصابة رياضية" },
  { id: "postop", label: "تأهيل بعد عملية" },
  { id: "women", label: "صحة المرأة" },
  { id: "umrah", label: "رعاية المعتمرين والزوار" },
  { id: "wellness", label: "تغذية ولياقة ورعاية تكميلية" },
  { id: "other", label: "أخرى / لست متأكدًا" },
] as const;

export type ComplaintId = (typeof complaints)[number]["id"];

export const complaintLabel = (id: string) => complaints.find((c) => c.id === id)?.label ?? "أخرى";

export const areaToComplaint: Record<BodyAreaId, ComplaintId> = {
  neck: "neck",
  upperBack: "neck",
  lowerBack: "lowerBack",
  shoulder: "shoulder",
  elbow: "elbow",
  wrist: "elbow",
  hip: "hip",
  knee: "knee",
  ankle: "ankle",
};

export const programToComplaint: Record<string, ComplaintId> = {
  spine: "lowerBack",
  joints: "knee",
  sports: "sports",
  postop: "postop",
  umrah: "umrah",
  women: "women",
  home: "other",
  lymph: "wellness",
  nutrition: "wellness",
  body: "wellness",
  cupping: "wellness",
};

export const forWhomOptions = ["لنفسي", "لأحد والديّ", "لطفلي", "لشخص آخر"] as const;
export const timeOptions = ["أقرب موعد متاح", "صباحًا", "بعد الظهر", "مساءً"] as const;
export const therapistOptions = ["بدون تفضيل", "أخصائي", "أخصائية"] as const;
export const paymentOptions = ["دفع مباشر", "تأمين طبي"] as const;
