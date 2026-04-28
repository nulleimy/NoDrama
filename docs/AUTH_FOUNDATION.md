# NoDrama — Auth Foundation

## Purpose

Bundle 13 adds the first authentication foundation.

## Stack

- NextAuth / Auth.js compatible setup
- Google provider via environment variables
- Email magic link provider via environment variables
- JWT session strategy
- Account page at `/account`

## Required environment variables

Core:

- NEXTAUTH_SECRET
- NEXTAUTH_URL

Google:

- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

Email magic link:

- EMAIL_SERVER
- EMAIL_FROM

## MVP decision

Google + email magic link are the MVP login methods.

Apple login is intentionally postponed because it has a heavier setup.

Phone login is postponed because SMS adds provider costs, abuse protection, and rate limiting complexity.

## Next steps

- Persist users in DB
- Add credits per user
- Connect Stripe customer IDs
- Add protected routes
