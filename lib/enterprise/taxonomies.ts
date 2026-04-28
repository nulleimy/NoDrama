import type {
  ChannelId,
  LanguageId,
  RelationshipId,
  StrategyId,
  ToneId,
} from "@/lib/generateContract";

export type { ToneId, RelationshipId, ChannelId, StrategyId, LanguageId };

export const forbiddenPatterns = [
  "fake illness",
  "fake accident",
  "fake death in family",
  "gaslighting",
  "impersonation",
  "legal or financial manipulation",
];

export const toneDescriptors: Record<ToneId, { cs: string; en: string }> = {
  kind: { cs: "milý", en: "kind" },
  friendly: { cs: "přátelský", en: "friendly" },
  assertive: { cs: "asertivní", en: "assertive" },
  formal: { cs: "formální", en: "formal" },
  apologetic: { cs: "omluvný", en: "apologetic" },
  funny: { cs: "vtipný", en: "funny" },
  absurd: { cs: "absurdní", en: "absurd" },
  minimal: { cs: "krátký", en: "minimal" },
};
