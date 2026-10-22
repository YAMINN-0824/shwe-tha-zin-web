import type { Metadata } from "next";
import { locales } from "@/i18n/config";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { fontVariables } from "../fonts";
import "../globals.css";

// /ja と /en を、ビルドのときに作っておく
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: { default: dict.meta.title, template: `%s | ${dict.meta.title}` },
    description: dict.meta.description,
  };
}

// お客さん用のページの共通部分（ヘッダーとフッター）
export default async function SiteLayout({ children }: LayoutProps<"/[lang]">) {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader locale={locale} nav={dict.nav} />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter footer={dict.footer} shop={dict.shop} />
      </body>
    </html>
  );
}
