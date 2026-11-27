# Turning on sign-in (Supabase)

The site ships with sign-in switched off. Everything below is free on the
Supabase **Free** plan; nothing here needs a paid add-on.

1. **Restore the project.** The existing project `pgoaqljkoghziprxmmiy`
   (organization "ai signal", Free plan) is paused. Supabase dashboard →
   the project → *Restore project*. Free projects pause again after about a
   week without traffic.
2. **Create the tables.** SQL editor → run
   `supabase/migrations/20261020000000_accounts.sql` (profiles, interests and
   saved items, all with row-level security so each person sees only their own rows).
3. **Email sign-in.** Authentication → Sign In / Providers → Email: enable,
   turn on *Email OTP*. Authentication → Emails → *Magic link* template: paste
   `supabase/templates/otp-code.html` so people get a 6-digit code.
   The built-in mailer allows only a few emails per hour; for real use add a
   free SMTP sender (for example Resend or Brevo free tier) under *SMTP settings*.
4. **Google sign-in (optional).** Google Cloud console → OAuth client (Web) with
   redirect URI `https://pgoaqljkoghziprxmmiy.supabase.co/auth/v1/callback`;
   paste the client ID and secret into Supabase → Providers → Google.
   The Google secret stays in Supabase, never in this repository.
5. **Redirect URLs.** Authentication → URL configuration: Site URL
   `https://archvanta.github.io/`, additional redirect
   `https://archvanta.github.io/**`.
6. **Connect the site.** GitHub → archvanta/archvanta.github.io → Settings →
   Secrets and variables → Actions → **Variables** (not secrets):
   - `SUPABASE_URL` = `https://pgoaqljkoghziprxmmiy.supabase.co`
   - `SUPABASE_PUBLISHABLE_KEY` = the `sb_publishable_…` key (Project settings → API keys)
   - `ACCOUNTS_ENABLED` = `true`

   Then re-run the *pages* workflow. The build refuses a secret or
   service-role key (`scripts/check-bundle-keys.mjs`).
