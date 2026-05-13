import { readFileSync, existsSync } from "node:fs";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(existsSync("lib/security/abuseGuard.ts"), "Missing lib/security/abuseGuard.ts");
assert(existsSync("docs/ops/ABUSE_GUARD.md"), "Missing docs/ops/ABUSE_GUARD.md");

const route = readFileSync("app/api/generate/route.ts", "utf8");
const guard = readFileSync("lib/security/abuseGuard.ts", "utf8");
const opsDoc = readFileSync("docs/ops/ABUSE_GUARD.md", "utf8");

assert(route.includes("isAbuseGuardEnabled"), "Route does not wire abuse guard enablement");
assert(route.includes("enforceGenerateAbuseLimit"), "Route does not enforce abuse guard");
assert(route.includes('code: "RATE_LIMITED"'), "Route missing RATE_LIMITED response");
assert(route.includes("retryAfterSeconds"), "Route missing retryAfterSeconds");

assert(guard.includes("NODRAMA_ABUSE_GUARD_ENABLED"), "Missing enabled env key");
assert(guard.includes("NODRAMA_GENERATE_LIMIT_WINDOW_SECONDS"), "Missing window env key");
assert(guard.includes("NODRAMA_GENERATE_LIMIT_MAX"), "Missing max env key");
assert(guard.includes("NODRAMA_ABUSE_GUARD_HASH_SALT"), "Missing salt env key");
assert(guard.includes("createHash"), "Guard missing hashing implementation");

assert(opsDoc.includes("RATE_LIMITED"), "Ops doc missing rate limit response contract");

console.log("verify-abuse-guard-foundation: ok");
