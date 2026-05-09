import type { GenerateRequest, GenerateResponse } from "../generateContract";
import type { LanguageCode, ReplyChannel, ReplyStyle, SituationCategory } from "./phraseTypes";
import {
  chooseCzechSpeakerForm,
  inferCzechSpeakerGender,
  neutralizeCzechSlashForms,
  resolveCzechAddress,
} from "./czechMorphology";
import { formatEnglishReply, hasCzechLeakage } from "./englishRealization";
import {
  getCzechRealizerSlots,
  type RealizerFamily,
  type RealizerSlot,
} from "./realizerPhrases.cs";
import { getEnglishRealizerSlots } from "./realizerPhrases.en";

type RealizerVariant = keyof GenerateResponse["output"];
type ComplexityProfile = "compact" | "natural" | "expanded";

type RealizerInput = {
  request: GenerateRequest;
  category: SituationCategory;
  language: LanguageCode;
  style: ReplyStyle;
  channel: ReplyChannel;
  composed: GenerateResponse["output"];
  detectedScenarioFamily?: string;
  contentDepth: {
    scenarioCategory: string;
    tonePresetId: string;
    selectorMixing: {
      inferredDomain: string;
      inferredScenarioFamily?: string;
      selectors: {
        tone: { id: string };
        relationship: { id: string };
        channel: { id: string };
        strategy: { id: string };
      };
    };
  };
};

const variantOrder: RealizerVariant[] = [
  "shortReply",
  "naturalReply",
  "strongReply",
  "followUpReply",
];

const complexityByVariant: Record<RealizerVariant, ComplexityProfile> = {
  shortReply: "compact",
  naturalReply: "natural",
  strongReply: "expanded",
  followUpReply: "compact",
};

export function resolveRealizerLocale(
  request: Pick<GenerateRequest, "situation"> & {
    locale?: LanguageCode;
    appLocale?: LanguageCode;
    requestLocale?: LanguageCode;
  },
  detectedLanguage: LanguageCode
): LanguageCode {
  return request.appLocale || request.requestLocale || request.locale || detectedLanguage;
}

export function realizeReplyVariants(input: RealizerInput): GenerateResponse["output"] {
  const locale = resolveRealizerLocale(input.request, input.language);
  const realized =
    locale === "en" ? realizeEnglishVariants(input) : realizeCzechVariants(input);

  return enforceVariantDiversity(realized, locale, input.composed);
}

function realizeCzechVariants(input: RealizerInput): GenerateResponse["output"] {
  const toneId = resolveToneId(input);
  const channelId = resolveChannelId(input);
  const relationshipId = resolveRelationshipId(input);
  const address = resolveCzechAddress({ relationshipId, channelId, toneId });
  const family = resolveRealizerFamily(input);
  const slots = getCzechRealizerSlots({ family, toneId, channelId, address });
  const gender = inferCzechSpeakerGender(input.request.situation);

  return mapVariants((variant, index) => {
    if (variant === "followUpReply") {
      return pickPressureFollowUp(slots.pressureFollowUp, address.mode === "formal", index);
    }

    const complexity = complexityByVariant[variant];
    const parts = composeSlotParts(slots, variant, index, complexity);
    if (variant === "strongReply") parts.splice(3, 0, "V tomhle mám jasno.");
    const withGender = parts.map((part) =>
      chooseCzechSpeakerForm(gender, {
        female: part,
        male: part,
        neutral: part.replace(/\břekla\b/g, "řeknu").replace(/\bpřijela\b/g, "dorazím"),
      })
    );

    return formatCzechReply(withGender, { channelId, complexity });
  });
}

function realizeEnglishVariants(input: RealizerInput): GenerateResponse["output"] {
  const toneId = resolveToneId(input);
  const channelId = resolveChannelId(input);
  const relationshipId = resolveRelationshipId(input);
  const formal =
    toneId === "formal" ||
    relationshipId === "authority" ||
    relationshipId === "client" ||
    channelId === "email" ||
    channelId === "professional_dm";
  const family = resolveRealizerFamily(input);
  const slots = getEnglishRealizerSlots({ family, toneId, channelId, formal });

  return mapVariants((variant, index) => {
    if (variant === "followUpReply") {
      return pickPressureFollowUp(slots.pressureFollowUp, formal, index);
    }

    const complexity = complexityByVariant[variant];
    const parts = composeSlotParts(slots, variant, index, complexity);
    if (variant === "strongReply") parts.splice(3, 0, "I’m clear on this.");
    const reply = formatEnglishReply(parts, { channelId, complexity });

    if (hasCzechLeakage(reply)) {
      return input.composed[variant];
    }

    return reply;
  });
}

function composeSlotParts(
  slots: Record<RealizerSlot, string[]>,
  variant: RealizerVariant,
  variantIndex: number,
  complexity: ComplexityProfile
) {
  const opener = pickSlot(slots.opener, variantIndex);
  const reason = pickSlot(slots.reason, variantIndex + 1);
  const boundary = pickSlot(slots.boundary, variantIndex);
  const softener = pickSlot(slots.softener, variantIndex + 1);
  const nextStep = pickSlot(slots.nextStep, variantIndex + 2);
  const closing = pickSlot(slots.closing, variantIndex);

  if (complexity === "compact") return [opener, boundary, nextStep];
  if (variant === "strongReply") return [opener, reason, boundary, nextStep, closing];
  return [opener, reason, boundary, softener, nextStep];
}

function pickPressureFollowUp(
  pressureFollowUps: string[],
  preferFirst: boolean,
  index: number
): string {
  if (preferFirst) return pressureFollowUps[0] || pressureFollowUps[index] || "";
  return pressureFollowUps[1] || pressureFollowUps[0] || "";
}

function formatCzechReply(
  sentences: string[],
  input: { channelId: string; complexity: ComplexityProfile }
): string {
  const cleaned = sentences
    .map((sentence) => neutralizeCzechSlashForms(sentence).replace(/\s+/g, " ").trim())
    .filter(Boolean);

  if (input.channelId === "email" && input.complexity !== "compact") {
    const [opener, ...rest] = cleaned;
    return [opener, "", rest.join(" ")].filter(Boolean).join("\n");
  }

  return cleaned.join(" ");
}

function enforceVariantDiversity(
  output: GenerateResponse["output"],
  locale: LanguageCode,
  fallback: GenerateResponse["output"]
): GenerateResponse["output"] {
  const next = { ...output };
  const seenOpeners = new Set<string>();

  for (const variant of variantOrder) {
    const current = next[variant].trim();
    const opener = current.split(/[.!?\n]/)[0].toLowerCase();

    if (seenOpeners.has(opener) || isNearDuplicate(current, previousValues(next, variant))) {
      next[variant] = current.length > 0 ? diversify(current, locale, variant) : fallback[variant];
    }

    seenOpeners.add(next[variant].split(/[.!?\n]/)[0].toLowerCase());
  }

  if (isNearDuplicate(next.followUpReply, [next.shortReply, next.naturalReply, next.strongReply])) {
    next.followUpReply =
      locale === "en"
        ? "I understand the pressure, but I’m not changing the answer just to end the conversation faster."
        : "Rozumím tlaku, ale odpověď kvůli tomu měnit nebudu.";
  }

  return next;
}

function previousValues(output: GenerateResponse["output"], variant: RealizerVariant) {
  return variantOrder.slice(0, variantOrder.indexOf(variant)).map((key) => output[key]);
}

function isNearDuplicate(value: string, others: string[]) {
  const valueTokens = tokenSet(value);
  if (valueTokens.size < 3) return false;

  return others.some((other) => {
    const otherTokens = tokenSet(other);
    const shared = [...valueTokens].filter((token) => otherTokens.has(token)).length;
    return shared / Math.max(valueTokens.size, otherTokens.size, 1) > 0.72;
  });
}

function tokenSet(value: string) {
  return new Set(
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2)
  );
}

function diversify(value: string, locale: LanguageCode, variant: RealizerVariant) {
  if (variant === "strongReply") {
    return locale === "en"
      ? `${value} I need this to be treated as a clear boundary.`
      : `${value} Potřebuji, aby to bylo brané jako jasná hranice.`;
  }

  return locale === "en" ? `${value} That is the clearest version.` : `${value} Tohle je nejjasnější verze.`;
}

function mapVariants(
  build: (variant: RealizerVariant, index: number) => string
): GenerateResponse["output"] {
  return {
    shortReply: build("shortReply", 0),
    naturalReply: build("naturalReply", 1),
    strongReply: build("strongReply", 2),
    followUpReply: build("followUpReply", 3),
  };
}

function pickSlot(values: string[], index: number) {
  return values[index % values.length] || "";
}

function resolveToneId(input: RealizerInput) {
  return (
    input.request.toneId ||
    input.contentDepth.selectorMixing.selectors.tone.id ||
    mapStyleToToneId(input.style)
  );
}

function resolveChannelId(input: RealizerInput) {
  return (
    input.request.channelId ||
    input.contentDepth.selectorMixing.selectors.channel.id ||
    input.channel
  );
}

function resolveRelationshipId(input: RealizerInput) {
  return (
    input.request.relationshipId ||
    input.contentDepth.selectorMixing.selectors.relationship.id ||
    "friend"
  );
}

function mapStyleToToneId(style: ReplyStyle) {
  if (style === "firm") return "assertive";
  if (style === "funny" || style === "absurd") return "playful";
  if (style === "formal") return "formal";
  if (style === "casual") return "warm";
  return "neutral";
}

function resolveRealizerFamily(input: RealizerInput): RealizerFamily {
  const strategyId = input.contentDepth.selectorMixing.selectors.strategy.id;
  const intent = input.category.intent;
  const domain = input.category.domain;
  const scenarioFamily =
    input.detectedScenarioFamily ||
    input.contentDepth.selectorMixing.inferredScenarioFamily;

  if (
    [
      "work_social_invitation",
      "authority_social_decline",
      "social_invitation_decline",
    ].includes(scenarioFamily || "")
  ) {
    return "decline";
  }

  if (scenarioFamily === "work_deadline_delay") return "delay";
  if (scenarioFamily === "client_scope_negotiation") return "negotiate";
  if (scenarioFamily === "money_refuse_loan") return "boundary";
  if (scenarioFamily === "family_pressure_boundary") return "boundary";
  if (scenarioFamily === "repair_after_mistake") return "repair";

  if (strategyId === "repair" || intent === "apology") return "repair";
  if (strategyId === "delay" || intent === "delay" || intent === "reschedule") {
    return "delay";
  }
  if (strategyId === "hard_boundary" || intent === "boundary") return "boundary";
  if (strategyId === "negotiate" || intent === "negotiate") return "negotiate";
  if (strategyId === "clarify" || intent === "clarify") return "clarify";
  if (strategyId === "redirect") return "redirect";
  if (strategyId === "exit" || strategyId === "soft_exit") return "exit";
  if (domain === "work" || domain === "business") return "work";
  return "decline";
}
