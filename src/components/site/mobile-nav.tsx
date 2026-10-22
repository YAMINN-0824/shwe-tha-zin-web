"use client";

import { useState, type ReactNode } from "react";
import { MenuIcon, XIcon } from "lucide-react";

// スマホのメニュー。ボタンを押すと、ヘッダーの下に開く
export function MobileNav({
  openLabel,
  closeLabel,
  children,
}: {
  openLabel: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((value) => !value)}
        className="grid size-10 place-items-center rounded-lg text-forest focus-visible:outline-2 focus-visible:outline-ring"
      >
        {open ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </button>
      <div
        id="mobile-nav"
        hidden={!open}
        // リンクを押したら閉じる
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className="absolute inset-x-0 top-full border-b border-border bg-background px-5 pt-2 pb-8 animate-bloom [animation-duration:600ms]"
      >
        {children}
      </div>
    </div>
  );
}
