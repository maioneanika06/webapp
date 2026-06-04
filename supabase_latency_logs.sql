create table if not exists public.latency_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  app_name text not null,
  process text not null,
  latency_sec numeric not null,
  status text not null default 'success',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists latency_logs_created_at_idx
  on public.latency_logs (created_at desc);

create index if not exists latency_logs_app_process_idx
  on public.latency_logs (app_name, process);

alter table public.latency_logs enable row level security;

drop policy if exists "Allow public latency inserts" on public.latency_logs;
create policy "Allow public latency inserts"
  on public.latency_logs
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Allow authenticated latency reads" on public.latency_logs;
create policy "Allow authenticated latency reads"
  on public.latency_logs
  for select
  to authenticated
  using (true);
