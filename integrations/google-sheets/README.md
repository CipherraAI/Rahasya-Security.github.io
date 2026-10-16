# Early-access signups → Google Sheet

The site's form (`src/components/EarlyAccessForm.tsx`) posts to the Vercel function
`api/early-access.ts`. The function validates the entry and forwards it, with a shared
secret, to a Google Apps Script attached to your Sheet. The script appends one row per
signup: Submitted at, Name, Work email, Firm / studio, Role, Message, Source.

## One-time setup (about 5 minutes)

1. **Create the Sheet.** In Google Drive, create a new Google Sheet, e.g. "Cipherra early access".
   The script creates a `Signups` tab with headers on the first submission.
2. **Add the script.** In the Sheet: *Extensions → Apps Script*. Delete the starter code and
   paste in `early-access.gs` from this folder.
3. **Set the secret.** Replace `PASTE_THE_SAME_SECRET_AS_VERCEL_HERE` with the value of
   `SHEET_WEBHOOK_SECRET` (in the repo's git-ignored `.env.local`; the same value is stored in
   the Vercel project). Save.
4. **Deploy as a web app.** *Deploy → New deployment → Select type: Web app*.
   - Execute as: **Me**
   - Who has access: **Anyone** (the Vercel function calls it without a Google login;
     the shared secret is what keeps others out)
   - Click *Deploy*, approve the permissions prompt, and copy the **Web app URL** (ends in `/exec`).
5. **Give Vercel the URL.** Either send it to whoever is deploying, or run:
   ```
   npx vercel env add SHEET_WEBHOOK_URL production --scope nithesh2108-8379s-projects
   ```
   then redeploy (`npx vercel deploy --prod --scope nithesh2108-8379s-projects`).

## Notes

- Editing the script later: *Deploy → Manage deployments → Edit → New version* keeps the same URL.
- To rotate the secret: change it in the script (new version) and in Vercel
  (`vercel env rm` / `vercel env add SHEET_WEBHOOK_SECRET`), then redeploy the site.
- Bots: the form has a hidden honeypot field; filled-in honeypots are accepted silently and not saved.
- Values starting with `=`, `+`, `-` or `@` are prefixed with `'` so they are stored as text, not formulas.
