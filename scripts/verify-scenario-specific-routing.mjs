import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const intelligence = readFileSync("lib/nodrama/replyIntelligence.ts", "utf8");
const composer = readFileSync("lib/language/replyComposer.ts", "utf8");
const verify = readFileSync("scripts/verify.sh", "utf8");

for (const scenario of [
  "work_extra_work_boundary",
  "friend_help_capacity_decline",
  "repeated_favors_boundary",
  "social_dm_personal_boundary",
  "redirect_topic",
  "buy_time_no_deadline",
]) {
  assert.ok(intelligence.includes(scenario), `Missing scenario route: ${scenario}`);
}

for (const phrase of [
  "isBuyTimeWithoutDeadlineContext",
  "isWorkExtraWorkBoundaryContext",
  "isFriendHelpCapacityContext",
  "isRepeatedFavorsContext",
  "isSocialDmPersonalBoundaryContext",
]) {
  assert.ok(composer.includes(phrase), `Missing composer helper: ${phrase}`);
}

assert.ok(!intelligence.includes('"dm",'), 'replyIntelligence must not use plain "dm" token');
assert.ok(!composer.includes("social dm|dm"), 'replyComposer must not use plain dm regex alternative');
assert.ok(!intelligence.includes('toneSuggestion = "polite";'), "polite is not a valid tone selector id");

assert.ok(
  verify.includes("scripts/verify-scenario-specific-routing.mjs"),
  "verify.sh must run scenario-specific routing verifier"
);

console.log("OK: scenario-specific reply routing verified");
