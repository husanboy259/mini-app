-- Buyurtmaga telefon qo'shish: zakaz bergan mijozga SMS yuborish uchun
alter table public.orders
  add column if not exists phone text;

comment on column public.orders.phone is 'Mijoz telefon raqami (SMS tasdiq uchun, ixtiyoriy)';
