import { cn } from "@/lib/utils";
import { Phrases } from "./phrases";

// すべてのセクションで同じ見出しの形（DESIGN.md「セクションの見出し」）
// 小さいラベル → 細い金の線 → 大きい見出し
// 大きさは clamp() で、390px の画面から 1280px の画面まで、なめらかに変わる
//   ラベル 20px → 30px、見出し 34px → 56px

// 見出しの下の説明の文章（16px → 18px）。どのセクションでも、これを使う
export const sectionBodyText = "text-[clamp(1rem,0.945rem+0.225vw,1.125rem)]";

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
          "font-heading text-[clamp(1.25rem,0.975rem+1.124vw,1.875rem)] leading-snug font-normal tracking-[0.08em]",
          tone === "dark" ? "text-gold" : "text-gold-deep",
        )}
      >
        <Phrases>{label}</Phrases>
      </p>
      <span aria-hidden="true" className="mt-4 h-px w-12 bg-gold md:w-16" />
      <h2
        id={id}
        className="mt-6 text-[clamp(2.125rem,1.523rem+2.472vw,3.5rem)] leading-[1.3] text-balance"
      >
        <Phrases>{heading}</Phrases>
      </h2>
    </div>
  );
}
