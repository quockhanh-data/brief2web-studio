# Y-VOICE — Email submissions

The public contributor form sends the draft, contact email, name, title, category, references, and document link through FormSubmit to `insightyouthvoiceclub@gmail.com`. The page tells contributors this before they submit. No contributor account is needed and incoming mail does not create a web post.

## First-time activation

1. Deploy the current code to the `yvoice-insight-hub` branch and Cloudflare Pages.
2. Submit a clearly labeled test message from the public form.
3. The mailbox owner opens `insightyouthvoiceclub@gmail.com` (including Spam) and follows FormSubmit's activation message.
4. Submit a second test and verify the email, title, content, and links arrived as expected.

A successful AJAX response means the service accepted the request; it does not prove delivery to Inbox. Check Spam and the provider status if the message is missing. Do not share the activation link publicly.

## Editorial workflow

Read the incoming email, sign in at `/admin.html`, and create a draft from the material approved for publication. Review spelling, permissions, links, and sources, then publish deliberately. The email stays in the mailbox and is not copied into the website automatically.

Do not send attachments through the web form. Contributors can include a share link or email files directly to the club mailbox. Provider documentation: https://formsubmit.co/ajax-documentation and https://formsubmit.co/.