# Y-VOICE Insight Hub

Website Y-VOICE with a public news board, an email submission form for contributors, and an editorial dashboard.

## Editorial workflow

- Contributors send their name, contact email, draft, category, references, and document link to the editorial mailbox through FormSubmit. They do not need an account.
- The editor reads the email, signs in at `/admin.html`, creates or edits a draft, and chooses when to publish.
- Only articles explicitly published by an editor appear on the public board.
- Admin access uses one encrypted Cloudflare secret (`ADMIN_PASSWORD`). Random session tokens are stored as hashes in D1.

## Run the interface

```bash
npm install
npm run dev
```

Cloudflare Pages Functions require a D1 binding named `DB`. See [CLOUDFLARE-SETUP.md](CLOUDFLARE-SETUP.md) for setup steps and the email activation workflow.

## Cloudflare Pages

- Repository: `quockhanh-data/brief2web-studio`
- Production branch: `yvoice-insight-hub`
- Build command: `npm run build`
- Build output: `dist`
- Intended address: `https://y-voice.pages.dev`

The Pages address becomes active after the project deploys successfully and its database and secrets are configured.