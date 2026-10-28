import type { Dictionary } from "@/i18n/dictionaries/ja";
import { formatPrice, type MenuCategory } from "@/lib/menu";
import { DishBlock } from "./dish-block";
import { Phrases } from "./phrases";

// メニューのページの、1 つの分類（DESIGN.md「メニューのページ」）
// 金の線 → 分類の名前（h2）→ 料理を 1 品ずつ（ジグザグ）
export function MenuCategorySection({
  category,
  text,
  preload = false,
}: {
  category: MenuCategory;
  text: Dictionary["menuPage"];
  // ページのいちばん上の分類だけ、はじめの写真を先に読みこむ
  preload?: boolean;
}) {
  const headingId = `category-${category.id}-heading`;
  const price = (value: number) => (
    <>
      {formatPrice(value)}
      <span className="text-small text-forest-soft">{text.taxIncluded}</span>
    </>
  );

  return (
    <section id={`category-${category.id}`} aria-labelledby={headingId} className="scroll-mt-20">
      <span aria-hidden="true" className="block h-px w-10 bg-gold md:w-12" />
      <h2 id={headingId} className="mt-5 text-h2 text-balance">
        <Phrases>{category.name}</Phrases>
      </h2>

      <div className="mt-12 flex flex-col gap-16 md:mt-16 md:gap-24">
        {category.dishes.map((dish, i) =>
          dish.image ? (
            <DishBlock
              key={dish.id}
              headingId={`dish-${dish.id}`}
              // 1 品目はお皿が右、2 品目は左…
              plateSide={i % 2 === 0 ? "right" : "left"}
              index={i}
              preload={preload && i === 0}
              dish={{
                id: dish.id,
                title: <Phrases>{dish.name}</Phrases>,
                description: dish.description ? <Phrases>{dish.description}</Phrases> : null,
                price: price(dish.price),
                image: dish.image,
              }}
            />
          ) : (
            // 写真のない料理（ふつうはない。管理画面では写真が必要）：消えないように、文字だけ。動かさない
            <article key={dish.id} aria-labelledby={`dish-${dish.id}`} className="md:mx-auto md:w-full md:max-w-[26rem]">
              <h3 id={`dish-${dish.id}`} className="text-h3 text-balance">
                <Phrases>{dish.name}</Phrases>
              </h3>
              {dish.description && (
                <p className="mt-4 text-lead text-forest-soft">
                  <Phrases>{dish.description}</Phrases>
                </p>
              )}
              <p className="mt-4 font-heading text-lead tabular-nums">{price(dish.price)}</p>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
