"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

// ページの中のセクション（#menu、#reservation など）へのリンク
// 同じページにいるときは、何回押しても、そのセクションまでスクロールする
// （ふつうのリンクは、URL がもう #reservation だと、2 回目は動かない）
// 「動きを減らす」設定では、すぐに移る。別のページからは、ふつうに移動する
export function SectionLink({
  href,
  onClick,
  ...props
}: ComponentProps<typeof Link> & { href: string }) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        onClick?.(event);
        const [path, id] = href.split("#");
        if (!id || (path && path !== window.location.pathname)) return;
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        window.history.replaceState(null, "", `#${id}`);
        // キーボードや読み上げの人も、そのセクションから読めるように、見出しへフォーカスを移す
        const heading = target.querySelector<HTMLElement>("h2");
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      }}
      {...props}
    />
  );
}
