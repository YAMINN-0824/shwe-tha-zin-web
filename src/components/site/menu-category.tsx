import type { Dictionary } from "@/i18n/dictionaries/ja";
import { formatPrice, type MenuCategory } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { DishShowcase, type ShowcaseSlide } from "./dish-showcase";
import { FadeUp } from "./fade-up";
import { Phrases } from "./phrases";

// メニューのページの、1 つの分類（DESIGN.md「メニューのページ」）
// 金の線 → 分類の名前（h2）→ 写真のある料理のショーケース → すべての料理のリスト
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
  // 写真のない料理は、リストだけに出す（かわりの写真は使わない）
  const slides: ShowcaseSlide[] = category.dishes.flatMap((dish) =>
    dish.image
      ? [
          {
            id: dish.id,
            name: dish.name,
            title: <Phrases>{dish.name}</Phrases>,
            description: dish.description ? <Phrases>{dish.description}</Phrases> : null,
            price: price(dish.price),
            image: dish.image,
          },
        ]
      : [],
  );

  return (
    <section id={`category-${category.id}`} aria-labelledby={headingId} className="scroll-mt-10">
      <FadeUp>
        <span aria-hidden="true" className="block h-px w-10 bg-gold md:w-12" />
        <h2 id={headingId} className="mt-5 text-h2 text-balance">
          <Phrases>{category.name}</Phrases>
        </h2>
      </FadeUp>

      {slides.length > 0 && (
        <FadeUp delay={150} className="mt-10 md:mt-14">
          <DishShowcase slides={slides} label={category.name} text={text.showcase} preload={preload} />
        </FadeUp>
      )}

      <ul className={cn("flex max-w-3xl flex-col", slides.length > 0 ? "mt-12 md:mt-16" : "mt-6")}>
        {category.dishes.map((dish) => (
          <li key={dish.id} className="border-b border-forest/10 py-6 first:border-t">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lead font-medium">
                <Phrases>{dish.name}</Phrases>
              </h3>
              <p className="text-body whitespace-nowrap tabular-nums">{price(dish.price)}</p>
            </div>
            {dish.description && (
              <p className="mt-2 text-body text-forest-soft">
                <Phrases>{dish.description}</Phrases>
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
