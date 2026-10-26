import { cn } from "@/lib/utils";
import { Phrases } from "./phrases";

// すべてのセクションで同じ見出しの形（DESIGN.md「セクションの見出し」）
// 小さいラベル → 細い金の線 → 大きい見出し
// 大きさは globals.css の文字の大きさ（ラベル text-label、見出し text-h2）

export function SectionHeading({
  id,
  label,
  heading,
  tone = "light",
  as: Heading = "h2",
  className,
}: {
  id: string;
  // ページのいちばん上の見出しは h1（メニューのページなど）
  as?: "h1" | "h2";
  label: string;
  heading: string;
  // dark = 森の緑の上（金とアイボリーをそのまま文字に使える）
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start", className)}>
      <p
        className={cn(
          "font-heading text-label font-normal tracking-[0.08em]",
          tone === "dark" ? "text-gold" : "text-gold-deep",
        )}
      >
        <Phrases>{label}</Phrases>
      </p>
      <span aria-hidden="true" className="mt-4 h-px w-10 bg-gold md:w-12" />
      <Heading
        id={id}
        className="mt-5 text-h2 text-balance"
      >
        <Phrases>{heading}</Phrases>
      </Heading>
    </div>
  );
}
