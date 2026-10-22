import { cn } from "@/lib/utils";

// ゆっくりただよう金の花粉（DESIGN.md「動き」）。CSS だけで動かす
// 「動きを減らす」設定の人には出さない
const dots = [
  { left: "8%", top: "78%", size: 4, delay: "-3s", duration: "28s", onPhone: true },
  { left: "36%", top: "18%", size: 3, delay: "-11s", duration: "24s", onPhone: false },
  { left: "47%", top: "64%", size: 5, delay: "-18s", duration: "30s", onPhone: true },
  { left: "62%", top: "12%", size: 3, delay: "-7s", duration: "26s", onPhone: true },
  { left: "88%", top: "44%", size: 4, delay: "-15s", duration: "32s", onPhone: false },
  { left: "78%", top: "86%", size: 3, delay: "-22s", duration: "27s", onPhone: true },
];

export function Pollen() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 motion-reduce:hidden"
    >
      {dots.map((dot) => (
        <span
          key={`${dot.left}-${dot.top}`}
          className={cn(
            "absolute animate-pollen rounded-full bg-gold will-change-transform",
            !dot.onPhone && "max-md:hidden",
          )}
          style={{
            left: dot.left,
            top: dot.top,
            width: dot.size,
            height: dot.size,
            animationDelay: dot.delay,
            animationDuration: dot.duration,
          }}
        />
      ))}
    </div>
  );
}
