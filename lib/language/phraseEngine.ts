import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";
import { mapUiChannelToReplyChannel } from "@/lib/language/channelMap";
import { selectPhrases } from "@/lib/language/phraseSelector";
import { realizeReplyVariants, resolveRealizerLocale } from "@/lib/language/phraseRealizer";
import { composeReplyVariants, detectReplyLanguage } from "@/lib/language/replyComposer";
import { matchSituationCategory } from "@/lib/language/situationMatcher";
import { mapUiToneToReplyStyle } from "@/lib/language/toneMap";
import type { ReplyChannel, ReplyIntent, ReplyStyle } from "@/lib/language/phraseTypes";
import {
  createContentDepthRuntimeContext,
  type ContentDepthRuntimeContext,
} from "@/lib/nodrama/contentDepthRuntime";
import { mapSelectorStrategyToIntent } from "@/lib/nodrama/selectorMixing.mjs";
import {
  applyQaRewrite,
  detectIntentConflict,
  detectReplyContext,
  resolveScenarioRoute,
  runReplyQa,
} from "@/lib/nodrama/replyIntelligence";

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
    replyIntelligence: {
      detectedContext: ReturnType<typeof detectReplyContext>;
      intentConflict: ReturnType<typeof detectIntentConflict>;
      routeOverride: ReturnType<typeof resolveScenarioRoute>;
      qaByVariant: {
        shortReply: ReturnType<typeof runReplyQa>;
        naturalReply: ReturnType<typeof runReplyQa>;
        strongReply: ReturnType<typeof runReplyQa>;
        followUpReply: ReturnType<typeof runReplyQa>;
      };
    };
  };
} {
  const match = matchSituationCategory(input.situation);
  const detectedLanguage = detectReplyLanguage(input);
  const language = resolveRealizerLocale(input, detectedLanguage);
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
  const intent = mapStrategyToPhraseIntent(
    contentDepth.selectorMixing.selectors.strategy.id
  );
  const detectedContext = detectReplyContext(input.situation);
  const routeOverride = resolveScenarioRoute(
    contentDepth.selectorMixing.selectors.strategy.id,
    detectedContext
  );
  const intentConflict = detectIntentConflict(
    contentDepth.selectorMixing.selectors.strategy.id,
    detectedContext
  );

  const selection = selectPhrases({
    intent,
    domain: match.category.domain,
    style,
    channel,
    language,
  });

  const composedOutput = composeReplyVariants({
    request: input,
    category: match.category,
    language,
    style,
    channel,
    contentDepth,
    selectedPhrases: selection.selected,
    fallbackUsed: selection.fallbackUsed,
    blockedReason: selection.blockedReason,
    routeOverride,
  });
  const rawOutput = realizeReplyVariants({
    request: input,
    category: match.category,
    language,
    style,
    channel,
    contentDepth,
    composed: composedOutput,
    detectedScenarioFamily: detectedContext.scenarioFamily,
  });

  const qaByVariant = {
    shortReply: runReplyQa({
      text: rawOutput.shortReply,
      detected: detectedContext,
      strategyId: contentDepth.selectorMixing.selectors.strategy.id,
      relationshipId: contentDepth.selectorMixing.selectors.relationship.id,
      channelId: contentDepth.selectorMixing.selectors.channel.id,
      toneId: contentDepth.selectorMixing.selectors.tone.id,
    }),
    naturalReply: runReplyQa({
      text: rawOutput.naturalReply,
      detected: detectedContext,
      strategyId: contentDepth.selectorMixing.selectors.strategy.id,
      relationshipId: contentDepth.selectorMixing.selectors.relationship.id,
      channelId: contentDepth.selectorMixing.selectors.channel.id,
      toneId: contentDepth.selectorMixing.selectors.tone.id,
    }),
    strongReply: runReplyQa({
      text: rawOutput.strongReply,
      detected: detectedContext,
      strategyId: contentDepth.selectorMixing.selectors.strategy.id,
      relationshipId: contentDepth.selectorMixing.selectors.relationship.id,
      channelId: contentDepth.selectorMixing.selectors.channel.id,
      toneId: contentDepth.selectorMixing.selectors.tone.id,
    }),
    followUpReply: runReplyQa({
      text: rawOutput.followUpReply,
      detected: detectedContext,
      strategyId: contentDepth.selectorMixing.selectors.strategy.id,
      relationshipId: contentDepth.selectorMixing.selectors.relationship.id,
      channelId: contentDepth.selectorMixing.selectors.channel.id,
      toneId: contentDepth.selectorMixing.selectors.tone.id,
    }),
  };

  const output = {
    shortReply: applyQaRewrite(rawOutput.shortReply, qaByVariant.shortReply, detectedContext.language),
    naturalReply: applyQaRewrite(rawOutput.naturalReply, qaByVariant.naturalReply, detectedContext.language),
    strongReply: applyQaRewrite(rawOutput.strongReply, qaByVariant.strongReply, detectedContext.language),
    followUpReply: applyQaRewrite(rawOutput.followUpReply, qaByVariant.followUpReply, detectedContext.language),
  };

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
      replyIntelligence: {
        detectedContext,
        intentConflict,
        routeOverride,
        qaByVariant,
      },
    },
  };
}

function mapStrategyToPhraseIntent(strategyId: string): ReplyIntent {
  const strategyIntent = mapSelectorStrategyToIntent(strategyId);

  if (strategyIntent === "repair") return "apology";
  if (strategyIntent === "soft_exit") return "soft_exit";
  if (strategyIntent === "boundary") return "boundary";
  if (strategyIntent === "negotiate") return "negotiate";
  if (strategyIntent === "clarify") return "clarify";
  if (strategyIntent === "delay") return "delay";
  return "decline";
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
