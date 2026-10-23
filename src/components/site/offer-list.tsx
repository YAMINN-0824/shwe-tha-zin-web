"use client";

import { Bike, CalendarHeart, ChefHat, type LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { OfferIcon } from "@/i18n/dictionaries/ja";
import { cn } from "@/lib/utils";

const icons: Record<OfferIcon, LucideIcon> = {
  events: CalendarHeart,
  special: ChefHat,
  delivery: Bike,
};

// 光った丸・アイコン・見出しの見た目（押したとき）
// Tailwind はコードの中の文字をそのまま読むので、クラス名は省略せずに書く
const ringLit =
  "border-gold bg-gold/15 shadow-[0_0_0_1px_var(--color-gold),0_0_18px_5px_rgb(217_169_46/0.45)]";
// 押していなくても、マウスをのせたとき（hover はマウスのある画面だけ）と、キーボードのフォーカスでも光る
const ringHoverOrFocus =
  "group-hover:border-gold group-hover:bg-gold/15 group-hover:shadow-[0_0_0_1px_var(--color-gold),0_0_18px_5px_rgb(217_169_46/0.45)] group-focus-visible:border-gold group-focus-visible:bg-gold/15 group-focus-visible:shadow-[0_0_0_1px_var(--color-gold),0_0_18px_5px_rgb(217_169_46/0.45)]";
const textLit = "text-gold-deep";
const textHoverOrFocus = "group-hover:text-gold-deep group-focus-visible:text-gold-deep";

// 「お店でできること」の 3 つ。1 つの箱に入れる（お店の情報の帯と同じ形）
// マウスをのせる・フォーカスする・押すと、アイコンの丸に、小さな明かりのような金の光がともる（DESIGN.md「お店でできること」）
// 押して光らせるのは 1 つだけ。もう一度押すと消える
export function OfferList({
  items,
}: {
  items: { icon: OfferIcon; title: string; body: ReactNode }[];
}) {
  const [lit, setLit] = useState<OfferIcon | null>(null);

  return (
    <ul className="mt-14 grid gap-1 rounded-[6px] border border-forest/15 p-2 md:mt-20 md:grid-cols-3">
      {items.map((item) => {
        const Icon = icons[item.icon];
        const on = lit === item.icon;
        // 光は 0.15 秒ですぐにつく。「動きを減らす」設定では、つく・消えるだけ
        const quick =
          "transition-[color,border-color,background-color,box-shadow] duration-150 motion-reduce:transition-none";
        return (
          <li key={item.icon}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => setLit(on ? null : item.icon)}
              className="group relative block w-full rounded-[4px] px-5 py-6 text-left focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-gold-deep focus-visible:outline-solid"
            >
              {/* アイコンの丸。光ると：ふちが濃く太い金（border ＋ ring で 2px）、まわりにやわらかい金の光、中はうすい金色 */}
              <span
                className={cn(
                  quick,
                  "relative flex size-14 items-center justify-center rounded-full border",
                  on ? ringLit : ["border-gold/50", ringHoverOrFocus],
                )}
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.25}
                  className={cn(quick, "size-6", on ? textLit : ["text-gold", textHoverOrFocus])}
                />
              </span>
              <span
                className={cn(
                  quick,
                  "relative mt-5 block font-heading text-xl leading-snug font-medium tracking-wide",
                  on ? textLit : textHoverOrFocus,
                )}
              >
                {item.title}
              </span>
              <span className="relative mt-2 block max-w-xs leading-relaxed text-forest-soft">
                {item.body}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
