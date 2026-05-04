import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";
import { mapUiChannelToReplyChannel } from "@/lib/language/channelMap";
import { selectPhrases } from "@/lib/language/phraseSelector";
import { composeReplyVariants, detectReplyLanguage } from "@/lib/language/replyComposer";
import { matchSituationCategory } from "@/lib/language/situationMatcher";
import { mapUiToneToReplyStyle } from "@/lib/language/toneMap";
import type { ReplyChannel, ReplyStyle } from "@/lib/language/phraseTypes";
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
  const language = detectReplyLanguage(input);
  const contentDepth = createContentDepthRuntimeContext(
    input,
    match.category,
    language
  );
  const style =
    mapSelectorToneToReplyStyle(contentDepth.selectorMixing.selectors.tone.id) ||
    mapUiToneToReplyStyle(input.tone);
  const channel =
    mapSelectorChannelToReplyChannel(
      contentDepth.selectorMixing.selectors.channel.id
    ) || mapUiChannelToReplyChannel(input.channel);

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

function mapSelectorToneToReplyStyle(toneId: string): ReplyStyle | null {
  if (toneId === "formal") return "formal";
  if (toneId === "assertive") return "firm";
  if (toneId === "playful") return "funny";
  if (toneId === "neutral") return "neutral";
  return "casual";
}

function mapSelectorChannelToReplyChannel(channelId: string): ReplyChannel | null {
  if (channelId === "email") return "email";
  if (channelId === "work_chat" || channelId === "professional_dm") {
    return "slack";
  }

  return "whatsapp";
}
