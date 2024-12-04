-- Existing tables...

-- Add user preferences table
create table user_preferences (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users not null,
  is_onboarded boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS
alter table user_preferences enable row level security;

-- Create policies
create policy "Users can view their own preferences" on user_preferences
  for select using (auth.uid() = user_id);

create policy "Users can insert their own preferences" on user_preferences
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own preferences" on user_preferences
  for update using (auth.uid() = user_id);