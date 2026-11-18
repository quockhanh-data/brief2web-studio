# Y-VOICE editorial handoff

## Publishing

- Admin dashboard: `/admin.html`.
- Contributors submit drafts by email through the public form; they do not create web accounts.
- The editor reads the mailbox, signs in, creates a draft, checks sources and permissions, then publishes deliberately.
- Only published articles appear in the public news board.

## Deployment and data

- Production branch: `yvoice-insight-hub`.
- Cloudflare Pages build command: `npm run build`; output directory: `dist`.
- Cloudflare D1 binding: `DB`; schema: `migrations/0001_articles.sql`.
- Encrypted admin secrets and FormSubmit first-time activation are described in `CLOUDFLARE-SETUP.md` and `EMAIL-SETUP.md`.
- Never place admin secrets in GitHub or send them in chat.

## Main files

- `index.html`, `styles.css`, `script.js`, `app.js`: public website and submission form.
- `admin.html`, `admin.css`, `admin.js`: editorial dashboard.
- `functions/api/[[path]].js`: public article feed and protected admin API.
- `migrations/0001_articles.sql`: articles and login rate-limit tables.