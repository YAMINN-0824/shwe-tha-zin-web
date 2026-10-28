"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MenuGarnish } from "./menu-garnish";
import { Plate } from "./plate";

// メニューのページの、写真のある料理 1 品のブロック（DESIGN.md「メニューのページ」）
// 画面に入ったら、お皿が横からすべって入り、少しかたむいてから、まっすぐになる
// 名前・説明・値段も、反対がわから同じときに入ってくる
// 画面から全部出たら、もとにもどす（下へ・上へ、どちらのスクロールでも、また動く）
// 写真を読みこむまでは動かさない（からっぽのわくが動かないように）

// ブロックがこれだけ見えたら動く（0.5 = 半分）。大きくすると、おそく（画面のまん中より上で）動く
const REVEAL_AT = 0.5;
// 画面が低くて、ブロックが半分も入りきらないとき：画面の高さのこれだけをうめたら動く
const REVEAL_SCREEN_SHARE = 0.5;
// 写真を読みこめないまま、これだけたったら、動かさずに出す（ms）
const LOAD_TIMEOUT_MS = 2500;
// 見えている大きさが変わるたびに調べる（0, 0.1, … 1）
const THRESHOLDS = Array.from({ length: 11 }, (_, i) => i / 10);

export type DishBlockData = {
  id: string;
  // 見せる名前・説明・値段（サーバーで <Phrases> をかけたもの）
  title: ReactNode;
  description: ReactNode | null;
  price: ReactNode;
  image: { url: string; alt: string };
};

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
  // 動いてよいところまで見えているか（全部出たら false にもどる）
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  // 写真を読みこんで、見えてから、1 コマあけて動かす（動く前の場所に、先に置いておくため）
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setOnscreen(entry.isIntersecting);
        if (!entry.isIntersecting) {
          // 全部出た：もとにもどす（画面の外なので見えない）。少しのスクロールでは、ここに来ない
          setInView(false);
          setMoving(false);
          return;
        }
        const screen = entry.rootBounds?.height ?? window.innerHeight;
        if (
          entry.intersectionRatio >= REVEAL_AT - 0.001 ||
          entry.intersectionRect.height >= screen * REVEAL_SCREEN_SHARE
        ) {
          setInView(true);
        }
      },
      { threshold: THRESHOLDS },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // 見えたのに写真がなかなか来ないときは、待ちつづけない
  useEffect(() => {
    if (!inView || loaded) return;
    const timer = window.setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [inView, loaded]);

  useEffect(() => {
    if (!inView || !loaded) return;
    let second = 0;
    const first = window.requestAnimationFrame(() => {
      second = window.requestAnimationFrame(() => setMoving(true));
    });
    return () => {
      window.cancelAnimationFrame(first);
      window.cancelAnimationFrame(second);
    };
  }, [inView, loaded]);

  // shown = 動かさずに、すぐ出す（写真が読めない・おそいとき）
  const shown = failed || timedOut;
  const hidden = !moving && !shown;
  const fromRight = plateSide === "right";
  // 動くのは、もとにもどすときではなく、入ってくるときだけ（もどすときは、すぐ）
  const transition = moving && "duration-[600ms] ease-bloom md:duration-[800ms]";

  return (
    <article
      ref={ref}
      aria-labelledby={headingId}
      data-onscreen={onscreen}
      // PC：お皿と文字を 1 つのまとまりにして、まん中に。間は左右どちらでも同じ（4rem）
      className="group/dish flex flex-col gap-6 md:flex-row md:items-center md:justify-center md:gap-16"
    >
      {/* 文字：お皿の反対がわから、お皿より短いきょりで入ってくる */}
      <div
        className={cn(
          "md:max-w-[26rem] md:min-w-0",
          moving && "transition-[translate,opacity]",
          transition,
          // 動く前の場所は motion-safe だけ（「動きを減らす」設定では、はじめから正しい場所に出る）
          hidden && "motion-safe:opacity-0",
          hidden &&
            (fromRight
              ? "motion-safe:-translate-x-4 motion-safe:md:-translate-x-8"
              : "motion-safe:translate-x-4 motion-safe:md:translate-x-8"),
          fromRight ? "md:order-first" : "md:order-last",
        )}
      >
        {/* 料理の名前は text-h3（DESIGN.md「文字の大きさ」）。長い名前でも、ことばのとちゅうで切れない */}
        <h3 id={headingId} className="text-h3 text-balance">
          {dish.title}
        </h3>
        {dish.description && <p className="mt-4 max-w-[35em] text-lead text-forest-soft">{dish.description}</p>}
        <p className="mt-4 font-heading text-lead tabular-nums">{dish.price}</p>
      </div>

      {/* お皿：スマホでは上。左右にずらしてジグザグ。わくは動かさず、中のお皿だけ動かす */}
      <div
        className={cn(
          // タブレットはお皿を小さく（文字の列を広くして、長い名前をことばのとちゅうで切らない）
          "relative order-first aspect-square w-[82%] max-w-[20rem] md:w-[42%] md:max-w-none md:shrink-0 lg:w-[min(34rem,52%)]",
          fromRight ? "ml-auto md:order-last md:ml-0" : "mr-auto md:order-first md:mr-0",
        )}
      >
        <div className={cn(moving && "transition-opacity", transition, hidden && "motion-safe:opacity-0")}>
          <MenuGarnish index={index} />
        </div>
        <div
          className={cn(
            "absolute inset-[11%]",
            moving && "transition-[translate,rotate,opacity]",
            transition,
            hidden && "motion-safe:opacity-0",
            // 横からすべって入る（スマホは短く）。進む向きに少しかたむいて、まっすぐになる
            hidden &&
              (fromRight
                ? "motion-safe:-rotate-[8deg] motion-safe:translate-x-[20%] motion-safe:md:translate-x-[35%]"
                : "motion-safe:rotate-[8deg] motion-safe:-translate-x-[20%] motion-safe:md:-translate-x-[35%]"),
          )}
        >
          <Plate
            src={dish.image.url}
            alt={dish.image.alt}
            sizes="(min-width: 768px) 424px, 66vw"
            preload={preload}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        </div>
      </div>
    </article>
  );
}
