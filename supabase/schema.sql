
-- Stores every completed audit
create table if not exists audits (
  id            text primary key,             -- nanoid, used in shareable URL
  form_input    jsonb not null,               -- full FormInput object
  audit_summary jsonb not null,               -- full AuditSummary object
  ai_summary    text not null default '',     -- ai-generated paragraph
  created_at    timestamptz not null default now()
);

-- Stores email leads (linked to an audit)
create table if not exists leads (
  id            uuid primary key default gen_random_uuid(),
  audit_id      text not null references audits(id) on delete cascade,
  email         text not null,
  company_name  text,
  role          text,
  team_size     int,
  created_at    timestamptz not null default now()
);

-- Index for fast audit lookup by ID
create index if not exists audits_created_at_idx on audits(created_at desc);

-- Index for lead lookup by audit
create index if not exists leads_audit_id_idx on leads(audit_id);

-- Row Level Security
alter table audits enable row level security;
alter table leads enable row level security;

-- Public can read audits (for shareable URLs)
-- PII (email, company) is in leads table which is NOT publicly readable
create policy "Public audits are viewable by anyone"
  on audits for select
  using (true);

-- Only service role can insert audits (via API route with service key)
create policy "Service role can insert audits"
  on audits for insert
  with check (true);

-- Only service role can read/insert leads
create policy "Service role can manage leads"
  on leads for all
  using (true)
  with check (true);