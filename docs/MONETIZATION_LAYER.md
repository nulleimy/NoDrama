# NoDrama — Monetization Layer

## Purpose

Bundle 8 adds the first monetization UX layer without payment provider integration.

## Includes

- stronger paywall box
- Pro upsell copy
- one-off SOS situation packs
- copy buttons for generated replies
- visible value moment before payment
- pricing section situation packs

## Pricing hypothesis

1 situation = finished reply + tone variants + quick tuning.

Subscription:

- Free: 0 Kč, 2 situations free, then 1 situation/week, basic tones, no history or 24h history only
- Starter: 79 Kč / month, 20 situations/month
- Pro: 149 Kč / month, 45 situations/month, all tones, follow-up tuning, history, work/dating/client modes
- Power: 299 Kč / month, 100 situations/month, templates, saved profiles, heavy work/client/dating use

One-off packs:

- SOS: 29 Kč, 4 situations, valid for 7 days
- Mini: 69 Kč, 15 situations, valid for 14 days
- Klid: 149 Kč, 40 situations, valid for 30 days

## Why no Stripe yet

Before connecting payments, the app should validate:

- whether users hit the limit
- whether they copy replies
- which CTA they notice
- whether urgent situation packs are clearer than subscription

Stripe should come after the conversion moment is good.
