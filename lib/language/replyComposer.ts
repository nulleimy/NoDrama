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

type ReplyFamily =
  | "repair"
  | "delay"
  | "decline"
  | "boundary"
  | "work"
  | "negotiate"
  | "clarify"
  | "redirect"
  | "exit";

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
  routeOverride?: ReplyFamily;
};

const englishSignals = [
  "apologize",
  "sorry",
  "client",
  "partner",
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
  "replied",
  "sharply",
  "repair",
  "over-explain",
  "overexplaining",
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
    input.contentDepth.selectorMixing.selectors.strategy.id,
    strategyIntent as ReplyIntent,
    input.category.domain,
    input.routeOverride
  );
  const isFormal = isFormalContext(input);
  const isFirm = isFirmContext(input);
  const phraseFallback = input.selectedPhrases[0]?.text;
  const safetyDegraded = composeSafetyDegradedReply(input, isFormal, isFirm);

  const variants =
    safetyDegraded ||
    (input.language === "en"
      ? composeEnglish(input, family, isFormal, isFirm)
      : composeCzech(input, family, isFormal, isFirm));

  if (!phraseFallback) return variants;

  return {
    shortReply: variants.shortReply || phraseFallback,
    naturalReply: variants.naturalReply || phraseFallback,
    strongReply: variants.strongReply || phraseFallback,
    followUpReply: variants.followUpReply || phraseFallback,
  };
}

function composeSafetyDegradedReply(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const warnings = input.contentDepth.selectorMixing.safetyWarnings;
  const shouldDegrade = warnings.some((warning) =>
    [
      "fake_alibi_request_blocked",
      "manipulation_or_harassment_request_blocked",
      "blame_shifting_request_degraded",
      "coercive_request_degraded",
      "impersonation_request_blocked",
    ].includes(warning)
  );

  if (!shouldDegrade) return null;

  if (input.language === "en") {
    return {
      shortReply: "I can’t make up an excuse, but I can be clear and honest.",
      naturalReply: isFormal
        ? "I don’t want to invent a reason or put blame somewhere it does not belong. I can give you a clear, honest update and focus on the next step."
        : "I don’t want to make up an excuse or shift blame. I can be honest, keep it brief, and focus on what happens next.",
      strongReply: isFirm
        ? "I’m not going to use a fake excuse or pressure anyone. I’ll keep this truthful and direct."
        : "I’ll keep this truthful and avoid making up details or pressuring anyone.",
      followUpReply:
        "If more detail is needed: “I don’t want to over-explain or invent reasons. The honest version is enough.”",
    };
  }

  return {
    shortReply: "Nebudu si vymýšlet výmluvu, ale můžu to říct jasně a pravdivě.",
    naturalReply: isFormal
      ? "Nechci si vymýšlet důvod ani přesouvat vinu někam, kam nepatří. Můžu poslat jasnou a pravdivou zprávu zaměřenou na další krok."
      : "Nechci si vymýšlet výmluvu ani házet vinu na někoho jiného. Můžu to říct pravdivě, stručně a bez zbytečného tlaku.",
    strongReply: isFirm
      ? "Nebudu používat falešnou výmluvu ani na nikoho tlačit. Zůstanu u pravdivé a přímé verze."
      : "Zůstanu u pravdy a nebudu si vymýšlet detaily ani na nikoho tlačit.",
    followUpReply:
      "Kdyby bylo potřeba víc detailů: „Nechci to přehánět ani si vymýšlet důvody. Pravdivá verze stačí.“",
  };
}

function resolveReplyFamily(
  strategyId: string,
  intent: ReplyIntent,
  domain: SituationCategory["domain"],
  routeOverride?: ReplyFamily
): ReplyFamily {
  if (routeOverride) return routeOverride;
  if (strategyId === "repair") return "repair";
  if (strategyId === "soft_decline") return "decline";
  if (strategyId === "hard_boundary") return "boundary";
  if (strategyId === "delay") return "delay";
  if (strategyId === "negotiate") return "negotiate";
  if (strategyId === "clarify") return "clarify";
  if (strategyId === "redirect") return "redirect";
  if (strategyId === "exit") return "exit";
  if (intent === "negotiate") return "negotiate";
  if (intent === "clarify" || intent === "follow_up") return "clarify";
  if (intent === "apology") return "repair";
  if (intent === "delay" || intent === "reschedule" || intent === "not_available") {
    return "delay";
  }
  if (intent === "boundary") return "boundary";
  if (domain === "work" || domain === "business") return "work";
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
  if (family === "negotiate") return composeCzechNegotiate(input, isFormal, isFirm);
  if (family === "clarify") return composeCzechClarify(input, isFormal, isFirm);
  if (family === "redirect") return composeCzechRedirect(input, isFormal, isFirm);
  if (family === "exit") return composeCzechExit(input, isFormal, isFirm);
  if (family === "delay") return composeCzechDelay(input, isFormal, isFirm);
  if (family === "boundary") return composeCzechBoundary(input, isFormal, isFirm);
  return composeCzechDecline(input, isFormal, isFirm);
}

function composeEnglish(
  input: ComposerInput,
  family: ReplyFamily,
  isFormal: boolean,
  isFirm: boolean
) {
  if (family === "work") return composeEnglishWork(input, isFormal, isFirm);
  if (family === "repair") return composeEnglishRepair(input, isFormal, isFirm);
  if (family === "negotiate") {
    return composeEnglishNegotiate(input, isFormal, isFirm);
  }
  if (family === "clarify") return composeEnglishClarify(input, isFormal, isFirm);
  if (family === "redirect") return composeEnglishRedirect(input, isFormal, isFirm);
  if (family === "exit") return composeEnglishExit(input, isFormal, isFirm);
  if (family === "delay") return composeEnglishDelay(input, isFormal, isFirm);
  if (family === "boundary") return composeEnglishBoundary(input, isFormal, isFirm);
  return composeEnglishDecline(input, isFormal, isFirm);
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

  return composeCzechBoundary(input, isFormal, isFirm);
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

  return composeEnglishBoundary(input, isFormal, isFirm);
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

function composeEnglishRepair(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  if (isPartnerRepairContext(input)) {
    return {
      shortReply: "I’m sorry I replied too sharply. That’s on me.",
      naturalReply:
        "I’m sorry I replied too sharply. That’s on me. I don’t want to over-explain it; I just want to repair the tone and handle this better.",
      strongReply:
        "I replied too sharply, and I’m taking responsibility for that. I want to repair the tone and handle this better.",
      followUpReply:
        "If more detail is needed: “I don’t want to over-explain it. I just want to own my tone and do better.”",
    };
  }

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

function composeCzechNegotiate(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const isClient = input.contentDepth.selectorMixing.selectors.relationship.id === "client";

  if (isFamilyNegotiateContext(input)) {
    return {
      shortReply: "Celý víkend nedám, ale zvládnu jedno odpoledne.",
      naturalReply:
        "Celý víkend nedám, ale zvládnu jedno odpoledne. Pojďme vybrat, co je nejdůležitější.",
      strongReply:
        "Celý víkend nedám. Můžu nabídnout jedno odpoledne, a potřebuju, abychom podle toho vybrali prioritu.",
      followUpReply:
        "Kdyby přišel tlak: „Rozumím, že bys chtěl/a víc, ale celý víkend slíbit nemůžu.“",
    };
  }

  return {
    shortReply: isClient
      ? "V tomhle rozsahu to můžu převzít po úpravě zadání, termínu nebo ceny."
      : "Tohle zvládnu, pokud upravíme rozsah, termín nebo priority.",
    naturalReply: isFormal
      ? "Rád/a to posunu dál, ale v aktuálním rozsahu potřebujeme upravit zadání, termín nebo rozpočet. Navrhuji si nejdřív potvrdit, co je priorita."
      : "Můžu s tím pomoct, jen potřebuju upravit rozsah, termín nebo priority. Pojďme si potvrdit, co je teď nejdůležitější.",
    strongReply: isFirm
      ? "V aktuálních podmínkách to nepotvrdím. Pokud se má pokračovat, potřebujeme změnit rozsah, termín nebo rozpočet."
      : "Nechci potvrdit něco, co by nebylo realistické. Potřebujeme upravit podmínky a pak se můžu jasně zavázat.",
    followUpReply:
      "Kdyby chtěli rozhodnutí hned: „Rozumím, ale bez potvrzeného rozsahu nebo termínu bych slíbil/a něco nereálného.“",
  };
}

function composeEnglishNegotiate(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const isClient = input.contentDepth.selectorMixing.selectors.relationship.id === "client";

  if (isFamilyNegotiateContext(input)) {
    return {
      shortReply: "I can’t do the whole weekend, but I can do one afternoon.",
      naturalReply:
        "I can’t do the whole weekend, but I can do one afternoon. Let’s choose the time that matters most.",
      strongReply:
        "I can’t commit to the whole weekend. I can offer one afternoon, and we need to choose the priority around that.",
      followUpReply:
        "If guilt pressure continues: “I understand you wanted more time, but I can’t promise the whole weekend.”",
    };
  }

  return {
    shortReply: isClient
      ? "I can take this on if we adjust the scope, timing, or budget."
      : "I can do this if we adjust the scope, timing, or priorities.",
    naturalReply: isFormal
      ? "I’m happy to move this forward, but the current scope needs an adjustment to the brief, timing, or budget. I suggest we confirm the priority first."
      : "I can help with this, but we need to adjust the scope, timing, or priorities first. Let’s confirm what matters most right now.",
    strongReply: isFirm
      ? "I can’t confirm this under the current terms. If it should move forward, the scope, timing, or budget needs to change."
      : "I don’t want to agree to something unrealistic. We need to adjust the terms first, then I can commit clearly.",
    followUpReply:
      "If they want an immediate yes: “I understand, but without confirmed scope or timing I’d be promising something unrealistic.”",
  };
}

function composeCzechClarify(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const isFaceToFace =
    input.contentDepth.selectorMixing.selectors.channel.id === "face_to_face";

  return {
    shortReply: isFaceToFace
      ? "Chci si to nejdřív ujasnit, než na to odpovím."
      : "Můžeš mi prosím upřesnit, co ode mě teď potřebuješ?",
    naturalReply: isFormal
      ? "Než na to odpovím, potřebuji si ujasnit očekávání. Můžete prosím potvrdit, co přesně ode mě teď potřebujete?"
      : "Než odpovím, chci si ujasnit, co ode mě teď potřebuješ. Můžeš to prosím říct konkrétněji?",
    strongReply: isFirm
      ? "Bez jasného očekávání na to teď nebudu přikyvovat. Nejdřív si potřebuju ujasnit, co přesně je požadavek."
      : "Nechci si domýšlet, co tím myslíš. Nejdřív si to prosím ujasněme.",
    followUpReply:
      "Kdyby přišel tlak: „Rozumím, ale nechci reagovat na domněnku. Potřebuji jasně vědět, o co jde.“",
  };
}

function composeEnglishClarify(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const isFaceToFace =
    input.contentDepth.selectorMixing.selectors.channel.id === "face_to_face";

  return {
    shortReply: isFaceToFace
      ? "I want to clarify this before I answer."
      : "Can you clarify what you need from me right now?",
    naturalReply: isFormal
      ? "Before I answer, I need to clarify the expectation. Could you confirm exactly what you need from me right now?"
      : "Before I answer, I want to understand what you need from me. Can you be a bit more specific?",
    strongReply: isFirm
      ? "I’m not going to agree without a clear expectation. I need to understand the request first."
      : "I don’t want to guess what you mean. Let’s clarify it first.",
    followUpReply:
      "If there is pressure: “I understand, but I don’t want to respond to an assumption. I need the request to be clear first.”",
  };
}

function isBuyTimeWithoutDeadlineContext(input: ComposerInput) {
  const normalized = normalizeSituation(input.request.situation);

  return (
    /\b(ziskat cas|odpovedet hned|bez slibovani|konkretniho vysledku|buy time|without promising)\b/.test(
      normalized
    ) &&
    !/\b(deadline|termin|termín|dodat|deliverable|vystup|výstup)\b/.test(normalized)
  );
}

function composeCzechDelay(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  if (isBuyTimeWithoutDeadlineContext(input)) {
    return {
      shortReply: "Potřebuji si to nejdřív promyslet, než odpovím.",
      naturalReply: isFormal
        ? "Potřebuji si to nejdřív promyslet, abych neslíbil/a konkrétní výsledek dřív, než v tom budu mít jasno."
        : "Potřebuju si to nejdřív promyslet. Nechci teď slíbit konkrétní výsledek, dokud v tom nebudu mít jasno.",
      strongReply: isFirm
        ? "Teď nechci dát rychlý slib. Nejdřív si to promyslím a ozvu se, až budu vědět, co můžu říct poctivě."
        : "Nechci odpovědět pod tlakem jen proto, aby něco zaznělo. Nejdřív si to promyslím.",
      followUpReply:
        "Kdyby tlačili na okamžitou odpověď: „Rozumím, že chceš reakci hned, ale nechci slíbit něco, co nemám promyšlené.“",
    };
  }

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

function composeEnglishDelay(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  if (isBuyTimeWithoutDeadlineContext(input)) {
    return {
      shortReply: "I need to think this through before I answer.",
      naturalReply: isFormal
        ? "I need to think this through first so I do not promise a specific outcome before I am clear."
        : "I need to think this through first. I do not want to promise a specific outcome before I am clear.",
      strongReply: isFirm
        ? "I do not want to give a rushed promise. I will think it through and come back when I can answer honestly."
        : "I do not want to answer under pressure just to say something. I need to think it through first.",
      followUpReply:
        "If they press for an immediate answer: “I understand you want a reply now, but I do not want to promise something I have not thought through.”",
    };
  }

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

function composeCzechBoundary(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  if (isWorkExtraWorkBoundaryContext(input)) {
    return {
      shortReply: "Práci navíc teď nepřebírám.",
      naturalReply:
        "Chápu, že je toho hodně, ale práci navíc teď nepřebírám. Potřebuju držet svoje současné priority.",
      strongReply:
        "Práci navíc nepřebírám. Pokud se mají měnit priority, potřebuju, aby se to domluvilo jasně v týmu.",
      followUpReply:
        "Kdyby se požadavek vracel: „Rozumím, ale bez změny priorit to na sebe nevezmu.“",
    };
  }

  if (isFriendHelpCapacityContext(input)) {
    return {
      shortReply: "Se stěhováním teď pomoct nezvládnu.",
      naturalReply:
        "Mrzí mě to, ale se stěhováním teď pomoct nezvládnu. Nemám na to kapacitu a nechci slíbit něco, co pak nedám.",
      strongReply: isFirm
        ? "Se stěhováním nepomůžu. Potřebuju respektovat svoji kapacitu a nebudu to nechávat otevřené."
        : "Teď na to nemám energii, takže pomoc neslíbím.",
      followUpReply:
        "Kdyby přišel tlak: „Chápu, že by se ti pomoc hodila, ale kapacitu na to teď nemám.“",
    };
  }

  if (isRepeatedFavorsContext(input)) {
    return {
      shortReply: "Další laskavosti teď brát nebudu.",
      naturalReply:
        "Vnímám, že se to opakuje, a potřebuju nastavit jasnou hranici. Další laskavosti teď brát nebudu.",
      strongReply:
        "Moje odpověď je ne. Nechci dál fungovat tak, že automaticky přebírám další laskavosti.",
      followUpReply:
        "Kdyby se to opakovalo: „Rozumím, že bys chtěl/a pomoc, ale tuhle hranici neměním.“",
    };
  }

  if (isSocialDmPersonalBoundaryContext(input)) {
    return {
      shortReply: "Tohle je na mě už moc osobní.",
      naturalReply:
        "Tohle je na mě už moc osobní, takže konverzaci trochu ubrzdím. Prosím držme ji víc obecně.",
      strongReply:
        "V osobních otázkách pokračovat nechci. Prosím respektuj, že tuhle hranici držím.",
      followUpReply:
        "Kdyby to pokračovalo: „Rozumím, ale osobní věci tady řešit nechci.“",
    };
  }

  if (isPartnerBoundaryContext(input)) {
    return {
      shortReply: "Tohle téma teď dál otevírat nechci.",
      naturalReply:
        "Tohle téma teď dál otevírat nechci. Už jsem řekla, kde stojím, a potřebuju, abychom to teď nechali být.",
      strongReply:
        "Svoje stanovisko neměním. Nechci to dál otevírat a potřebuju, abychom to teď nechali být.",
      followUpReply:
        "Kdyby se téma vracelo: „Rozumím, že se k tomu chceš vracet, ale já v tomhle teď pokračovat nechci.“",
    };
  }

  if (isSocialBoundaryContext(input)) {
    return {
      shortReply: "Už jsem říkala, že nepřijdu. Prosím respektuj to.",
      naturalReply:
        "Už jsem říkala, že nepřijdu, a nechci to dál řešit dokola. Prosím respektuj to.",
      strongReply: isFirm
        ? "Moje odpověď je ne. Nechci to dál rozebírat a potřebuji, abys to respektoval/a."
        : "Nepřijdu a nechci o tom dál debatovat. Prosím ber to jako finální odpověď.",
      followUpReply:
        "Kdyby přemlouvali dál: „Rozumím, že bys chtěl/a jinou odpověď, ale svoje rozhodnutí neměním.“",
    };
  }

  if (isMoneyContext(input)) {
    return {
      shortReply: "Peníze půjčovat nechci, takže do toho nepůjdu.",
      naturalReply: isFormal
        ? "Rozumím, že je to citlivé, ale peníze půjčovat nechci. Nechci to dlouze vysvětlovat, moje odpověď je ne."
        : "Chápu, že se ptáš, ale peníze půjčovat nechci. Nechci to dlouze rozebírat, moje odpověď je ne.",
      strongReply: isFirm
        ? "Peníze nepůjčím. Prosím, respektuj to bez dalšího přemlouvání."
        : "Do půjčování peněz nepůjdu. Nechci kolem toho dělat napětí, ale odpověď neměním.",
      followUpReply:
        "Kdyby tlačili dál: „Rozumím, ale v tomhle mám jasno. Peníze půjčovat nebudu.“",
    };
  }

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

function composeEnglishBoundary(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  if (isWorkExtraWorkBoundaryContext(input)) {
    return {
      shortReply: "I am not taking on extra work right now.",
      naturalReply:
        "I understand there is a lot going on, but I am not taking on extra work right now. I need to keep my current priorities clear.",
      strongReply:
        "I am not taking on the extra work. If priorities need to change, that needs to be agreed clearly with the team.",
      followUpReply:
        "If it comes back: “I understand, but without a priority change I am not taking this on.”",
    };
  }

  if (isFriendHelpCapacityContext(input)) {
    return {
      shortReply: "I cannot help with the move right now.",
      naturalReply:
        "I am sorry, but I cannot help with the move right now. I do not have the capacity, and I do not want to promise something I cannot follow through on.",
      strongReply: isFirm
        ? "I am not helping with the move. I need to respect my capacity, and I am not leaving this open."
        : "I do not have the energy for it right now, so I cannot promise help.",
      followUpReply:
        "If there is pressure: “I understand the help would matter, but I do not have the capacity for it right now.”",
    };
  }

  if (isRepeatedFavorsContext(input)) {
    return {
      shortReply: "I am not taking on more favors right now.",
      naturalReply:
        "I can see this has become repeated, and I need to set a clear boundary. I am not taking on more favors right now.",
      strongReply:
        "My answer is no. I do not want to keep automatically taking on more favors.",
      followUpReply:
        "If it repeats: “I understand you want help, but I am not changing this boundary.”",
    };
  }

  if (isSocialDmPersonalBoundaryContext(input)) {
    return {
      shortReply: "This is getting too personal for me.",
      naturalReply:
        "This is getting too personal for me, so I am going to slow the conversation down. Please keep it more general.",
      strongReply:
        "I do not want to continue with personal questions. Please respect that boundary.",
      followUpReply:
        "If it continues: “I understand, but I do not want to discuss personal things here.”",
    };
  }

  if (isAfterHoursWorkBoundaryContext(input)) {
    return {
      shortReply:
        "I can respond during working hours, but I’m not available after hours.",
      naturalReply:
        "I can respond during working hours, but I’m not available for ongoing after-hours replies.",
      strongReply:
        "I’m available during working hours. I’m not available for ongoing after-hours replies.",
      followUpReply:
        "If it continues: “Please send it through the work channel and I’ll respond during working hours.”",
    };
  }

  if (isPartnerBoundaryContext(input)) {
    return {
      shortReply: "I don’t want to keep reopening this topic.",
      naturalReply:
        "I don’t want to keep reopening this topic. I’ve said where I stand, and I need us to leave it here for now.",
      strongReply:
        "I’ve said where I stand. I’m not reopening this topic, and I need us to leave it here for now.",
      followUpReply:
        "If it comes up again: “I understand you want to revisit it, but I’m not continuing this conversation right now.”",
    };
  }

  if (isSocialBoundaryContext(input)) {
    return {
      shortReply: "I already said I can’t come. Please respect that.",
      naturalReply:
        "I already said I can’t come, and I need you to respect that. I don’t want to keep debating it.",
      strongReply: isFirm
        ? "My answer is no. I don’t want to keep discussing it, and I need that to be respected."
        : "I’m not coming, and I don’t want to keep debating it. Please take this as my final answer.",
      followUpReply:
        "If they keep pushing: “I understand you wanted a different answer, but I’m not changing my decision.”",
    };
  }

  if (isMoneyContext(input)) {
    return {
      shortReply: "I’m not comfortable lending money, so I’m going to say no.",
      naturalReply: isFormal
        ? "I understand this is sensitive, but I’m not comfortable lending money. I don’t want to over-explain it; my answer is no."
        : "I get why you’re asking, but I’m not comfortable lending money. I don’t want to make it a long discussion; my answer is no.",
      strongReply: isFirm
        ? "I’m not lending money. Please respect that without pushing further."
        : "I’m not going to lend money. I don’t want tension around it, but I’m not changing my answer.",
      followUpReply:
        "If they keep pushing: “I understand, but I’m clear on this. I’m not lending money.”",
    };
  }

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

function composeCzechRedirect(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const isPublic =
    input.contentDepth.selectorMixing.selectors.relationship.id ===
      "stranger_public" ||
    input.contentDepth.selectorMixing.selectors.channel.id === "social_dm";

  return {
    shortReply: isPublic
      ? "Tohle tady řešit nebudu, prosím směřujte to do správného kanálu."
      : "Tohle teď přesměruju jinam, kde to dává větší smysl.",
    naturalReply: isFormal
      ? "Tady to nechci řešit v detailu. Prosím pošlete to správným kanálem nebo člověku, který to může vyřešit."
      : "Tady to nechci rozebírat. Pošlu tě radši na vhodnější místo nebo člověka, který s tím umí pomoct.",
    strongReply: isFirm
      ? "Tímhle směrem v téhle konverzaci pokračovat nebudu. Prosím použijte vhodný kanál."
      : "Nechci to řešit tady. Dává větší smysl přesměrovat to jinam.",
    followUpReply:
      "Kdyby se to vracelo zpět: „Rozumím, ale tady to nevyřešíme. Držme se prosím vhodného kanálu.“",
  };
}

function composeEnglishRedirect(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const isPublic =
    input.contentDepth.selectorMixing.selectors.relationship.id ===
      "stranger_public" ||
    input.contentDepth.selectorMixing.selectors.channel.id === "social_dm";

  return {
    shortReply: isPublic
      ? "I’m not going to handle this here; please use the right channel."
      : "I’m going to redirect this to a better place to handle it.",
    naturalReply: isFormal
      ? "I don’t want to handle the details here. Please send this through the right channel or to the person who can resolve it."
      : "I don’t want to unpack this here. I’m going to point you to a better place or person for it.",
    strongReply: isFirm
      ? "I’m not continuing this in this conversation. Please use the appropriate channel."
      : "I don’t want to handle this here. Redirecting it is the better next step.",
    followUpReply:
      "If it comes back: “I understand, but we won’t solve it here. Please keep this in the right channel.”",
  };
}

function composeCzechExit(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const isGroup =
    input.contentDepth.selectorMixing.selectors.channel.id === "group_chat";

  return {
    shortReply: isGroup
      ? "Z téhle konverzace se teď odpojím. Nechci to dál vyhrocovat."
      : "Tuhle konverzaci teď ukončím, ať to dál neeskaluje.",
    naturalReply: isFormal
      ? "Myslím, že teď bude nejlepší tuhle konverzaci ukončit. Nechci přidávat další napětí, proto se odpojím."
      : "Teď z toho vystoupím. Nechci to dál hrotit ani rozebírat ve chvíli, kdy to nikam neposouvá.",
    strongReply: isFirm
      ? "V téhle konverzaci už pokračovat nebudu. Odpojuji se a prosím respektujte to."
      : "Tady se zastavím. Nechci pokračovat způsobem, který by to zhoršil.",
    followUpReply:
      "Kdyby přišlo další naléhání: „Nechávám to tady. Vrátím se k tomu jen tehdy, když to půjde řešit klidně.“",
  };
}

function composeEnglishExit(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  const isGroup =
    input.contentDepth.selectorMixing.selectors.channel.id === "group_chat";

  return {
    shortReply: isGroup
      ? "I’m going to step out of this chat now. I don’t want to escalate it."
      : "I’m going to end this conversation now so it does not escalate.",
    naturalReply: isFormal
      ? "I think it is best to end this conversation here. I don’t want to add more tension, so I’m stepping away."
      : "I’m going to step away from this now. I don’t want to keep going when it is not helping.",
    strongReply: isFirm
      ? "I’m not continuing this conversation. I’m stepping away, and I need that to be respected."
      : "I’m going to stop here. I don’t want to continue in a way that makes this worse.",
    followUpReply:
      "If they keep pressing: “I’m leaving it here. I’ll only come back to this if it can be handled calmly.”",
  };
}

function isMoneyContext(input: ComposerInput) {
  const normalized = input.request.situation
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    input.contentDepth.selectorMixing.inferredDomain === "money" ||
    /\b(money|lend|loan|borrow|payment|price|penize|pujcit|pujck|platba|cena)\b/.test(
      normalized
    )
  );
}

function isSocialBoundaryContext(input: ComposerInput) {
  const relationshipId = input.contentDepth.selectorMixing.selectors.relationship.id;

  return (
    ["friend", "close_friend"].includes(relationshipId) &&
    input.contentDepth.selectorMixing.inferredDomain === "social"
  );
}

function isWorkExtraWorkBoundaryContext(input: ComposerInput) {
  const normalized = normalizeSituation(input.request.situation);

  return (
    /\b(kolega|kolegyn|coworker|colleague|peer)\b/.test(normalized) &&
    /\b(praci navic|prace navic|extra work|additional work)\b/.test(normalized)
  );
}

function isFriendHelpCapacityContext(input: ComposerInput) {
  const normalized = normalizeSituation(input.request.situation);

  return (
    /\b(kamaradka|kamarad|close friend|friend)\b/.test(normalized) &&
    /\b(pomoct|pomoc|stehovanim|moving|help)\b/.test(normalized) &&
    /\b(nemam energii|kapacitu|capacity|energy)\b/.test(normalized)
  );
}

function isRepeatedFavorsContext(input: ComposerInput) {
  const normalized = normalizeSituation(input.request.situation);

  return /\b(laskavost|laskavosti|favors|favours|porad chce|opakovane chce)\b/.test(
    normalized
  );
}

function isSocialDmPersonalBoundaryContext(input: ComposerInput) {
  const normalized = normalizeSituation(input.request.situation);

  return (
    /\b(instagram|social dm|direct message)\b/.test(normalized) &&
    /\b(osobne|personal|ubrzdit|slow down)\b/.test(normalized)
  );
}

function isPartnerBoundaryContext(input: ComposerInput) {
  const relationshipId = input.contentDepth.selectorMixing.selectors.relationship.id;

  return (
    ["partner", "dating"].includes(relationshipId) ||
    input.contentDepth.selectorMixing.inferredDomain === "dating" ||
    input.contentDepth.scenarioCategory === "dating_clarity"
  );
}

function isPartnerRepairContext(input: ComposerInput) {
  const normalized = normalizeSituation(input.request.situation);

  return (
    isPartnerBoundaryContext(input) &&
    /\b(replied|reply|said|tone|sharply|sharp|overexplain|over explaining|over explain)\b/.test(
      normalized
    )
  );
}

function isAfterHoursWorkBoundaryContext(input: ComposerInput) {
  const relationshipId = input.contentDepth.selectorMixing.selectors.relationship.id;
  const channelId = input.contentDepth.selectorMixing.selectors.channel.id;
  const normalized = normalizeSituation(input.request.situation);

  return (
    (["authority", "peer"].includes(relationshipId) ||
      ["work_chat", "professional_dm"].includes(channelId) ||
      input.contentDepth.selectorMixing.inferredDomain === "work") &&
    /\b(after hours|afterhours|off hours|offhours|outside working hours|outside work hours|working hours)\b/.test(
      normalized
    )
  );
}

function isFamilyNegotiateContext(input: ComposerInput) {
  return (
    isFamilyDeclineContext(input) &&
    input.contentDepth.selectorMixing.selectors.strategy.id === "negotiate"
  );
}

function isFamilyDeclineContext(input: ComposerInput) {
  return (
    input.contentDepth.selectorMixing.selectors.relationship.id === "family" ||
    input.contentDepth.selectorMixing.inferredDomain === "family" ||
    input.contentDepth.scenarioCategory === "family_boundaries"
  );
}

function normalizeSituation(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[-_]/g, " ");
}

function composeCzechDecline(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  if (isFamilyDeclineContext(input)) {
    return {
      shortReply: "Tento víkend nepřijedu. Nechci se kvůli tomu hádat.",
      naturalReply:
        "Chápu, že tě to mrzí, ale tento víkend nepřijedu. Nechci se kvůli tomu hádat, jen ti to říkám rovnou.",
      strongReply: isFirm
        ? "Tento víkend nepřijedu. Rozumím, že je to pro tebe nepříjemné, ale moje rozhodnutí platí."
        : "Vím, že bys byl/a rád/a, kdybych přijel/a, ale tentokrát nepřijedu.",
      followUpReply:
        "Kdyby přišel tlak přes vinu: „Mrzí mě, že to tak vnímáš, ale nechci rozhodnutí měnit pod tlakem.“",
    };
  }

  return {
    shortReply: "Díky za pozvání, tentokrát to vynechám.",
    naturalReply: isFormal
      ? "Děkuji za pozvání. Tentokrát se nezapojím, ale vážím si toho, že jste na mě mysleli."
      : "Dneska to nakonec nedám. Nechci si vymýšlet důvody ani to zbytečně natahovat, tak říkám rovnou, že tentokrát vynechám. Díky za pozvání.",
    strongReply: isFirm
      ? "Díky, ale tentokrát ne. Nechci to nechávat otevřené, moje odpověď zůstává stejná."
      : "Díky, tentokrát to vynechám. Nechci slibovat něco, do čeho teď nejdu.",
    followUpReply:
      "Kdyby přemlouvali: „Chápu, že bys byl/a rád/a, ale tentokrát to nechávám takhle.“",
  };
}

function composeEnglishDecline(
  input: ComposerInput,
  isFormal: boolean,
  isFirm: boolean
) {
  if (isFamilyDeclineContext(input)) {
    return {
      shortReply:
        "I’m not visiting this weekend. I don’t want this to become an argument.",
      naturalReply:
        "I understand you’re disappointed, but I’m not visiting this weekend. I don’t want this to turn into an argument, so I’m saying it clearly.",
      strongReply: isFirm
        ? "I’m not visiting this weekend. I understand that is disappointing, but my decision stands."
        : "I know you wanted me to visit, but I’m not coming this time.",
      followUpReply:
        "If guilt pressure continues: “I’m sorry it feels that way, but I don’t want to change my decision under pressure.”",
    };
  }

  return {
    shortReply: "Thanks for inviting me, I’ll sit this one out.",
    naturalReply: isFormal
      ? "Thank you for the invitation. I won’t join this time, but I appreciate you thinking of me."
      : "I’m going to sit this one out tonight. I don’t want to make up a story or drag it out, so I’m saying it directly. Thanks for inviting me.",
    strongReply: isFirm
      ? "Thanks, but not this time. I don’t want to leave it open; my answer stays the same."
      : "Thanks, I’ll skip this one. I don’t want to promise something I’m not going to do.",
    followUpReply:
      "If they keep pushing: “I get that you’d like me there, but I’m keeping it this way this time.”",
  };
}
