-- Backfill columns when fortis_conversations (or fortis_messages) existed before the admin
-- training migration. `CREATE TABLE IF NOT EXISTS` does not ALTER existing tables, which
-- caused POST /api/conversations/sync to fail with: column fortis_conversations.flags does not exist.

alter table public.fortis_conversations
  add column if not exists flags jsonb not null default '[]'::jsonb;

alter table public.fortis_conversations
  add column if not exists title text not null default '';

alter table public.fortis_conversations
  add column if not exists status text not null default 'active';

alter table public.fortis_conversations
  add column if not exists created_at timestamptz not null default now();

alter table public.fortis_conversations
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'fortis_messages'
  ) then
    alter table public.fortis_messages
      add column if not exists message_index int not null default 0;
    alter table public.fortis_messages
      add column if not exists created_at timestamptz not null default now();
  end if;
end $$;

create index if not exists fortis_conversations_updated_idx
  on public.fortis_conversations (updated_at desc);

create index if not exists fortis_messages_conversation_idx
  on public.fortis_messages (conversation_id, message_index);
