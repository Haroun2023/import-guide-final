/**
 * Arabic number agreement for counted nouns:
 * طلب واحد · طلبان · 3 طلبات · 11 طلبًا · 100 طلب.
 * Pass the phrases in the case the sentence needs (e.g. «طلبين» after a preposition).
 */
export function countAr(n: number, one: string, two: string, few: string, many: string, hundred = many) {
  if (n === 1) return one;
  if (n === 2) return two;
  const r = n % 100;
  if (r >= 3 && r <= 10) return `${n} ${few}`;
  if (r >= 11) return `${n} ${many}`;
  return n === 0 ? `0 ${few}` : `${n} ${hundred}`;
}

export const minutesAr = (n: number) => countAr(n, "دقيقة واحدة", "دقيقتين", "دقائق", "دقيقة");
export const attemptsAr = (n: number) => countAr(n, "محاولة واحدة", "محاولتين", "محاولات", "محاولة");
export const leadsAr = (n: number) => countAr(n, "طلب واحد", "طلبان", "طلبات", "طلبًا", "طلب");
