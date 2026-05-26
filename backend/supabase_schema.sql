-- ==========================================
-- CALEN DESIGN — MIGRACIÓN BASE DE DATOS (SCHEMA "calen")
-- ==========================================

-- 1. CREACIÓN DEL SCHEMA E AISLAMIENTO
create schema if not exists calen;

-- 2. CREACIÓN DE TABLAS Y RELACIONES

-- CATEGORIES
create table if not exists calen.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz default now()
);

-- PRODUCTS
create table if not exists calen.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category_id uuid references calen.categories(id) on delete set null,
  price numeric(10,2) not null,
  images text[] default '{}',
  active boolean default true,
  created_at timestamptz default now()
);

-- VARIANTS
create table if not exists calen.variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references calen.products(id) on delete cascade,
  size text,
  color text,
  stock integer default 0,
  created_at timestamptz default now()
);

-- ORDERS
create table if not exists calen.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text default 'pending',
  total numeric(10,2) not null,
  shipping_address jsonb,
  mp_payment_id text,
  created_at timestamptz default now()
);

-- ORDER_ITEMS
create table if not exists calen.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references calen.orders(id) on delete cascade,
  variant_id uuid references calen.variants(id) on delete set null,
  quantity integer not null,
  unit_price numeric(10,2) not null
);

-- SHIPPING_LABELS
create table if not exists calen.shipping_labels (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references calen.orders(id) on delete cascade,
  carrier text,
  tracking_number text,
  label_url text,
  created_at timestamptz default now()
);

-- ==========================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table calen.categories enable row level security;
alter table calen.products enable row level security;
alter table calen.variants enable row level security;
alter table calen.orders enable row level security;
alter table calen.order_items enable row level security;
alter table calen.shipping_labels enable row level security;

-- ==========================================
-- 4. DEFINICIÓN DE POLÍTICAS RLS EN EL SCHEMA "calen"
-- ==========================================

-- CATEGORIES
create policy "Allow public read access for categories"
  on calen.categories for select
  using (true);

create policy "Allow admin write access for categories"
  on calen.categories for all
  using (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'))
  with check (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'));

-- PRODUCTS
create policy "Allow public read access for active products"
  on calen.products for select
  using (active = true or ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'));

create policy "Allow admin write access for products"
  on calen.products for all
  using (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'))
  with check (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'));

-- VARIANTS
create policy "Allow public read access for variants"
  on calen.variants for select
  using (true);

create policy "Allow admin write access for variants"
  on calen.variants for all
  using (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'))
  with check (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'));

-- ORDERS
create policy "Allow users to read their own orders"
  on calen.orders for select
  using (auth.uid() = user_id or ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'));

create policy "Allow users to create their own orders"
  on calen.orders for insert
  with check (auth.uid() = user_id or ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'));

create policy "Allow admin full access to orders"
  on calen.orders for all
  using (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'))
  with check (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'));

-- ORDER_ITEMS
create policy "Allow users to read their own order items"
  on calen.order_items for select
  using (
    exists (
      select 1 from calen.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    ) or ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
  );

create policy "Allow users to create their own order items"
  on calen.order_items for insert
  with check (
    exists (
      select 1 from calen.orders o
      where o.id = order_items.order_id and o.user_id = auth.uid()
    ) or ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
  );

create policy "Allow admin full access to order items"
  on calen.order_items for all
  using (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'))
  with check (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'));

-- SHIPPING_LABELS
create policy "Allow users to read their own shipping labels"
  on calen.shipping_labels for select
  using (
    exists (
      select 1 from calen.orders o
      where o.id = shipping_labels.order_id and o.user_id = auth.uid()
    ) or ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
  );

create policy "Allow admin full access to shipping labels"
  on calen.shipping_labels for all
  using (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'))
  with check (((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'));

-- ==========================================
-- 5. INSERTAR CATEGORÍAS INICIALES EN SCHEMA "calen"
-- ==========================================

insert into calen.categories (name, slug) values
  ('Remeras', 'remeras'),
  ('Buzos', 'buzos'),
  ('Vestidos', 'vestidos'),
  ('Lencería', 'lenceria'),
  ('Abrigos', 'abrigos')
on conflict (slug) do nothing;

-- ==========================================
-- 6. CREACIÓN Y CONFIGURACIÓN DE STORAGE ( buckets y objects son compartidos en schema storage )
-- ==========================================

-- Crear el bucket si no existe
insert into storage.buckets (id, name, public)
values ('calen-products', 'calen-products', true)
on conflict (id) do nothing;

-- Políticas de RLS para el Bucket calen-products
create policy "Public Access to Product Images"
  on storage.objects for select
  using (bucket_id = 'calen-products');

create policy "Admin Upload Product Images"
  on storage.objects for insert
  with check (
    bucket_id = 'calen-products' 
    and (
      ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
      or auth.jwt() ->> 'role' = 'service_role'
    )
  );

create policy "Admin Update Product Images"
  on storage.objects for update
  using (
    bucket_id = 'calen-products' 
    and (
      ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
      or auth.jwt() ->> 'role' = 'service_role'
    )
  );

create policy "Admin Delete Product Images"
  on storage.objects for delete
  using (
    bucket_id = 'calen-products' 
    and (
      ((auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin')
      or auth.jwt() ->> 'role' = 'service_role'
    )
  );

-- ==========================================
-- 7. VISTAS ACTUALIZABLES EN EL SCHEMA "public" (Workaround para Exposed Schemas)
-- ==========================================

-- Crear Vistas en SCHEMA "public" que apuntan a "calen"
create or replace view public.categories with (security_invoker = true) as 
select id, name, slug, created_at from calen.categories;

create or replace view public.products with (security_invoker = true) as 
select id, name, description, category_id, price, images, active, created_at from calen.products;

create or replace view public.variants with (security_invoker = true) as 
select id, product_id, size, color, stock, created_at from calen.variants;

create or replace view public.orders with (security_invoker = true) as 
select id, user_id, status, total, shipping_address, mp_payment_id, created_at from calen.orders;

create or replace view public.order_items with (security_invoker = true) as 
select id, order_id, variant_id, quantity, unit_price from calen.order_items;

create or replace view public.shipping_labels with (security_invoker = true) as 
select id, order_id, carrier, tracking_number, label_url, created_at from calen.shipping_labels;

-- Otorgar permisos sobre las vistas a los roles del API de Supabase
grant select, insert, update, delete on public.categories to anon, authenticated, service_role;
grant select, insert, update, delete on public.products to anon, authenticated, service_role;
grant select, insert, update, delete on public.variants to anon, authenticated, service_role;
grant select, insert, update, delete on public.orders to anon, authenticated, service_role;
grant select, insert, update, delete on public.order_items to anon, authenticated, service_role;
grant select, insert, update, delete on public.shipping_labels to anon, authenticated, service_role;

-- Asegurar permisos de uso en el schema "calen" para que las vistas puedan acceder
grant usage on schema calen to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema calen to anon, authenticated, service_role;
