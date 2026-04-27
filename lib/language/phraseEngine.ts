import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";
import { mapUiChannelToReplyChannel } from "@/lib/language/channelMap";
import { selectPhrases } from "@/lib/language/phraseSelector";
import { matchSituationCategory } from "@/lib/language/situationMatcher";
import { mapUiToneToReplyStyle } from "@/lib/language/toneMap";

function expandReply(base: string, index: number) {
  if (index === 0) return base;

  if (index === 1) {
    if (base.includes("díky za pochopení") || base.includes("Díky za pochopení")) {
      return base;
    }

    return `${base} Ozvu se později.`;
  }

  return makeFirmReply(base);
}

function makeFirmReply(base: string) {
  const normalized = base.replace(/\s+/g, " ").trim();

  if (
    normalized.includes("nebudu mít prostor") ||
    normalized.includes("nezúčastním") ||
    normalized.includes("nevyhovuje") ||
    normalized.includes("nemohu")
  ) {
    return `${normalized} Nechci to zbytečně rozebírat.`;
  }

  return `${normalized} Dávám vědět rovnou a nechci to zbytečně rozebírat.`;
}

export function generatePhraseEngineReply(
  input: GenerateRequest,
  remaining: number,
  limit: number
): GenerateResponse & {
  meta: {
    engine: "phrase";
    categoryId: string;
    categoryLabel: string;
    requestedStyle: string;
    effectiveStyle: string;
    fallbackUsed: boolean;
    blockedReason?: string;
    recommendedId?: string;
    scores: { id: string; score: number; reasons: string[] }[];
  };
} {
  const match = matchSituationCategory(input.situation);
  const style = mapUiToneToReplyStyle(input.tone);
  const channel = mapUiChannelToReplyChannel(input.channel);

  const selection = selectPhrases({
    intent: match.category.intent,
    domain: match.category.domain,
    style,
    channel,
    language: "cs",
  });

  const replies = selection.selected.map((entry, index) => expandReply(entry.text, index));

  const shortReply = replies[0] || "Dávám vědět rovnou, že mi to tentokrát nevyjde.";
  const naturalReply = replies[1] || `${shortReply} Díky za pochopení.`;
  const strongReply =
    replies[2] || "Tentokrát se nezúčastním a nechci to zbytečně komplikovat.";
  const followUpReply =
    selection.fallbackUsed && selection.blockedReason
      ? "Kdyby se ptali dál: „Nechci to moc rozebírat, jen dávám vědět včas.“"
      : "Kdyby se ptali dál: „Nechci to moc rozebírat. Dávám vědět hlavně proto, aby se s tím dalo počítat.“";

  return {
    ok: true,
    remaining,
    limit,
    output: {
      shortReply,
      naturalReply,
      strongReply,
      followUpReply,
    },
    meta: {
      engine: "phrase",
      categoryId: match.category.id,
      categoryLabel: match.category.label,
      requestedStyle: selection.requestedStyle,
      effectiveStyle: selection.effectiveStyle,
      fallbackUsed: selection.fallbackUsed,
      blockedReason: selection.blockedReason,
      recommendedId: selection.recommendedId,
      scores: selection.scores.map((item) => ({
        id: item.entry.id,
        score: item.score,
        reasons: item.reasons,
      })),
    },
  };
}
