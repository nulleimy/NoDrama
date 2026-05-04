import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";
import type {
  LanguageCode,
  PhraseBankEntry,
  ReplyChannel,
  ReplyIntent,
  ReplyStyle,
  SituationCategory,
} from "@/lib/language/phraseTypes";
import type { ContentDepthRuntimeContext } from "@/lib/nodrama/contentDepthRuntime";
import { mapSelectorStrategyToIntent } from "@/lib/nodrama/selectorMixing.mjs";

type ReplyFamily = "repair" | "delay" | "decline" | "boundary" | "work";

type ComposerInput = {
  request: GenerateRequest;
  category: SituationCategory;
  language: LanguageCode;
  style: ReplyStyle;
  channel: ReplyChannel;
  contentDepth: ContentDepthRuntimeContext;
  selectedPhrases: PhraseBankEntry[];
  fallbackUsed: boolean;
  blockedReason?: string;
};

const englishSignals = [
  "apologize",
  "sorry",
  "client",
  "deadline",
  "meeting",
  "call",
  "delay",
  "late",
  "decline",
  "boundary",
  "reschedule",
  "work",
  "need more time",
  "not available",
  "can't",
  "cannot",
  "won't",
  "i need",
  "i want",
  "i don't",
];

const czechSignals = [
  "omluva",
  "omlouvám",
  "promiň",
  "klient",
  "termín",
  "schůzka",
  "meeting",
  "call",
  "nestíhám",
  "pozdě",
  "odmítnout",
  "hranice",
  "posunout",
  "potřebuji",
  "nechci",
  "nemůžu",
  "nejde",
];

export function detectReplyLanguage(input: GenerateRequest): LanguageCode {
  const normalized = input.situation.toLowerCase();
  const hasCzechCharacters = /[áčďéěíňóřšťúůýž]/i.test(normalized);
  const englishScore = englishSignals.filter((signal) =>
    normalized.includes(signal)
  ).length;
  const czechScore = czechSignals.filter((signal) =>
    normalized.includes(signal)
  ).length;

  if (englishScore > czechScore && !hasCzechCharacters) return "en";
  return "cs";
}

export function composeReplyVariants(
  input: ComposerInput
): GenerateResponse["output"] {
  const strategyIntent = mapSelectorStrategyToIntent(
    input.contentDepth.selectorMixing.selectors.strategy.id
  );
  const family = resolveReplyFamily(
    strategyIntent as ReplyIntent,
    input.category.domain
  );
  const isFormal = isFormalContext(input);
  const isFirm = isFirmContext(input);
  const phraseFallback = input.selectedPhrases[0]?.text;

  const variants =
    input.language === "en"
      ? composeEnglish(input, family, isFormal, isFirm)
      : composeCzech(input, family, isFormal, isFirm);

  if (!phraseFallback) return variants;

  return {
    shortReply: variants.shortReply || phraseFallback,
    naturalReply: variants.naturalReply || phraseFallback,
    strongReply: variants.strongReply || phraseFallback,
    followUpReply: variants.followUpReply || phraseFallback,
  };
}

function resolveReplyFamily(
  intent: ReplyIntent,
  domain: SituationCategory["domain"]
): ReplyFamily {
  if (domain === "work" || domain === "business") return "work";
  if (intent === "apology") return "repair";
  if (intent === "delay" || intent === "reschedule" || intent === "not_available") {
    return "delay";
  }
  if (intent === "boundary") return "boundary";
  return "decline";
}

function isFormalContext(input: ComposerInput) {
  return (
    input.style === "formal" ||
    input.channel === "email" ||
    input.channel === "slack" ||
    input.contentDepth.scenarioCategory === "work_commitments"
  );
}

function isFirmContext(input: ComposerInput) {
  return input.style === "firm" || input.contentDepth.tonePresetId === "firm";
}

function composeCzech(
  input: ComposerInput,
  family: ReplyFamily,
  isFormal: boolean,
  isFirm: boolean
) {
  if (family === "work") return composeCzechWork(input, isFormal, isFirm);
  if (family === "repair") return composeCzechRepair(isFormal, isFirm);
  if (family === "delay") return composeCzechDelay(isFormal, isFirm);
  if (family === "boundary") return composeCzechBoundary(isFormal, isFirm);
  return composeCzechDecline(isFormal, isFirm);
}

function composeEnglish(
  input: ComposerInput,
  family: ReplyFamily,
  isFormal: boolean,
  isFirm: boolean
) {
  if (family === "work") return composeEnglishWork(input, isFormal, isFirm);
  if (family === "repair") return composeEnglishRepair(isFormal, isFirm);
  if (family === "delay") return composeEnglishDelay(isFormal, isFirm);
  if (family === "boundary") return composeEnglishBoundary(isFormal, isFirm);
  return composeEnglishDecline(isFormal, isFirm);
}

function composeCzechWork(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const intent = input.category.intent;

  if (intent === "apology") {
    return {
      shortReply: "Omlouvám se za zdržení. Beru to na sebe a pošlu další krok co nejdřív.",
      naturalReply:
        "Omlouvám se za zdržení na mé straně. Nechci to zamlouvat; navážu konkrétním dalším krokem a dám vědět, jakmile bude hotovo.",
      strongReply: isFirm
        ? "Omlouvám se za zdržení. Přebírám za to odpovědnost a nastavím jasný další krok, aby bylo zřejmé, co bude následovat."
        : "Omlouvám se za zdržení. Přebírám za to odpovědnost a pošlu jasný další krok.",
      followUpReply:
        "Kdyby bylo potřeba doplnění: „Nechci slibovat nereálný čas. Potvrdím další krok, jakmile ho budu moct dodržet.“",
    };
  }

  if (intent === "delay" || intent === "reschedule" || intent === "not_available") {
    return {
      shortReply: isFormal
        ? "Potřebuji na to více času. Navrhnu prosím nový realistický termín."
        : "Potřebuju na to víc času. Pošlu realistický další krok.",
      naturalReply: isFormal
        ? "Potřebuji na to více času, abych neposlal/a nedotažený výstup. Navrhnu nový realistický termín a dám vědět, co je hotové."
        : "Potřebuju na to víc času, ať neposílám něco napůl. Dám vědět realistický termín a co je hotové.",
      strongReply:
        "Teď to nechci slíbit nereálně. Potřebuji termín posunout a potvrdit až čas, který opravdu dokážu dodržet.",
      followUpReply:
        "Kdyby tlačili na okamžitou odpověď: „Rozumím urgentnosti, ale nechci dát nepřesný slib. Potvrdím reálný čas.“",
    };
  }

  return composeCzechBoundary(isFormal, isFirm);
}

function composeEnglishWork(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const intent = input.category.intent;

  if (intent === "apology") {
    return {
      shortReply: "I’m sorry for the delay. I own that and will send the next step as soon as I can.",
      naturalReply:
        "I’m sorry for the delay on my side. I don’t want to gloss over it; I’ll follow up with a clear next step as soon as it’s ready.",
      strongReply: isFirm
        ? "I’m sorry for the delay. I’m taking responsibility for it and will reset expectations with a clear next step."
        : "I’m sorry for the delay. I’m taking responsibility for it and will send a clear next step.",
      followUpReply:
        "If they ask for more detail: “I don’t want to promise an unrealistic time. I’ll confirm the next step when I can stand behind it.”",
    };
  }

  if (intent === "delay" || intent === "reschedule" || intent === "not_available") {
    return {
      shortReply: isFormal
        ? "I need more time on this and will suggest a realistic new timing."
        : "I need a bit more time on this. I’ll send a realistic next step.",
      naturalReply: isFormal
        ? "I need more time on this so I don’t send something unfinished. I’ll suggest a realistic new timing and clarify what is already done."
        : "I need a bit more time so I don’t send something half-finished. I’ll share a realistic timing and what’s done.",
      strongReply:
        "I don’t want to make an unrealistic promise. I need to move the timing and confirm a date I can actually meet.",
      followUpReply:
        "If there is pressure for an instant answer: “I understand the urgency, but I don’t want to give an inaccurate promise. I’ll confirm a realistic time.”",
    };
  }

  return composeEnglishBoundary(isFormal, isFirm);
}

function composeCzechRepair(isFormal: boolean, isFirm: boolean) {
  return {
    shortReply: "Omlouvám se, tohle je na mě. Napravím to konkrétním dalším krokem.",
    naturalReply: isFormal
      ? "Omlouvám se, tohle je na mé straně. Nechci to obcházet; pošlu konkrétní další krok a realistický čas nápravy."
      : "Promiň, tohle je na mně. Nechci se vymlouvat — pošlu konkrétní další krok a napravím to.",
    strongReply: isFirm
      ? "Beru za to odpovědnost. Teď je důležité to napravit konkrétním krokem, ne to dál vysvětlovat."
      : "Beru to na sebe a pošlu jasný další krok, aby bylo zřejmé, jak to napravím.",
    followUpReply:
      "Kdyby chtěli víc detailů: „Rozumím. Nechci zahlcovat vysvětlováním; důležité je teď dodat nápravu.“",
  };
}

function composeEnglishRepair(isFormal: boolean, isFirm: boolean) {
  return {
    shortReply: "I’m sorry — that’s on me. I’ll fix it with a clear next step.",
    naturalReply: isFormal
      ? "I’m sorry, this is on my side. I don’t want to talk around it; I’ll send a clear next step and realistic timing for fixing it."
      : "Sorry, that’s on me. I don’t want to make excuses — I’ll send a concrete next step and fix it.",
    strongReply: isFirm
      ? "I’m taking responsibility for it. The useful thing now is to fix it with a clear next step, not over-explain it."
      : "I’m taking responsibility and will send a clear next step so it’s clear how I’ll fix it.",
    followUpReply:
      "If they ask for more detail: “I understand. I don’t want to over-explain; the important part now is the fix.”",
  };
}

function composeCzechDelay(isFormal: boolean, isFirm: boolean) {
  return {
    shortReply: "Potřebuji to posunout. Dám vědět realistický další termín.",
    naturalReply: isFormal
      ? "Potřebuji to posunout, abych nepotvrdil/a nereálný čas. Dám vědět realistický další termín a co bude následovat."
      : "Potřebuju to posunout. Nechci slibovat čas, který nedodržím, takže pošlu realistický další termín.",
    strongReply: isFirm
      ? "Teď nepotvrdím nereálný termín. Potřebuji to posunout a dám vědět čas, který opravdu zvládnu dodržet."
      : "Nechci dát slib, který nebude držet. Potřebuji to posunout a potvrdit realistický čas.",
    followUpReply:
      "Kdyby byl tlak: „Rozumím, že je to nepříjemné. Přesto nechci slíbit něco, co by znovu selhalo.“",
  };
}

function composeEnglishDelay(isFormal: boolean, isFirm: boolean) {
  return {
    shortReply: "I need to move this. I’ll share a realistic next timing.",
    naturalReply: isFormal
      ? "I need to move this so I don’t confirm an unrealistic time. I’ll share a realistic next timing and what will happen next."
      : "I need to move this. I don’t want to promise a time I can’t meet, so I’ll send a realistic next timing.",
    strongReply: isFirm
      ? "I’m not going to confirm an unrealistic deadline. I need to move this and share a time I can actually meet."
      : "I don’t want to give a promise that won’t hold. I need to move this and confirm a realistic time.",
    followUpReply:
      "If there is pressure: “I understand this is inconvenient. I still don’t want to promise something that would fail again.”",
  };
}

function composeCzechBoundary(isFormal: boolean, isFirm: boolean) {
  return {
    shortReply: "Tohle teď nemohu přijmout v tomhle rozsahu.",
    naturalReply: isFormal
      ? "Tohle teď nemohu přijmout v tomto rozsahu. Rád/a se domluvím na prioritě nebo upraveném zadání."
      : "Tohle teď nemůžu vzít v tomhle rozsahu. Můžeme se domluvit na jednodušší variantě nebo jiném termínu.",
    strongReply: isFirm
      ? "V tomhle rozsahu to nepřebírám. Pokud se má pokračovat, potřebujeme upravit zadání, prioritu nebo termín."
      : "Tohle teď nemohu potvrdit. Bez úpravy rozsahu nebo termínu by to nebylo fér očekávání.",
    followUpReply:
      "Kdyby přišel tlak: „Rozumím, že je to důležité. Bez změny rozsahu nebo termínu to ale nemohu potvrdit.“",
  };
}

function composeEnglishBoundary(isFormal: boolean, isFirm: boolean) {
  return {
    shortReply: "I can’t take this on in the current scope.",
    naturalReply: isFormal
      ? "I can’t take this on in the current scope. I’m happy to discuss priority or an adjusted brief."
      : "I can’t take this on in this scope right now. We can agree on a simpler version or a different timing.",
    strongReply: isFirm
      ? "I’m not taking this on in the current scope. If this should move forward, the brief, priority or timing needs to change."
      : "I can’t confirm this as it stands. Without changing scope or timing, it would create the wrong expectation.",
    followUpReply:
      "If there is pressure: “I understand this matters. Without a change in scope or timing, I can’t confirm it.”",
  };
}

function composeCzechDecline(isFormal: boolean, isFirm: boolean) {
  return {
    shortReply: "Díky za pozvání, tentokrát to vynechám.",
    naturalReply: isFormal
      ? "Děkuji za pozvání. Tentokrát se nezapojím, ale vážím si toho, že jste na mě mysleli."
      : "Díky za pozvání, tentokrát to vynechám. Nechci to zbytečně natahovat, ale vážím si toho.",
    strongReply: isFirm
      ? "Díky, ale tentokrát ne. Nechci to nechávat otevřené, moje odpověď zůstává stejná."
      : "Díky, tentokrát to vynechám. Nechci slibovat něco, do čeho teď nejdu.",
    followUpReply:
      "Kdyby přemlouvali: „Chápu, že bys byl/a rád/a, ale tentokrát to nechávám takhle.“",
  };
}

function composeEnglishDecline(isFormal: boolean, isFirm: boolean) {
  return {
    shortReply: "Thanks for inviting me, I’ll sit this one out.",
    naturalReply: isFormal
      ? "Thank you for the invitation. I won’t join this time, but I appreciate you thinking of me."
      : "Thanks for inviting me, I’ll sit this one out. I don’t want to drag it out, but I appreciate it.",
    strongReply: isFirm
      ? "Thanks, but not this time. I don’t want to leave it open; my answer stays the same."
      : "Thanks, I’ll skip this one. I don’t want to promise something I’m not going to do.",
    followUpReply:
      "If they keep pushing: “I get that you’d like me there, but I’m keeping it this way this time.”",
  };
}
