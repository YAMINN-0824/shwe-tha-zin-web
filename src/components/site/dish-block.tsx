"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MenuGarnish } from "./menu-garnish";
import { Plate } from "./plate";

// メニューのページの、写真のある料理 1 品のブロック（DESIGN.md「メニューのページ」）
// 画面に入ったら、お皿が横から入ってくる（丸いお皿はころがる、グラスや横長のお皿は少しかたむくだけ）
// 名前・説明・値段も、反対がわから同じときに入ってくる。1 回だけ動く
// 写真を読みこむまでは動かさない（からっぽのわくが動かないように）

// 写真を読みこめないまま、これだけたったら、動かさずに出す（ms）
const LOAD_TIMEOUT_MS = 2500;

export type DishBlockData = {
  id: string;
  // 見せる名前・説明・値段（サーバーで <Phrases> をかけたもの）
  title: ReactNode;
  description: ReactNode | null;
  price: ReactNode;
  image: { url: string; alt: string };
};

// round = 真上から撮った丸いお皿（ころがる）、other = グラスや横長のお皿（かたむくだけ）
type Shape = "round" | "other";

// 丸いお皿か：たて・よこがほぼ同じで、すけていないところが円の形（円の中はうまって、四すみはすけている）
// 32×32 にかいて調べる。/_next/image の写真は同じサイトなので、キャンバスで読める。読めなければ other
function measureShape(image: HTMLImageElement): Shape {
  const ratio = image.naturalWidth / image.naturalHeight;
  if (ratio < 0.85 || ratio > 1.2) return "other";
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return "other";
  try {
    context.drawImage(image, 0, 0, size, size);
    const { data } = context.getImageData(0, 0, size, size);
    let inside = 0;
    let insideFilled = 0;
    let outside = 0;
    let outsideFilled = 0;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (x + 0.5) / size - 0.5;
        const dy = (y + 0.5) / size - 0.5;
        const filled = (data[(y * size + x) * 4 + 3] ?? 0) > 128 ? 1 : 0;
        if (dx * dx + dy * dy <= 0.25) {
          inside++;
          insideFilled += filled;
        } else {
          outside++;
          outsideFilled += filled;
        }
      }
    }
    return insideFilled / inside >= 0.9 && outsideFilled / outside <= 0.1 ? "round" : "other";
  } catch {
    return "other";
  }
}

export function DishBlock({
  dish,
  headingId,
  plateSide,
  index,
  preload = false,
}: {
  dish: DishBlockData;
  headingId: string;
  // お皿の場所（1 品目は右、2 品目は左…のジグザグ）。お皿はこちらがわから入ってくる
  plateSide: "right" | "left";
  // 飾りの組み合わせを変えるための、分類の中の番号
  index: number;
  // ページのいちばん上の料理だけ、写真を先に読みこむ
  preload?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [onscreen, setOnscreen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [shape, setShape] = useState<Shape | null>(null);
  const [failed, setFailed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  // shape がわかってから 1 コマあけて動かす（動く前の場所に、先に置いておくため）
  const [moving, setMoving] = useState(false);

  // 画面に入ったか（動きは 1 回だけ）。外にあるときは、うかぶ飾りを止める
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        setOnscreen(visible);
        if (visible) setSeen(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // 画面に入ったのに写真がなかなか来ないときは、待ちつづけない
  useEffect(() => {
    if (!seen || shape) return;
    const timer = window.setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [seen, shape]);

  useEffect(() => {
    if (!seen || !shape) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setMoving(true));
    });
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [seen, shape]);

  // shown = 動かさずに、すぐ出す（写真が読めない・おそいとき）
  const shown = failed || timedOut;
  const hidden = !moving && !shown;
  const fromRight = plateSide === "right";

  return (
    <article
      ref={ref}
      aria-labelledby={headingId}
      data-onscreen={onscreen}
      className="group/dish grid items-center gap-6 md:grid-cols-2 md:gap-16"
    >
      {/* 文字：お皿の反対がわから、お皿より短いきょりで入ってくる */}
      <div
        className={cn(
          moving && "transition-[translate,opacity] duration-[600ms] ease-bloom md:duration-[800ms]",
          // 動く前の場所は motion-safe だけ（「動きを減らす」設定では、はじめから正しい場所に出る）
          hidden && "motion-safe:opacity-0",
          hidden &&
            (fromRight
              ? "motion-safe:-translate-x-4 motion-safe:md:-translate-x-8"
              : "motion-safe:translate-x-4 motion-safe:md:translate-x-8"),
          fromRight ? "md:order-first" : "md:order-last",
        )}
      >
        <h3 id={headingId} className="text-h2 text-balance">
          {dish.title}
        </h3>
        {dish.description && <p className="mt-4 max-w-[35em] text-body text-forest-soft">{dish.description}</p>}
        <p className="mt-5 font-heading text-h3 tabular-nums">{dish.price}</p>
      </div>

      {/* お皿：スマホでは上。左右にずらしてジグザグ。わくは動かさず、中のお皿だけ動かす */}
      <div
        className={cn(
          "relative order-first aspect-square w-[82%] max-w-[20rem] md:w-full md:max-w-[34rem]",
          fromRight ? "ml-auto md:order-last md:ml-0 md:justify-self-end" : "mr-auto md:order-first md:mr-0",
        )}
      >
        <div
          className={cn(
            moving && "transition-opacity duration-[600ms] ease-bloom md:duration-[800ms]",
            hidden && "motion-safe:opacity-0",
          )}
        >
          <MenuGarnish index={index} />
        </div>
        <div
          className={cn(
            "absolute inset-[11%]",
            moving && "transition-[translate,rotate,opacity] duration-[600ms] ease-bloom md:duration-[800ms]",
            hidden && "motion-safe:opacity-0",
            // 横から入る（スマホは短く）
            hidden &&
              (fromRight
                ? "motion-safe:translate-x-[20%] motion-safe:md:translate-x-[35%]"
                : "motion-safe:-translate-x-[20%] motion-safe:md:-translate-x-[35%]"),
            // 丸いお皿は、進む向きにころがる（右から来るときは左回り）。ほかは少しかたむくだけ
            hidden &&
              shape === "round" &&
              (fromRight
                ? "motion-safe:rotate-[80deg] motion-safe:md:rotate-[120deg]"
                : "motion-safe:-rotate-[80deg] motion-safe:md:-rotate-[120deg]"),
            hidden && shape === "other" && (fromRight ? "motion-safe:-rotate-[8deg]" : "motion-safe:rotate-[8deg]"),
          )}
        >
          <Plate
            src={dish.image.url}
            alt={dish.image.alt}
            sizes="(min-width: 768px) 420px, 66vw"
            preload={preload}
            onLoad={(image) => setShape((current) => current ?? measureShape(image))}
            onError={() => setFailed(true)}
          />
        </div>
      </div>
    </article>
  );
}
