-- =========================================================
-- RLS と place_order() / request_reservation() のテスト
-- ローカルの Supabase で動かす（npx supabase start のあと）:
--   docker exec -i supabase_db_shwe-tha-zin-web psql -U postgres -d postgres -X < supabase/tests/rls_and_functions.sql
-- 結果は NOTICE に PASS / FAIL で出る。最後に全部ロールバックするので、データは残らない。
-- 注意: pgTAP ではないので、npx supabase test db では動かない。
-- =========================================================
\set ON_ERROR_STOP on
\set QUIET on
set client_min_messages = notice;
begin;

-- ---------- テスト用データ（postgres として入れる） ----------
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'staff@test.local'),
  ('22222222-2222-2222-2222-222222222222', 'customer@test.local');
insert into public.staff (user_id, name) values ('11111111-1111-1111-1111-111111111111', 'Test Staff');
insert into public.menu_categories (id, name_ja, name_en) values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'カレー', 'Curry');
insert into public.menu_items (id, category_id, name_ja, name_en, price, is_available) values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'aaaaaaaa-0000-0000-0000-000000000001', 'チキンカレー', 'Chicken Curry', 1000, true),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'aaaaaaaa-0000-0000-0000-000000000001', '売り切れカレー', 'Sold Out Curry', 1200, false);
-- 過去の予約と注文（スタッフが後で更新できるか確認する）
insert into public.reservations (id, customer_name, phone, party_size, reserved_at) values
  ('cccccccc-0000-0000-0000-000000000001', 'Old Guest', '0900000000', 2, now() - interval '3 days');
insert into public.orders (id, order_type, pickup_at, customer_name, phone, total_price) values
  ('dddddddd-0000-0000-0000-000000000001', 'takeout', now() - interval '3 days', 'Old Buyer', '0900000000', 1000);

create function pg_temp.ok(label text, cond boolean) returns void language plpgsql as $$
begin
  raise notice '% %', case when cond then 'PASS' else 'FAIL' end, label;
end $$;
create function pg_temp.expect_error(label text, stmt text) returns void language plpgsql as $$
begin
  execute stmt;
  raise notice 'FAIL % (エラーにならなかった)', label;
exception when others then
  raise notice 'PASS % → %', label, sqlerrm;
end $$;
grant execute on all functions in schema pg_temp to anon, authenticated;

-- =========================================================
\echo '--- 1. お客さん (anon) ---'
set local role anon;
select pg_temp.ok('anon: reservations が 0 行に見える', (select count(*) from public.reservations) = 0);
select pg_temp.ok('anon: orders が 0 行に見える',       (select count(*) from public.orders) = 0);
select pg_temp.ok('anon: order_items が 0 行に見える',  (select count(*) from public.order_items) = 0);
select pg_temp.ok('anon: staff が 0 行に見える',        (select count(*) from public.staff) = 0);
-- マイグレーションの仮のメニューも入っているので、テスト用の分類だけで数える
select pg_temp.ok('anon: お店に出している料理だけ見える (1 行)', (select count(*) from public.menu_items where category_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 1);
select pg_temp.ok('anon: 出していない料理は見えない',
  not exists (select 1 from public.menu_items where id = 'bbbbbbbb-0000-0000-0000-000000000002'));
select pg_temp.expect_error('anon: orders に直接 INSERT できない',
  $q$insert into public.orders (order_type, table_number, total_price) values ('dine_in', 'T1', 0)$q$);
select pg_temp.expect_error('anon: reservations に直接 INSERT できない',
  $q$insert into public.reservations (customer_name, phone, party_size, reserved_at) values ('x', '00000', 1, now() + interval '1 day')$q$);
select pg_temp.expect_error('anon: menu_items を INSERT できない',
  $q$insert into public.menu_items (category_id, name_ja, name_en, price) values ('aaaaaaaa-0000-0000-0000-000000000001', 'x', 'x', 1)$q$);
update public.menu_items set price = 1 where true;
select pg_temp.ok('anon: menu_items の UPDATE は 0 行 (値段は変わらない)',
  (select price from public.menu_items where id = 'bbbbbbbb-0000-0000-0000-000000000001') = 1000);
-- 予約は anon には見えないので、postgres にもどって確かめる
update public.reservations set status = 'cancelled' where true;
delete from public.reservations where true;
reset role;
select pg_temp.ok('anon: reservations を UPDATE できていない',
  (select status from public.reservations where id = 'cccccccc-0000-0000-0000-000000000001') = 'pending');
select pg_temp.ok('anon: reservations を DELETE できていない', (select count(*) from public.reservations) = 1);
set local role anon;

\echo '--- 2. request_reservation() (anon) ---'
select pg_temp.ok('予約できる (pending になる)',
  public.request_reservation('  山田  ', '09012345678', 4, now() + interval '2 days', '', ' 窓側 ') is not null);
select pg_temp.expect_error('過去の日時は NG',
  $q$select public.request_reservation('山田', '09012345678', 2, now() - interval '1 hour')$q$);
select pg_temp.expect_error('人数 0 は NG',
  $q$select public.request_reservation('山田', '09012345678', 0, now() + interval '1 day')$q$);
select pg_temp.expect_error('人数 21 は NG',
  $q$select public.request_reservation('山田', '09012345678', 21, now() + interval '1 day')$q$);
select pg_temp.expect_error('名前が空は NG',
  $q$select public.request_reservation('   ', '09012345678', 2, now() + interval '1 day')$q$);
select pg_temp.ok('予約したあとも anon には見えない', (select count(*) from public.reservations) = 0);

\echo '--- 3. place_order() (anon) ---'
select public.place_order('dine_in',
  '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000001","quantity":3}]', 'T5') as dine_in_result \gset
\echo '   結果:' :dine_in_result
select pg_temp.ok('店内注文: 合計 3000 円 (DB の値段で計算)', (:'dine_in_result'::jsonb ->> 'total_price')::int = 3000);
select pg_temp.ok('持ち帰り注文ができる',
  public.place_order('takeout', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000001","quantity":1}]',
    null, now() + interval '30 minutes', '佐藤', '09011112222') is not null);
select pg_temp.expect_error('持ち帰り: 過去の受け取り時間は NG',
  $q$select public.place_order('takeout', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000001","quantity":1}]', null, now() - interval '1 minute', '佐藤', '09011112222')$q$);
select pg_temp.expect_error('持ち帰り: 受け取り時間なしは NG',
  $q$select public.place_order('takeout', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000001","quantity":1}]', null, null, '佐藤', '09011112222')$q$);
select pg_temp.expect_error('持ち帰り: 電話なしは NG',
  $q$select public.place_order('takeout', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000001","quantity":1}]', null, now() + interval '30 minutes', '佐藤', null)$q$);
select pg_temp.expect_error('店内: テーブル番号なしは NG',
  $q$select public.place_order('dine_in', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000001","quantity":1}]')$q$);
select pg_temp.expect_error('売り切れメニューは NG',
  $q$select public.place_order('dine_in', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000002","quantity":1}]', 'T1')$q$);
select pg_temp.expect_error('存在しないメニューは NG',
  $q$select public.place_order('dine_in', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-00000000ffff","quantity":1}]', 'T1')$q$);
select pg_temp.expect_error('個数 0 は NG',
  $q$select public.place_order('dine_in', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000001","quantity":0}]', 'T1')$q$);
select pg_temp.expect_error('個数 100 は NG',
  $q$select public.place_order('dine_in', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000001","quantity":100}]', 'T1')$q$);
select pg_temp.expect_error('空の注文は NG',
  $q$select public.place_order('dine_in', '[]', 'T1')$q$);
select pg_temp.expect_error('送った値段は無視される (price キーは使われない) → 個数なしで NG',
  $q$select public.place_order('dine_in', '[{"menu_item_id":"bbbbbbbb-0000-0000-0000-000000000001","price":1}]', 'T1')$q$);
select pg_temp.ok('注文したあとも anon には見えない', (select count(*) from public.orders) = 0);

reset role;
-- =========================================================
\echo '--- 4. ログインしているけど staff ではない人 ---'
select set_config('request.jwt.claims', '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
set local role authenticated;
select pg_temp.ok('非 staff: reservations が 0 行', (select count(*) from public.reservations) = 0);
select pg_temp.ok('非 staff: orders が 0 行',       (select count(*) from public.orders) = 0);
select pg_temp.ok('非 staff: order_items が 0 行',  (select count(*) from public.order_items) = 0);
select pg_temp.ok('非 staff: is_staff() = false',   not public.is_staff());
select pg_temp.ok('非 staff: お店に出している料理だけ見える (1 行)', (select count(*) from public.menu_items where category_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 1);
update public.menu_items set is_popular = true where true;
update public.orders set status = 'cancelled' where true;
update public.reservations set status = 'cancelled' where true;
delete from public.reservations where true;
reset role;
select pg_temp.ok('非 staff: menu_items を UPDATE できていない (人気にできない)',
  not exists (select 1 from public.menu_items where category_id = 'aaaaaaaa-0000-0000-0000-000000000001' and is_popular));
select pg_temp.ok('非 staff: orders を UPDATE できていない',
  not exists (select 1 from public.orders where status = 'cancelled'));
select pg_temp.ok('非 staff: reservations を UPDATE できていない',
  not exists (select 1 from public.reservations where status = 'cancelled'));
select pg_temp.ok('非 staff: reservations を DELETE できていない', (select count(*) from public.reservations) = 2);

-- =========================================================
\echo '--- 5. お店の人 (staff) ---'
select set_config('request.jwt.claims', '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);
set local role authenticated;
select pg_temp.ok('staff: is_staff() = true', public.is_staff());
select pg_temp.ok('staff: reservations が 2 行 (過去 1 + 新しい 1)', (select count(*) from public.reservations) = 2);
select pg_temp.ok('staff: orders が 3 行 (過去 1 + 新しい 2)',       (select count(*) from public.orders) = 3);
select pg_temp.ok('staff: order_items が 2 行',                    (select count(*) from public.order_items) = 2);
select pg_temp.ok('staff: 新しい予約は pending で、名前と note は trim、空の email は null',
  exists (select 1 from public.reservations
          where customer_name = '山田' and note = '窓側' and email is null and status = 'pending'));
select pg_temp.ok('staff: order_items に名前と値段がコピーされている',
  exists (select 1 from public.order_items where item_name_ja = 'チキンカレー' and unit_price = 1000 and quantity = 3));
select pg_temp.ok('staff: staff テーブルは自分の行だけ', (select count(*) from public.staff) = 1);
select pg_temp.ok('staff: 出していない料理も見える (2 行)', (select count(*) from public.menu_items where category_id = 'aaaaaaaa-0000-0000-0000-000000000001') = 2);
update public.menu_items set is_popular = true, popular_sort_order = 5 where id = 'bbbbbbbb-0000-0000-0000-000000000001';
select pg_temp.ok('staff: 人気料理にできる',
  (select is_popular and popular_sort_order = 5 from public.menu_items where id = 'bbbbbbbb-0000-0000-0000-000000000001'));

update public.reservations set status = 'confirmed' where id = 'cccccccc-0000-0000-0000-000000000001';
select pg_temp.ok('staff: 過去の予約を UPDATE できる',
  (select status from public.reservations where id = 'cccccccc-0000-0000-0000-000000000001') = 'confirmed');
update public.reservations set status = 'cancelled' where customer_name = '山田';
select pg_temp.ok('staff: 予約をキャンセルにできる',
  (select status from public.reservations where customer_name = '山田') = 'cancelled');
update public.reservations set status = 'pending' where customer_name = '山田';
select pg_temp.ok('staff: キャンセルした予約を確認待ちに戻せる',
  (select status from public.reservations where customer_name = '山田') = 'pending');
delete from public.reservations where true;
select pg_temp.ok('staff でも reservations は DELETE できない (ポリシーがない)',
  (select count(*) from public.reservations) = 2);
update public.orders set status = 'completed' where id = 'dddddddd-0000-0000-0000-000000000001';
select pg_temp.ok('staff: 過去の注文 (pickup_at が過去) を UPDATE できる',
  (select status from public.orders where id = 'dddddddd-0000-0000-0000-000000000001') = 'completed');
update public.menu_items set price = 1100 where id = 'bbbbbbbb-0000-0000-0000-000000000001';
select pg_temp.ok('staff: メニューの値段を変えられる',
  (select price from public.menu_items where id = 'bbbbbbbb-0000-0000-0000-000000000001') = 1100);
select pg_temp.expect_error('staff でも orders に直接 INSERT はできない (関数を使う)',
  $q$insert into public.orders (order_type, table_number, total_price) values ('dine_in', 'T1', 0)$q$);

reset role;
rollback;
\echo '--- 終わり（全部ロールバック済み） ---'
