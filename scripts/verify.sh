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

echo "==> Lint"
npm run lint

echo "==> Build"
npm run build

echo "✅ Verify passed"
