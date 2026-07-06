create table if not exists native_host_releases (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  base_url text not null,
  notes text,
  is_active boolean not null default false,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_native_host_releases_active
  on native_host_releases (is_active)
  where is_active = true;

create index if not exists idx_native_host_releases_created_at
  on native_host_releases (created_at desc);
