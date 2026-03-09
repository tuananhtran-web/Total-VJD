-- Fix Courts Table and RLS
-- Run this script in Supabase SQL Editor to fix the 404 error

-- 1. Create Courts table if not exists
create table if not exists public.courts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete cascade,
  name text not null,
  price_per_hour double precision default 0,
  open_time text default '06:00 - 22:00',
  status text default 'active',
  images text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable RLS
alter table public.courts enable row level security;

-- 3. Add Policies (Drop existing first to avoid errors)
drop policy if exists "Public access courts" on public.courts;
create policy "Public access courts" on public.courts for all using (true);

-- 4. Verify Clubs table RLS
alter table public.clubs enable row level security;
drop policy if exists "Public access clubs" on public.clubs;
create policy "Public access clubs" on public.clubs for all using (true);
