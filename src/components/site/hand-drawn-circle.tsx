import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// 大切な 1 語を、金の手がきの丸でかこむ。丸は線をえがくように出てくる
// 1 ページに 1 回だけ使う（DESIGN.md「動き」）
export function HandDrawnCircle({
  children,
  drawClassName,
}: {
  children: ReactNode;
  // 丸がかかれはじめるタイミング（例: "[animation-delay:1700ms]"）
  drawClassName?: string;
}) {
  return (
    // 丸がとなりの字にさわらないよう、左右に少しあける
    <span className="relative mx-[0.22em] inline-block">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        fill="none"
        className="pointer-events-none absolute top-[calc(50%-0.72em)] left-[-0.2em] h-[1.44em] w-[calc(100%+0.4em)] overflow-visible stroke-gold"
      >
        {/* 手でかいたように、少しゆがんで、かき終わりが重なる線 */}
        <path
          d="M60 5C32 1 5 12 4 31C3 49 30 58 58 56C85 54 98 41 96 24C94 9 74 1 42 6"
          pathLength={1}
          strokeWidth={1.75}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={cn("animate-draw [stroke-dasharray:1]", drawClassName)}
        />
      </svg>
    </span>
  );
}
