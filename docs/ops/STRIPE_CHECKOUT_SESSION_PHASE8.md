# NoDrama — Stripe Checkout Session Phase 8

Status: Checkout session creation is wired.

Implemented:
- server-side Checkout Session creation
- accountKey stored as client_reference_id
- nodrama_account_key metadata
- nodrama_entitlement_key metadata
- nodrama_price_id metadata
- subscription_data metadata for subscription sessions
- active checkout buttons for pricing plans and credit packs

Supported SKUs:
- pack_sos
- pack_mini
- pack_klid
- starter_monthly
- pro_monthly
- power_monthly

Required env:
- STRIPE_SECRET_KEY
- NEXT_PUBLIC_APP_URL
- STRIPE_PRICE_SOS_PACK
- STRIPE_PRICE_MINI_PACK
- STRIPE_PRICE_KLID_PACK
- STRIPE_PRICE_STARTER_MONTHLY
- STRIPE_PRICE_PRO_MONTHLY
- STRIPE_PRICE_POWER_MONTHLY

Security:
- Checkout is created server-side only.
- STRIPE_SECRET_KEY must never be exposed to the browser.
- Webhook fulfillment remains the source of truth for credits.
- UI redirect success is not proof of payment.
