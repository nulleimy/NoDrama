#!/usr/bin/env node
import fs from "node:fs";
import { execSync } from "node:child_process";

const exists = (path) => fs.existsSync(path);
const read = (path) => (exists(path) ? fs.readFileSync(path, "utf8") : "");

const readJson = (path) => {
  if (!exists(path)) return null;
  return JSON.parse(fs.readFileSync(path, "utf8"));
};

const runOk = (cmd) => {
  try {
    execSync(cmd, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
};

const hasAny = (paths) => paths.some(exists);

const hasMatchingPath = (roots, pattern) => {
  const walk = (dir) => {
    if (!exists(dir)) return [];
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = `${dir}/${entry.name}`;
      if (entry.isDirectory()) {
        out.push(...walk(full));
      } else {
        out.push(full);
      }
    }
    return out;
  };

  return roots.flatMap(walk).some((path) => pattern.test(path));
};


const branchExists = (branch) =>
  runOk(`git show-ref --verify --quiet refs/heads/${branch}`) ||
  runOk(`git ls-remote --exit-code --heads origin ${branch}`);

const pkg = readJson("package.json");
const scripts = pkg?.scripts ?? {};

const envText = [".env.example", ".env.sample", "env.example"].map(read).join("\n");
const strict = process.env.NODRAMA_RELEASE_GATE_STRICT === "true";

const checks = [
  {
    name: "package.json exists",
    ok: exists("package.json"),
    required: true,
    fix: "Repo must contain package.json.",
  },
  {
    name: "npm verify script exists",
    ok: Boolean(scripts.verify),
    required: true,
    fix: "Add npm script: verify.",
  },
  {
    name: "npm lint script exists",
    ok: Boolean(scripts.lint),
    required: true,
    fix: "Add npm script: lint.",
  },
  {
    name: "npm build script exists",
    ok: Boolean(scripts.build),
    required: true,
    fix: "Add npm script: build.",
  },
  {
    name: "Stripe billing route foundation exists",
    ok: hasAny([
      "app/api/billing/checkout/route.ts",
      "app/api/billing/portal/route.ts",
      "app/api/billing/webhook/route.ts",
    ]),
    required: true,
    fix: "Add Stripe checkout/portal/webhook route foundation.",
  },
  {
    name: "Stripe env example exists",
    ok: /STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|STRIPE_PRICE|STRIPE_PRICE_ID/.test(envText),
    required: false,
    fix: "Add Stripe env placeholders to .env.example. Never commit real secrets.",
  },
  {
    name: "Production DB env example exists",
    ok: /DATABASE_URL|POSTGRES_URL|PRISMA_DATABASE_URL|SUPABASE_URL|NEON_DATABASE_URL/.test(envText),
    required: false,
    fix: "Add production DB env placeholder to .env.example. Never commit real secrets.",
  },
  {
    name: "Persistence or migration foundation exists",
    ok: hasAny([
      "prisma/schema.prisma",
      "drizzle.config.ts",
      "supabase/migrations",
      "db/migrations",
      "docs/ops/PRODUCTION_PERSISTENCE_MIGRATION_PLAN.md",
      "docs/ops/PRODUCTION_PERSISTENCE_PLAN.md",
      "docs/architecture/PRODUCTION_PERSISTENCE_PLAN.md",
      "scripts/verify-production-persistence-plan.mjs",
      "lib/credits/creditLedger.ts",
      "scripts/verify-production-persistence-plan.mjs",
      "scripts/verify-production-persistence.mjs",
      "lib/nodrama/creditLedger.ts",
      "lib/nodrama/authCreditLedger.ts",
    ]) || hasMatchingPath(
      ["docs", "scripts", "lib", "app"],
      /production.*persistence|persistence.*plan|migration|credit.*ledger|ledger.*credit/i
    ),
    required: true,
    fix: "Add DB schema/migrations, production persistence plan, or verified credit ledger foundation.",
  },
  {
    name: "Full dataset 3k/9k gate exists",
    ok: hasAny([
      "datasets",
      "data/full-dataset",
      "qa/datasets",
      "tests/fixtures/full-dataset",
      "scripts/verify-full-dataset.mjs",
      "scripts/verify-full-dataset-gate.mjs",
    ]),
    required: false,
    fix: "Add full dataset smoke/regression gate for 3k/9k scenarios.",
  },
  {
    name: "release/deploy branch exists",
    ok: branchExists("release/deploy"),
    required: false,
    fix: "Create and push branch: release/deploy.",
  },
  {
    name: "Release gate status document exists",
    ok: exists("docs/ops/RELEASE_GATE_STATUS.md"),
    required: true,
    fix: "Add docs/ops/RELEASE_GATE_STATUS.md.",
  },
];

let hardFailures = 0;
let softFailures = 0;

console.log("NoDrama release gate");
console.log("====================");
console.log(`Mode: ${strict ? "STRICT" : "REPORT"}`);
console.log("");

for (const check of checks) {
  const isHard = check.required || strict;

  if (check.ok) {
    console.log(`✅ ${check.name}`);
    continue;
  }

  if (isHard) {
    hardFailures += 1;
    console.log(`❌ ${check.name}`);
  } else {
    softFailures += 1;
    console.log(`⚠️ ${check.name}`);
  }

  console.log(`   Fix: ${check.fix}`);
}

console.log("");

if (hardFailures > 0) {
  console.log(`Release blocked: ${hardFailures} hard failure(s), ${softFailures} warning(s).`);
  process.exit(1);
}

if (softFailures > 0) {
  console.log(`Release report: ${softFailures} warning(s). Strict release mode would block.`);
  process.exit(0);
}

console.log("✅ Release gate passed.");
