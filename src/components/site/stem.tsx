import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { OrchidMark } from "./orchid-mark";

// ページの中心を通る「花の茎」の線（DESIGN.md「レイアウト」）
// スマホでは左はし、PC ではまん中。親に relative をつける
export function Stem({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 left-5 w-px origin-top bg-leaf/45 md:left-1/2",
        className,
      )}
    />
  );
}

// 茎から垂れ下がるブロック。PC では side で左右に分かれる
export function Hanging({
  side,
  className,
  children,
}: {
  side: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative pl-10 md:pl-0",
        side === "left"
          ? "md:col-start-1 md:pr-16"
          : "md:col-start-2 md:pl-16",
        className,
      )}
    >
      {/* 茎とブロックをつなぐ、短い横の線（見出しの 1 行目の高さ） */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-5 left-0 h-px w-7 bg-leaf/45 md:w-12",
          side === "left" && "md:right-0 md:left-auto",
        )}
      />
      {/* 左側のブロックは、茎の近くに寄せる */}
      <div className={cn("max-w-md", side === "left" && "md:ml-auto md:w-fit")}>
        {children}
      </div>
    </div>
  );
}

// 茎の上に置く、小さいランの区切り
export function StemDivider({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative h-14", className)}>
      <span className="absolute top-1/2 left-5 -translate-x-1/2 -translate-y-1/2 bg-background p-1.5 md:left-1/2">
        <OrchidMark className="size-9 text-leaf" />
      </span>
    </div>
  );
}
