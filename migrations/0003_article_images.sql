CREATE TABLE IF NOT EXISTS article_images (
  id TEXT PRIMARY KEY,
  content_type TEXT NOT NULL CHECK (content_type IN ('image/jpeg','image/png','image/webp')),
  image_data BLOB NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 1750000),
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS image_storage_usage (
  id INTEGER PRIMARY KEY CHECK (id=1),
  bytes_used INTEGER NOT NULL DEFAULT 0 CHECK (bytes_used >= 0 AND bytes_used <= 350000000)
);
INSERT OR IGNORE INTO image_storage_usage (id,bytes_used) VALUES (1,0);
