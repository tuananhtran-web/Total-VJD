-- Reset Database Script
-- This script will DROP existing tables (except Users) and re-create them with the correct schema.
-- It ensures all columns required by the app are present.

-- 1. Drop existing tables to ensure clean slate (Order matters due to dependencies)
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.notifications;
DROP TABLE IF EXISTS public.packages;
DROP TABLE IF EXISTS public.clubs; -- This was likely the issue (schema mismatch)
DROP TABLE IF EXISTS public.courts;
DROP TABLE IF EXISTS public.system_settings;

-- Note: We do NOT drop public."VJD" (Users) to preserve user accounts. 
-- We assume "VJD" exists and has 'id' as bigint (based on previous error).

-- 2. Create Clubs table (Full Schema)
create table public.clubs (
  id uuid primary key default gen_random_uuid(), -- Use gen_random_uuid() which is built-in
  name text not null,
  address text,
  price_range text,
  open_time text default '06:00 - 22:00',
  rating float default 5.0,
  type text default 'daily', -- 'daily' or 'event'
  category_id text default '1',
  distance text default '0km',
  description text,
  image text,
  -- Extra columns required by ClubService
  tags text[] default array[]::text[],
  services text[] default array[]::text[],
  images text[] default array[]::text[],
  rules text[] default array[]::text[],
  
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create Courts table
create table public.courts (
  id uuid primary key default gen_random_uuid(),
  club_id uuid references public.clubs(id) on delete cascade,
  name text not null,
  price_per_hour double precision default 0,
  open_time text default '06:00 - 22:00',
  status text default 'active',
  images text[] default array[]::text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create Packages table
create table public.packages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_months integer default 1,
  price_original double precision default 0,
  price_sale double precision default 0,
  description text,
  features jsonb default '[]'::jsonb,
  is_best_seller boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Create Bookings table
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id bigint references public."VJD"(id), -- References VJD(id) which is bigint
  date text not null, -- Format YYYY-MM-DD
  slots jsonb default '[]'::jsonb,
  court_id text not null, 
  total_price double precision default 0,
  status text default 'pending', -- pending, confirmed, cancelled
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Create Notifications table
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  type text default 'system',
  date text, 
  is_read boolean default false,
  user_id bigint, -- Matches VJD id type
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Create System Settings table
create table public.system_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 7. Insert Initial Data (Sample Clubs)
insert into public.clubs (name, address, price_range, open_time, rating, type, category_id, distance, image, description)
values 
('Sân Pickleball Apolo', '123 Nguyễn Văn Linh, Q.7', '50.000đ/h', '06:00 - 22:00', 4.8, 'daily', '1', '2.5km', 'https://img.freepik.com/free-photo/pickleball-court-with-net_23-2149729604.jpg', 'Sân mới, đẹp, thoáng mát.'),
('Sân Cầu Lông VJD', '456 Lê Văn Việt, Q.9', '40.000đ/h', '05:00 - 23:00', 4.5, 'daily', '2', '5.0km', 'https://img.freepik.com/free-photo/badminton-court-indoor_23-2149729607.jpg', 'Sân thảm tiêu chuẩn thi đấu.'),
('Sân Bóng Đá Mini', '789 Phạm Văn Đồng, Thủ Đức', '200.000đ/h', '06:00 - 00:00', 4.2, 'daily', '3', '8.0km', 'https://img.freepik.com/free-photo/soccer-field-green-grass_23-2149729608.jpg', 'Sân cỏ nhân tạo chất lượng cao.');

-- 8. Insert Initial Data (System Settings)
insert into public.system_settings (key, value)
values (
  'global_settings', 
  '{"maintenanceMode": false, "homeBanners": ["https://img.freepik.com/free-vector/gradient-sport-facebook-cover-template_23-2149729606.jpg", "https://img.freepik.com/free-vector/flat-design-sport-facebook-cover_23-2149729605.jpg"], "contactPhone": "0901234567"}'::jsonb
)
on conflict (key) do nothing;

-- 9. Enable RLS
alter table public.clubs enable row level security;
create policy "Public access clubs" on public.clubs for all using (true);

alter table public.courts enable row level security;
create policy "Public access courts" on public.courts for all using (true);

alter table public.packages enable row level security;
create policy "Public access packages" on public.packages for all using (true);

alter table public.bookings enable row level security;
create policy "Public access bookings" on public.bookings for all using (true);

alter table public.notifications enable row level security;
create policy "Public access notifications" on public.notifications for all using (true);

alter table public.system_settings enable row level security;
create policy "Public access settings" on public.system_settings for all using (true);
