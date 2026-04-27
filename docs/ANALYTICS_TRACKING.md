# NoDrama — Analytics + Conversion Tracking

## Purpose

Bundle 11 adds a lightweight internal event layer without external analytics tools.

## Events

- generate_clicked
- generate_success
- generate_failed
- copy_reply
- paywall_shown
- paywall_closed
- credit_pack_clicked
- pricing_cta_clicked

## Architecture

Client components call `trackEvent`.

`trackEvent` sends a POST request to `/api/events`.

The API validates payloads with Zod and logs events in development.

## Privacy

This layer does not read contacts, clipboard contents, browser history, files, or location.

It sends only product interaction metadata.

## Future integrations

This contract can later be connected to:

- Supabase
- PostHog
- Stripe events
- internal dashboard
