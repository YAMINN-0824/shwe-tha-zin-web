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

// 「お店でできること」の 3 つ。押すと、アイコンの丸に、小さな明かりのような金の光がともる（DESIGN.md「お店でできること」）
// 光るのは 1 つだけ。もう一度押すと消える
export function OfferList({
  items,
}: {
  items: { icon: OfferIcon; title: string; body: ReactNode }[];
}) {
  const [lit, setLit] = useState<OfferIcon | null>(null);

  // ボタンの内側の余白（px-5）のぶん、外にずらして、見出しと左をそろえる
  return (
    <ul className="-mx-5 mt-14 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-4">
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
              className="relative block w-full rounded-xl px-5 py-6 text-left focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-gold-deep focus-visible:outline-solid"
            >
              {/* アイコンの丸。光ると：ふちが濃く太い金（border ＋ ring で 2px）、まわりにやわらかい金の光、中はうすい金色 */}
              <span
                className={cn(
                  quick,
                  "relative flex size-14 items-center justify-center rounded-full border",
                  on
                    ? "border-gold bg-gold/15 shadow-[0_0_0_1px_var(--color-gold),0_0_18px_5px_rgb(217_169_46/0.45)]"
                    : "border-gold/50",
                )}
              >
                <Icon
                  aria-hidden="true"
                  strokeWidth={1.25}
                  className={cn(quick, "size-6", on ? "text-gold-deep" : "text-gold")}
                />
              </span>
              <span
                className={cn(
                  quick,
                  "relative mt-5 block font-heading text-xl leading-snug font-medium tracking-wide",
                  on && "text-gold-deep",
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
