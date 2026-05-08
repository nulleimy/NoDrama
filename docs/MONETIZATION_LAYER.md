# NoDrama — Monetization Layer

## Purpose

Bundle 8 adds the first monetization UX layer without payment provider integration.

## Includes

- stronger paywall box
- Pro upsell copy
- one-off SOS situation packs
- copy buttons for generated replies
- visible value moment before payment
- pricing section SOS packs

## Pricing hypothesis

NoDrama sells solved situations, not raw AI generations:

- 1 situation = a finished reply + tone variants + quick refinement
- The value is less awkwardness, faster replies, safer wording and less overexplaining

Subscription:

- Free: 0 Kč, 2 situations free, then 1 situation per week
- Starter: 79 Kč / month
- 20 situations / month
- Pro: 149 Kč / month
- 45 situations / month, main plan
- Power: 299 Kč / month
- 100 situations / month

One-off packs:

- SOS: 29 Kč, 4 situations, valid 7 days
- Mini: 69 Kč, 15 situations, valid 14 days
- Klid: 149 Kč, 40 situations, valid 30 days

## Why no Stripe yet

Before connecting payments, the app should validate:

- whether users hit the limit
- whether they copy replies
- which CTA they notice
- whether SOS packs are clearer than subscription

Stripe should come after the conversion moment is good.
