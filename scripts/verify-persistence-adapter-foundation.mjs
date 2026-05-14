import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "lib/persistence/persistenceTypes.ts",
  "lib/persistence/persistenceConfig.ts",
  "lib/persistence/adapters/localFilePersistence.ts",
  "lib/persistence/adapters/databasePersistencePlaceholder.ts",
  "lib/persistence/persistenceRepository.ts",
  "docs/architecture/PERSISTENCE_ADAPTERS.md",
];

for (const rel of requiredFiles) {
  if (!existsSync(path.join(root, rel))) throw new Error(`Missing required file: ${rel}`);
}

const envExample = readFileSync(path.join(root, ".env.example"), "utf8");
for (const key of ["NODRAMA_PERSISTENCE_MODE", "NODRAMA_DATABASE_URL"]) {
  if (!envExample.includes(key)) throw new Error(`.env.example missing ${key}`);
}

const docs = readFileSync(path.join(root, "docs/architecture/PERSISTENCE_ADAPTERS.md"), "utf8").toLowerCase();
for (const phrase of ["metadata-only", "private mode", "credit ledger", "idempotent", "no full prompt storage by default"]) {
  if (!docs.includes(phrase)) throw new Error(`docs/architecture/PERSISTENCE_ADAPTERS.md missing phrase: ${phrase}`);
}

const verifySh = readFileSync(path.join(root, "scripts/verify.sh"), "utf8");
if (!verifySh.includes("verify-persistence-adapter-foundation.mjs")) {
  throw new Error("scripts/verify.sh does not wire verify-persistence-adapter-foundation.mjs");
}

const pkg = readFileSync(path.join(root, "package.json"), "utf8").toLowerCase();
if (pkg.includes('"prisma"') || pkg.includes('"@prisma/client"')) {
  throw new Error("Unexpected Prisma dependency detected");
}

console.log("verify-persistence-adapter-foundation: ok");
