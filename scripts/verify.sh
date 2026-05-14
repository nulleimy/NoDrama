#!/usr/bin/env bash
set -euo pipefail

echo "==> Node"
node --version

echo "==> npm"
if command -v npm >/dev/null 2>&1; then
  npm --version
else
  echo "npm unavailable; using local node_modules binaries for lint/build"
fi

if [ -f scripts/verify-language-foundation.mjs ]; then
  echo "==> Language foundation"
  node scripts/verify-language-foundation.mjs
fi

if [ -f scripts/verify-phrase-engine.mjs ]; then
  echo "==> Phrase engine"
  node scripts/verify-phrase-engine.mjs
fi

if [ -f scripts/verify-generate-contract.mjs ]; then
  echo "==> Generate contract"
  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types scripts/verify-generate-contract.mjs
fi

if [ -f scripts/verify-phrase-expansion.mjs ]; then
  echo "==> Phrase expansion"
  node scripts/verify-phrase-expansion.mjs
fi

if [ -f scripts/verify-phrase-quality.mjs ]; then
  echo "==> Phrase quality"
  node scripts/verify-phrase-quality.mjs
fi

if [ -f scripts/verify-phrase-realizer-flexibility.mjs ]; then
  echo "==> Phrase realizer flexibility"
  node scripts/verify-phrase-realizer-flexibility.mjs
fi


if [ -f scripts/verify-pricing-copy-polish.mjs ]; then
  echo "==> Pricing copy polish"
  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types scripts/verify-pricing-copy-polish.mjs
fi
if [ -f scripts/verify-monetization-layer.mjs ]; then
  echo "==> Monetization layer"
  node scripts/verify-monetization-layer.mjs
fi

if [ -f scripts/verify-nodrama-enterprise.mjs ]; then
  echo "==> NoDrama Enterprise"
  node scripts/verify-nodrama-enterprise.mjs
fi

if [ -f scripts/verify-admin-analytics-security.mjs ]; then
  echo "==> Admin analytics security"
  node scripts/verify-admin-analytics-security.mjs
fi

if [ -f scripts/verify-devops-foundation.mjs ]; then
  echo "==> DevOps foundation"
  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types scripts/verify-devops-foundation.mjs
fi

if [ -f scripts/verify-nodrama-content-depth.mjs ]; then
  echo "==> NoDrama content-depth v2 foundation"
  node scripts/verify-nodrama-content-depth.mjs
fi

if [ -f scripts/verify-taxonomy-schema-v2.mjs ]; then
  echo "==> NoDrama taxonomy schema v2"
  node scripts/verify-taxonomy-schema-v2.mjs
fi

if [ -f scripts/verify-micro-situation-seed-v1.mjs ]; then
  echo "==> NoDrama micro-situation seed v1"
  node scripts/verify-micro-situation-seed-v1.mjs
fi

if [ -f scripts/verify-ui-taxonomy-controls.mjs ]; then
  echo "==> Public generator UI taxonomy controls"
  node scripts/verify-ui-taxonomy-controls.mjs
fi

if [ -f scripts/verify-selector-mixing-ux.mjs ]; then
  echo "==> Selector mixing UX"
  node scripts/verify-selector-mixing-ux.mjs
fi

if [ -f scripts/verify-mvp-routing-and-test-limit.mjs ]; then
  echo "==> MVP routing and local test limit"
  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types scripts/verify-mvp-routing-and-test-limit.mjs
fi

if [ -f scripts/verify-safety-polarity-domain-phrases.mjs ]; then
  echo "==> Safety polarity and domain-specific phrases"
  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types scripts/verify-safety-polarity-domain-phrases.mjs
fi

if [ -f scripts/verify-extended-qa-polish.mjs ]; then
  echo "==> Extended QA polish"
  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types scripts/verify-extended-qa-polish.mjs
fi

if [ -f scripts/verify-reply-intelligence-v2.mjs ]; then
  echo "==> Reply intelligence v2"
  node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --experimental-strip-types scripts/verify-reply-intelligence-v2.mjs
fi

if [ -f scripts/verify-feedback-reasons-v2.mjs ]; then
  echo "==> Feedback reasons v2"
  node scripts/verify-feedback-reasons-v2.mjs
fi

if [ -f scripts/verify-feedback-regression-export.mjs ]; then
  echo "==> Feedback regression export"
  node scripts/verify-feedback-regression-export.mjs
fi

if [ -f scripts/verify-memory-lane-controls.mjs ]; then
  echo "==> Memory Lane controls"
  node scripts/verify-memory-lane-controls.mjs
fi

if [ -f scripts/verify-account-dashboard-polish.mjs ]; then
  echo "==> Account dashboard polish"
  node scripts/verify-account-dashboard-polish.mjs
fi

if [ -f scripts/verify-soft-neon-landing-and-feedback.mjs ]; then
  echo "==> Soft neon landing and feedback UI"
  node scripts/verify-soft-neon-landing-and-feedback.mjs
fi

if [ -f scripts/verify-reply-rating-tuning-chips.mjs ]; then
  echo "==> Reply rating and tuning chips"
  node scripts/verify-reply-rating-tuning-chips.mjs
fi

if [ -f scripts/verify-generator-quality.mjs ]; then
  echo "==> Generator quality v1"
  node scripts/verify-generator-quality.mjs
fi

if [ -f scripts/verify-safe-logging-core.mjs ]; then
  echo "==> Safe logging core"
  node scripts/verify-safe-logging-core.mjs
fi


if [ -f scripts/verify-production-persistence-plan.mjs ]; then
  echo "==> Production persistence plan"
  node scripts/verify-production-persistence-plan.mjs
fi

if [ -f scripts/verify-persistence-adapter-foundation.mjs ]; then
  echo "==> Persistence adapter foundation"
  node scripts/verify-persistence-adapter-foundation.mjs
fi
if [ -f scripts/verify-scenario-specific-routing.mjs ]; then
  echo "==> Scenario-specific reply routing"
  node scripts/verify-scenario-specific-routing.mjs
fi

if [ -f scripts/verify-stripe-checkout-foundation.mjs ]; then
  echo "==> Stripe checkout foundation"
  node scripts/verify-stripe-checkout-foundation.mjs
fi

if [ -f scripts/verify-abuse-guard-foundation.mjs ]; then
  echo "==> Abuse guard foundation"
  node scripts/verify-abuse-guard-foundation.mjs
fi

echo "==> Lint"
if command -v npm >/dev/null 2>&1; then
  npm run lint
else
  node node_modules/eslint/bin/eslint.js
fi

echo "==> Build"
if command -v npm >/dev/null 2>&1; then
  npm run build
else
  node node_modules/next/dist/bin/next build
fi

echo "✅ Verify passed"
