"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// 画面に入ったら、少し下から、しずかに出てくる（メニューのページだけ。DESIGN.md「メニューのページの動き」）
// 1 回だけ動く。「動きを減らす」設定の人には、はじめから出ている
export function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  // 同じ分類の中で、見出し → ショーケースの順に出すための、おくれ（ms）
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-revealed={revealed}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "translate-y-6 opacity-0 transition-[opacity,translate] duration-[900ms] ease-bloom",
        "data-[revealed=true]:translate-y-0 data-[revealed=true]:opacity-100",
        "motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      )}
    >
      {children}
    </div>
  );
}
