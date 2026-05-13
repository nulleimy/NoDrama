import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const moduleFile = readFileSync("lib/analytics/funnelEvents.ts", "utf8");
const docs = readFileSync("docs/ops/ADMIN_ANALYTICS_FUNNEL.md", "utf8");
const adminPage = readFileSync("app/admin/analytics/page.tsx", "utf8");
const verifySh = readFileSync("scripts/verify.sh", "utf8");

const requiredEvents = ["page_view","generator_input_started","generate_attempt","generate_success","generate_failed","copy_clicked","rating_positive","rating_negative","feedback_wrong_context","feedback_not_sendable","tuning_chip_clicked","memory_export_clicked","memory_clear_clicked","private_mode_enabled","private_mode_disabled","pricing_viewed","plan_cta_clicked","sos_pack_cta_clicked","free_limit_hit","rate_limited"];
for (const event of requiredEvents) {
  if (!moduleFile.includes(`\"${event}\"`) && !moduleFile.includes(`'${event}'`)) {
    fail(`Missing event taxonomy item: ${event}`);
  }
}

if (!moduleFile.includes("assertNoSensitiveAnalyticsPayload")) fail("Missing sensitive payload guard.");
if (!docs.includes("Forbidden payload")) fail("Analytics funnel docs missing forbidden payload section.");
if (!adminPage.includes("Metadata-only analytics")) fail("Admin page missing metadata-only copy.");
if (!adminPage.includes("No full user situations stored")) fail("Admin page missing privacy copy.");
if (!verifySh.includes("verify-admin-analytics-funnel-v1.mjs")) fail("verify.sh does not call admin analytics funnel v1 verifier.");

const banned = ["fullPrompt", "rawPrompt", "generatedReplyFull"];
for (const b of banned) {
  if (moduleFile.includes(`${b}:`) || moduleFile.includes(`\"${b}\"`)) {
    fail(`Forbidden key introduced in analytics module: ${b}`);
  }
}

console.log("✅ Admin analytics funnel v1 verified");
