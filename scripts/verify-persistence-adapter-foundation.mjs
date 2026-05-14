#!/usr/bin/env node
import { readFile, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function exists(rel) {
  try {
    await access(path.join(root, rel));
    return true;
  } catch {
    return false;
  }
}

async function assertFile(rel) {
  if (!(await exists(rel))) {
    throw new Error(`Missing required file: ${rel}`);
  }
}

async function main() {
  const requiredFiles = [
    "lib/persistence/persistenceTypes.ts",
    "lib/persistence/persistenceConfig.ts",
    "lib/persistence/adapters/localFilePersistence.ts",
    "lib/persistence/adapters/databasePersistencePlaceholder.ts",
    "lib/persistence/persistenceRepository.ts",
    "docs/architecture/PERSISTENCE_ADAPTERS.md",
  ];

  for (const file of requiredFiles) {
    await assertFile(file);
  }

  const envExample = await readFile(path.join(root, ".env.example"), "utf8");
  if (!envExample.includes("NODRAMA_PERSISTENCE_MODE")) {
    throw new Error(".env.example missing NODRAMA_PERSISTENCE_MODE");
  }
  if (!envExample.includes("NODRAMA_DATABASE_URL")) {
    throw new Error(".env.example missing NODRAMA_DATABASE_URL");
  }

  const docs = await readFile(path.join(root, "docs/architecture/PERSISTENCE_ADAPTERS.md"), "utf8");
  const requiredPhrases = [
    "metadata-only",
    "private mode",
    "credit ledger",
    "idempotency",
    "no full prompt storage by default",
  ];
  for (const phrase of requiredPhrases) {
    if (!docs.toLowerCase().includes(phrase)) {
      throw new Error(`Persistence docs missing phrase: ${phrase}`);
    }
  }

  const verifySh = await readFile(path.join(root, "scripts/verify.sh"), "utf8");
  if (!verifySh.includes("verify-persistence-adapter-foundation.mjs")) {
    throw new Error("scripts/verify.sh does not wire persistence adapter verifier");
  }

  const packageJson = await readFile(path.join(root, "package.json"), "utf8");
  const blockedDbDeps = ["prisma", "@prisma/client", "drizzle-orm", "pg", "postgres"];
  for (const dep of blockedDbDeps) {
    if (packageJson.includes(`\"${dep}\"`)) {
      throw new Error(`Unexpected DB dependency introduced: ${dep}`);
    }
  }

  console.log("✅ Persistence adapter foundation verified");
}

main().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exit(1);
});
