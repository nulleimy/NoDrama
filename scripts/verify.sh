#!/usr/bin/env bash
set -euo pipefail

echo "==> Node"
node --version

echo "==> npm"
npm --version

echo "==> Lint"
npm run lint

echo "==> Build"
npm run build

echo "✅ Verify passed"
