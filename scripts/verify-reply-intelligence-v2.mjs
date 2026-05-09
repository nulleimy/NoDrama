import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

import { detectReplyContext, runReplyQa } from "../lib/nodrama/replyIntelligence.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const jiti = createJiti(import.meta.url, {
  alias: {
    "@": repoRoot,
    "@/*": `${repoRoot}/*`,
  },
});
const { generateRequestSchema } = await jiti.import("../lib/generateContract.ts");
const { generatePhraseEngineReply } = await jiti.import(
  "../lib/language/phraseEngine.ts"
);

const composer = readFileSync("lib/language/replyComposer.ts", "utf8");

const authorityInvite = detectReplyContext("Šéf mě pozval na narozeninovou oslavu ale nechci jít");
assert.equal(authorityInvite.scenarioFamily, "work_social_invitation");
assert.ok(["medium", "high"].includes(authorityInvite.confidence));
assert.ok(authorityInvite.reasons.length > 0);

const workDelay = detectReplyContext("Nestíhám termín projektu a potřebuju posunout dodání");
assert.equal(workDelay.scenarioFamily, "work_deadline_delay");

const friendDecline = detectReplyContext("Kamarád mě pozval ven, ale nemám energii");
assert.equal(friendDecline.scenarioFamily, "social_invitation_decline");

const moneyRefusal = detectReplyContext("Bratranec chce půjčit peníze a nechci půjčit");
assert.equal(moneyRefusal.scenarioFamily, "money_refuse_loan");

const familyBoundary = detectReplyContext("Rodina na mě tlačí přes výčitky");
assert.equal(familyBoundary.scenarioFamily, "family_pressure_boundary");

const clientScope = detectReplyContext("Client asks for extra scope outside budget and timeline");
assert.equal(clientScope.scenarioFamily, "client_scope_negotiation");

const clientScopeReply = generatePhraseEngineReply(
  generateRequestSchema.parse({
    situation:
      "Klient chce přidat další práci mimo rozsah a rozpočet, potřebuji vyjednat cenu a termín.",
    toneId: "formal",
    relationshipId: "client",
    channelId: "email",
    strategyId: "negotiate",
    appLocale: "cs",
  }),
  2,
  2
);

assert.equal(
  clientScopeReply.meta.replyIntelligence.detectedContext.scenarioFamily,
  "client_scope_negotiation"
);
assert.match(
  Object.values(clientScopeReply.output).join(" "),
  /\b(rozsah|term[ií]n|rozpočet|cena|zad[aá]n[ií])\b/i,
  "client scope negotiation should use scope, time or price framing"
);

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
