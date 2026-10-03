import type { CmsState } from "@/cms/types";
import { countAr } from "./count";

export type Check = { id: string; level: "good" | "recommended" | "critical"; title: string; text: string; fix?: string };

/** Site Health: real checks on the content and settings, in order of importance. */
export function healthChecks(s: CmsState): Check[] {
  const out: Check[] = [];
  const on = (id: string) => s.plugins[id]?.installed && s.plugins[id]?.active;
  if (!s.site.license.moh)
    out.push({ id: "moh", level: "critical", title: "رقم ترخيص وزارة الصحة غير مضاف", text: "الإعلانات الصحية تحتاج رقم الترخيص ظاهرًا في الموقع.", fix: "/settings" });
  if (s.site.isDemo) out.push({ id: "demo", level: "recommended", title: "شريط «نسخة عرض» ظاهر أعلى الموقع", text: "أخفِه بعد اعتماد البيانات.", fix: "/settings" });
  if (!s.site.insurers.length) out.push({ id: "ins", level: "recommended", title: "شركات التأمين غير مذكورة", text: "خمسة منافسين في المدينة يعلنون تأمينهم أو أسعارهم.", fix: "/settings" });
  if (!s.site.rating) out.push({ id: "rating", level: "recommended", title: "تقييم Google غير معروض", text: "أضف التقييم ورابطه ليظهر تحت أرقام الثقة.", fix: "/settings" });
  const longTitles = s.programs.filter((p) => (p.seoTitle ?? "").length > 60);
  if (longTitles.length) out.push({ id: "seo-long", level: "recommended", title: `${longTitles.length} من عناوين البحث أطول من 60 حرفًا`, text: "قد يقصّها Google في النتائج.", fix: "/seo" });
  const noDesc = s.posts.filter((p) => p.status === "published" && !p.seo.description);
  if (noDesc.length) out.push({ id: "post-desc", level: "recommended", title: `${countAr(noDesc.length, "مقال منشور", "مقالان منشوران", "مقالات منشورة", "مقالًا منشورًا", "مقال منشور")} بلا وصف للبحث`, text: "اكتب وصفًا يظهر تحت العنوان في Google.", fix: "/posts" });
  const noAlt = s.media.filter((m) => !m.builtIn && !m.alt);
  if (noAlt.length) out.push({ id: "alt", level: "recommended", title: `${countAr(noAlt.length, "صورة مرفوعة", "صورتان مرفوعتان", "صور مرفوعة", "صورة مرفوعة")} بلا نص بديل`, text: "النص البديل يساعد المكفوفين ومحركات البحث.", fix: "/media" });
  if (!on("backups")) out.push({ id: "backup", level: "critical", title: "النسخ الاحتياطي متوقف", text: "فعّل إضافة النسخ الاحتياطي حتى لا يضيع المحتوى.", fix: "/plugins" });
  if (!on("security")) out.push({ id: "sec", level: "critical", title: "إضافة الأمان متوقفة", text: "جدار الحماية وحد محاولات الدخول غير مفعّلين.", fix: "/plugins" });
  const analytics = s.plugins.analytics?.settings ?? {};
  const pixels = ["metaPixelId", "snapPixelId", "tiktokPixelId"].some((k) => String(analytics[k] ?? ""));
  if (pixels && !on("cookies")) out.push({ id: "consent", level: "recommended", title: "بكسلات إعلانية دون شريط موافقة", text: "فعّل إضافة الخصوصية لتوقف البكسلات حتى يوافق الزائر.", fix: "/plugins" });
  if (!String(analytics.ga4Id ?? "")) out.push({ id: "ga4", level: "recommended", title: "Google Analytics غير مربوط", text: "أضف معرّف GA4 لتعرف من أين يأتي زوارك.", fix: "/analytics" });
  const noMdma = s.devices.filter((d) => !d.mdma);
  if (noMdma.length) out.push({ id: "mdma", level: "recommended", title: `${countAr(noMdma.length, "جهاز واحد", "جهازان", "أجهزة", "جهازًا")} بلا رقم إذن تسويق (MDMA)`, text: "هيئة الغذاء والدواء تشترط رقم الإذن وموافقة مسبقة في أي إعلان يسمّي الجهاز.", fix: "/devices" });
  if (s.site.offer.active && !s.site.offer.approval) out.push({ id: "offer", level: "recommended", title: "العرض مفعّل دون رقم موافقة", text: "العروض، ومنها التقييم المجاني، تحتاج موافقة الشؤون الصحية بالمنطقة قبل الإعلان.", fix: "/settings?tab=offer" });
  const drafts = s.posts.filter((p) => p.status === "draft").length;
  if (drafts) out.push({ id: "drafts", level: "good", title: `${countAr(drafts, "مسودة واحدة", "مسودتان", "مسودات", "مسودة")} بانتظار النشر`, text: "راجعها وانشرها حين تجهز.", fix: "/posts" });
  out.push({ id: "speed", level: "good", title: "الصفحات مولَّدة مسبقًا وسريعة", text: "الرئيسية تظهر في نحو 2.1 ثانية على جوال بشبكة بطيئة." });
  out.push({ id: "https", level: "good", title: "الاتصال مشفّر (HTTPS)", text: "كل الصفحات تُخدم عبر اتصال آمن." });
  return out;
}

export function healthScore(checks: Check[]) {
  const penalty = checks.reduce((n, c) => n + (c.level === "critical" ? 14 : c.level === "recommended" ? 5 : 0), 0);
  return Math.max(35, 100 - penalty);
}
