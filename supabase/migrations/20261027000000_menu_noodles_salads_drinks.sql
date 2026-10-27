-- =========================================================
-- メニュー：めん・サラダ・飲み物の料理を足す
-- 写真は Storage の menu-images の dishes/ に入れる（photos-upload/dishes/ から）
-- 同じ id がもうあれば入れない（もう一度流しても、ふえない）
-- 人気料理（is_popular）は変えない：ミャンマーごはんセットと揚げ物の盛り合わせだけ
-- =========================================================

-- ---------- 前の仮の料理を、お店に出さない（消さない） ----------
-- モヒンガー、シャン・カウスエ、ミャンマーミルクティー
update public.menu_items
set is_available = false
where id in (
  '0d000000-0000-4000-8000-000000000004',
  '0d000000-0000-4000-8000-000000000005',
  '0d000000-0000-4000-8000-000000000006'
);

-- ---------- 新しい料理 ----------
-- すべての料理（くり返さないよう、ここにまとめて書く）:
--   TODO: real price（値段は仮）
--   TODO: 説明は仮。お店の言葉に入れかえる
--   TODO: replace with real shop photo before going live（写真はストックの写真）
insert into public.menu_items (
  id, category_id, name_ja, name_en, description_ja, description_en, price,
  image_path, image_alt_ja, image_alt_en, sort_order
) values
  -- ===== めん =====
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000007', '0c000000-0000-4000-8000-000000000002',
   'ミャンマー風春雨スープ', 'Burmese Glass Noodle Soup',
   'ミャンマー風の春雨スープです。（仮）',
   'A Burmese-style glass noodle soup. (placeholder)',
   1200,
   'dishes/burmese-glass-noodle-soup.png',
   'どんぶりに入った、ミャンマー風春雨スープ',
   'A bowl of Burmese glass noodle soup',
   30),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000008', '0c000000-0000-4000-8000-000000000002',
   'ミャンマー風豚肉の汁なし麺', 'Burmese Pork Noodle Soup (Dry Style)',
   'ミャンマー風の、豚肉の汁なし麺です。（仮）',
   'Burmese-style pork noodles, served dry. (placeholder)',
   1200,
   'dishes/burmese-pork-noodle-soup-dry-style.png',
   'お皿に盛られた、ミャンマー風豚肉の汁なし麺',
   'A plate of Burmese pork noodles, dry style',
   40),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000009', '0c000000-0000-4000-8000-000000000002',
   'ミャンマー風ピリ辛米麺スープ', 'Burmese Spicy Rice Noodle Soup',
   'ミャンマー風の、ピリ辛の米麺スープです。（仮）',
   'A Burmese-style spicy rice noodle soup. (placeholder)',
   1200,
   'dishes/burmese-spicy-rice-noodle-soup.png',
   'どんぶりに入った、ミャンマー風ピリ辛米麺スープ',
   'A bowl of Burmese spicy rice noodle soup',
   50),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000010', '0c000000-0000-4000-8000-000000000002',
   'ココナッツチキンヌードルスープ', 'Coconut Noodle Soup',
   'ココナッツのチキンヌードルスープです。（仮）',
   'A coconut noodle soup. (placeholder)',
   1200,
   'dishes/coconut-noodle-soup.png',
   'どんぶりに入った、ココナッツチキンヌードルスープ',
   'A bowl of coconut noodle soup',
   60),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000011', '0c000000-0000-4000-8000-000000000002',
   'ミャンマー風温かい豆腐麺', 'Warm Burmese Tofu Noodle',
   'ミャンマー風の、温かい豆腐麺です。（仮）',
   'Warm Burmese-style tofu noodles. (placeholder)',
   1200,
   'dishes/warm-burmese-tofu-noodle.png',
   'どんぶりに入った、ミャンマー風温かい豆腐麺',
   'A bowl of warm Burmese tofu noodles',
   70),

  -- ===== サラダ =====
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000012', '0c000000-0000-4000-8000-000000000003',
   'ミャンマー風パパイヤサラダ', 'Burmese Papaya Salad',
   'ミャンマー風のパパイヤサラダです。（仮）',
   'A Burmese-style papaya salad. (placeholder)',
   900,
   'dishes/burmese-papaya-salad.png',
   'お皿に盛られた、ミャンマー風パパイヤサラダ',
   'A plate of Burmese papaya salad',
   20),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000013', '0c000000-0000-4000-8000-000000000003',
   'ミャンマー風太麺サラダ', 'Burmese Thick Rice Noodle Salad',
   'ミャンマー風の、太麺のサラダです。（仮）',
   'A Burmese-style thick rice noodle salad. (placeholder)',
   900,
   'dishes/burmese-thick-rice-noodle-salad.png',
   'どんぶりに入った、ミャンマー風太麺サラダ',
   'A bowl of Burmese thick rice noodle salad',
   30),

  -- ===== 飲み物 =====
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000014', '0c000000-0000-4000-8000-000000000005',
   'アボカドジュース', 'Avocado Juice',
   'アボカドのジュースです。（仮）',
   'Avocado juice. (placeholder)',
   500,
   'dishes/avocado-juice.png',
   'グラスに入ったアボカドジュース',
   'A glass of avocado juice',
   20),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000015', '0c000000-0000-4000-8000-000000000005',
   'ファルーダ', 'Falooda',
   'ファルーダです。（仮）',
   'Falooda. (placeholder)',
   500,
   'dishes/falooda.png',
   'グラスに入ったファルーダ',
   'A glass of falooda',
   30),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000016', '0c000000-0000-4000-8000-000000000005',
   'キウイソーダ', 'Kiwi Soda',
   'キウイのソーダです。（仮）',
   'Kiwi soda. (placeholder)',
   500,
   'dishes/kiwi-soda.png',
   'グラスに入ったキウイソーダ',
   'A glass of kiwi soda',
   40),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000017', '0c000000-0000-4000-8000-000000000005',
   'ライムジュース', 'Lime Juice',
   'ライムのジュースです。（仮）',
   'Lime juice. (placeholder)',
   500,
   'dishes/limes-juice.png',
   'グラスに入ったライムジュース',
   'A glass of lime juice',
   50),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000018', '0c000000-0000-4000-8000-000000000005',
   'モンラッサウン', 'Mont Lat Saung',
   'モンラッサウンです。（仮）',
   'Mont lat saung. (placeholder)',
   500,
   'dishes/mont-lat-saung.png',
   'グラスに入ったモンラッサウン',
   'A glass of mont lat saung',
   60),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000019', '0c000000-0000-4000-8000-000000000005',
   'オレンジジュース', 'Orange Juice',
   'オレンジのジュースです。（仮）',
   'Orange juice. (placeholder)',
   500,
   'dishes/orange-juice.png',
   'グラスに入ったオレンジジュース',
   'A glass of orange juice',
   70),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000020', '0c000000-0000-4000-8000-000000000005',
   'サトウキビジュース', 'Sugarcane Juice',
   'サトウキビのジュースです。（仮）',
   'Sugarcane juice. (placeholder)',
   500,
   'dishes/sugarcane-juice.png',
   'グラスに入ったサトウキビジュース',
   'A glass of sugarcane juice',
   80),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000021', '0c000000-0000-4000-8000-000000000005',
   'ドラゴンフルーツジュース', 'Dragon Fruit Juice',
   'ドラゴンフルーツのジュースです。（仮）',
   'Dragon fruit juice. (placeholder)',
   500,
   'dishes/dragon-fruit-juice.png',
   'グラスに入ったドラゴンフルーツジュース',
   'A glass of dragon fruit juice',
   90),
  -- TODO: real price / TODO: 説明は仮 / TODO: replace with real shop photo before going live
  ('0d000000-0000-4000-8000-000000000022', '0c000000-0000-4000-8000-000000000005',
   'スイカジュース', 'Watermelon Juice',
   'スイカのジュースです。（仮）',
   'Watermelon juice. (placeholder)',
   500,
   'dishes/watermelon-juice.png',
   'グラスに入ったスイカジュース',
   'A glass of watermelon juice',
   100)
on conflict (id) do nothing;
