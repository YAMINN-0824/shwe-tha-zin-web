import type { Metadata } from "next";
import Link from "next/link";
import { Phrases } from "@/components/site/phrases";
import { Plate } from "@/components/site/plate";
import { SectionHeading } from "@/components/site/section-heading";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { formatPrice, getMenu } from "@/lib/menu";

export async function generateMetadata(): Promise<Metadata> {
  const { menuPage } = await getDictionary();
  return { title: menuPage.title };
}

// メニューのページ：お店に出している料理を、分類ごとに（DESIGN.md「メニューのページ」）
export default async function MenuPage() {
  const locale = await getLocale();
  const { menuPage } = await getDictionary();
  const categories = await getMenu(locale);

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-20 md:py-28">
      <SectionHeading as="h1" id="menu-heading" label={menuPage.label} heading={menuPage.heading} />
      <p className="mt-6 text-body text-forest-soft">
        <Phrases>{menuPage.body}</Phrases>
      </p>

      {categories.length === 0 ? (
        <p className="mt-14 text-body">
          <Phrases>{menuPage.empty}</Phrases>
        </p>
      ) : (
        <div className="mt-14 flex flex-col gap-16 md:mt-20 md:gap-20">
          {categories.map((category) => (
            <section key={category.id} aria-labelledby={`category-${category.id}`}>
              <h2
                id={`category-${category.id}`}
                className="border-b border-forest/15 pb-3 text-h3 font-medium tracking-wide"
              >
                <Phrases>{category.name}</Phrases>
              </h2>
              <ul className="flex flex-col">
                {category.dishes.map((dish) => (
                  <li
                    key={dish.id}
                    className="grid grid-cols-[1fr_auto] items-center gap-5 border-b border-forest/10 py-6 md:gap-8"
                  >
                    <div>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-lead font-medium">
                          <Phrases>{dish.name}</Phrases>
                        </h3>
                        <p className="text-body whitespace-nowrap tabular-nums">
                          {formatPrice(dish.price)}
                          <span className="text-small text-forest-soft">{menuPage.taxIncluded}</span>
                        </p>
                      </div>
                      {dish.description && (
                        <p className="mt-2 text-body text-forest-soft">
                          <Phrases>{dish.description}</Phrases>
                        </p>
                      )}
                    </div>
                    {dish.image && (
                      <Plate
                        src={dish.image.url}
                        alt={dish.image.alt}
                        sizes="(min-width: 768px) 144px, 96px"
                        className="w-24 md:w-36"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <Link
        href={`/${locale}`}
        className="mt-16 inline-block rounded-sm text-body text-leaf-deep underline decoration-leaf/50 underline-offset-[0.4em] transition-colors duration-300 hover:text-forest hover:decoration-forest focus-visible:outline-2 focus-visible:outline-ring md:mt-20"
      >
        {menuPage.back}
      </Link>
    </main>
  );
}
