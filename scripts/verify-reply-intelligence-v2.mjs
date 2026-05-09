import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { getCzechRealizerSlots } from "../lib/language/realizerPhrases.cs.ts";
import {
  detectReplyContext,
  resolveScenarioRoute,
  runReplyQa,
} from "../lib/nodrama/replyIntelligence.ts";

const composer = readFileSync("lib/language/replyComposer.ts", "utf8");
const phraseEngine = readFileSync("lib/language/phraseEngine.ts", "utf8");

const authorityInvite = detectReplyContext("Šéf mě pozval na narozeninovou oslavu ale nechci jít");
assert.equal(authorityInvite.scenarioFamily, "work_social_invitation");
assert.equal(authorityInvite.relationshipSuggestion, "authority");
assert.equal(authorityInvite.strategySuggestion, "soft_decline");
assert.ok(["medium", "high"].includes(authorityInvite.confidence));
assert.ok(authorityInvite.reasons.length > 0);
assert.equal(resolveScenarioRoute(authorityInvite.strategySuggestion, authorityInvite), "decline");

const workDelay = detectReplyContext("Nestíhám termín projektu a potřebuju posunout dodání");
assert.equal(workDelay.scenarioFamily, "work_deadline_delay");

const schoolExtension = detectReplyContext(
  "nestíhám odevzdat slohovou práci, už jsem měla odklad a potřebuju dalších pět dní"
);
assert.equal(schoolExtension.domain, "school");
assert.equal(schoolExtension.scenarioFamily, "school_deadline_extension");
assert.equal(schoolExtension.relationshipSuggestion, "authority");
assert.equal(schoolExtension.strategySuggestion, "delay");
assert.ok(schoolExtension.reasons.includes("school_deadline_signal"));
assert.equal(resolveScenarioRoute("soft_decline", schoolExtension), "delay");

const friendDecline = detectReplyContext("Kamarád mě pozval ven, ale nemám energii");
assert.equal(friendDecline.scenarioFamily, "social_invitation_decline");

const moneyRefusal = detectReplyContext("Bratranec chce půjčit peníze a nechci půjčit");
assert.equal(moneyRefusal.scenarioFamily, "money_refuse_loan");
const issueMoneyRefusal = detectReplyContext("kamarád si chce půjčit peníze a já nechci");
assert.equal(issueMoneyRefusal.domain, "money");
assert.equal(issueMoneyRefusal.scenarioFamily, "money_refuse_loan");
assert.equal(resolveScenarioRoute("soft_decline", issueMoneyRefusal), "boundary");

const familyBoundary = detectReplyContext("Rodina na mě tlačí přes výčitky");
assert.equal(familyBoundary.scenarioFamily, "family_pressure_boundary");

const clientScope = detectReplyContext("Client asks for extra scope outside budget and timeline");
assert.equal(clientScope.scenarioFamily, "client_scope_negotiation");

const guardQa = runReplyQa({
  text: "Díky za pozvání, termín radši posunout na příští týden.",
  detected: authorityInvite,
  strategyId: "soft_decline",
  relationshipId: "authority",
  channelId: "work_chat",
  toneId: "soft",
});
assert.ok(guardQa.forbiddenTermsHit.length > 0);
assert.ok(["rewrite", "reject"].includes(guardQa.verdict));

const moneyVocabularyQa = runReplyQa({
  text: "Díky za pozvání. Tentokrát se nepřidám, ale vážím si toho, že jste na mě mysleli.",
  detected: issueMoneyRefusal,
  strategyId: "hard_boundary",
  relationshipId: "friend",
  channelId: "messenger_1to1",
  toneId: "assertive",
});
assert.ok(moneyVocabularyQa.contextFit < 0.65);
assert.ok(["rewrite", "reject"].includes(moneyVocabularyQa.verdict));
assert.ok(moneyVocabularyQa.forbiddenTermsHit.includes("pozvání"));
assert.ok(moneyVocabularyQa.reasons.includes("scenario_vocabulary_conflict"));

const moneySlots = getCzechRealizerSlots({
  family: "money_refuse_loan",
  toneId: "assertive",
  channelId: "messenger_1to1",
  address: {
    mode: "informal",
    pronoun: "ty",
    please: "prosím",
    respect: "respektuj",
    can: "můžeš",
    send: "pošli",
    confirm: "potvrď",
    understand: "chápu",
  },
});
const realizedMoneyText = Object.values(moneySlots).flat().join(" ");
assert.match(realizedMoneyText, /peníze/i);
assert.match(realizedMoneyText, /půjčovat nechci|půjčku/i);
for (const forbidden of ["pozvání", "oslava", "přidám se", "jste na mě mysleli"]) {
  assert.ok(!realizedMoneyText.includes(forbidden), `Money slots leaked ${forbidden}`);
}

assert.ok(!composer.includes("Prosím tě, respektuj to"), "Authority invite wording is too firm.");
assert.ok(phraseEngine.includes("routeOverride"), "Final realizer must receive scenario route overrides.");

for (const phrase of [
  "Potřebuji na to více času",
  "Díky za pozvání, tentokrát to vynechám.",
  "peníze půjčovat nechci",
  "Tento víkend nepřijedu",
  "scope, timing, or budget",
]) {
  assert.ok(composer.includes(phrase), `Missing expected phrase: ${phrase}`);
}

console.log("OK: reply intelligence v2 verified");
