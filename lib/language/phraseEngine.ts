import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";
import { mapUiChannelToReplyChannel } from "@/lib/language/channelMap";
import { selectPhrases } from "@/lib/language/phraseSelector";
import { composeReplyVariants, detectReplyLanguage } from "@/lib/language/replyComposer";
import { matchSituationCategory } from "@/lib/language/situationMatcher";
import { mapUiToneToReplyStyle } from "@/lib/language/toneMap";
import {
  createContentDepthRuntimeContext,
  type ContentDepthRuntimeContext,
} from "@/lib/nodrama/contentDepthRuntime";

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
    contentDepth: ContentDepthRuntimeContext;
  };
} {
  const match = matchSituationCategory(input.situation);
  const style = mapUiToneToReplyStyle(input.tone);
  const channel = mapUiChannelToReplyChannel(input.channel);
  const contentDepth = createContentDepthRuntimeContext(input, match.category);
  const language = detectReplyLanguage(input);

  const selection = selectPhrases({
    intent: match.category.intent,
    domain: match.category.domain,
    style,
    channel,
    language,
  });

  const output = composeReplyVariants({
    request: input,
    category: match.category,
    language,
    style,
    channel,
    contentDepth,
    selectedPhrases: selection.selected,
    fallbackUsed: selection.fallbackUsed,
    blockedReason: selection.blockedReason,
  });

  return {
    ok: true,
    remaining,
    limit,
    output,
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
      contentDepth,
    },
  };
}
