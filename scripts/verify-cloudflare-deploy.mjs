#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const mustExist = ["wrangler.jsonc", "docs/ops/CLOUDFLARE_DEPLOY.md", "package.json"];
for (const file of mustExist) {
  if (!existsSync(file)) fail(`Missing required Cloudflare deploy file: ${file}`);
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const scripts = packageJson.scripts || {};

for (const scriptName of ["cf:build", "cf:preview", "cf:deploy", "verify:cloudflare"]) {
  if (!scripts[scriptName]) fail(`package.json missing script: ${scriptName}`);
}

if (!scripts["cf:build"].includes("@opennextjs/cloudflare")) {
  fail("cf:build must use @opennextjs/cloudflare.");
}

if (!scripts["cf:deploy"].includes("wrangler")) {
  fail("cf:deploy must deploy through wrangler.");
}

const wrangler = readFileSync("wrangler.jsonc", "utf8");
for (const token of [
  '"name": "nodrama"',
  '"main": ".open-next/worker.js"',
  '"directory": ".open-next/assets"',
  '"compatibility_flags": ["nodejs_compat"]',
]) {
  if (!wrangler.includes(token)) fail(`wrangler.jsonc missing required token: ${token}`);
}

const docs = readFileSync("docs/ops/CLOUDFLARE_DEPLOY.md", "utf8");
for (const token of [
  "npm run cf:build",
  "npm run cf:deploy",
  "Cloudflare Workers through OpenNext",
  "File-backed runtime state under `data/**` is MVP/local-only",
  "NODRAMA_ALLOW_DEV_CREDIT_GRANTS=false",
]) {
  if (!docs.includes(token)) fail(`Cloudflare deploy runbook missing required token: ${token}`);
}

console.log("✅ Cloudflare deploy foundation verified");
