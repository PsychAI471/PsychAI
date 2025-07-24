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
