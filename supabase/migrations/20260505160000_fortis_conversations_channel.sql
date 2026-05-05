-- Sync from Next.js web widget: channel + optional external reference (Python/chat services may use these).
alter table public.fortis_conversations
  add column if not exists channel text;

alter table public.fortis_conversations
  add column if not exists channel_ref text;
