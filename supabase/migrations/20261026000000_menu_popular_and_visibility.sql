-- =========================================================
-- メニュー：人気料理、写真の説明、お店に出す / 出さない
-- =========================================================

-- ---------- 欄を足す ----------
alter table public.menu_items
  add column is_popular         boolean not null default false,  -- true = トップページに出す人気料理
  add column popular_sort_order integer not null default 0,      -- トップページの順番（小さい数が先）
  add column image_alt_ja       text not null default '' check (char_length(image_alt_ja) <= 300),
  add column image_alt_en       text not null default '' check (char_length(image_alt_en) <= 300);

-- is_available の意味：true = お店に出す / false = 出さない（メニューにも注文にも出ない）
-- 売り切れも false にする（「かくす」と「売り切れ」は分けない）
comment on column public.menu_items.is_available is 'true = お店に出す / false = 出さない（かくす・売り切れ）';
comment on column public.menu_items.image_path is 'menu-images バケットの中のパス（例: dishes/rice-set.png）';

-- ---------- RLS：お客さんには、お店に出している料理だけ見せる ----------
drop policy "anyone can read menu items" on public.menu_items;
create policy "anyone can read available menu items" on public.menu_items
  for select to anon, authenticated
  using (is_available or (select public.is_staff()));

-- ---------- Storage：メニューの写真は 5MB まで、PNG / JPEG / WebP だけ ----------
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp']
where id = 'menu-images';

-- =========================================================
-- 仮のメニュー
-- TODO: お店の本当のメニュー（名前・説明・値段）に入れかえる
-- 同じ id がもうあれば入れない（もう一度流しても、ふえない）
-- =========================================================
insert into public.menu_categories (id, name_ja, name_en, sort_order) values
  ('0c000000-0000-4000-8000-000000000001', 'ごはんもの', 'Rice dishes', 10),
  ('0c000000-0000-4000-8000-000000000002', 'めん',       'Noodles',     20),
  ('0c000000-0000-4000-8000-000000000003', 'サラダ',     'Salads',      30),
  ('0c000000-0000-4000-8000-000000000004', '揚げ物',     'Fritters',    40),
  ('0c000000-0000-4000-8000-000000000005', '飲み物',     'Drinks',      50)
on conflict (id) do nothing;

insert into public.menu_items (
  id, category_id, name_ja, name_en, description_ja, description_en, price,
  image_path, image_alt_ja, image_alt_en, is_popular, popular_sort_order, sort_order
) values
  -- 人気 1 番。TODO: 名前・値段は仮
  ('0d000000-0000-4000-8000-000000000001', '0c000000-0000-4000-8000-000000000001',
   'ミャンマーごはんセット（仮）', 'Burmese rice set',
   'ごはんと、小さなおかずをいろいろ。少しずつ味わえます。',
   'Rice with a spread of small side dishes, a little of everything.',
   1500,
   'dishes/rice-set.png',
   '竹のお盆に、ごはんと、カレーやスープ、野菜のおかずの小さなお皿がたくさん並んでいる',
   'A woven tray with rice and many small bowls of curry, soup and vegetable dishes',
   true, 10, 10),
  -- 人気 2 番。TODO: 名前・値段は仮
  ('0d000000-0000-4000-8000-000000000002', '0c000000-0000-4000-8000-000000000004',
   '揚げ物の盛り合わせ（仮）', 'Burmese fritters platter',
   '野菜や豆をからりと揚げて、すっぱいたれをつけて。',
   'Crisp vegetable and bean fritters with a tangy dipping sauce.',
   1000,
   'dishes/fritters.png',
   '竹のお盆に、豆や野菜の揚げ物と、レタス、キャベツ、緑のたれが盛られている',
   'A woven tray of bean and vegetable fritters with lettuce, cabbage and a green sauce',
   true, 20, 10),
  -- いまは人気ではない。TODO: 説明・値段は仮
  ('0d000000-0000-4000-8000-000000000003', '0c000000-0000-4000-8000-000000000003',
   'ラペットゥ（お茶の葉のサラダ）', 'Tea leaf salad (laphet)',
   '発酵させたお茶の葉に、カリカリの豆やナッツ、トマトをあえて。（仮）',
   'Fermented tea leaves tossed with crunchy beans, nuts and tomato. (placeholder)',
   900,
   'dishes/laphet.png',
   'うるしの赤いお盆に盛られた、ラペットゥ（お茶の葉のサラダ）',
   'Tea leaf salad (laphet) on a red lacquer tray',
   false, 0, 10),
  -- TODO: 仮の料理（写真なし）
  ('0d000000-0000-4000-8000-000000000004', '0c000000-0000-4000-8000-000000000002',
   'モヒンガー（仮）', 'Mohinga (placeholder)',
   '魚のだしの、やさしいスープに米のめん。（仮）',
   'Rice noodles in a gentle fish broth. (placeholder)',
   1100, null, '', '', false, 0, 10),
  -- TODO: 仮の料理（写真なし）
  ('0d000000-0000-4000-8000-000000000005', '0c000000-0000-4000-8000-000000000002',
   'シャン・カウスエ（仮）', 'Shan noodles (placeholder)',
   '鶏肉とトマトのたれを、米のめんにからめて。（仮）',
   'Rice noodles with a chicken and tomato sauce. (placeholder)',
   1100, null, '', '', false, 0, 20),
  -- TODO: 仮の料理（写真なし）
  ('0d000000-0000-4000-8000-000000000006', '0c000000-0000-4000-8000-000000000005',
   'ミャンマーミルクティー（仮）', 'Burmese milk tea (placeholder)',
   'こい紅茶に、練乳を入れて。（仮）',
   'Strong black tea with condensed milk. (placeholder)',
   400, null, '', '', false, 0, 10)
on conflict (id) do nothing;
