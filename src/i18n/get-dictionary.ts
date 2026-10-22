import { notFound } from "next/navigation";
import { lang } from "next/root-params";
import { hasLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/ja";

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ja: () => import("./dictionaries/ja").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
};

// URL の言語（/ja, /en）を読む。ちがう値なら 404
export async function getLocale(): Promise<Locale> {
  // /admin のように [lang] の外のページでは undefined になる
  const value = await lang();
  if (value === undefined || !hasLocale(value)) {
    notFound();
  }
  return value;
}

// いまの言語の文章を返す（Server Component で使う）
export async function getDictionary(): Promise<Dictionary> {
  return dictionaries[await getLocale()]();
}
