-- ============================================================
-- ORDERS — Buyurtmalar jadvali
-- Foydalanuvchi tanlagan narsalari (Cola, Pepsi, Burger va boshqalar)
-- shu jadvalga yoziladi. Server Supabase dan o'qib Telegram botga
-- va SMS orqali admin ga yuboradi.
-- ============================================================
-- Supabase Dashboard → SQL Editor da ushbu faylni ishlating.
-- ============================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  telegram_user_id bigint not null,
  telegram_username text,
  first_name text,
  items jsonb not null default '[]',
  total_price numeric(10, 2) not null,
  created_at timestamptz default now()
);

comment on table public.orders is 'Foydalanuvchi buyurtmalari — tanlangan mahsulotlar (Cola, Pepsi va b.)';
comment on column public.orders.telegram_user_id is 'Telegram foydalanuvchi ID';
comment on column public.orders.telegram_username is 'Telegram username (@user)';
comment on column public.orders.first_name is 'Ism (Telegram dan)';
comment on column public.orders.items is 'Tanlangan mahsulotlar: [{ "name", "price", "emoji", "quantity" }]';
comment on column public.orders.total_price is 'Buyurtma jami narxi';
comment on column public.orders.created_at is 'Buyurtma vaqti';

alter table public.orders enable row level security;

-- Frontend (anon key) faqat yangi buyurtma qo'sha oladi
create policy "Anyone can insert orders"
  on public.orders for insert
  with check (true);

-- Server service_role orqali o'qiydi (RLS dan tashqari).
-- Agar admin panelda o'qish kerak bo'lsa, select policy qo'shing.
