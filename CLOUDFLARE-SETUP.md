# Y-VOICE on Cloudflare Pages

## Pages project

- Connect `quockhanh-data/brief2web-studio` to Cloudflare Pages.
- Production branch: `yvoice-insight-hub`.
- Project slug: `y-voice` (hostname `y-voice.pages.dev`, if available).
- Build command: `npm run build`.
- Build output directory: `dist`.
- Project root: `/`.

## D1 database

1. Create a D1 database named `y-voice-content`.
2. Add a Pages Function D1 binding named `DB` and select the database.
3. Apply `migrations/0001_articles.sql` once.

## Admin secrets

In Pages project settings, add encrypted secrets (never plain-text variables):

- `ADMIN_PASSWORD`: choose a long, unique password for the editorial dashboard.
- `ADMIN_SESSION_SECRET`: generate an independent random secret with at least 32 bytes.

The dashboard is `/admin.html`. It uses a 12-hour, HttpOnly, Secure, SameSite=Strict signed session cookie and limits failed login attempts. Never commit either secret or send it in chat.

## Editorial flow

- Contributors use the form on the site; it emails their submission to `insightyouthvoiceclub@gmail.com` through FormSubmit. Contributors do not need an account.
- On first use, the mailbox owner must activate the FormSubmit email by following its activation message. Check Spam if needed.
- The editor reads the email, signs in to `/admin.html`, creates or edits a draft, then chooses when to publish.
- Only articles the editor explicitly publishes appear on the public news board. No article is auto-published from an incoming email.
- Keep contributor submissions and personal contact details in the editorial mailbox; copy only approved publication content into the CMS.

## Free-plan note

The design uses Cloudflare Pages, Functions, and D1 free allowances. Usage limits apply; stop before upgrading or enabling paid usage if Cloudflare shows a quota or billing prompt.