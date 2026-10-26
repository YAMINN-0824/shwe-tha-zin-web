import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Locale } from "@/i18n/config";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/supabase/database.types";

// メニューの写真を入れる Storage のバケット（image_path はこの中のパス）
const MENU_IMAGES_BUCKET = "menu-images";
// トップページに出す人気料理の数
const MAX_POPULAR_DISHES = 4;

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  // 写真がないときは null
  image: { url: string; alt: string } | null;
};

export type MenuCategory = {
  id: string;
  name: string;
  dishes: Dish[];
};

type MenuItemRow = Pick<
  Database["public"]["Tables"]["menu_items"]["Row"],
  | "id"
  | "name_ja"
  | "name_en"
  | "description_ja"
  | "description_en"
  | "price"
  | "image_path"
  | "image_alt_ja"
  | "image_alt_en"
>;

const itemColumns =
  "id, name_ja, name_en, description_ja, description_en, price, image_path, image_alt_ja, image_alt_en";

function toDish(
  row: MenuItemRow,
  locale: Locale,
  supabase: ReturnType<typeof createPublicClient>,
): Dish {
  const name = locale === "ja" ? row.name_ja : row.name_en;
  const alt = locale === "ja" ? row.image_alt_ja : row.image_alt_en;
  return {
    id: row.id,
    name,
    description: locale === "ja" ? row.description_ja : row.description_en,
    price: row.price,
    image: row.image_path
      ? {
          url: supabase.storage.from(MENU_IMAGES_BUCKET).getPublicUrl(row.image_path).data.publicUrl,
          // 写真の説明がまだないときは、料理の名前
          alt: alt || name,
        }
      : null,
  };
}

// メニューは、だれが見ても同じ。数分ごとに新しくする
// TODO: 管理画面でメニューを変えたら updateTag("menu") で、すぐ新しくする

// トップページの人気料理（お店に出していて、写真があるもの。最大 4 つ）
export async function getPopularDishes(locale: Locale): Promise<Dish[]> {
  "use cache";
  cacheTag("menu");
  cacheLife("minutes");

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("menu_items")
    .select(itemColumns)
    .eq("is_available", true)
    .eq("is_popular", true)
    .not("image_path", "is", null)
    .order("popular_sort_order", { ascending: true })
    .limit(MAX_POPULAR_DISHES);
  if (error) {
    throw new Error(`人気料理を読み込めませんでした: ${error.message}`);
  }
  return data.map((row) => toDish(row, locale, supabase));
}

// メニューのページ：分類ごとの、お店に出している料理（料理のない分類は出さない）
export async function getMenu(locale: Locale): Promise<MenuCategory[]> {
  "use cache";
  cacheTag("menu");
  cacheLife("minutes");

  const supabase = createPublicClient();
  // お店に出していない料理は、RLS でお客さんには見えない。ここでもしぼる
  const { data, error } = await supabase
    .from("menu_categories")
    .select(`id, name_ja, name_en, menu_items (${itemColumns})`)
    .eq("menu_items.is_available", true)
    .order("sort_order", { ascending: true })
    .order("sort_order", { referencedTable: "menu_items", ascending: true });
  if (error) {
    throw new Error(`メニューを読み込めませんでした: ${error.message}`);
  }
  return data
    .filter((category) => category.menu_items.length > 0)
    .map((category) => ({
      id: category.id,
      name: locale === "ja" ? category.name_ja : category.name_en,
      dishes: category.menu_items.map((row) => toDish(row, locale, supabase)),
    }));
}

// 「¥1,500」
export function formatPrice(price: number): string {
  return `¥${price.toLocaleString("en-US")}`;
}
