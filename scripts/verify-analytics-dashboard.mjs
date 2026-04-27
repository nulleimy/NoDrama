import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const requiredFiles = [
  "lib/analytics/eventStore.ts",
  "app/api/admin/analytics/summary/route.ts",
  "app/admin/analytics/page.tsx",
  "docs/ANALYTICS_DASHBOARD.md",
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing analytics dashboard file: ${file}`);
  }
}

const logger = readFileSync("lib/analytics/eventLogger.ts", "utf8");
const route = readFileSync("app/api/events/route.ts", "utf8");
const page = readFileSync("app/admin/analytics/page.tsx", "utf8");

if (!logger.includes("storeAnalyticsEvent")) {
  fail("Analytics logger does not persist events.");
}

if (!route.includes("await logAnalyticsEvent")) {
  fail("Events API does not await async analytics logging.");
}

if (!page.includes("Analytics dashboard")) {
  fail("Admin analytics page missing dashboard heading.");
}

console.log("✅ Analytics dashboard verified");
