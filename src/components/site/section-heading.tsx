import { cn } from "@/lib/utils";

// すべてのセクションで同じ見出しの形（DESIGN.md「セクションの見出し」）
// 小さいラベル → 細い金の線 → 大きい見出し
export function SectionHeading({
  id,
  label,
  heading,
  className,
}: {
  id: string;
  label: string;
  heading: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-start", className)}>
      <p className="font-heading tracking-wide text-gold-deep">{label}</p>
      <span aria-hidden="true" className="mt-3 h-px w-8 bg-gold" />
      <h2 id={id} className="mt-5 text-3xl leading-snug md:text-[2.5rem]">
        {heading}
      </h2>
    </div>
  );
}
