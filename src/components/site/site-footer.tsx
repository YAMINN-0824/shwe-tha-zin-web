import type { Dictionary } from "@/i18n/dictionaries/ja";
import { OrchidMark } from "./orchid-mark";
import { Phrases } from "./phrases";

export function SiteFooter({
  footer,
  shop,
}: {
  footer: Dictionary["footer"];
  shop: Dictionary["shop"];
}) {
  const items = [
    { label: footer.addressLabel, lines: shop.address },
    { label: footer.hoursLabel, lines: [shop.hours, shop.closed] },
    { label: footer.phoneLabel, lines: [shop.phone] },
  ];

  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1fr_2fr] md:py-20">
        <div className="flex items-center gap-3">
          <OrchidMark className="size-11 text-ivory/80" />
          <span className="font-heading text-xl font-medium tracking-[0.14em]">
            SHWE THA ZIN
          </span>
        </div>
        <dl className="grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <dt className="text-sm text-gold">{item.label}</dt>
              {item.lines.map((line) => (
                <dd key={line} className="text-sm leading-relaxed text-ivory/90">
                  <Phrases>{line}</Phrases>
                </dd>
              ))}
            </div>
          ))}
        </dl>
      </div>
      <p className="mx-auto max-w-6xl border-t border-ivory/10 px-5 py-6 text-xs text-ivory/60">
        © SHWE THA ZIN
      </p>
    </footer>
  );
}
