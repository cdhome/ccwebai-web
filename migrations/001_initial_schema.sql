create extension if not exists vector;

create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  avatar_url text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  device_id text not null unique,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  first_language text,
  first_timezone text,
  latest_extension_version text,
  latest_region text
);

create table if not exists installations (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  extension_version text not null,
  browser text,
  language text,
  timezone text,
  source text default 'unknown',
  installed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_installations_device_id on installations(device_id);
create index if not exists idx_installations_installed_at on installations(installed_at desc);

create table if not exists usage_events (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references devices(id) on delete cascade,
  event_type text not null,
  provider_id text,
  model text,
  extension_version text,
  region text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_usage_events_device_id on usage_events(device_id);
create index if not exists idx_usage_events_occurred_at on usage_events(occurred_at desc);
create index if not exists idx_usage_events_event_type on usage_events(event_type);

create table if not exists issues (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  device_id uuid references devices(id) on delete set null,
  title text not null,
  description text not null,
  provider_id text,
  extension_version text,
  reproduction_steps text,
  status text not null default 'open',
  priority_score integer not null default 0,
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_issues_status on issues(status);
create index if not exists idx_issues_priority_score on issues(priority_score desc);
create index if not exists idx_issues_created_at on issues(created_at desc);

create table if not exists issue_votes (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issues(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(issue_id, user_id)
);

create table if not exists issue_comments (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issues(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists issue_logs (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid references issues(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size bigint not null default 0,
  raw_text text,
  created_at timestamptz not null default now()
);

create table if not exists issue_embeddings (
  issue_id uuid primary key references issues(id) on delete cascade,
  embedding vector(1536),
  model text,
  updated_at timestamptz not null default now()
);

insert into users (email, name, role)
values
  ('admin@ccwebai.com', 'CCWebAI Admin', 'admin'),
  ('ops@ccwebai.com', 'CCWebAI Ops', 'admin')
on conflict (email) do nothing;
