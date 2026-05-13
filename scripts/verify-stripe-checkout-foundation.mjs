import { readFileSync, existsSync } from "node:fs";

const envExample = readFileSync('.env.example', 'utf8');
const required = [
  'STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','STRIPE_PRICE_STARTER_MONTHLY','STRIPE_PRICE_PRO_MONTHLY','STRIPE_PRICE_POWER_MONTHLY','STRIPE_PRICE_SOS_PACK','STRIPE_PRICE_MINI_PACK','STRIPE_PRICE_KLID_PACK','NEXT_PUBLIC_APP_URL'
];
for (const key of required) {
  if (!envExample.includes(`${key}=`)) throw new Error(`Missing ${key} in .env.example`);
}
if (!existsSync('app/api/billing/checkout/route.ts')) throw new Error('Missing checkout endpoint');
if (!existsSync('app/api/billing/webhook/route.ts')) throw new Error('Missing webhook endpoint');
const webhook = readFileSync('app/api/billing/webhook/route.ts', 'utf8');
if (!webhook.includes('markWebhookEventProcessed')) throw new Error('Missing idempotency guard in webhook');
if (!webhook.includes('addCredits')) throw new Error('Missing server-side credit grant path');
const accountPage = readFileSync('app/account/page.tsx', 'utf8');
if (accountPage.toLowerCase().includes('billing=success') || accountPage.toLowerCase().includes('addcredits')) throw new Error('Potential client-side success URL credit grant logic found');
const checkout = readFileSync('app/api/billing/checkout/route.ts', 'utf8');
if (!checkout.includes('STRIPE_NOT_CONFIGURED')) throw new Error('Missing safe failure when env is not configured');
console.log('✅ Stripe checkout foundation verification passed');
