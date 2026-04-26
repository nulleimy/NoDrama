import type { PhraseScore } from "@/lib/language/phraseScoring";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9á-ž\s]/gi, "")
    .split(/\s+/)
    .filter(Boolean);
}

function tokenSimilarity(a: string, b: string) {
  const tokensA = new Set(normalize(a));
  const tokensB = new Set(normalize(b));

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  const intersection = [...tokensA].filter((token) => tokensB.has(token)).length;
  const union = new Set([...tokensA, ...tokensB]).size;

  return intersection / union;
}

export function diversifyRankedPhrases(ranked: PhraseScore[], limit = 3): PhraseScore[] {
  const selected: PhraseScore[] = [];

  for (const candidate of ranked) {
    const tooSimilar = selected.some(
      (existing) => tokenSimilarity(existing.entry.text, candidate.entry.text) > 0.72
    );

    if (!tooSimilar) {
      selected.push(candidate);
    }

    if (selected.length >= limit) {
      break;
    }
  }

  if (selected.length < limit) {
    for (const candidate of ranked) {
      if (!selected.some((item) => item.entry.id === candidate.entry.id)) {
        selected.push(candidate);
      }

      if (selected.length >= limit) {
        break;
      }
    }
  }

  return selected;
}
