export type AntiCringeResult = {
  ok: boolean;
  reasons: string[];
};

const bannedFragments = [
  "haha",
  "lol",
  "doslova",
  "metaforicky řečeno",
  "epický fail",
  "totální masakr",
];

const highDramaFragments = [
  "umírám",
  "katastrofa",
  "tragédie",
  "pohroma",
  "emergency",
  "disaster",
];

export function checkAntiCringe(text: string): AntiCringeResult {
  const lower = text.toLowerCase();
  const reasons: string[] = [];

  if (text.length > 180) {
    reasons.push("too_long");
  }

  if (text.split(",").length > 4) {
    reasons.push("too_many_clauses");
  }

  for (const fragment of bannedFragments) {
    if (lower.includes(fragment)) {
      reasons.push(`banned_fragment:${fragment}`);
    }
  }

  for (const fragment of highDramaFragments) {
    if (lower.includes(fragment)) {
      reasons.push(`high_drama_fragment:${fragment}`);
    }
  }

  return {
    ok: reasons.length === 0,
    reasons,
  };
}
