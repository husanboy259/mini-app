-- ============================================================
-- Xato: "new row violates row-level security policy for table 'orders'"
-- Supabase Dashboard → SQL Editor da BARCHA qatorlarni tanlab Run bosing.
-- ============================================================

-- 1) Barcha mavjud policy larni o'chirish (nomlar farq qilishi mumkin)
do $$
declare
  r record;
begin
  for r in (select policyname from pg_policies where tablename = 'orders' and schemaname = 'public')
  loop
    execute format('drop policy if exists %I on public.orders', r.policyname);
  end loop;
end $$;

-- 2) Anon (frontend) va authenticated uchun INSERT ruxsati
create policy "orders_insert_anon"
  on public.orders for insert
  to anon
  with check (true);

create policy "orders_insert_authenticated"
  on public.orders for insert
  to authenticated
  with check (true);

-- 3) INSERT dan keyin .select('id') ishlashi uchun anon o'qiy oladi
create policy "orders_select_anon"
  on public.orders for select
  to anon
  using (true);

-- 4) Jadvalga ruxsatlar
grant insert, select on public.orders to anon;
grant usage on schema public to anon;
