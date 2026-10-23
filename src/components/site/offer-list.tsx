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

// 「お店でできること」の 3 つ。押すと、その項目のうしろに金の光がともる（DESIGN.md「お店でできること」）
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
        const quick = "transition-[opacity,color,border-color] duration-150 motion-reduce:transition-none";
        return (
          <li key={item.icon}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => setLit(on ? null : item.icon)}
              className="relative block w-full rounded-xl px-5 py-6 text-left focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-gold-deep focus-visible:outline-solid"
            >
              {/* うしろの金の光。まん中で gold/25 まで（これより濃いと、文字が読みにくくなる） */}
              <span
                aria-hidden="true"
                className={cn(
                  quick,
                  "pointer-events-none absolute inset-x-0 -inset-y-4 bg-[radial-gradient(ellipse_closest-side,rgb(217_169_46/0.25),rgb(217_169_46/0.1)_55%,rgb(217_169_46/0))]",
                  on ? "opacity-100" : "opacity-0",
                )}
              />
              <span
                className={cn(
                  quick,
                  "relative flex size-14 items-center justify-center rounded-full border",
                  on ? "border-gold-deep/60" : "border-gold/50",
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
