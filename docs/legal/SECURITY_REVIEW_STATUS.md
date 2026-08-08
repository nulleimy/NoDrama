# NoDrama Security Review Status

## Current state

This repository contains security-sensitive integrations and configuration surfaces for authentication, billing, database access, AI providers, and operational services.

A full history secret scan, dependency vulnerability review, and production configuration audit have **not** been attested by this licensing change.

Current release state for those controls:

`UNKNOWN / NEEDS VERIFICATION`

## Required evidence before production

- current-tree secret scan
- full Git-history secret scan
- production environment variable inventory without exposing values
- dependency vulnerability scan against the exact lockfile
- server/client environment-boundary review
- Stripe webhook and entitlement verification evidence
- Supabase privilege/service-role boundary review
- AI-provider data-use and retention configuration review

Do not record a security PASS until those checks have completed with evidence.
