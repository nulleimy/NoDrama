#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const planPath = path.resolve('docs/architecture/PRODUCTION_PERSISTENCE_PLAN.md');

if (!fs.existsSync(planPath)) {
  console.error('Missing required document: docs/architecture/PRODUCTION_PERSISTENCE_PLAN.md');
  process.exit(1);
}

const content = fs.readFileSync(planPath, 'utf8').toLowerCase();

const requiredTerms = [
  'metadata-only',
  'private mode',
  'credit ledger',
  'webhook source of truth',
  'retention policy',
  'export/delete',
  'no full prompt storage by default',
  'idempotent',
  'audit log',
  'regression candidates',
];

const missing = requiredTerms.filter((term) => !content.includes(term));

if (missing.length > 0) {
  console.error('Production persistence plan is missing required terms:');
  for (const term of missing) {
    console.error(`- ${term}`);
  }
  process.exit(1);
}

console.log('✅ Production persistence plan verification passed');
