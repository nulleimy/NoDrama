export type DetectorLanguage = "cs" | "en";
export type DetectorDomain =
  | "work"
  | "school"
  | "social"
  | "family"
  | "dating"
  | "client_business"
  | "money"
  | "public"
  | "general";

export type ScenarioFamily =
  | "work_social_invitation"
  | "work_deadline_delay"
  | "school_deadline_extension"
  | "social_invitation_decline"
  | "authority_social_decline"
  | "client_scope_negotiation"
  | "family_pressure_boundary"
  | "money_refuse_loan"
  | "repair_after_mistake"
  | "general";

export type SelectorSource = "auto" | "manual" | "default";

export type ContextDetectionResult = {
  language: DetectorLanguage;
  domain: DetectorDomain;
  scenarioFamily: ScenarioFamily;
  relationshipSuggestion: string;
  strategySuggestion: string;
  channelSuggestion: string;
  toneSuggestion: string;
  confidence: "low" | "medium" | "high";
  reasons: string[];
  warnings: string[];
};

export type ReplyQaVerdict = "pass" | "rewrite" | "reject";

export type ReplyQaResult = {
  verdict: ReplyQaVerdict;
  contextFit: number;
  strategyFit: number;
  relationshipFit: number;
  channelFit: number;
  toneFit: number;
  sendability: number;
  reasons: string[];
  forbiddenTermsHit: string[];
  mismatchType?: string;
};

const deadlineSignals = [
  "deadline",
  "termin",
  "termín",
  "dodat",
  "deliverable",
  "task",
  "ukol",
  "úkol",
  "vystup",
  "výstup",
  "posunout",
  "postpone",
  "push the deadline",
  "send a realistic next date",
];

const schoolDeadlineSignals = [
  "odevzdat",
  "slohova prace",
  "slohová práce",
  "slohovou praci",
  "slohovou práci",
  "odklad",
  "dalsich pet dni",
  "dalších pět dní",
  "nestiham",
  "nestíhám",
];

const schoolSpecificSignals = [
  "odevzdat",
  "slohova prace",
  "slohová práce",
  "slohovou praci",
  "slohovou práci",
  "odklad",
  "dalsich pet dni",
  "dalších pět dní",
];

const invitationSignals = [
  "invite",
  "invited",
  "invitation",
  "party",
  "birthday",
  "dinner",
  "hangout",
  "pozval",
  "pozvani",
  "pozvání",
  "oslava",
  "vecirek",
  "večírek",
];

const authoritySignals = ["boss", "manager", "sef", "šéf", "lead", "director"];
const familySignals = ["rodina", "máma", "mama", "táta", "tata", "family", "parent"];
const moneySignals = ["pujc", "půjč", "loan", "borrow", "lend", "money", "penize", "peníze"];
const clientSignals = ["client", "klient", "scope", "rozsah", "budget", "rozpocet", "rozpočet"];
const repairSignals = ["omlouv", "promin", "sorry", "apolog", "my fault", "moje chyba"];
const pressureSignals = ["tlak", "pressure", "keeps pushing", "nuti", "nutí", "vycita", "vyčítá", "guilt"];

const fakeCueSignals = [
  "fake excuse",
  "fake illness",
  "fake emergency",
  "believable excuse",
  "blame someone else",
  "vymysli vymluvu",
  "falesna",
  "falešná",
  "vymluvu",
  "výmluvu",
];

const forbiddenByScenario: Record<string, string[]> = {
  work_social_invitation: [
    "termín",
    "termin",
    "deadline",
    "dodat",
    "výstup",
    "vystup",
    "posunout",
    "deliverable",
    "send a realistic next date",
  ],
  work_deadline_delay: [
    "pozvání",
    "pozvani",
    "oslava",
    "přidám se",
    "pridam se",
    "jste na mě mysleli",
    "jste na me mysleli",
    "invitation",
    "party",
  ],
  school_deadline_extension: [
    "pozvání",
    "pozvani",
    "oslava",
    "přidám se",
    "pridam se",
    "jste na mě mysleli",
    "jste na me mysleli",
    "invitation",
    "party",
  ],
  social_invitation_decline: [
    "termín",
    "deadline",
    "dodat",
    "deliverable",
    "posunout",
  ],
  authority_social_decline: [
    "termín",
    "deadline",
    "dodat",
    "deliverable",
    "posunout",
  ],
  money_refuse_loan: [
    "scope",
    "rozsah",
    "deliverable",
    "pozvání",
    "pozvani",
    "oslava",
    "přidám se",
    "pridam se",
    "jste na mě mysleli",
    "jste na me mysleli",
  ],
  family_pressure_boundary: ["i am so sorry", "strašně se omlouvám", "hrozne se omlouvam"],
};

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAny(text: string, needles: string[]) {
  return needles.some((needle) => text.includes(normalize(needle)));
}

export function detectReplyContext(text: string): ContextDetectionResult {
  const normalized = normalize(text);
  const reasons: string[] = [];
  const warnings: string[] = [];

  const language: DetectorLanguage = /[áčďéěíňóřšťúůýž]/i.test(text) ? "cs" : "en";
  const hasAuthority = hasAny(normalized, authoritySignals);
  const hasInvite = hasAny(normalized, invitationSignals);
  const hasSchoolDeadline =
    hasAny(normalized, schoolDeadlineSignals) && hasAny(normalized, schoolSpecificSignals);
  const hasDeadline = hasAny(normalized, deadlineSignals) || hasSchoolDeadline;
  const hasFamily = hasAny(normalized, familySignals);
  const hasMoney = hasAny(normalized, moneySignals);
  const hasClient = hasAny(normalized, clientSignals);
  const hasRepair = hasAny(normalized, repairSignals);
  const hasPressure = hasAny(normalized, pressureSignals);

  if (hasAuthority) reasons.push("authority_signal");
  if (hasInvite) reasons.push("invitation_signal");
  if (hasDeadline) reasons.push("deadline_signal");
  if (hasSchoolDeadline) reasons.push("school_deadline_signal");
  if (hasFamily) reasons.push("family_signal");
  if (hasMoney) reasons.push("money_signal");
  if (hasClient) reasons.push("client_scope_signal");
  if (hasRepair) reasons.push("repair_signal");
  if (hasPressure) reasons.push("pressure_signal");

  let domain: DetectorDomain = "general";
  let scenarioFamily: ScenarioFamily = "general";
  let relationshipSuggestion = "friend";
  let strategySuggestion = "soft_decline";
  let channelSuggestion = "messenger_1to1";
  let toneSuggestion = "neutral";

  if (hasSchoolDeadline) {
    domain = "school";
    scenarioFamily = "school_deadline_extension";
    relationshipSuggestion = "authority";
    strategySuggestion = "delay";
    channelSuggestion = "email";
    toneSuggestion = "formal";
  } else if (hasClient) {
    domain = "client_business";
    scenarioFamily = "client_scope_negotiation";
    relationshipSuggestion = "client";
    strategySuggestion = "negotiate";
    channelSuggestion = "email";
    toneSuggestion = "formal";
  } else if (hasMoney) {
    domain = "money";
    scenarioFamily = "money_refuse_loan";
    relationshipSuggestion = hasFamily ? "family" : "friend";
    strategySuggestion = "hard_boundary";
    toneSuggestion = "assertive";
  } else if (hasFamily && hasPressure) {
    domain = "family";
    scenarioFamily = "family_pressure_boundary";
    relationshipSuggestion = "family";
    strategySuggestion = "hard_boundary";
    toneSuggestion = "assertive";
  } else if (hasRepair) {
    domain = hasAuthority ? "work" : "social";
    scenarioFamily = "repair_after_mistake";
    relationshipSuggestion = hasAuthority ? "authority" : "friend";
    strategySuggestion = "repair";
    toneSuggestion = "apologetic";
  } else if (hasAuthority && hasInvite && !hasDeadline) {
    domain = "work";
    scenarioFamily = "work_social_invitation";
    relationshipSuggestion = "authority";
    strategySuggestion = "soft_decline";
    channelSuggestion = "work_chat";
    toneSuggestion = "soft";
  } else if (hasAuthority && hasInvite && hasDeadline) {
    domain = "work";
    scenarioFamily = "authority_social_decline";
    relationshipSuggestion = "authority";
    strategySuggestion = "soft_decline";
    warnings.push("mixed_signals_invitation_and_deadline");
  } else if (hasDeadline || (hasAuthority && !hasInvite)) {
    domain = "work";
    scenarioFamily = "work_deadline_delay";
    relationshipSuggestion = hasAuthority ? "authority" : "peer";
    strategySuggestion = "delay";
    channelSuggestion = "work_chat";
    toneSuggestion = "concise";
  } else if (hasInvite) {
    domain = "social";
    scenarioFamily = "social_invitation_decline";
    relationshipSuggestion = "friend";
    strategySuggestion = "soft_decline";
    toneSuggestion = "warm";
  } else if (hasFamily) {
    domain = "family";
    scenarioFamily = "family_pressure_boundary";
    relationshipSuggestion = "family";
    strategySuggestion = "clarify";
    toneSuggestion = "soft";
  } else {
    domain = "social";
    scenarioFamily = "general";
  }

  if (hasAny(normalized, fakeCueSignals)) {
    warnings.push("deception_cue_detected");
  }

  const confidenceScore = reasons.length + (scenarioFamily !== "general" ? 1 : 0);
  const confidence = confidenceScore >= 3 ? "high" : confidenceScore >= 2 ? "medium" : "low";

  if (confidence === "low") {
    warnings.push("low_confidence_check_selection");
  }

  return {
    language,
    domain,
    scenarioFamily,
    relationshipSuggestion,
    strategySuggestion,
    channelSuggestion,
    toneSuggestion,
    confidence,
    reasons,
    warnings,
  };
}

export function detectIntentConflict(
  strategyId: string,
  detected: ContextDetectionResult
): string | null {
  if (
    strategyId === "delay" &&
    ["work_social_invitation", "social_invitation_decline", "authority_social_decline"].includes(
      detected.scenarioFamily
    )
  ) {
    return detected.language === "cs"
      ? "Tohle vypadá spíš jako pozvánka než termín. Chceš získat čas, nebo rovnou odmítnout hezky?"
      : "This looks more like an invitation than a deadline. Do you want to buy time, or decline kindly now?";
  }

  if (
    strategyId === "soft_decline" &&
    ["work_deadline_delay", "school_deadline_extension"].includes(detected.scenarioFamily)
  ) {
    return detected.language === "cs"
      ? "Tohle vypadá jako termínový kontext. Nechceš raději zvolit strategii získání času?"
      : "This looks like a deadline context. Consider switching to a delay strategy.";
  }

  return null;
}

export function resolveScenarioRoute(
  selectedStrategyId: string,
  detected: ContextDetectionResult
): "delay" | "decline" | "boundary" | "repair" | "negotiate" | "clarify" | "redirect" | "exit" {
  if (detected.scenarioFamily === "money_refuse_loan") return "boundary";
  if (
    ["work_deadline_delay", "school_deadline_extension"].includes(detected.scenarioFamily)
  ) {
    return "delay";
  }

  if (
    ["work_social_invitation", "social_invitation_decline", "authority_social_decline"].includes(
      detected.scenarioFamily
    ) &&
    selectedStrategyId === "delay"
  ) {
    return "decline";
  }

  if (selectedStrategyId === "hard_boundary") return "boundary";
  if (selectedStrategyId === "repair") return "repair";
  if (selectedStrategyId === "negotiate") return "negotiate";
  if (selectedStrategyId === "clarify") return "clarify";
  if (selectedStrategyId === "redirect") return "redirect";
  if (selectedStrategyId === "exit") return "exit";
  if (selectedStrategyId === "delay") return "delay";
  return "decline";
}

export function runReplyQa(args: {
  text: string;
  detected: ContextDetectionResult;
  strategyId: string;
  relationshipId: string;
  channelId: string;
  toneId: string;
}): ReplyQaResult {
  const normalized = normalize(args.text);
  const reasons: string[] = [];
  const forbiddenTermsHit: string[] = [];
  const guardTerms = forbiddenByScenario[args.detected.scenarioFamily] || [];

  for (const term of guardTerms) {
    if (normalized.includes(normalize(term))) {
      forbiddenTermsHit.push(term);
    }
  }

  const strategyConflict = detectIntentConflict(args.strategyId, args.detected);
  if (strategyConflict) reasons.push("intent_conflict_detected");
  if (forbiddenTermsHit.length > 0) {
    reasons.push("forbidden_scenario_terms_hit");
    reasons.push("scenario_vocabulary_conflict");
  }

  const contextFit = forbiddenTermsHit.length ? 0.35 : 0.9;
  const strategyFit = strategyConflict ? 0.45 : 0.9;
  const relationshipFit = 0.85;
  const channelFit = args.detected.scenarioFamily === "client_scope_negotiation" && args.channelId !== "email" ? 0.55 : 0.85;
  const toneFit = args.toneId === "playful" && args.detected.scenarioFamily !== "social_invitation_decline" ? 0.6 : 0.88;

  let sendability = 0.92;
  if (hasAny(normalized, fakeCueSignals)) {
    sendability = 0.3;
    reasons.push("deception_wording_detected");
  }

  const minFit = Math.min(contextFit, strategyFit, sendability);
  const verdict: ReplyQaVerdict = minFit < 0.3 ? "reject" : minFit < 0.65 ? "rewrite" : "pass";

  return {
    verdict,
    contextFit,
    strategyFit,
    relationshipFit,
    channelFit,
    toneFit,
    sendability,
    reasons,
    forbiddenTermsHit,
    mismatchType:
      strategyConflict && forbiddenTermsHit.length
        ? "strategy_and_terms"
        : strategyConflict
          ? "strategy"
          : forbiddenTermsHit.length
            ? "forbidden_terms"
            : undefined,
  };
}

export function applyQaRewrite(text: string, qa: ReplyQaResult, language: DetectorLanguage): string {
  if (qa.verdict === "pass") return text;

  if (qa.verdict === "reject") {
    return language === "cs"
      ? "Nechci si vymýšlet výmluvu. Řeknu to raději stručně a pravdivě."
      : "I do not want to make up an excuse. I will keep it brief and truthful.";
  }

  let rewritten = text;
  for (const term of qa.forbiddenTermsHit) {
    const pattern = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    rewritten = rewritten.replace(
      pattern,
      language === "cs" ? "tohle téma" : "this topic"
    );
  }

  return rewritten;
}
