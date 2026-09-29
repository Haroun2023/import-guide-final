/**
 * Phone helpers for Saudi + international visitors (Umrah pilgrims often use
 * foreign numbers). Accepts Arabic-Indic and Persian digits typed on Arabic
 * keyboards.
 */

const DIGIT_MAP: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
};

export function toLatinDigits(input: string) {
  return input.replace(/[٠-٩۰-۹]/g, (d) => DIGIT_MAP[d] ?? d);
}

export type ParsedPhone =
  | { valid: true; e164: string; national: boolean }
  | { valid: false };

/**
 * Normalises to E.164.
 * - Saudi mobiles: 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX, 009665XXXXXXXX
 * - International: must start with + or 00 (8–15 digits in total)
 */
export function parsePhone(raw: string): ParsedPhone {
  const latin = toLatinDigits(raw).trim();
  const hasPlus = latin.startsWith("+");
  let digits = latin.replace(/\D/g, "");
  if (!digits) return { valid: false };

  let international = hasPlus;
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
    international = true;
  }

  if (international) {
    if (digits.startsWith("966")) {
      const local = digits.slice(3).replace(/^0/, "");
      return /^5\d{8}$/.test(local) ? { valid: true, e164: `+966${local}`, national: true } : { valid: false };
    }
    return /^[1-9]\d{7,14}$/.test(digits) ? { valid: true, e164: `+${digits}`, national: false } : { valid: false };
  }

  if (digits.startsWith("966")) digits = digits.slice(3);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return /^5\d{8}$/.test(digits) ? { valid: true, e164: `+966${digits}`, national: true } : { valid: false };
}

/** Light formatting while typing a Saudi number: 05X XXX XXXX */
export function formatPhoneInput(raw: string) {
  const latin = toLatinDigits(raw);
  if (/^\s*(\+|00)/.test(latin)) return latin.replace(/[^\d+\s]/g, "");
  const all = latin.replace(/\D/g, "");
  if (all.startsWith("966")) return all.slice(0, 12);
  const d = all.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)} ${d.slice(3)}`;
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`;
}
