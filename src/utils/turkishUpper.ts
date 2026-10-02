/**
 * Converts any string into proper Turkish uppercase,
 * correctly handling dotted and dotless I's (i -> İ, ı -> I),
 * and special Turkish letters (ç, ğ, ö, ş, ü).
 */
export function toTurkishUpper(text: string): string {
  if (!text) return '';
  return text.trim().toLocaleUpperCase('tr-TR');
}
