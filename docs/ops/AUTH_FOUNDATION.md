# Auth Experience Foundation (NoDrama)

## Providers

NoDrama auth uses NextAuth with optional providers configured in `lib/auth/authOptions.ts`:

- Google provider (`google`) when `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set.
- Email magic link provider (`email`) when `EMAIL_SERVER` and `EMAIL_FROM` are set.

If neither provider is configured, UI must stay safe and show: **"Login is not configured in this environment."**

## Required environment variables

Minimum required variables:

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `EMAIL_SERVER`
- `EMAIL_FROM`
- `RESEND_API_KEY` (for mail provider operations outside this core foundation)

## Local development behavior

- `/account` renders session state via `next-auth/react` helpers.
- Logged-out users see sign-in CTAs only for providers detected by NextAuth.
- Logged-in users see available user identity fields (name/email) and a sign-out CTA.
- Login supports account continuity UX only.

## Production requirements

- Configure at least one provider (Google and/or Email).
- Set stable `NEXTAUTH_URL` and secure `NEXTAUTH_SECRET`.
- Use secure email infrastructure for magic links.
- Add monitoring and abuse controls around auth email volume.

## JWT session limitation

Current session strategy is JWT-based. This means there is no production-grade user ledger persistence yet in this auth foundation itself.

## Future work

- DB-backed user profile and account ledger are future work.
- Credit-to-user binding is future work unless a separate audited ledger is introduced.

## Privacy and Memory Lane

Memory Lane remains **local-first**.

- No silent cloud history sync is enabled in this phase.
- No raw sensitive user prompts should be stored as part of this auth foundation.
- Any future sync must be explicit opt-in and documented.
