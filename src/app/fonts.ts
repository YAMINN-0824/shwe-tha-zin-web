import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";

// フォントについては DESIGN.md を見る
// 日本語のフォントはファイルが大きいので、preload しない（使う文字の分だけ読み込まれる）
const shipporiMincho = Shippori_Mincho({
  variable: "--font-shippori-mincho",
  // 400 はセクションの小さいラベル（細い字）
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
});

const zenKakuGothic = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  preload: false,
  display: "swap",
});

// <html> の className に入れる
export const fontVariables = `${shipporiMincho.variable} ${zenKakuGothic.variable}`;
