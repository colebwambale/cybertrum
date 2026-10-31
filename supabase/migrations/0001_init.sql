-- Sentinel Supply: initial schema. Run in the Supabase SQL editor or via `supabase db push`.
create extension if not exists pgcrypto;

create type user_role      as enum ('customer', 'staff', 'admin', 'super_admin');
create type order_status   as enum ('pending_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
create type payment_status as enum ('pending', 'paid', 'failed', 'refunded');
create type quote_status   as enum ('draft', 'ready_to_review', 'accepted', 'declined', 'expired');
create type ticket_status  as enum ('open', 'awaiting_customer', 'resolved');

create sequence order_seq start 10001;
create sequence quote_seq start 2001;
create sequence ticket_seq start 3001;

-- ---------- Helpers ----------
create function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- Profiles (1:1 with auth.users) ----------
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  company    text,
  phone      text,
  role       user_role not null default 'customer',
  created_at timestamptz not null default now()
);

create function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

create function is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('staff', 'admin', 'super_admin'));
$$;

-- ---------- Catalogue ----------
create table categories (
  id   uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique
);

create table products (
  id          uuid primary key default gen_random_uuid(),
  sku         text not null unique,
  slug        text not null unique,
  name        text not null,
  brand       text,
  category_id uuid references categories(id),
  summary     text,
  description text,
  specs       jsonb not null default '{}',
  price       numeric(14,2) not null check (price >= 0),
  currency    text not null default 'USD' check (currency in ('UGX', 'USD')),
  warranty    text,
  image_url   text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger products_updated before update on products for each row execute function set_updated_at();

create table inventory (
  product_id    uuid primary key references products(id) on delete cascade,
  on_hand       integer not null default 0 check (on_hand >= 0),
  reorder_level integer not null default 5
);

create table inventory_movements (
  id         bigint generated always as identity primary key,
  product_id uuid not null references products(id),
  delta      integer not null,
  reason     text not null,          -- sale | restock | adjustment | return
  order_id   uuid,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create view low_stock as
  select p.id, p.sku, p.name, i.on_hand, i.reorder_level
  from inventory i join products p on p.id = i.product_id
  where i.on_hand <= i.reorder_level;

-- ---------- Customers ----------
create table addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  label      text,
  line1      text not null,
  city       text not null,
  district   text,
  country    text not null default 'Uganda',
  phone      text,
  is_default boolean not null default false
);

create table wishlist_items (
  user_id    uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  primary key (user_id, product_id)
);

-- ---------- Orders & payments ----------
create table orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique default ('SS-' || nextval('order_seq')),
  user_id        uuid not null references profiles(id),
  status         order_status not null default 'pending_payment',
  currency       text not null check (currency in ('UGX', 'USD')),
  subtotal       numeric(14,2) not null,
  vat            numeric(14,2) not null,
  shipping       numeric(14,2) not null default 0,
  total          numeric(14,2) not null,
  payment_method text not null,        -- mobile_money | card | bank_transfer
  delivery       jsonb not null,       -- snapshot of name/email/phone/address at order time
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger orders_updated before update on orders for each row execute function set_updated_at();

create table order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  name       text not null,
  sku        text not null,
  unit_price numeric(14,2) not null,
  qty        integer not null check (qty > 0)
);

create table payments (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references orders(id) on delete cascade,
  provider        text not null,
  reference       text not null unique,
  provider_txn_id text,
  amount          numeric(14,2) not null,
  currency        text not null,
  status          payment_status not null default 'pending',
  raw             jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger payments_updated before update on payments for each row execute function set_updated_at();

-- Called by the payment webhook (service role). Idempotent: only acts on pending orders.
create function mark_order_paid(p_order_id uuid) returns void language plpgsql security definer set search_path = public as $$
declare it record;
begin
  update orders set status = 'confirmed' where id = p_order_id and status = 'pending_payment';
  if not found then return; end if;
  for it in select product_id, qty from order_items where order_id = p_order_id loop
    update inventory set on_hand = greatest(on_hand - it.qty, 0) where product_id = it.product_id;
    insert into inventory_movements (product_id, delta, reason, order_id) values (it.product_id, -it.qty, 'sale', p_order_id);
  end loop;
end $$;
revoke execute on function mark_order_paid(uuid) from public, anon, authenticated;

-- ---------- Quotations & support ----------
create table quotations (
  id           uuid primary key default gen_random_uuid(),
  quote_number text not null unique default ('QT-' || nextval('quote_seq')),
  user_id      uuid not null references profiles(id),
  title        text not null,
  status       quote_status not null default 'draft',
  currency     text not null default 'USD' check (currency in ('UGX', 'USD')),
  valid_until  date,
  notes        text,
  created_at   timestamptz not null default now()
);

create table quotation_items (
  id           uuid primary key default gen_random_uuid(),
  quotation_id uuid not null references quotations(id) on delete cascade,
  product_id   uuid references products(id),
  description  text not null,
  unit_price   numeric(14,2) not null,
  qty          integer not null check (qty > 0)
);

create table support_requests (
  id            uuid primary key default gen_random_uuid(),
  ticket_number text not null unique default ('SR-' || nextval('ticket_seq')),
  user_id       uuid not null references profiles(id),
  subject       text not null,
  body          text not null,
  status        ticket_status not null default 'open',
  created_at    timestamptz not null default now()
);

-- ---------- Web Push ----------
create table push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table profiles            enable row level security;
alter table categories          enable row level security;
alter table products            enable row level security;
alter table inventory           enable row level security;
alter table inventory_movements enable row level security;
alter table addresses           enable row level security;
alter table wishlist_items      enable row level security;
alter table orders              enable row level security;
alter table order_items         enable row level security;
alter table payments            enable row level security;
alter table quotations          enable row level security;
alter table quotation_items     enable row level security;
alter table support_requests    enable row level security;
alter table push_subscriptions  enable row level security;

-- Users may edit only these profile columns; role changes go through the service role / dashboard.
revoke update on profiles from authenticated;
grant update (full_name, company, phone) on profiles to authenticated;
create policy profiles_read   on profiles for select using (id = auth.uid() or is_staff());
create policy profiles_update on profiles for update using (id = auth.uid());

create policy categories_read  on categories for select using (true);
create policy categories_write on categories for all using (is_staff()) with check (is_staff());
create policy products_read    on products   for select using (is_active or is_staff());
create policy products_write   on products   for all using (is_staff()) with check (is_staff());

create policy inventory_staff  on inventory           for all    using (is_staff()) with check (is_staff());
create policy movements_staff  on inventory_movements for select using (is_staff());

create policy addresses_own on addresses      for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy wishlist_own  on wishlist_items for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy push_own      on push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Orders are created server-side (service role), so customers only need read access.
create policy orders_read  on orders for select using (user_id = auth.uid() or is_staff());
create policy orders_staff on orders for update using (is_staff());
create policy order_items_read on order_items for select
  using (exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_staff())));
create policy payments_read on payments for select
  using (exists (select 1 from orders o where o.id = order_id and (o.user_id = auth.uid() or is_staff())));

create policy quotes_read   on quotations for select using (user_id = auth.uid() or is_staff());
create policy quotes_insert on quotations for insert with check (user_id = auth.uid() and status = 'draft');
create policy quotes_staff  on quotations for all using (is_staff()) with check (is_staff());
create policy quote_items_read  on quotation_items for select
  using (exists (select 1 from quotations q where q.id = quotation_id and (q.user_id = auth.uid() or is_staff())));
create policy quote_items_staff on quotation_items for all using (is_staff()) with check (is_staff());

create policy tickets_own   on support_requests for select using (user_id = auth.uid() or is_staff());
create policy tickets_insert on support_requests for insert with check (user_id = auth.uid());
create policy tickets_staff on support_requests for update using (is_staff());
