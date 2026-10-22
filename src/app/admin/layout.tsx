import type { Metadata } from "next";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "SHWE THA ZIN 管理画面",
};

// 管理画面の共通部分。お客さん用のページとは別の root layout
export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="ja" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
