-- Supabase SQL Editor da ishlating.
-- Jadval: name, price, emoji (logo)

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  emoji text not null default '🍽️',
  created_at timestamptz default now()
);

-- Row Level Security (ixtiyoriy): barcha o‘qishga ochiq, yozish faqat service role orqali
alter table public.menu_items enable row level security;

create policy "Menu items are viewable by everyone"
  on public.menu_items for select
  using (true);

-- Demo ma’lumotlar (ixtiyoriy — bir marta ishlating)
insert into public.menu_items (name, price, emoji) values
  ('Burger', 5.00, '🍔'),
  ('Fries', 3.50, '🍟'),
  ('Hot Dog', 4.00, '🌭'),
  ('Pizza', 6.00, '🍕'),
  ('Donut', 2.50, '🍩'),
  ('Ice Cream', 3.00, '🍦'),
  ('Soda', 2.00, '🥤'),
  ('Cola', 2.00, '🥤'),
  ('Pepsi', 2.00, '🥤'),
  ('Cake', 4.50, '🍰');
