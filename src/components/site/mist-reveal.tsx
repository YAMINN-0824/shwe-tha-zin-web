"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// スクロールして写真が見えてきたら、朝の霧がゆっくり晴れる（DESIGN.md「動き」）
// 1 回だけ動く。「動きを減らす」設定の人には、霧を出さない
const clear = "transition-[opacity,transform] duration-[2400ms] ease-bloom";

export function MistReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    // 写真の 4 割が見えたら晴らす
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-revealed={revealed}
      className={cn("group/mist relative overflow-hidden", className)}
    >
      {/* 霧の中では、写真が少しぼやけて、少し大きい */}
      <div
        className={cn(
          "scale-[1.04] blur-md transition-[filter,transform] duration-[2400ms] ease-bloom",
          "group-data-[revealed=true]/mist:scale-100 group-data-[revealed=true]/mist:blur-none",
          "motion-reduce:scale-100 motion-reduce:blur-none",
        )}
      >
        {children}
      </div>

      {/* 霧：左と右に分かれて、うすくなって消える */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 motion-reduce:hidden"
      >
        <span
          className={cn(
            clear,
            "absolute -inset-[20%] bg-[radial-gradient(ellipse_at_32%_42%,rgb(247_243_232/0.95),rgb(247_243_232/0.55)_45%,rgb(247_243_232/0)_75%)]",
            "group-data-[revealed=true]/mist:-translate-x-[18%] group-data-[revealed=true]/mist:opacity-0",
          )}
        />
        <span
          className={cn(
            clear,
            "absolute -inset-[20%] bg-[radial-gradient(ellipse_at_70%_62%,rgb(247_243_232/0.9),rgb(247_243_232/0.5)_45%,rgb(247_243_232/0)_75%)] delay-200",
            "group-data-[revealed=true]/mist:translate-x-[18%] group-data-[revealed=true]/mist:opacity-0",
          )}
        />
        <span
          className={cn(
            clear,
            "absolute inset-0 bg-ivory/55",
            "group-data-[revealed=true]/mist:opacity-0",
          )}
        />
      </div>
    </div>
  );
}
