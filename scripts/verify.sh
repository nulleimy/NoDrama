#!/usr/bin/env bash
set -euo pipefail

echo "==> Node"
node --version

echo "==> npm"
npm --version

if [ -f scripts/verify-language-foundation.mjs ]; then
  echo "==> Language foundation"
  node scripts/verify-language-foundation.mjs
fi

if [ -f scripts/verify-phrase-engine.mjs ]; then
  echo "==> Phrase engine"
  node scripts/verify-phrase-engine.mjs
fi

if [ -f scripts/verify-phrase-expansion.mjs ]; then
  echo "==> Phrase expansion"
  node scripts/verify-phrase-expansion.mjs
fi

if [ -f scripts/verify-phrase-quality.mjs ]; then
  echo "==> Phrase quality"
  node scripts/verify-phrase-quality.mjs
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

if [ -f scripts/verify-nodrama-content-depth.mjs ]; then
  echo "==> NoDrama content-depth v2 foundation"
  node scripts/verify-nodrama-content-depth.mjs
fi

echo "==> Lint"
npm run lint

echo "==> Build"
npm run build

echo "✅ Verify passed"
