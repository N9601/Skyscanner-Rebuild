-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  trips jsonb not null default '[]'::jsonb,
  alerts jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

drop policy if exists "Users manage own data" on public.user_data;
create policy "Users manage own data"
  on public.user_data
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
