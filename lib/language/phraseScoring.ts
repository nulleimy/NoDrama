import { checkAntiCringe } from "@/lib/language/antiCringe";
import type { PhraseBankEntry, ReplyChannel, ReplyStyle } from "@/lib/language/phraseTypes";

export type PhraseScoreInput = {
  entry: PhraseBankEntry;
  requestedStyle: ReplyStyle;
  channel: ReplyChannel;
};

export type PhraseScore = {
  entry: PhraseBankEntry;
  score: number;
  reasons: string[];
};

function lengthScore(text: string) {
  if (text.length <= 90) return 20;
  if (text.length <= 140) return 14;
  if (text.length <= 180) return 6;
  return -20;
}

function styleScore(entry: PhraseBankEntry, requestedStyle: ReplyStyle) {
  if (entry.style === requestedStyle) return 25;
  if (requestedStyle === "absurd" && entry.style === "funny") return 16;
  if (requestedStyle === "funny" && entry.style === "casual") return 12;
  if (entry.style === "neutral") return 8;
  return 0;
}

function channelScore(entry: PhraseBankEntry, channel: ReplyChannel) {
  return entry.channel.includes(channel) ? 20 : -30;
}

function humorQualityScore(entry: PhraseBankEntry) {
  if (entry.style !== "funny" && entry.style !== "absurd") return 0;

  let score = 0;

  if (entry.tags.includes("non_cringe")) score += 15;
  if (entry.tags.includes("playful")) score += 10;
  if (entry.intensity === 1) score += 10;
  if (entry.intensity === 2) score += 4;
  if (entry.intensity === 3) score -= 12;

  return score;
}

function naturalnessScore(text: string) {
  let score = 0;

  if (text.includes("Dávám vědět")) score += 6;
  if (text.includes("díky za pochopení")) score += 4;
  if (text.includes("Hele")) score += 4;
  if (text.includes("Upřímně")) score += 4;
  if (text.includes("Omlouvám se")) score += 5;

  if (text.split(" ").length < 4) score -= 10;
  if (text.split(" ").length > 28) score -= 8;

  return score;
}

export function scorePhrase(input: PhraseScoreInput): PhraseScore {
  const { entry, requestedStyle, channel } = input;
  const reasons: string[] = [];
  let score = 50;

  const antiCringe = checkAntiCringe(entry.text);

  if (!antiCringe.ok) {
    score -= 40;
    reasons.push(...antiCringe.reasons);
  }

  const len = lengthScore(entry.text);
  score += len;
  reasons.push(`length:${len}`);

  const style = styleScore(entry, requestedStyle);
  score += style;
  reasons.push(`style:${style}`);

  const channelValue = channelScore(entry, channel);
  score += channelValue;
  reasons.push(`channel:${channelValue}`);

  const humor = humorQualityScore(entry);
  score += humor;
  if (humor !== 0) reasons.push(`humor:${humor}`);

  const natural = naturalnessScore(entry.text);
  score += natural;
  if (natural !== 0) reasons.push(`natural:${natural}`);

  return {
    entry,
    score,
    reasons,
  };
}

export function rankPhrases(
  entries: PhraseBankEntry[],
  requestedStyle: ReplyStyle,
  channel: ReplyChannel
): PhraseScore[] {
  return entries
    .map((entry) => scorePhrase({ entry, requestedStyle, channel }))
    .sort((a, b) => b.score - a.score);
}
