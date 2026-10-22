// サイトで使う言語。URL の最初の部分になる（/ja, /en）
export const locales = ["ja", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ja";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
