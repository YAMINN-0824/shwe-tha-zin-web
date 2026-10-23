"use client";

import { Bike, CalendarHeart, ChefHat, type LucideIcon } from "lucide-react";
import { useState } from "react";
import type { OfferIcon } from "@/i18n/dictionaries/ja";
import { cn } from "@/lib/utils";

const icons: Record<OfferIcon, LucideIcon> = {
  events: CalendarHeart,
  special: ChefHat,
  delivery: Bike,
};

// 「お店でできること」の 3 つ（DESIGN.md「お店でできること」）
// マウスをのせる・フォーカスする・押すと、見出しの字のうしろに、蛍光ペンのようなやわらかい金の光がともる
// 押して光らせるのは 1 つだけ。もう一度押すと消える
// Tailwind はコードの中の文字をそのまま読むので、クラス名は省略せずに書く
export function OfferList({ items }: { items: { icon: OfferIcon; title: string }[] }) {
  const [lit, setLit] = useState<OfferIcon | null>(null);

  return (
    // せまいスマホ（360px 未満）では縦にならべる
    <ul className="grid grid-cols-3 gap-2 max-[359px]:grid-cols-1 max-[359px]:gap-1">
      {items.map((item) => {
        const Icon = icons[item.icon];
        const on = lit === item.icon;
        return (
          <li key={item.icon}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => setLit(on ? null : item.icon)}
              className="group flex w-full flex-col items-center rounded-[6px] px-1 py-5 text-center max-[359px]:py-3 focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-gold-deep focus-visible:outline-solid"
            >
              <Icon
                aria-hidden="true"
                absoluteStrokeWidth
                strokeWidth={1.25}
                className="size-14 text-gold md:size-16"
              />
              <span className="relative mt-5 px-1 font-heading text-base leading-snug sm:text-lg font-medium tracking-wide md:text-xl">
                {/* 見出しのうしろの金の光。まん中で gold/55 まで（森の緑の字は、いちばん濃いところでも 9 以上） */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -inset-x-3 -inset-y-2 bg-[radial-gradient(ellipse_closest-side,rgb(217_169_46/0.55),rgb(217_169_46/0.25)_55%,rgb(217_169_46/0))] transition-opacity duration-150 motion-reduce:transition-none",
                    on
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
                  )}
                />
                <span className="relative whitespace-nowrap">{item.title}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
