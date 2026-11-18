# Y-VOICE image storage

The admin editor can upload JPG, PNG, and WebP cover images to the existing Cloudflare D1 database.

- Maximum file size: 1.75 MB.
- Aggregate image quota: 350 MB.
- No R2 bucket or subscription is used.
- The D1 schema is in `migrations/0003_article_images.sql`.

The migration must be applied to the production D1 database before the upload API is used. Cloudflare D1 Free has a 500 MB per-database limit; the 350 MB image cap leaves room for article content and metadata.
