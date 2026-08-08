# NoDrama Third-Party Notices and Release Compliance Baseline

NoDrama is proprietary software, but it depends on third-party software and services that retain their own licenses, copyright notices, terms, and privacy obligations.

This file is a compliance baseline, not a substitute for the exact production dependency manifest or legal review.

## Current application stack — verify exact versions before release

The repository architecture and code currently reference or contemplate components including:

- Next.js / React
- TypeScript
- Tailwind CSS
- Supabase
- authentication libraries used by the deployed application
- Stripe
- Upstash Redis
- Resend
- Vercel
- an approved OpenAI-compatible model provider
- JavaScript/Node transitive dependencies recorded by the package lockfile

Each component remains under its upstream license or service terms. NoDrama's proprietary license does not relicense third-party components.

## Distribution and deployment requirements

Before any commercial production release or packaged redistribution:

1. lock the exact production dependency graph;
2. generate an SBOM or equivalent machine-readable dependency inventory;
3. record SPDX identifiers where available;
4. collect required copyright and license notices;
5. identify copyleft, source-availability, native-binary, font, media, model, dataset, and vendored-code obligations;
6. verify that no dependency or copied code has an unknown or incompatible license;
7. verify package-lock consistency with the production build;
8. confirm provider terms for AI APIs, payment processing, authentication/database, email, hosting, and rate limiting;
9. verify that no production credentials, signing keys, webhook secrets, API keys, service-role credentials, or private tokens are committed to source control;
10. archive the dependency and notice evidence associated with each production release.

## SaaS-specific distinction

A hosted SaaS deployment may have different obligations from redistribution of a binary or source package. Network-service terms, privacy/data-processing terms, model-provider terms, and payment-provider terms must still be reviewed even when a dependency's software license does not require redistribution notices to end users.

## Models and generated output

Model-provider terms, data-use settings, output restrictions, training/retention behavior, and jurisdictional requirements are separate from open-source package licensing and must be approved for each production provider.

## Fonts, artwork, media, copy, and brand assets

Fonts, icons, images, screenshots, marketing copy supplied by third parties, generated assets, and other media require their own provenance and usage rights. They are not automatically covered by the NoDrama source-code license.

## Release status

Until the exact production dependency graph and service-provider configuration have been verified, this document records the required process but does **not** declare the full production stack distribution-cleared.
