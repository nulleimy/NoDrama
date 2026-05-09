#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";

import {
  detectReplyContext,
  runReplyQa,
} from "../lib/nodrama/replyIntelligence.ts";

const confidenceRank = { low: 1, medium: 2, high: 3 };
const genericInvitationTerms = [
  "pozvání",
  "akce",
  "oslava",
  "přidám se",
  "jste na mě mysleli",
  "ses ozval",
  "ozvala",
  "tentokrát do toho nepůjdu",
];

const scenarios = [
  {
    id: "work-peer-extra-work-boundary",
    input: "Kolega po mně opakovaně chce práci navíc a já už to nechci dělat.",
    output:
      "Práci navíc teď nepřebírám. Potřebuju držet svoje současné priority a nastavit jasnou hranici.",
    expected: {
      domain: "work",
      scenarioFamily: "work_extra_work_boundary",
      relationshipSuggestion: "peer",
      strategySuggestion: "hard_boundary",
      channelSuggestion: "work_chat",
      minConfidence: "high",
      requiredTerms: ["práci navíc", "hranici"],
      forbiddenTerms: genericInvitationTerms,
    },
  },
  {
    id: "repeated-favors-boundary",
    input: "Někdo po mně pořád chce laskavosti a já potřebuji jasně nastavit hranici.",
    output:
      "Další laskavosti teď brát nebudu. Potřebuju nastavit jasnou hranici.",
    expected: {
      domain: "social",
      scenarioFamily: "repeated_favors_boundary",
      relationshipSuggestion: "friend",
      strategySuggestion: "hard_boundary",
      minConfidence: "high",
      requiredTerms: ["laskavosti", "hranici"],
      forbiddenTerms: genericInvitationTerms,
    },
  },
  {
    id: "family-pressure-boundary",
    input: "Rodina mě tlačí na návštěvu, ale já potřebuji klid a nechci se hádat.",
    output:
      "Chápu, že tě to mrzí, ale teď na návštěvu nepřijedu. Potřebuju klid a nechci se hádat.",
    expected: {
      domain: "family",
      scenarioFamily: "family_pressure_boundary",
      relationshipSuggestion: "family",
      strategySuggestion: "hard_boundary",
      minConfidence: "high",
      requiredTerms: ["klid", "hádat"],
      forbiddenTerms: genericInvitationTerms,
    },
  },
  {
    id: "close-friend-help-capacity",
    input: "Blízká kamarádka chce pomoct se stěhováním, ale já na to nemám energii.",
    output:
      "Se stěhováním teď pomoct nezvládnu. Nemám na to energii a nechci slíbit něco, co pak nedám.",
    expected: {
      domain: "social",
      scenarioFamily: "friend_help_capacity_decline",
      relationshipSuggestion: "close_friend",
      strategySuggestion: "hard_boundary",
      minConfidence: "high",
      requiredTerms: ["stěhováním", "energii"],
      forbiddenTerms: [...genericInvitationTerms, "peníze", "půjč"],
    },
  },
  {
    id: "social-dm-personal-boundary",
    input: "Na Instagramu mi někdo píše moc osobně a chci slušně ubrzdit konverzaci.",
    output:
      "Tohle je na mě už moc osobní, takže konverzaci trochu ubrzdím. Prosím držme ji víc obecně.",
    expected: {
      domain: "public",
      scenarioFamily: "social_dm_personal_boundary",
      relationshipSuggestion: "stranger_public",
      strategySuggestion: "hard_boundary",
      channelSuggestion: "social_dm",
      minConfidence: "high",
      requiredTerms: ["osobní", "ubrz"],
      forbiddenTerms: genericInvitationTerms,
    },
  },
  {
    id: "redirect-topic",
    input: "Nechci řešit osobní téma a potřebuji konverzaci převést jinam.",
    output:
      "Osobní téma tady řešit nechci. Pojďme konverzaci převést jinam.",
    expected: {
      domain: "social",
      scenarioFamily: "redirect_topic",
      relationshipSuggestion: "friend",
      strategySuggestion: "redirect",
      minConfidence: "high",
      requiredTerms: ["téma", "jinam"],
      forbiddenTerms: [...genericInvitationTerms, "ukončím", "odpojím"],
    },
  },
  {
    id: "buy-time-without-deadline",
    input:
      "Nestíhám odpovědět hned a potřebuji si získat čas bez slibování konkrétního výsledku.",
    output:
      "Potřebuju si to nejdřív promyslet. Nechci teď slíbit konkrétní výsledek, dokud v tom nebudu mít jasno.",
    expected: {
      domain: "general",
      scenarioFamily: "buy_time_no_deadline",
      relationshipSuggestion: "peer",
      strategySuggestion: "delay",
      minConfidence: "high",
      requiredTerms: ["promyslet", "konkrétní výsledek"],
      forbiddenTerms: [...genericInvitationTerms, "termín", "dodám další krok"],
    },
  },
  {
    id: "authority-social-invitation-tone",
    input: "Šéf mě pozval na narozeninovou oslavu, ale nechci jít.",
    output:
      "Dobrý den, děkuji za pozvání. Tentokrát se nezúčastním. Děkuji za pochopení.",
    expected: {
      domain: "work",
      scenarioFamily: "work_social_invitation",
      relationshipSuggestion: "authority",
      strategySuggestion: "soft_decline",
      channelSuggestion: "work_chat",
      minConfidence: "high",
      requiredTerms: ["děkuji", "nezúčastním"],
      forbiddenTerms: ["ses ozval", "ozvala", "tentokrát do toho nepůjdu"],
    },
  },
];

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesTerm(text, term) {
  return normalize(text).includes(normalize(term));
}

function assertExpectedContext(result, expected, id) {
  for (const key of [
    "domain",
    "scenarioFamily",
    "relationshipSuggestion",
    "strategySuggestion",
    "channelSuggestion",
  ]) {
    if (expected[key]) {
      assert.equal(result[key], expected[key], `${id}: expected ${key}`);
    }
  }

  if (expected.minConfidence) {
    assert.ok(
      confidenceRank[result.confidence] >= confidenceRank[expected.minConfidence],
      `${id}: expected confidence >= ${expected.minConfidence}, received ${result.confidence}`
    );
  }
}

function assertExpectedOutput(output, expected, id) {
  const requiredTerms = expected.requiredTerms || [];
  const forbiddenTerms = expected.forbiddenTerms || [];

  for (const term of requiredTerms) {
    assert.ok(includesTerm(output, term), `${id}: missing required term "${term}"`);
  }

  for (const term of forbiddenTerms) {
    assert.ok(!includesTerm(output, term), `${id}: contained forbidden term "${term}"`);
  }
}

const results = [];

for (const scenario of scenarios) {
  const detected = detectReplyContext(scenario.input);
  assertExpectedContext(detected, scenario.expected, scenario.id);
  assertExpectedOutput(scenario.output, scenario.expected, scenario.id);

  const qa = runReplyQa({
    text: scenario.output,
    detected,
    strategyId: detected.strategySuggestion,
    relationshipId: detected.relationshipSuggestion,
    channelId: detected.channelSuggestion,
    toneId: detected.toneSuggestion,
  });

  assert.equal(qa.forbiddenTermsHit.length, 0, `${scenario.id}: QA forbidden terms hit`);

  results.push({
    id: scenario.id,
    ok: true,
    detected,
    outputPreview: scenario.output,
    qa,
  });
}

mkdirSync("data/runtime/smoke-results", { recursive: true });
writeFileSync(
  "data/runtime/smoke-results/latest.json",
  `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`
);

console.log(`CLI scenario smoke passed: ${results.length} / ${results.length}`);
