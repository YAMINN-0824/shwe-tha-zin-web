import type { Dictionary } from "@/i18n/dictionaries/ja";
import { OrchidMark } from "./orchid-mark";
import { Phrases } from "./phrases";

export function SiteFooter({
  footer,
  shop,
  newTab,
}: {
  footer: Dictionary["footer"];
  shop: Dictionary["shop"];
  // 「（新しいタブで開きます）」（読み上げだけ）
  newTab: string;
}) {
  // お店の情報の帯と同じ内容（辞書の shop）
  const items = [
    { label: footer.addressLabel, lines: [shop.mapLink] },
    { label: footer.hoursLabel, lines: [shop.hours] },
    { label: footer.phoneLabel, lines: [shop.phone] },
  ];

  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1fr_2fr] md:py-20">
        <div className="flex items-center gap-3">
          <OrchidMark className="size-11 text-ivory/80" />
          <span className="font-heading text-h3 font-medium tracking-[0.14em]">
            SHWE THA ZIN
          </span>
        </div>
        <dl className="grid gap-8 sm:grid-cols-[1.5fr_1fr_1fr]">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col gap-2">
              <dt className="text-small text-gold">{item.label}</dt>
              {item.lines.map((line) => (
                <dd key={line} className="text-small text-ivory/90">
                  {/* 地図は Google マップへ（新しいタブ）。電話番号は、本当の番号（phoneHref）が入ったらリンクにする */}
                  {line === shop.mapLink ? (
                    <a
                      href={shop.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-sm decoration-ivory/40 underline-offset-[0.3em] hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-gold"
                    >
                      {line}
                      <span className="sr-only">{newTab}</span>
                    </a>
                  ) : line === shop.phone && shop.phoneHref ? (
                    <a
                      href={shop.phoneHref}
                      className="rounded-sm underline decoration-ivory/40 underline-offset-[0.3em] hover:decoration-ivory focus-visible:outline-2 focus-visible:outline-gold"
                    >
                      {line}
                    </a>
                  ) : (
                    <Phrases>{line}</Phrases>
                  )}
                </dd>
              ))}
            </div>
          ))}
        </dl>
      </div>
      <p className="mx-auto max-w-6xl border-t border-ivory/10 px-5 py-6 text-small text-ivory/60">
        © SHWE THA ZIN
      </p>
    </footer>
  );
}
