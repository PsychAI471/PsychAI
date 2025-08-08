-- Users table
create table users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text unique,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now()
);

-- Chat sessions table
create table chat_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid references users(id) on delete cascade,
  created_at timestamptz DEFAULT now()
);

-- Chat messages table
create table chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz DEFAULT now()
);

-- Journal entries table
create table journal_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid references users(id) on delete cascade,
  entry text not null,
  created_at timestamptz DEFAULT now()
);

-- Mood entries table for tracking user mood
create table mood_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid references users(id) on delete cascade,
  mood_score integer check (mood_score >= 1 and mood_score <= 10),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Session analytics table for tracking session data
create table session_analytics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid references users(id) on delete cascade,
  duration integer,
  message_count integer,
  session_date timestamptz,
  created_at timestamptz DEFAULT now()
);
