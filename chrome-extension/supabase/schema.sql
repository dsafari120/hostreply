-- Run this in Supabase → SQL Editor → New query

-- ── property_configs ────────────────────────────────────────────────────────
create table public.property_configs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users not null unique,
  host_name    text not null default '',
  prop_name    text not null default '',
  personality  text not null default '',
  checkin      text not null default '',
  checkout     text not null default '',
  wifi_name    text not null default '',
  wifi_pass    text not null default '',
  parking      text not null default '',
  rules        text not null default '',
  extra        text not null default '',
  updated_at   timestamptz not null default now()
);

alter table public.property_configs enable row level security;

create policy "Users manage their own config"
  on public.property_configs
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── saved_replies ────────────────────────────────────────────────────────────
create table public.saved_replies (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users not null,
  guest_message text not null,
  reply         text not null,
  tag           text not null default 'Other',
  saved_at      timestamptz not null default now()
);

alter table public.saved_replies enable row level security;

create policy "Users manage their own replies"
  on public.saved_replies
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
