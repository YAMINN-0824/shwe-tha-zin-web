import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// 手でかいたように、少しゆがんで、かき終わりが重なる線
const PATH = "M60 5C32 1 5 12 4 31C3 49 30 58 58 56C85 54 98 41 96 24C94 9 74 1 42 6";
// 1 ページに 1 回だけ使うので、id は固定
const MASK_ID = "hand-drawn-circle-mask";

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
    // 丸がとなりの字にさわらないよう、左右にあける
    <span className="relative mx-[0.45em] inline-block">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        fill="none"
        // 楕円の中に、ことばの四すみが入る大きさ（上下は 2em、左右は 6% ＋ 0.2em はみ出す）
        className="pointer-events-none absolute top-[calc(50%-1em)] left-[calc(-6%-0.2em)] h-[2em] w-[calc(112%+0.4em)] overflow-visible"
      >
        {/* 見える線は、横に長くのびても太さが変わらないようにする（non-scaling-stroke）
            その線に点線の動きをつけると、長さがずれて、とちゅうで切れてしまう
            → 太いマスクの線に動きをつけて、見える線を少しずつ出す */}
        <mask id={MASK_ID} maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="100">
          <path
            d={PATH}
            pathLength={1}
            stroke="white"
            strokeWidth={16}
            strokeLinecap="round"
            className={cn("animate-draw [stroke-dasharray:1]", drawClassName)}
          />
        </mask>
        <path
          d={PATH}
          mask={`url(#${MASK_ID})`}
          strokeWidth={1.75}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="stroke-gold"
        />
      </svg>
    </span>
  );
}
