-- 40U Social Club database setup
-- Run this file in Supabase SQL Editor before using /admin.

create extension if not exists pgcrypto;

drop table if exists public.registrations cascade;
drop table if exists public.events cascade;

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null check (category in ('social','sports','reading','yoga','workshop','art','movie','coffee','hangout')),
  city text not null,
  country text not null,
  venue text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null check (capacity > 0),
  published boolean not null default false,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  birthday_month integer not null check (birthday_month between 1 and 12),
  birthday_day integer not null check (birthday_day between 1 and 31),
  created_at timestamptz not null default now(),
  unique(event_id, user_id)
);

create index events_upcoming_idx on public.events (published, starts_at);
create index registrations_user_idx on public.registrations (user_id, created_at desc);

create or replace function public.is_40u_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select lower(coalesce(auth.jwt() ->> 'email', '')) = 'triftan88@gmail.com' $$;

alter table public.events enable row level security;
alter table public.registrations enable row level security;

create policy "published events are public" on public.events for select using ((published = true and archived = false) or public.is_40u_admin());
create policy "admin can create events" on public.events for insert with check (public.is_40u_admin());
create policy "admin can update events" on public.events for update using (public.is_40u_admin()) with check (public.is_40u_admin());
create policy "admin can delete events" on public.events for delete using (public.is_40u_admin());

create policy "members can see their own registrations" on public.registrations for select using (auth.uid() = user_id or public.is_40u_admin());
create or replace function public.event_has_capacity(target_event_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.events e where e.id = target_event_id and e.published = true and e.archived = false and e.starts_at > now() and (select count(*) from public.registrations r where r.event_id = target_event_id) < e.capacity) $$;

create policy "members can register themselves" on public.registrations for insert with check (auth.uid() = user_id and public.event_has_capacity(event_id));
create policy "members can cancel their own registrations" on public.registrations for delete using (auth.uid() = user_id or public.is_40u_admin());
create policy "admin can update registrations" on public.registrations for update using (public.is_40u_admin()) with check (public.is_40u_admin());

create or replace function public.touch_events_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger events_updated_at before update on public.events for each row execute procedure public.touch_events_updated_at();

-- Optional starter content for a new database. Replace or remove before launch.
insert into public.events (title, description, category, city, country, venue, starts_at, ends_at, capacity, published) values
('Coffee, no agenda', 'A soft landing for a Saturday morning. Come as you are, stay as long as you like.', 'coffee', 'Singapore', 'Singapore', 'Tiong Bahru', '2026-10-10 10:30:00+08', '2026-10-10 12:00:00+08', 18, true),
('The book we never finished', 'A very low-pressure reading circle for curious people and unfinished books.', 'reading', 'London', 'United Kingdom', 'Hackney Library', '2026-10-17 14:00:00+01', '2026-10-17 16:00:00+01', 14, true);
