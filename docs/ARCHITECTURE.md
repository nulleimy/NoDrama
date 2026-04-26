# NoDrama — Architecture

## Goal

NoDrama is a small SaaS product for generating socially safe replies, apologies, refusals and rescheduling messages.

## Initial Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI-compatible LLM API
- Stripe
- Upstash Redis
- Resend
- Vercel

## Planned Modules

### App Shell

- Landing page
- Pricing page
- Dashboard
- Generator screen

### Auth

- Supabase Auth
- User profile
- Plan state

### Billing

- Stripe Checkout
- Stripe Webhook
- Customer Portal
- Plan-to-credit mapping

### Generator Core

- Input validation
- Prompt builder
- Safety rules
- AI generation
- Usage tracking
- Credit decrement
- Generation history

### Limits

| Plan | Price | Limit |
|---|---:|---:|
| Free | 0 Kč | 2-3 generations/day |
| Starter | 79 Kč/month | 100 generations/month |
| Pro | 149 Kč/month | 500 generations/month |
| Power | 299 Kč/month | 2000 generations/month |

## Safety Design

The generator should avoid elaborate lies and refuse requests involving fraud, fake official claims, forged documents, legal deception or harmful manipulation.
