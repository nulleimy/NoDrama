import { situationCategories } from "@/lib/language/situationCategories";
import type { SituationCategory } from "@/lib/language/phraseTypes";

export type SituationMatch = {
  category: SituationCategory;
  score: number;
  matchedKeywords: string[];
};

function normalize(input: string) {
  return input.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

export function matchSituationCategory(input: string): SituationMatch {
  const normalizedInput = normalize(input);

  const matches = situationCategories.map((category) => {
    const keywords = [...category.keywordsCs, ...category.keywordsEn];
    const matchedKeywords = keywords.filter((keyword) =>
      normalizedInput.includes(normalize(keyword))
    );

    let score = matchedKeywords.length * 10;

    if (normalizedInput.includes(normalize(category.domain))) {
      score += 2;
    }

    if (normalizedInput.includes(normalize(category.intent))) {
      score += 2;
    }

    return {
      category,
      score,
      matchedKeywords,
    };
  });

  const best = matches.sort((a, b) => b.score - a.score)[0];

  if (best && best.score > 0) {
    return best;
  }

  const fallback =
    situationCategories.find((category) => category.id === "digital_short_not_cold") ||
    situationCategories[0];

  return {
    category: fallback,
    score: 0,
    matchedKeywords: [],
  };
}
