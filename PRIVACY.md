# NoDrama Privacy Policy — Draft Baseline

**Status:** Technical/product privacy baseline. Operator identity, final subprocessors, retention periods, lawful bases, transfer safeguards, and user-rights contact must be completed and legally reviewed before public commercial launch.

## 1. Scope

This document describes the intended privacy model for the NoDrama service. NoDrama helps users draft messages using account, application, billing, and AI-assisted processing services.

## 2. Data categories

Depending on enabled features, NoDrama may process:

- account identifiers and authentication metadata;
- profile and plan information;
- user-submitted situations, prompts, instructions, and text to be rewritten;
- generated replies and refinement metadata where product history is enabled;
- usage, credit, rate-limit, and entitlement records;
- billing and payment status received from the payment processor;
- operational, security, abuse-prevention, and diagnostic metadata;
- email-delivery metadata where transactional email is enabled.

NoDrama should minimize collection and avoid requesting special-category or highly sensitive personal data unless a specific product need and lawful basis have been approved.

## 3. Purpose limitation

Data should be processed only as necessary to:

- provide requested message-generation and refinement functionality;
- authenticate users and protect accounts;
- enforce plans, credits, and rate limits;
- process and reconcile purchases and entitlements;
- prevent abuse, fraud, and security incidents;
- maintain service reliability and support users;
- meet legal obligations where applicable.

Use of customer content for model training, advertising, unrelated profiling, or sale is not authorized by this baseline and would require a separate explicit product, privacy, and legal decision.

## 4. AI processing

User-provided text may be transmitted to an approved AI-model provider when generation is requested. Production configuration must document the selected provider, region where relevant, data-retention settings, training/data-use settings, and contractual privacy terms.

NoDrama should send only the minimum content necessary for the requested generation and must not place secrets or privileged infrastructure credentials into model prompts.

## 5. Payments

Payment-card details should be handled by the approved payment processor rather than stored directly by NoDrama. NoDrama may retain transaction identifiers, product/price identifiers, payment state, entitlement state, and other reconciliation metadata needed for service operation and accounting.

## 6. Subprocessors

The architecture currently contemplates third-party services for hosting, authentication/database, AI generation, payments, rate limiting, and transactional email. The production subprocessor list must be generated from actual deployed configuration before launch.

Expected categories currently include services such as Vercel, Supabase, an OpenAI-compatible model provider, Stripe, Upstash, and Resend. Inclusion in this document is not proof that every service is active in production.

**Launch gate:** `PRODUCTION SUBPROCESSOR REGISTER — NEEDS VERIFICATION`.

## 7. Retention

Retention must be purpose-limited. Final retention periods for account data, generated-message history, billing records, security logs, and backups must be defined before public launch.

Where the product does not require long-term retention of user-submitted message content, shorter retention or user-controlled deletion should be preferred.

**Launch gate:** `RETENTION SCHEDULE — NEEDS COMPLETION`.

## 8. Security

NoDrama should apply appropriate technical and organizational controls, including least privilege, secret separation, server-side authorization, authenticated billing fulfillment, rate limiting, secure transport, dependency maintenance, auditability for sensitive operations, and incident-response procedures.

No security control eliminates all risk. Users should avoid submitting information unnecessary for the requested message-generation task.

## 9. User rights

Users may have rights under applicable data-protection law, including access, correction, deletion, restriction, portability, objection, and complaint rights. The exact rights process and response channel must be completed for the operator's jurisdiction and markets.

**Launch gate:** `DATA SUBJECT REQUEST CONTACT/PROCESS — NEEDS COMPLETION`.

## 10. International transfers

If personal data is processed outside the user's jurisdiction, the operator must verify and document the applicable transfer mechanism and safeguards before launch.

## 11. Controller/operator identity

The controller/operator legal name, registered address, registration/company number where applicable, privacy contact, and supervisory-authority information must be inserted before public commercial launch.

**Launch gate:** `CONTROLLER IDENTITY — NEEDS COMPLETION`.

## 12. Changes

Material changes to production data practices require corresponding updates to this policy and, where applicable, notice or consent before the changed processing begins.
