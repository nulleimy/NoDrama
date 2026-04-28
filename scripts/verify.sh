#!/usr/bin/env bash
set -euo pipefail

echo "==> Node"
node --version

echo "==> npm"
npm --version

echo "==> Language foundation"
node scripts/verify-language-foundation.mjs

echo "==> Phrase engine"
node scripts/verify-phrase-engine.mjs

echo "==> Phrase expansion"
node scripts/verify-phrase-expansion.mjs

echo "==> Phrase quality"
node scripts/verify-phrase-quality.mjs

echo "==> QA engine"
node scripts/verify-qa-engine.mjs

echo "==> Monetization layer"
node scripts/verify-monetization-layer.mjs

echo "==> Lint"
npm run lint

echo "==> Build"
npm run build

echo "✅ Verify passed"
