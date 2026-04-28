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

- Mini: 79 Kč / month
- Plus: 129 Kč / month
- Pro: 249 Kč / month

One-off packs:

- Emergency 1 situation: 39 Kč
- 20 credits: 49 Kč
- 75 credits: 149 Kč
- 200 credits: 299 Kč
- 500 credits: 599 Kč

## Why no Stripe yet

Before connecting payments, the app should validate:

- whether users hit the limit
- whether they copy replies
- which CTA they notice
- whether credit packs are clearer than subscription

Stripe should come after the conversion moment is good.
