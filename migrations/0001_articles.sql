CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL,
  cover_image TEXT NOT NULL DEFAULT '',
  author_name TEXT NOT NULL DEFAULT '',
  author_email TEXT NOT NULL DEFAULT '',
  author_phone TEXT NOT NULL DEFAULT '',
  references_text TEXT NOT NULL DEFAULT '',
  document_url TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('pending','draft','published','archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT
);
CREATE INDEX IF NOT EXISTS articles_status_published ON articles(status, published_at DESC);
CREATE INDEX IF NOT EXISTS articles_created ON articles(created_at DESC);
CREATE TABLE IF NOT EXISTS admin_login_attempts (
  ip_hash TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 0,
  window_started INTEGER NOT NULL
);
