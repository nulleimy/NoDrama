import { readFileSync } from "node:fs";

function fail(message) {
  console.error(`❌ ${message}`);
  process.exit(1);
}

const adminApiRoute = readFileSync("app/api/admin/analytics/summary/route.ts", "utf8");
const adminPage = readFileSync("app/admin/analytics/page.tsx", "utf8");
const store = readFileSync("lib/analytics/eventStore.ts", "utf8");
const creditGrantRoute = readFileSync("app/api/credits/add/route.ts", "utf8");
const envExample = readFileSync(".env.example", "utf8");

if (!adminApiRoute.includes("ADMIN_ANALYTICS_TOKEN")) {
  fail("Admin analytics summary route is not guarded by ADMIN_ANALYTICS_TOKEN.");
}

if (!adminApiRoute.includes("x-admin-token")) {
  fail("Admin analytics summary route does not check x-admin-token.");
}

if (!adminApiRoute.includes("UNAUTHORIZED")) {
  fail("Admin analytics summary route does not return unauthorized response.");
}

if (!adminPage.includes("requireAdminPage")) {
  fail("Admin analytics page is not protected by requireAdminPage().");
}

if (!adminPage.includes("await requireAdminPage()")) {
  fail("Admin analytics page does not await the server-side admin guard before reading analytics.");
}

if (!store.includes("parseAnalyticsLine")) {
  fail("Analytics JSONL parser is not defensive.");
}

if (!store.includes("event is StoredAnalyticsEvent")) {
  fail("Analytics JSONL parser does not type-filter malformed lines.");
}

if (!creditGrantRoute.includes("NODRAMA_ENABLE_DEV_CREDIT_GRANTS")) {
  fail("Manual credit grants are not behind an explicit dev-only flag.");
}

if (!creditGrantRoute.includes("NODE_ENV !== \"production\"")) {
  fail("Manual credit grants are not blocked in production.");
}

if (!creditGrantRoute.includes("CREDIT_GRANT_DISABLED")) {
  fail("Manual credit grant route does not return a disabled response.");
}

if (!envExample.includes("ADMIN_EMAILS=")) {
  fail(".env.example does not document ADMIN_EMAILS.");
}

if (!envExample.includes("NODRAMA_ENABLE_DEV_CREDIT_GRANTS=false")) {
  fail(".env.example does not document disabled dev credit grants.");
}

console.log("✅ Admin analytics security verified");
