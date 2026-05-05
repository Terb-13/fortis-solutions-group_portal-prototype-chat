-- Fortis Edge: conversations for admin review, training knowledge, FAQs, estimate status.
-- Apply in Supabase SQL editor or via CLI migrations.

-- ---------------------------------------------------------------------------
-- Conversations + messages (synced from the public assistant)
-- ---------------------------------------------------------------------------
create table if not exists public.fortis_conversations (
  id uuid primary key,
  title text not null default '',
  status text not null default 'active'
    check (status in ('active', 'archived', 'needs_review')),
  flags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fortis_messages (
  id text primary key,
  conversation_id uuid not null references public.fortis_conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  message_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists fortis_messages_conversation_idx
  on public.fortis_messages (conversation_id, message_index);

create index if not exists fortis_conversations_updated_idx
  on public.fortis_conversations (updated_at desc);

-- ---------------------------------------------------------------------------
-- Operator-approved knowledge snippets (injected into chat via Next.js)
-- ---------------------------------------------------------------------------
create table if not exists public.fortis_knowledge (
  id uuid primary key default gen_random_uuid (),
  title text,
  content text not null,
  source text not null default 'admin_training',
  published boolean not null default true,
  conversation_id uuid references public.fortis_conversations (id) on delete set null,
  assistant_message_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fortis_knowledge_published_idx
  on public.fortis_knowledge (published)
  where published = true;

-- ---------------------------------------------------------------------------
-- Published FAQs (optional public API + chat context)
-- ---------------------------------------------------------------------------
create table if not exists public.fortis_faq (
  id text primary key,
  question text not null,
  answer text not null,
  category text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fortis_faq_published_idx
  on public.fortis_faq (published, sort_order);

-- ---------------------------------------------------------------------------
-- Estimates: add status if missing (table may already exist)
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'fortis_estimates'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'fortis_estimates'
      and column_name = 'status'
  ) then
    alter table public.fortis_estimates
      add column status text not null default 'generated';
  end if;
end $$;

-- Enable RLS (defaults deny anon). Service role bypasses RLS.
alter table public.fortis_conversations enable row level security;
alter table public.fortis_messages enable row level security;
alter table public.fortis_knowledge enable row level security;
alter table public.fortis_faq enable row level security;

-- Optional: read published knowledge + FAQs with anon key (chat + public FAQ API)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'fortis_faq'
      and policyname = 'fortis_faq_public_read_published'
  ) then
    create policy fortis_faq_public_read_published
      on public.fortis_faq
      for select
      to anon, authenticated
      using (published = true);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'fortis_knowledge'
      and policyname = 'fortis_knowledge_public_read_published'
  ) then
    create policy fortis_knowledge_public_read_published
      on public.fortis_knowledge
      for select
      to anon, authenticated
      using (published = true);
  end if;
end $$;
