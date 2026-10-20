-- =========================================================
-- SHWE THA ZIN: 最初のテーブル
-- =========================================================

-- ---------- 種類（enum） ----------
create type public.staff_role as enum ('owner', 'staff');
create type public.reservation_status as enum ('pending', 'confirmed', 'cancelled');
create type public.order_type as enum ('dine_in', 'takeout');
create type public.order_status as enum ('new', 'preparing', 'ready', 'completed', 'cancelled');

-- ---------- updated_at を自動で新しくする ----------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------- お店の人 ----------
create table public.staff (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 100),
  role       public.staff_role not null default 'staff',
  created_at timestamptz not null default now()
);

-- ログインしている人が staff かどうか
-- security definer なので、staff テーブルの RLS を通らずに確認できる（ループしない）
create function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.staff where user_id = (select auth.uid())
  );
$$;

-- ---------- メニューの分類 ----------
create table public.menu_categories (
  id         uuid primary key default gen_random_uuid(),
  name_ja    text not null check (char_length(name_ja) between 1 and 100),
  name_en    text not null check (char_length(name_en) between 1 and 100),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- メニュー ----------
create table public.menu_items (
  id             uuid primary key default gen_random_uuid(),
  category_id    uuid not null references public.menu_categories (id) on delete restrict,
  name_ja        text not null check (char_length(name_ja) between 1 and 100),
  name_en        text not null check (char_length(name_en) between 1 and 100),
  description_ja text not null default '' check (char_length(description_ja) <= 1000),
  description_en text not null default '' check (char_length(description_en) <= 1000),
  price          integer not null check (price >= 0),  -- 円（税込み）
  image_path     text,                                 -- Storage の menu-images の中のパス
  is_available   boolean not null default true,        -- false = 売り切れ
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index menu_items_category_id_idx on public.menu_items (category_id);

-- ---------- 予約（リクエスト型：お店の人が確定かキャンセルをする） ----------
create table public.reservations (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 1 and 100),
  phone         text not null check (char_length(phone) between 5 and 30),
  email         text check (char_length(email) <= 254),
  party_size    integer not null check (party_size between 1 and 20),
  reserved_at   timestamptz not null,
  note          text check (char_length(note) <= 500),
  status        public.reservation_status not null default 'pending',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index reservations_reserved_at_idx on public.reservations (reserved_at);

-- ---------- 注文 ----------
create table public.orders (
  id            uuid primary key default gen_random_uuid(),
  order_no      bigint generated always as identity unique,  -- お店で呼ぶ番号
  order_type    public.order_type not null,
  table_number  text check (char_length(table_number) between 1 and 10),
  pickup_at     timestamptz,
  customer_name text check (char_length(customer_name) between 1 and 100),
  phone         text check (char_length(phone) between 5 and 30),
  note          text check (char_length(note) <= 500),
  total_price   integer not null check (total_price >= 0),
  status        public.order_status not null default 'new',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- 店内：テーブル番号がいる / 持ち帰り：受け取り時間・名前・電話がいる
  constraint orders_type_fields check (
    (order_type = 'dine_in'
      and table_number is not null
      and pickup_at is null)
    or
    (order_type = 'takeout'
      and table_number is null
      and pickup_at is not null
      and customer_name is not null
      and phone is not null)
  )
);
create index orders_status_created_at_idx on public.orders (status, created_at desc);

-- ---------- 注文の中身 ----------
create table public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid references public.menu_items (id) on delete set null,
  -- 注文したときの名前と値段をコピーして残す
  item_name_ja text not null,
  item_name_en text not null,
  unit_price   integer not null check (unit_price >= 0),
  quantity     integer not null check (quantity between 1 and 99)
);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_menu_item_id_idx on public.order_items (menu_item_id);

-- ---------- updated_at のトリガー ----------
create trigger set_updated_at before update on public.menu_categories
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.menu_items
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.reservations
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- =========================================================
-- RLS
-- =========================================================
alter table public.staff           enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items      enable row level security;
alter table public.reservations    enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;

-- staff：自分の行だけ見られる（追加・変更は Supabase のダッシュボードでする）
create policy "staff can read own row" on public.staff
  for select to authenticated
  using (user_id = (select auth.uid()));

-- メニューの分類：だれでも見られる / 変えられるのはお店の人だけ
create policy "anyone can read categories" on public.menu_categories
  for select to anon, authenticated
  using (true);
create policy "staff can insert categories" on public.menu_categories
  for insert to authenticated
  with check ((select public.is_staff()));
create policy "staff can update categories" on public.menu_categories
  for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));
create policy "staff can delete categories" on public.menu_categories
  for delete to authenticated
  using ((select public.is_staff()));

-- メニュー：だれでも見られる（売り切れも表示する） / 変えられるのはお店の人だけ
create policy "anyone can read menu items" on public.menu_items
  for select to anon, authenticated
  using (true);
create policy "staff can insert menu items" on public.menu_items
  for insert to authenticated
  with check ((select public.is_staff()));
create policy "staff can update menu items" on public.menu_items
  for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));
create policy "staff can delete menu items" on public.menu_items
  for delete to authenticated
  using ((select public.is_staff()));

-- 予約：お店の人だけが見る・変える
-- お客さんはテーブルに直接書けない。request_reservation() 関数を使う
create policy "staff can read reservations" on public.reservations
  for select to authenticated
  using ((select public.is_staff()));
create policy "staff can update reservations" on public.reservations
  for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

-- 注文：お店の人だけが見る・変える
-- お客さんはテーブルに直接書けない。place_order() 関数を使う
create policy "staff can read orders" on public.orders
  for select to authenticated
  using ((select public.is_staff()));
create policy "staff can update orders" on public.orders
  for update to authenticated
  using ((select public.is_staff()))
  with check ((select public.is_staff()));

create policy "staff can read order items" on public.order_items
  for select to authenticated
  using ((select public.is_staff()));

-- =========================================================
-- お客さん用の関数
-- =========================================================

-- 予約のリクエスト（状態は必ず pending から）
create function public.request_reservation(
  p_customer_name text,
  p_phone         text,
  p_party_size    integer,
  p_reserved_at   timestamptz,
  p_email         text default null,
  p_note          text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_reserved_at <= now() then
    raise exception '予約の日時は、これから先の日時にしてください';
  end if;

  insert into public.reservations (customer_name, phone, email, party_size, reserved_at, note)
  values (
    trim(p_customer_name),
    trim(p_phone),
    nullif(trim(p_email), ''),
    p_party_size,
    p_reserved_at,
    nullif(trim(p_note), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- 注文
-- p_items は [{"menu_item_id": "...", "quantity": 2}, ...] の形
-- 値段と合計は DB のメニューから計算する（お客さんが送った値段は使わない）
create function public.place_order(
  p_order_type    public.order_type,
  p_items         jsonb,
  p_table_number  text default null,
  p_pickup_at     timestamptz default null,
  p_customer_name text default null,
  p_phone         text default null,
  p_note          text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_line_count integer;
  v_valid_count integer;
  v_total integer;
  v_order_id uuid;
  v_order_no bigint;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception '注文の中身がありません';
  end if;

  v_line_count := jsonb_array_length(p_items);
  if v_line_count = 0 or v_line_count > 50 then
    raise exception '注文の数がまちがっています';
  end if;

  if p_order_type = 'takeout' and (p_pickup_at is null or p_pickup_at <= now()) then
    raise exception '受け取り時間は、これから先の時間にしてください';
  end if;

  -- 売っているメニューで、個数が 1〜99 のものだけを数えて、合計を出す
  select count(*), coalesce(sum(m.price * (e ->> 'quantity')::integer), 0)
    into v_valid_count, v_total
  from jsonb_array_elements(p_items) as e
  join public.menu_items as m
    on m.id = (e ->> 'menu_item_id')::uuid
   and m.is_available
  where (e ->> 'quantity')::integer between 1 and 99;

  if v_valid_count <> v_line_count then
    raise exception '注文できないメニューか、まちがった個数があります';
  end if;

  insert into public.orders (
    order_type, table_number, pickup_at, customer_name, phone, note, total_price
  )
  values (
    p_order_type,
    nullif(trim(p_table_number), ''),
    p_pickup_at,
    nullif(trim(p_customer_name), ''),
    nullif(trim(p_phone), ''),
    nullif(trim(p_note), ''),
    v_total
  )
  returning id, order_no into v_order_id, v_order_no;

  insert into public.order_items (
    order_id, menu_item_id, item_name_ja, item_name_en, unit_price, quantity
  )
  select v_order_id, m.id, m.name_ja, m.name_en, m.price, (e ->> 'quantity')::integer
  from jsonb_array_elements(p_items) as e
  join public.menu_items as m on m.id = (e ->> 'menu_item_id')::uuid;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_no', v_order_no,
    'total_price', v_total
  );
end;
$$;

-- 関数を使えるのは anon と authenticated だけ
revoke execute on function public.request_reservation(text, text, integer, timestamptz, text, text) from public;
revoke execute on function public.place_order(public.order_type, jsonb, text, timestamptz, text, text, text) from public;
grant execute on function public.request_reservation(text, text, integer, timestamptz, text, text) to anon, authenticated;
grant execute on function public.place_order(public.order_type, jsonb, text, timestamptz, text, text, text) to anon, authenticated;

-- =========================================================
-- Realtime：新しい注文の通知（RLS があるので、お店の人にだけ届く）
-- =========================================================
alter publication supabase_realtime add table public.orders;

-- =========================================================
-- Storage：メニューの写真
-- =========================================================
insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true);

create policy "staff can upload menu images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'menu-images' and (select public.is_staff()));
create policy "staff can update menu images" on storage.objects
  for update to authenticated
  using (bucket_id = 'menu-images' and (select public.is_staff()))
  with check (bucket_id = 'menu-images' and (select public.is_staff()));
create policy "staff can delete menu images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'menu-images' and (select public.is_staff()));
