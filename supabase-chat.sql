create table if not exists public.chat_messages (
  id text primary key,
  username text not null,
  message text not null check (char_length(message) between 1 and 500),
  sent_at timestamptz not null default now()
);

alter table public.chat_messages enable row level security;

create policy "Anyone can read chat messages"
  on public.chat_messages for select
  to anon, authenticated
  using (true);

create policy "Anyone can send chat messages"
  on public.chat_messages for insert
  to anon, authenticated
  with check (true);

alter publication supabase_realtime add table public.chat_messages;
