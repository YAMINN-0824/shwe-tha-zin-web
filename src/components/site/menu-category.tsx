import type { Dictionary } from "@/i18n/dictionaries/ja";
import { formatPrice, type MenuCategory } from "@/lib/menu";
import { DishBlock } from "./dish-block";
import { Phrases } from "./phrases";

// メニューのページの、1 つの分類（DESIGN.md「メニューのページ」）
// 金の線 → 分類の名前（h2）→ 写真のある料理を 1 品ずつ（ジグザグ）→ すべての料理の値段リスト
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
  const priceListId = `category-${category.id}-prices`;
  const price = (value: number) => (
    <>
      {formatPrice(value)}
      <span className="text-small text-forest-soft">{text.taxIncluded}</span>
    </>
  );
  // 写真のない料理は、値段リストだけに出す（かわりの写真は使わない）
  const photoDishes = category.dishes.flatMap((dish) => (dish.image ? [{ ...dish, image: dish.image }] : []));

  return (
    <section id={`category-${category.id}`} aria-labelledby={headingId} className="scroll-mt-20">
      <span aria-hidden="true" className="block h-px w-10 bg-gold md:w-12" />
      <h2 id={headingId} className="mt-5 text-h2 text-balance">
        <Phrases>{category.name}</Phrases>
      </h2>

      {photoDishes.length > 0 && (
        <div className="mt-12 flex flex-col gap-16 md:mt-16 md:gap-24">
          {photoDishes.map((dish, i) => (
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
          ))}
        </div>
      )}

      {/* 分類の最後：すべての料理の、小さい値段リスト（名前は上のブロックの h3 にあるので、見出しにしない） */}
      <div className={photoDishes.length > 0 ? "mt-16 md:mt-24" : "mt-8"}>
        <p id={priceListId} className="text-small text-forest-soft">
          {text.priceList}
        </p>
        <ul aria-labelledby={`${headingId} ${priceListId}`} className="mt-3 flex max-w-xl flex-col">
          {category.dishes.map((dish) => (
            <li
              key={dish.id}
              className="flex items-baseline justify-between gap-x-6 border-b border-forest/10 py-3 first:border-t"
            >
              <span className="text-body">
                <Phrases>{dish.name}</Phrases>
              </span>
              <span className="text-body whitespace-nowrap tabular-nums">{price(dish.price)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
