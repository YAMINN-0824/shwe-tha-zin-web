"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const labels: Record<Locale, { short: string; name: string }> = {
  ja: { short: "JA", name: "日本語" },
  en: { short: "EN", name: "English" },
};

// 今のページのまま、言語だけを変える（/ja/menu ⇄ /en/menu）
export function LanguageSwitch({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <nav aria-label={label} className={cn("flex items-center gap-1", className)}>
      {locales.map((target, index) => (
        <span key={target} className="flex items-center gap-1">
          {index > 0 && (
            <span aria-hidden="true" className="text-leaf/60">
              /
            </span>
          )}
          <Link
            href={rest ? `/${target}/${rest}` : `/${target}`}
            hrefLang={target}
            lang={target}
            aria-label={labels[target].name}
            aria-current={target === locale ? "true" : undefined}
            className={cn(
              "rounded-sm px-1 py-0.5 text-small tracking-wider transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-ring",
              target === locale
                ? "font-medium text-forest"
                : "text-leaf-deep hover:text-forest",
            )}
          >
            {labels[target].short}
          </Link>
        </span>
      ))}
    </nav>
  );
}
