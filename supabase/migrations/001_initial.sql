-- Users: 4-digit ID + nickname
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY CHECK (char_length(id) = 4 AND id ~ '^[0-9]+$'),
  nickname TEXT NOT NULL CHECK (char_length(nickname) >= 1 AND char_length(nickname) <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User favorites: one row per user, articles as JSONB array
CREATE TABLE IF NOT EXISTS user_favorites (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  articles JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily articles cache (for cloud deployment - replaces local JSON files)
CREATE TABLE IF NOT EXISTS daily_articles (
  date TEXT PRIMARY KEY,
  articles JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_articles ENABLE ROW LEVEL SECURITY;

-- Policies: allow all for anon (we validate via API)
CREATE POLICY "Allow all users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all favorites" ON user_favorites FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all daily_articles" ON daily_articles FOR ALL USING (true) WITH CHECK (true);
