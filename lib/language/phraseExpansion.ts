import { checkAntiCringe } from "@/lib/language/antiCringe";
import { phraseBankSeed } from "@/lib/language/phraseBankSeed";
import { phrasePatterns, type PhrasePattern } from "@/lib/language/phrasePatterns";
import type { PhraseBankEntry } from "@/lib/language/phraseTypes";

function sentenceCase(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function composePatternPhrase(pattern: PhrasePattern, opening: string, core: string, closing: string) {
  const raw = `${opening} ${core}, ${closing}`
    .replace(/\s+/g, " ")
    .replace(",,", ",")
    .trim();

  return sentenceCase(raw);
}

export function expandPattern(pattern: PhrasePattern): PhraseBankEntry[] {
  const entries: PhraseBankEntry[] = [];

  for (const opening of pattern.openings) {
    for (const core of pattern.cores) {
      for (const closing of pattern.closings) {
        const text = composePatternPhrase(pattern, opening, core, closing);
        const quality = checkAntiCringe(text);

        if (!quality.ok) {
          continue;
        }

        entries.push({
          id: `${pattern.id}_${entries.length + 1}`,
          language: pattern.language,
          style: pattern.style,
          intent: pattern.intent,
          channel: pattern.channels,
          text,
          intensity: pattern.intensity,
          risk: pattern.risk,
          tags: [...pattern.tags, "expanded"],
        });
      }
    }
  }

  return entries;
}

export function getExpandedPhraseBank(): PhraseBankEntry[] {
  const expanded = phrasePatterns.flatMap(expandPattern);
  const all = [...phraseBankSeed, ...expanded];

  const seen = new Set<string>();

  return all.filter((entry) => {
    const key = `${entry.language}:${entry.style}:${entry.intent}:${entry.text}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export const expandedPhraseBank = getExpandedPhraseBank();
