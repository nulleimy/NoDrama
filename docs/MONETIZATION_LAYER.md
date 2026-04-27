# NoDrama — Monetization Layer

## Purpose

Bundle 8 adds the first monetization UX layer without payment provider integration.

## Includes

- stronger paywall box
- Pro upsell copy
- one-off credit packs
- copy buttons for generated replies
- visible value moment before payment
- pricing section credit packs

## Pricing hypothesis

Subscription:

- Starter: 79 Kč / month
- Pro: 149 Kč / month
- Power: 299 Kč / month

One-off packs:

- 20 replies: 29 Kč
- 100 replies: 99 Kč
- 500 replies: 299 Kč

## Why no Stripe yet

Before connecting payments, the app should validate:

- whether users hit the limit
- whether they copy replies
- which CTA they notice
- whether credit packs are clearer than subscription

Stripe should come after the conversion moment is good.
