"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionLink } from "./section-link";

// メニューのページの、分類のタブ（DESIGN.md「メニューのページ」）
// スクロールしても画面の上に残る。いま見ている分類は、金の線と gold-deep の字
// 押すと、その分類までスクロールして、分類の見出しにフォーカスを移す（SectionLink）
// スマホでは、タブの列だけ横にスクロールする（いまのタブが見えるところまで、列が動く）
export function CategoryTabs({
  categories,
  label,
}: {
  categories: { id: string; name: string }[];
  label: string;
}) {
  const [active, setActive] = useState(categories[0]?.id ?? null);
  const listRef = useRef<HTMLUListElement>(null);

  // 画面の上のほう（タブのすぐ下の帯）にある分類を、いまの分類にする
  useEffect(() => {
    const sections = categories
      .map((category) => document.getElementById(`category-${category.id}`))
      .filter((section): section is HTMLElement => section !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        // いちばん上にある分類（帯にかかっているもの）
        const top = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActive(top.target.id.replace("category-", ""));
      },
      { rootMargin: "-15% 0px -75% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  // いまのタブが、タブの列の中で見えるようにする（ページのたてのスクロールは動かさない）
  useEffect(() => {
    const list = listRef.current;
    const tab = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !tab) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: tab.offsetLeft - 20, behavior: reduce ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav
      aria-label={label}
      className="sticky top-0 z-20 -mx-5 mt-10 border-b border-forest/15 bg-ivory md:mt-12"
    >
      <ul ref={listRef} className="flex gap-x-7 overflow-x-auto px-5 [scrollbar-width:none]">
        {categories.map((category) => {
          const current = category.id === active;
          return (
            <li key={category.id} className="shrink-0">
              <SectionLink
                href={`#category-${category.id}`}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-12 items-center border-b-2 border-transparent text-body whitespace-nowrap text-forest-soft transition-colors duration-300 hover:text-forest",
                  "rounded-t-sm focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                  current && "border-gold text-gold-deep hover:text-gold-deep",
                )}
              >
                {category.name}
              </SectionLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
