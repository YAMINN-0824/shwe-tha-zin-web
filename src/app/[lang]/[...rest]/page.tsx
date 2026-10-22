import { notFound } from "next/navigation";

// /ja/〇〇 のように、まだないページは [lang]/not-found.tsx を表示する
export default function CatchAllPage() {
  notFound();
}
