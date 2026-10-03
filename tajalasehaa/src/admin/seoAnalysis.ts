/**
 * The SEO plugin's analysis (Yoast-style traffic lights), for articles,
 * programs and pages. Arabic-aware: it strips diacritics before matching.
 */

import { countAr } from "./count";

const nChars = (n: number) => countAr(n, "حرف واحد", "حرفان", "أحرف", "حرفًا", "حرف");
const nWords = (n: number) => countAr(n, "كلمة واحدة", "كلمتان", "كلمات", "كلمة");

export type Light = "good" | "ok" | "bad";
export type SeoCheck = { id: string; light: Light; text: string };

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي");

const words = (s: string) => s.split(/\s+/).filter(Boolean);

export function analyze(input: { title: string; description: string; focus: string; body: string; firstParagraph?: string; headings?: number; images?: number; hasCta?: boolean }): { checks: SeoCheck[]; score: Light } {
  const { title, description, body } = input;
  const focus = norm(input.focus.trim());
  const checks: SeoCheck[] = [];
  const add = (id: string, light: Light, text: string) => checks.push({ id, light, text });

  if (!focus) add("focus", "bad", "لم تحدد عبارة مفتاحية. اكتب ما سيبحث عنه المراجع، مثل «علاج خشونة الركبة».");
  else {
    add("focus-title", norm(title).includes(focus) ? "good" : "ok", norm(title).includes(focus) ? "العبارة المفتاحية في عنوان البحث." : "أضف العبارة المفتاحية إلى عنوان البحث.");
    add("focus-desc", norm(description).includes(focus) ? "good" : "ok", norm(description).includes(focus) ? "العبارة المفتاحية في الوصف." : "اذكر العبارة المفتاحية في الوصف.");
    if (input.firstParagraph !== undefined)
      add("focus-intro", norm(input.firstParagraph).includes(focus) ? "good" : "ok", norm(input.firstParagraph).includes(focus) ? "العبارة تظهر في أول فقرة." : "اذكر العبارة المفتاحية في أول فقرة.");
    const count = norm(body).split(focus).length - 1;
    const total = Math.max(1, words(body).length);
    const density = (count * words(focus).length * 100) / total;
    add("density", count === 0 ? "bad" : density > 3.5 ? "ok" : "good", count === 0 ? "العبارة المفتاحية لا تظهر في النص." : density > 3.5 ? `العبارة تتكرر كثيرًا (${count} مرات). قلّلها لتبدو طبيعية.` : `العبارة تظهر ${count} مرة في النص.`);
  }

  const tl = title.length;
  add("title-len", tl === 0 ? "bad" : tl < 30 ? "ok" : tl <= 60 ? "good" : "ok", tl === 0 ? "لا يوجد عنوان للبحث." : tl < 30 ? `عنوان البحث قصير (${nChars(tl)}). استفد من 60 حرفًا.` : tl <= 60 ? `طول عنوان البحث مناسب (${nChars(tl)}).` : `عنوان البحث طويل (${nChars(tl)}) وقد يُقص في Google.`);
  const dl = description.length;
  add("desc-len", dl === 0 ? "bad" : dl < 70 ? "ok" : dl <= 160 ? "good" : "ok", dl === 0 ? "لا يوجد وصف. سيختار Google نصًا من الصفحة." : dl < 70 ? `الوصف قصير (${nChars(dl)}).` : dl <= 160 ? `طول الوصف مناسب (${nChars(dl)}).` : `الوصف طويل (${nChars(dl)}) وسيُقص.`);

  const n = words(body).length;
  add("length", n >= 300 ? "good" : n >= 150 ? "ok" : "bad", n >= 300 ? `طول المحتوى جيد (${nWords(n)}).` : `المحتوى قصير (${nWords(n)}). 300 كلمة على الأقل تساعد الصفحة على الظهور.`);
  if (input.headings !== undefined) add("headings", input.headings >= 2 ? "good" : "ok", input.headings >= 2 ? "العناوين الفرعية تقسّم النص جيدًا." : "أضف عناوين فرعية تسهّل القراءة على الجوال.");
  const sentences = body.split(/[.!؟?\n]+/).map((s) => words(s).length).filter(Boolean);
  const long = sentences.filter((x) => x > 25).length;
  if (sentences.length) add("sentences", long / sentences.length > 0.25 ? "ok" : "good", long / sentences.length > 0.25 ? `${long} جمل طويلة (أكثر من 25 كلمة). قسّمها.` : "الجمل قصيرة وسهلة.");
  if (input.hasCta !== undefined) add("cta", input.hasCta ? "good" : "ok", input.hasCta ? "في المقال زر حجز." : "أضف زر «احجز تقييمك» في آخر المقال.");

  const bad = checks.filter((c) => c.light === "bad").length;
  const ok = checks.filter((c) => c.light === "ok").length;
  return { checks, score: bad ? "bad" : ok > 2 ? "ok" : "good" };
}

export const LIGHT_LABEL: Record<Light, string> = { good: "جيد", ok: "يحتاج تحسينًا", bad: "ضعيف" };
export const LIGHT_DOT: Record<Light, string> = { good: "bg-brand-500", ok: "bg-[#e0a33a]", bad: "bg-coral-500" };
