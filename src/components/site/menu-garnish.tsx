import { cn } from "@/lib/utils";

// 料理のお皿のまわりに、ゆっくりうかぶ材料の線画（DESIGN.md「メニューのページの動き」）
// 1 品に PC 2 つ・スマホ 1 つだけ（ページを静かにするため）。料理ごとに組み合わせを変える
// お皿のまわりの空いたところ（四すみ）だけに置く。料理・文字には重ねない
// TODO: 本当の材料の切り抜き写真に入れかえてもよい

type Kind = "leaf" | "sesame" | "chili" | "lime" | "peanut";

// 場所と大きさ（四すみ。お皿はわくのまん中の 78%）
const place: Record<Kind, string> = {
  leaf: "top-[2%] right-[4%] w-12 md:w-16",
  sesame: "top-[7%] left-[6%] w-7 md:w-8",
  chili: "bottom-[3%] left-[5%] w-10 md:w-14",
  lime: "bottom-[2%] right-[6%] w-10 md:w-14",
  peanut: "top-[5%] right-[6%] w-6 md:w-8",
};

// 料理ごとの組み合わせ（1 つめはいつも出す、2 つめは PC だけ）。同じ角にならないように
const pairs: [Kind, Kind][] = [
  ["leaf", "chili"],
  ["sesame", "lime"],
  ["chili", "peanut"],
  ["lime", "sesame"],
  ["peanut", "chili"],
];

// うかぶ速さ（同じにならないように）
const timing = [
  { duration: "8s", delay: "0s" },
  { duration: "6.5s", delay: "-3s" },
];

export function MenuGarnish({ index }: { index: number }) {
  const pair = pairs[index % pairs.length] ?? pairs[0];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {pair?.map((kind, i) => (
        <span key={kind} className={cn("absolute", place[kind], i > 0 && "hidden md:block")}>
          {/* ゆっくりうかぶ。料理のブロックが画面の外にあるときは止める */}
          <span
            style={{ animationDuration: timing[i]?.duration, animationDelay: timing[i]?.delay }}
            className="block animate-float [animation-play-state:paused] group-data-[onscreen=true]/dish:[animation-play-state:running] motion-reduce:animate-none"
          >
            <GarnishArt kind={kind} />
          </span>
        </span>
      ))}
    </div>
  );
}

function GarnishArt({ kind }: { kind: Kind }) {
  switch (kind) {
    // お茶の葉（ラペットゥ）
    case "leaf":
      return (
        <svg viewBox="0 0 48 48" className="h-auto w-full">
          <path d="M7 41C7 21 21 7 42 6C42 27 28 41 7 41Z" className="fill-leaf/80" />
          <path d="M9 39C19 29 29 19 39 9" className="fill-none stroke-ivory-soft" strokeWidth="1.25" strokeLinecap="round" />
        </svg>
      );
    // ごま 3 つぶ
    case "sesame":
      return (
        <svg viewBox="0 0 32 32" className="h-auto w-full">
          {[
            { x: 9, y: 11, r: -30 },
            { x: 21, y: 8, r: 25 },
            { x: 16, y: 22, r: 70 },
          ].map((seed) => (
            <ellipse
              key={`${seed.x}-${seed.y}`}
              cx={seed.x}
              cy={seed.y}
              rx="2.6"
              ry="4.2"
              transform={`rotate(${seed.r} ${seed.x} ${seed.y})`}
              className="fill-ivory-soft stroke-gold-deep/60"
              strokeWidth="1"
            />
          ))}
        </svg>
      );
    // とうがらし
    case "chili":
      return (
        <svg viewBox="0 0 48 48" className="h-auto w-full">
          <path d="M15 11C10 23 15 36 38 43C31 35 25 23 23 12C21 9 17 9 15 11Z" className="fill-lacquer/85" />
          <path d="M19 10C18 6 20 4 24 3" className="fill-none stroke-leaf-deep" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    // ライムの輪切り
    case "lime":
      return (
        <svg viewBox="0 0 48 48" className="h-auto w-full">
          <circle cx="24" cy="24" r="21" className="fill-leaf/70" />
          <circle cx="24" cy="24" r="17.5" className="fill-secondary" />
          {[0, 60, 120].map((angle) => (
            <line
              key={angle}
              x1="24"
              y1="7.5"
              x2="24"
              y2="40.5"
              transform={`rotate(${angle} 24 24)`}
              className="stroke-ivory-soft"
              strokeWidth="1.25"
            />
          ))}
        </svg>
      );
    // ピーナッツ（からつき）
    case "peanut":
      return (
        <svg viewBox="0 0 32 48" className="h-auto w-full">
          <path
            d="M16 4C23 4 26 9 25 14C24 18 21 20 21 24C21 28 25 30 25 35C25 41 21 44 16 44C11 44 7 41 7 35C7 30 11 28 11 24C11 20 8 18 7 14C6 9 9 4 16 4Z"
            className="fill-parchment stroke-gold-deep/70"
            strokeWidth="1.25"
          />
        </svg>
      );
  }
}
