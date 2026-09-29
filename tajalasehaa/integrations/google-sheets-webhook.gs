/**
 * Google Apps Script — استقبال طلبات الحجز في Google Sheets مع تنبيه بالبريد.
 *
 * الإعداد (5 دقائق):
 * 1) أنشئ Google Sheet جديدًا ← Extensions ← Apps Script ← الصق هذا الملف.
 * 2) غيّر SECRET إلى كلمة سر طويلة، وضع بريد الاستقبال في NOTIFY_EMAIL (اختياري).
 * 3) Deploy ← New deployment ← Web app
 *      Execute as: Me   |   Who has access: Anyone
 * 4) انسخ رابط Web app وضعه في Vercel كمتغير LEAD_WEBHOOK_URL،
 *    وضع كلمة السر نفسها في LEAD_WEBHOOK_SECRET ثم أعد النشر (Redeploy).
 *
 * ملاحظة امتثال: الطلبات تتضمن بيانات صحية (نوع الشكوى). قيّد صلاحيات
 * الوصول للملف على فريق الاستقبال فقط، وراجع متطلبات نظام حماية البيانات
 * الشخصية بشأن نقل البيانات خارج المملكة، أو استخدم نظام CRM مستضافًا محليًا.
 */

const SECRET = "change-me-to-a-long-random-secret";
const NOTIFY_EMAIL = ""; // مثال: reception@tajalasehaa.sa

const COLUMNS = [
  ["receivedAt", "وقت الاستلام"],
  ["ref", "رقم الطلب"],
  ["name", "الاسم"],
  ["phone", "الجوال"],
  ["complaint", "الحالة"],
  ["forWhom", "الحجز لـ"],
  ["mode", "نوع الخدمة"],
  ["time", "الوقت المفضل"],
  ["therapist", "تفضيل الأخصائي"],
  ["payment", "الدفع"],
  ["insurer", "شركة التأمين"],
  ["consentMarketing", "موافقة تسويقية"],
  ["placement", "موضع الحجز"],
  ["source", "المصدر"],
  ["utm_source", "utm_source"],
  ["utm_medium", "utm_medium"],
  ["utm_campaign", "utm_campaign"],
  ["utm_content", "utm_content"],
  ["utm_term", "utm_term"],
  ["click_id", "click_id"],
  ["landing", "صفحة الهبوط"],
  ["referrer", "المُحيل"],
  ["page", "الصفحة"],
  ["eventId", "event_id"],
];
const TEAM_COLUMNS = ["حالة المتابعة", "حجز مؤكد؟", "حضر؟", "ملاحظات الفريق"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (SECRET && data.secret !== SECRET) return json_({ ok: false, error: "unauthorized" });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS.map((c) => c[1]).concat(TEAM_COLUMNS));
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, COLUMNS.length + TEAM_COLUMNS.length).setFontWeight("bold");
    }

    const row = COLUMNS.map(([key]) => {
      const v = data[key];
      if (v === undefined || v === null) return "";
      // Keep phone numbers as text so "+966…" is not parsed as a number.
      return key === "phone" ? "'" + v : v;
    });
    sheet.appendRow(row.concat(["جديد", "", "", ""]));

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "طلب حجز جديد " + data.ref + " — " + (data.complaint || ""),
        [
          "الاسم: " + data.name,
          "الجوال: " + data.phone,
          "الحالة: " + data.complaint,
          "نوع الخدمة: " + data.mode,
          "الوقت المفضل: " + data.time,
          "المصدر: " + (data.source || "") + " " + (data.utm_campaign || ""),
          "",
          "اتصل خلال 5 دقائق — سرعة التواصل ترفع نسبة الحجز بشكل كبير.",
        ].join("\n"),
      );
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
