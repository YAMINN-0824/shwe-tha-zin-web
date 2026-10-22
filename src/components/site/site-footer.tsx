import type { Dictionary } from "@/i18n/dictionaries/ja";
import { OrchidMark } from "./orchid-mark";

export function SiteFooter({ footer }: { footer: Dictionary["footer"] }) {
  const items = [
    { label: footer.addressLabel, lines: [footer.address] },
    { label: footer.hoursLabel, lines: footer.hours },
    { label: footer.phoneLabel, lines: [footer.phone] },
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
        <dl className="grid gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <dt className="text-sm text-gold">{item.label}</dt>
              {item.lines.map((line) => (
                <dd key={line} className="text-sm leading-relaxed text-ivory/90">
                  {line}
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
