import type { GenerateRequest } from "@/lib/generateContract";
import { forbiddenPatterns, toneDescriptors } from "@/lib/enterprise/taxonomies";
import { microSituations, type MicroSituation } from "@/lib/enterprise/situations";

export type EnterpriseOutput = {
  situation: MicroSituation;
  badExample: string;
  goodExample: string;
  topExample: string;
  shortVersion: string;
  longVersion: string;
  whatNotToSay: string[];
  riskNote: string;
};

function normalize(input: string) {
  return input.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function scoreSituation(input: string, situation: MicroSituation) {
  const normalizedInput = normalize(input);
  const haystack = [
    situation.category,
    situation.subcategory,
    situation.microSituationCs,
    situation.microSituationEn,
  ]
    .map((item) => normalize(item))
    .join(" ");

  return normalizedInput
    .split(/\s+/)
    .filter((token) => token.length > 2)
    .reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
}

function pickSituation(input: GenerateRequest): MicroSituation {
  return microSituations
    .map((situation) => ({ situation, score: scoreSituation(input.situation, situation) }))
    .sort((a, b) => b.score - a.score)[0]?.situation ?? microSituations[0];
}

function localize<T>(language: "cs" | "en", cs: T, en: T) {
  return language === "cs" ? cs : en;
}

export function generateEnterpriseReply(input: GenerateRequest): EnterpriseOutput {
  const situation = pickSituation(input);
  const language = input.language;

  const badExample = localize(language, situation.badExampleCs, situation.badExampleEn);
  const goodExample = localize(language, situation.goodExampleCs, situation.goodExampleEn);
  const topExample = localize(language, situation.topExampleCs, situation.topExampleEn);

  const toneWord = toneDescriptors[input.tone][language];
  const needsFallbackTone = situation.blockedTones.includes(input.tone);

  const shortVersion =
    input.tone === "minimal"
      ? topExample.split(/[.!?]/)[0].trim() + "."
      : topExample;

  const longVersion =
    language === "cs"
      ? `${topExample} Styl: ${needsFallbackTone ? "automaticky bezpečně upraven" : toneWord}. Strategie: ${input.strategy}.`
      : `${topExample} Style: ${needsFallbackTone ? "auto-adjusted for safety" : toneWord}. Strategy: ${input.strategy}.`;

  const riskNote =
    language === "cs"
      ? `Riziko: ${situation.riskLevel}. Tlak: ${situation.pressureLevel}. Vyhni se lhaní a drž se konkrétních faktů.`
      : `Risk: ${situation.riskLevel}. Pressure: ${situation.pressureLevel}. Avoid lies and stay with concrete facts.`;

  const constraintList = localize(language, situation.constraintsCs, situation.constraintsEn);
  const whatNotToSay = [...constraintList, ...forbiddenPatterns].slice(0, 5);

  return {
    situation,
    badExample,
    goodExample,
    topExample,
    shortVersion,
    longVersion,
    whatNotToSay,
    riskNote,
  };
}
