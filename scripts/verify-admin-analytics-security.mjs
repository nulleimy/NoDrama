import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const route = readFileSync("app/api/admin/analytics/summary/route.ts", "utf8");
const store = readFileSync("lib/analytics/eventStore.ts", "utf8");

if (!route.includes("ADMIN_ANALYTICS_TOKEN")) {
  fail("Admin analytics summary route is not guarded by ADMIN_ANALYTICS_TOKEN.");
}

if (!route.includes("x-admin-token")) {
  fail("Admin analytics summary route does not check x-admin-token.");
}

if (!route.includes("UNAUTHORIZED")) {
  fail("Admin analytics summary route does not return unauthorized response.");
}

if (!store.includes("parseAnalyticsLine")) {
  fail("Analytics JSONL parser is not defensive.");
}

if (!store.includes("event is StoredAnalyticsEvent")) {
  fail("Analytics JSONL parser does not type-filter malformed lines.");
}

console.log("✅ Admin analytics security verified");
