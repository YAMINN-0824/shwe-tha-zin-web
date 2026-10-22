import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/ja";
import { cn } from "@/lib/utils";
import { LanguageSwitch } from "./language-switch";
import { MobileNav } from "./mobile-nav";
import { OrchidMark } from "./orchid-mark";

const linkClass =
  "rounded-sm text-forest/85 transition-colors duration-300 hover:text-forest focus-visible:outline-2 focus-visible:outline-ring";

export function SiteHeader({
  locale,
  nav,
}: {
  locale: Locale;
  nav: Dictionary["nav"];
}) {
  const links = [
    { href: `/${locale}#menu`, label: nav.menu },
    { href: `/${locale}#about`, label: nav.about },
  ];
  const reserveClass = cn(buttonVariants({ size: "lg" }), "px-4");

  return (
    <header className="relative z-10">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href={`/${locale}`}
          aria-label={`SHWE THA ZIN ${nav.home}`}
          className="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
        >
          <OrchidMark className="size-9 text-leaf" />
          <span className="font-heading text-lg font-medium tracking-[0.14em] whitespace-nowrap">
            SHWE THA ZIN
          </span>
        </Link>

        {/* PC */}
        <div className="hidden items-center gap-8 md:flex">
          <nav aria-label={nav.menu} className="flex items-center gap-7">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitch locale={locale} label={nav.language} />
          <Link href={`/${locale}#reservation`} className={reserveClass}>
            {nav.reserve}
          </Link>
        </div>

        {/* スマホ */}
        <MobileNav openLabel={nav.openMenu} closeLabel={nav.closeMenu}>
          <nav aria-label={nav.menu} className="flex flex-col">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(linkClass, "border-b border-border py-4 text-lg")}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <LanguageSwitch
            locale={locale}
            label={nav.language}
            className="mt-6 text-base"
          />
          <Link
            href={`/${locale}#reservation`}
            className={cn(reserveClass, "mt-8 w-full")}
          >
            {nav.reserve}
          </Link>
        </MobileNav>
      </div>
    </header>
  );
}
