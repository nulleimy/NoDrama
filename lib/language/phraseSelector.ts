import { checkAntiCringe } from "@/lib/language/antiCringe";
import { filterRecentlyUsed } from "@/lib/language/antiRepeat";
import { expandedPhraseBank } from "@/lib/language/phraseExpansion";
import { diversifyRankedPhrases } from "@/lib/language/phraseDiversity";
import { rankPhrases, type PhraseScore } from "@/lib/language/phraseScoring";
import type {
  LanguageCode,
  PhraseBankEntry,
  ReplyChannel,
  ReplyIntent,
  ReplyStyle,
  SituationDomain,
} from "@/lib/language/phraseTypes";
import { isStyleAllowedForChannel, isStyleAllowedForDomain } from "@/lib/language/styleRules";

export type PhraseSelectionInput = {
  intent: ReplyIntent;
  domain: SituationDomain;
  style: ReplyStyle;
  channel: ReplyChannel;
  language?: LanguageCode;
  recentlyUsedIds?: string[];
};

export type PhraseSelectionResult = {
  selected: PhraseBankEntry[];
  scores: PhraseScore[];
  recommendedId?: string;
  requestedStyle: ReplyStyle;
  effectiveStyle: ReplyStyle;
  fallbackUsed: boolean;
  blockedReason?: string;
};

function styleFallback(style: ReplyStyle): ReplyStyle[] {
  if (style === "absurd") return ["absurd", "funny", "casual", "neutral"];
  if (style === "funny") return ["funny", "casual", "neutral"];
  if (style === "formal") return ["formal", "neutral"];
  if (style === "firm") return ["firm", "neutral"];
  if (style === "casual") return ["casual", "neutral"];
  return ["neutral", "casual", "formal"];
}

function uniqueByText(entries: PhraseBankEntry[]) {
  const seen = new Set<string>();

  return entries.filter((entry) => {
    if (seen.has(entry.text)) return false;
    seen.add(entry.text);
    return true;
  });
}

export function selectPhrases(input: PhraseSelectionInput): PhraseSelectionResult {
  const domainDecision = isStyleAllowedForDomain(input.style, input.domain);
  const channelDecision = isStyleAllowedForChannel(input.style, input.channel);

  const requestedStyleAllowed = domainDecision.allowed && channelDecision.allowed;
  const candidateStyles = requestedStyleAllowed ? styleFallback(input.style) : styleFallback("neutral");

  const blockedReason = !domainDecision.allowed
    ? domainDecision.reason
    : !channelDecision.allowed
      ? channelDecision.reason
      : undefined;

  for (const style of candidateStyles) {
    const candidates = uniqueByText(
      expandedPhraseBank.filter((entry) => {
        if (entry.intent !== input.intent) return false;
        if (entry.style !== style) return false;
        if (input.language && entry.language !== input.language) return false;
        if (!entry.channel.includes(input.channel)) return false;
        if (!checkAntiCringe(entry.text).ok) return false;
        return true;
      })
    );

    const filtered = filterRecentlyUsed(candidates, input.recentlyUsedIds || []);

    if (filtered.length > 0) {
      const ranked = rankPhrases(filtered, input.style, input.channel);
      const diversified = diversifyRankedPhrases(ranked, 3);

      return {
        selected: diversified.map((item) => item.entry),
        scores: diversified,
        recommendedId: diversified[0]?.entry.id,
        requestedStyle: input.style,
        effectiveStyle: style,
        fallbackUsed: style !== input.style || !requestedStyleAllowed,
        blockedReason,
      };
    }
  }

  const fallback = uniqueByText(
    expandedPhraseBank.filter((entry) => {
      if (entry.intent !== "cancel") return false;
      if (entry.style !== "neutral") return false;
      if (input.language && entry.language !== input.language) return false;
      return checkAntiCringe(entry.text).ok;
    })
  );

  const rankedFallback = rankPhrases(fallback, input.style, input.channel);
  const diversifiedFallback = diversifyRankedPhrases(rankedFallback, 3);

  return {
    selected: diversifiedFallback.map((item) => item.entry),
    scores: diversifiedFallback,
    recommendedId: diversifiedFallback[0]?.entry.id,
    requestedStyle: input.style,
    effectiveStyle: "neutral",
    fallbackUsed: true,
    blockedReason: blockedReason || "No exact phrase candidate found.",
  };
}
