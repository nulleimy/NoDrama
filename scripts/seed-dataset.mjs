import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const seedPath = path.join(rootDir, 'data', 'seeds', 'enterprise-v2.seed.json');
const creditsDir = path.join(rootDir, 'data', 'credits');
const creditsPath = path.join(creditsDir, 'credits.json');

const rawSeed = await readFile(seedPath, 'utf8');
const seed = JSON.parse(rawSeed);

const now = new Date().toISOString();
const creditDb = Object.fromEntries(
  seed.creditAccounts.map((account) => [
    account.userId,
    {
      userId: account.userId,
      credits: account.credits,
      createdAt: now,
      updatedAt: now,
    },
  ])
);

await mkdir(creditsDir, { recursive: true });
await writeFile(creditsPath, `${JSON.stringify(creditDb, null, 2)}\n`, 'utf8');

console.log(`Seeded dataset ${seed.version}`);
console.log(`Credits entries: ${seed.creditAccounts.length}`);
