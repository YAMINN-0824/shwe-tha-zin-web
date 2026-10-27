"use client";

import { MoveLeft, MoveRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { MenuGarnish } from "./menu-garnish";
import { Plate } from "./plate";

// メニューのページの、写真のある料理のショーケース（DESIGN.md「メニューのページ」）
// 1 皿ずつ見せる。前へ・次へのボタン、← → キー、スワイプで変える。自動では動かない
// 料理が 1 皿だけのときは、ボタンなしで大きく見せるだけ

// スライドが動く時間（ms）。動いているあいだは、次の操作を受けつけない
const SLIDE_MS = 600;
// これより長く横に指を動かしたら、スワイプ
const SWIPE_PX = 50;

export type ShowcaseSlide = {
  id: string;
  // 読み上げ用の、ただの文字の名前
  name: string;
  // 見せる名前・説明・値段（サーバーで <Phrases> をかけたもの）
  title: ReactNode;
  description: ReactNode | null;
  price: ReactNode;
  image: { url: string; alt: string };
};

export function DishShowcase({
  slides,
  label,
  text,
  preload = false,
}: {
  slides: ShowcaseSlide[];
  // 分類の名前（スライドのまとまりの名前）
  label: string;
  text: { roleDescription: string; previous: string; next: string; status: string };
  // ページのいちばん上のショーケースだけ、はじめの写真を先に読みこむ
  preload?: boolean;
}) {
  const [index, setIndex] = useState(0);
  // 1 回でも動かしたか（はじめに見えたときは、文字を動かさない）
  const [moved, setMoved] = useState(false);
  const [onscreen, setOnscreen] = useState(false);
  const [status, setStatus] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const total = slides.length;
  const multiple = total > 1;

  // 画面の外にあるときは、うかぶ飾りを止める
  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setOnscreen(entry?.isIntersecting ?? false));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function go(to: number) {
    // はじめと最後で止まる（ぐるっと回らない）
    if (busy.current || to < 0 || to >= total || to === index) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      busy.current = true;
      timer.current = window.setTimeout(() => {
        busy.current = false;
      }, SLIDE_MS);
    }
    setIndex(to);
    setMoved(true);
    setStatus(
      text.status
        .replace("{current}", String(to + 1))
        .replace("{total}", String(total))
        .replace("{name}", slides[to]?.name ?? ""),
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    // たてのスクロールは、スワイプにしない
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? index + 1 : index - 1);
  }

  // 新しく見えた料理の文字：番号 → 名前 → 説明 → 値段 の順に、少しずつずれて出る
  const rise = (current: boolean, delay: string) => (moved && current ? cn("animate-rise", delay) : "");

  return (
    <div
      ref={rootRef}
      data-onscreen={onscreen}
      {...(multiple && {
        role: "region",
        "aria-roledescription": text.roleDescription,
        "aria-label": label,
        tabIndex: 0,
        onKeyDown,
        onPointerDown,
        onPointerUp,
        onPointerCancel: () => {
          swipeStart.current = null;
        },
      })}
      className={cn(
        "group/showcase grid touch-pan-y items-center gap-8 overflow-x-clip rounded-lg",
        "md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12 lg:gap-16",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
      )}
    >
      {/* 文字：全部の料理を同じ場所に重ねる（高さが変わって、ボタンが動かないように） */}
      <div>
        <div className="grid">
          {slides.map((slide, i) => {
            const current = i === index;
            return (
              <div key={slide.id} inert={!current} className={cn("[grid-area:1/1]", !current && "invisible")}>
                {multiple && (
                  <p className={cn("flex items-center gap-2.5 text-small text-forest-soft tabular-nums", rise(current, ""))}>
                    <span aria-hidden="true" className="size-1.5 rounded-full bg-lacquer" />
                    {i + 1} / {total}
                  </p>
                )}
                <p
                  className={cn(
                    "font-heading text-h2 font-medium tracking-wide text-balance",
                    multiple && "mt-4",
                    rise(current, "[animation-delay:60ms]"),
                  )}
                >
                  {slide.title}
                </p>
                {slide.description && (
                  <p className={cn("mt-5 max-w-[35em] text-body text-forest-soft", rise(current, "[animation-delay:120ms]"))}>
                    {slide.description}
                  </p>
                )}
                <p className={cn("mt-6 font-heading text-h3 tabular-nums", rise(current, "[animation-delay:180ms]"))}>
                  {slide.price}
                </p>
              </div>
            );
          })}
        </div>

        {multiple && (
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
            <NavButton disabled={index === 0} onClick={() => go(index - 1)}>
              <MoveLeft aria-hidden="true" strokeWidth={1.25} className="size-6" />
              {text.previous}
            </NavButton>
            <NavButton disabled={index === total - 1} onClick={() => go(index + 1)}>
              {text.next}
              <MoveRight aria-hidden="true" strokeWidth={1.25} className="size-6" />
            </NavButton>
          </div>
        )}
      </div>

      {/* 写真：スマホでは上、PC では右。古いお皿は片方へ出て、新しいお皿は反対から入る */}
      <div className="relative order-first mx-auto aspect-square w-full max-w-[22rem] md:order-last md:max-w-none">
        <span aria-hidden="true" className="absolute inset-[4%] rounded-full bg-parchment" />
        <MenuGarnish step={index % 2} />
        <div className="relative grid h-full place-items-center">
          {slides.map((slide, i) => {
            const offset = i - index;
            return (
              <div
                key={slide.id}
                inert={offset !== 0}
                className={cn(
                  "w-[78%] [grid-area:1/1] transition-[opacity,translate] duration-[600ms] ease-bloom",
                  offset < 0 && "-translate-x-[14%] opacity-0",
                  offset > 0 && "translate-x-[14%] opacity-0",
                )}
              >
                {/* となりの料理までだけ読みこむ（ほかは、近づいたら） */}
                {Math.abs(offset) <= 1 && (
                  <Plate
                    src={slide.image.url}
                    alt={slide.image.alt}
                    sizes="(min-width: 1152px) 470px, (min-width: 768px) 42vw, 275px"
                    preload={preload && i === 0}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {multiple && (
        <p aria-live="polite" className="sr-only">
          {status}
        </p>
      )}
    </div>
  );
}

// 動けないとき（はじめ・最後）も、フォーカスを失わないように disabled ではなく aria-disabled
function NavButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) onClick();
      }}
      className={cn(
        "inline-flex min-h-11 items-center gap-3 rounded-sm px-1 text-body text-forest transition-colors duration-300",
        "hover:not-aria-disabled:text-leaf-deep aria-disabled:cursor-default aria-disabled:opacity-40",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      )}
    >
      {children}
    </button>
  );
}
