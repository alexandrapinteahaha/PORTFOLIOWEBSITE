create extension if not exists pgcrypto;
create extension if not exists citext;

create type artwork_status as enum ('available', 'sold', 'archived', 'hidden');
create type product_type as enum (
  'original',
  'physical_print',
  'print_club_subscription',
  'digital_download',
  'commission_enquiry',
  'archive_only'
);
create type order_status as enum ('pending', 'paid', 'failed', 'refunded');
create type enquiry_status as enum ('new', 'reviewed', 'replied', 'closed');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext unique not null,
  full_name text,
  role text not null default 'subscriber',
  is_admin boolean not null default false,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table artworks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  year integer not null,
  medium text not null,
  dimensions text,
  description text,
  status artwork_status not null default 'available',
  categories text[] not null default '{}',
  series text,
  price_gbp integer,
  edition_info text,
  shipping_notes text,
  certificate_note text,
  print_available boolean not null default false,
  image_url text,
  gallery text[] not null default '{}',
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table artwork_images (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references artworks(id) on delete cascade,
  storage_path text,
  image_url text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  product_type product_type not null,
  artwork_id uuid references artworks(id) on delete set null,
  description text,
  price_gbp integer,
  stock_quantity integer,
  is_active boolean not null default true,
  image_url text,
  stripe_price_id text,
  shipping_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint original_stock_once check (
    product_type <> 'original'
    or stock_quantity is null
    or stock_quantity between 0 and 1
  )
);

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text,
  image_url text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  stripe_checkout_session_id text unique,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  email citext,
  status order_status not null default 'pending',
  total_gbp numeric(10, 2),
  currency text not null default 'gbp',
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  artwork_id uuid references artworks(id) on delete set null,
  title text not null,
  product_type product_type not null,
  quantity integer not null default 1,
  unit_price_gbp numeric(10, 2),
  created_at timestamptz not null default now()
);

create table print_club_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  year integer not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(year)
);

create table digital_files (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_type text not null,
  storage_bucket text not null default 'protected',
  storage_path text not null,
  is_subscriber_only boolean not null default true,
  product_id uuid references products(id) on delete set null,
  artwork_id uuid references artworks(id) on delete set null,
  created_at timestamptz not null default now()
);

create table print_club_months (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references print_club_projects(id) on delete cascade,
  title text not null,
  month integer not null check (month between 1 and 12),
  year integer not null,
  description text,
  image_url text,
  digital_file_id uuid references digital_files(id) on delete set null,
  process_pdf_id uuid references digital_files(id) on delete set null,
  monthly_letter_file_id uuid references digital_files(id) on delete set null,
  shipping_status text not null default 'pending',
  subscriber_only boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(year, month)
);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table subscriber_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  print_club_month_id uuid references print_club_months(id) on delete cascade,
  digital_file_id uuid references digital_files(id) on delete cascade,
  granted_at timestamptz not null default now(),
  unique(user_id, digital_file_id)
);

create table commission_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email citext not null,
  phone text,
  commission_type text not null,
  budget_range text not null,
  timeframe text not null,
  message text not null,
  status enquiry_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email citext unique not null,
  consent boolean not null default true,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table site_content (
  key text primary key,
  title text,
  body text,
  metadata jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table cv_entries (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  title text not null,
  institution text,
  location text,
  year_start integer,
  year_end integer,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index artworks_status_idx on artworks(status);
create index artworks_year_idx on artworks(year desc);
create index artworks_categories_idx on artworks using gin(categories);
create index artworks_series_idx on artworks(series);
create index products_type_idx on products(product_type);
create index products_artwork_id_idx on products(artwork_id);
create index products_active_idx on products(is_active) where is_active = true;
create index orders_user_id_idx on orders(user_id);
create index orders_session_idx on orders(stripe_checkout_session_id);
create index subscriptions_customer_idx on subscriptions(stripe_customer_id);
create index subscriptions_status_idx on subscriptions(status);
create index commission_status_idx on commission_enquiries(status);

create or replace function is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = user_id and is_admin = true
  );
$$;

create or replace function has_active_subscription(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles p
    join subscriptions s on s.stripe_customer_id = p.stripe_customer_id
    where p.id = user_id
      and s.status in ('active', 'trialing')
  );
$$;

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function handle_new_user();

create or replace function mark_original_product_sold(
  purchased_product_id uuid,
  checkout_session_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_product products%rowtype;
begin
  select *
  into target_product
  from products
  where id = purchased_product_id
  for update;

  if not found then
    return false;
  end if;

  if target_product.product_type <> 'original'
    or coalesce(target_product.stock_quantity, 0) <> 1
    or target_product.is_active is not true then
    return false;
  end if;

  update products
  set stock_quantity = 0,
      is_active = false,
      updated_at = now()
  where id = purchased_product_id;

  update artworks
  set status = 'sold',
      price_gbp = null,
      updated_at = now()
  where id = target_product.artwork_id;

  update orders
  set metadata = metadata || jsonb_build_object('original_locked', true)
  where stripe_checkout_session_id = checkout_session_id;

  return true;
end;
$$;

create or replace view artworks_public as
select
  id,
  slug,
  title,
  year,
  medium,
  dimensions,
  description,
  status,
  categories,
  series,
  price_gbp,
  edition_info,
  shipping_notes,
  certificate_note,
  print_available,
  image_url,
  gallery,
  created_at
from artworks
where hidden = false and status <> 'hidden';

create or replace view products_public as
select
  id,
  slug,
  title,
  product_type,
  artwork_id,
  description,
  price_gbp,
  stock_quantity,
  is_active,
  image_url,
  stripe_price_id,
  created_at
from products
where is_active = true;

create or replace view print_club_months_public as
select
  id,
  title,
  month,
  year,
  description,
  image_url,
  subscriber_only,
  created_at
from print_club_months;

alter table profiles enable row level security;
alter table artworks enable row level security;
alter table artwork_images enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table print_club_projects enable row level security;
alter table print_club_months enable row level security;
alter table subscriptions enable row level security;
alter table subscriber_access enable row level security;
alter table digital_files enable row level security;
alter table commission_enquiries enable row level security;
alter table newsletter_signups enable row level security;
alter table site_content enable row level security;
alter table cv_entries enable row level security;

create policy "public read visible artworks"
on artworks for select
using (hidden = false and status <> 'hidden');

create policy "admin manage artworks"
on artworks for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "public read active products"
on products for select
using (is_active = true);

create policy "admin manage products"
on products for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "public read print club projects"
on print_club_projects for select
using (is_active = true);

create policy "admin manage print club projects"
on print_club_projects for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "public read print club previews"
on print_club_months for select
using (true);

create policy "admin manage print club months"
on print_club_months for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "own profile read"
on profiles for select
using (auth.uid() = id or is_admin(auth.uid()));

create policy "own profile update"
on profiles for update
using (auth.uid() = id)
with check (auth.uid() = id and is_admin = false);

create policy "own orders read"
on orders for select
using (auth.uid() = user_id or is_admin(auth.uid()));

create policy "admin manage orders"
on orders for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "own subscriptions read"
on subscriptions for select
using (
  is_admin(auth.uid())
  or exists (
    select 1 from profiles
    where profiles.id = auth.uid()
      and profiles.stripe_customer_id = subscriptions.stripe_customer_id
  )
);

create policy "admin manage subscriptions"
on subscriptions for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "subscriber file access"
on digital_files for select
using (
  is_admin(auth.uid())
  or is_subscriber_only = false
  or has_active_subscription(auth.uid())
  or exists (
    select 1 from subscriber_access
    where subscriber_access.user_id = auth.uid()
      and subscriber_access.digital_file_id = digital_files.id
  )
);

create policy "admin manage files"
on digital_files for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "public create enquiries"
on commission_enquiries for insert
with check (true);

create policy "admin manage enquiries"
on commission_enquiries for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "public create newsletter signups"
on newsletter_signups for insert
with check (consent = true);

create policy "admin manage newsletter"
on newsletter_signups for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "public read site content"
on site_content for select
using (true);

create policy "admin manage site content"
on site_content for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "public read cv entries"
on cv_entries for select
using (true);

create policy "admin manage cv entries"
on cv_entries for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "public read images"
on artwork_images for select
using (true);

create policy "admin manage artwork images"
on artwork_images for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "public read product images"
on product_images for select
using (true);

create policy "admin manage product images"
on product_images for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "admin manage order items"
on order_items for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

create policy "own access read"
on subscriber_access for select
using (auth.uid() = user_id or is_admin(auth.uid()));

create policy "admin manage subscriber access"
on subscriber_access for all
using (is_admin(auth.uid()))
with check (is_admin(auth.uid()));

comment on table digital_files is 'Store private file paths in a protected Supabase Storage bucket. Do not expose subscriber-only paths publicly.';
comment on table products is 'Original products must use stock 1 or 0. Webhooks call mark_original_product_sold after successful payment.';
comment on table commission_enquiries is 'Future email notification integration can be added from the server action or database webhook.';
