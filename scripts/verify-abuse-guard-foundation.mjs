import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");

const abuseGuardPath = "lib/security/abuseGuard.ts";
const generateRoutePath = "app/api/generate/route.ts";
const docsPath = "docs/ops/ABUSE_GUARD.md";
const verifyShPath = "scripts/verify.sh";

assert.ok(existsSync(abuseGuardPath), "abuse guard module must exist");
assert.ok(existsSync(generateRoutePath), "/api/generate route must exist");
assert.ok(existsSync(docsPath), "ABUSE_GUARD ops doc must exist");

const abuseGuard = read(abuseGuardPath);
const generateRoute = read(generateRoutePath);
const docs = read(docsPath);
const verifySh = read(verifyShPath);

for (const required of [
  "getClientSignal",
  "hashClientSignal",
  "checkGenerateAbuseLimit",
  "buildAbuseDecision",
  "isAbuseGuardEnabled",
]) {
  assert.ok(abuseGuard.includes(required), `abuse guard missing ${required}`);
}

assert.ok(generateRoute.includes("checkGenerateAbuseLimit"), "generate route must use abuse guard limit check");
assert.ok(generateRoute.includes("RATE_LIMITED"), "generate route must include RATE_LIMITED code");
assert.ok(generateRoute.includes("status: 429"), "generate route must return 429 when blocked");

assert.ok(!abuseGuard.includes("rawIp"), "abuse guard must not persist raw IP label");
assert.ok(!abuseGuard.includes("prompt"), "abuse guard must not store full prompt in logs");

for (const envKey of [
  "NODRAMA_ABUSE_GUARD_ENABLED",
  "NODRAMA_GENERATE_LIMIT_WINDOW_SECONDS",
  "NODRAMA_GENERATE_LIMIT_MAX",
]) {
  assert.ok(docs.includes(envKey), `ABUSE_GUARD doc missing env key ${envKey}`);
}

assert.ok(verifySh.includes("verify-abuse-guard-foundation.mjs"), "verify.sh must execute abuse guard verifier");

console.log("OK: abuse guard foundation verified");
