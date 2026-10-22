import { cn } from "@/lib/utils";
import { Phrases } from "./phrases";

// すべてのセクションで同じ見出しの形（DESIGN.md「セクションの見出し」）
// 小さいラベル → 細い金の線 → 大きい見出し
export function SectionHeading({
  id,
  label,
  heading,
  tone = "light",
  className,
}: {
  id: string;
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
          "font-heading tracking-wide",
          tone === "dark" ? "text-gold" : "text-gold-deep",
        )}
      >
        <Phrases>{label}</Phrases>
      </p>
      <span aria-hidden="true" className="mt-3 h-px w-8 bg-gold" />
      <h2 id={id} className="mt-5 text-3xl leading-snug md:text-[2.5rem]">
        <Phrases>{heading}</Phrases>
      </h2>
    </div>
  );
}
