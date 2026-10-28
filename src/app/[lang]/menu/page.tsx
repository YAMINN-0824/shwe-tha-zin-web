import type { Metadata } from "next";
import Link from "next/link";
import { CategoryTabs } from "@/components/site/category-tabs";
import { MenuCategorySection } from "@/components/site/menu-category";
import { Phrases } from "@/components/site/phrases";
import { SectionHeading } from "@/components/site/section-heading";
import { getDictionary, getLocale } from "@/i18n/get-dictionary";
import { getMenu } from "@/lib/menu";

export async function generateMetadata(): Promise<Metadata> {
  const { menuPage } = await getDictionary();
  return { title: menuPage.title };
}

// メニューのページ：お店に出している料理を、分類ごとに（DESIGN.md「メニューのページ」）
// 横から入ってくるお皿で、横スクロールが出ないように overflow-x-clip（sticky のタブは動く）
export default async function MenuPage() {
  const locale = await getLocale();
  const { menuPage } = await getDictionary();
  const categories = await getMenu(locale);

  return (
    <main className="mx-auto w-full max-w-6xl overflow-x-clip px-5 py-20 md:py-28">
      <SectionHeading as="h1" id="menu-heading" label={menuPage.label} heading={menuPage.heading} />
      <p className="mt-6 text-body text-forest-soft">
        <Phrases>{menuPage.body}</Phrases>
      </p>

      {categories.length === 0 ? (
        <p className="mt-14 text-body">
          <Phrases>{menuPage.empty}</Phrases>
        </p>
      ) : (
        <>
          <CategoryTabs
            label={menuPage.categories}
            categories={categories.map((category) => ({ id: category.id, name: category.name }))}
          />
          <div className="mt-16 flex flex-col gap-28 md:mt-24 md:gap-36">
            {categories.map((category, index) => (
              <MenuCategorySection
                key={category.id}
                category={category}
                text={menuPage}
                preload={index === 0}
              />
            ))}
          </div>
        </>
      )}

      <Link
        href={`/${locale}`}
        className="mt-20 inline-block rounded-sm text-body text-leaf-deep underline decoration-leaf/50 underline-offset-[0.4em] transition-colors duration-300 hover:text-forest hover:decoration-forest focus-visible:outline-2 focus-visible:outline-ring md:mt-28"
      >
        {menuPage.back}
      </Link>
    </main>
  );
}
