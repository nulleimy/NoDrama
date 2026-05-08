const finalSelectorIds = {
  tone: new Set([
    "neutral",
    "soft",
    "assertive",
    "formal",
    "apologetic",
    "warm",
    "concise",
    "playful",
  ]),
  relationship: new Set([
    "authority",
    "peer",
    "client",
    "friend",
    "close_friend",
    "partner",
    "family",
    "stranger_public",
  ]),
  channel: new Set([
    "messenger_1to1",
    "group_chat",
    "email",
    "work_chat",
    "professional_dm",
    "social_dm",
    "voice_call",
    "face_to_face",
  ]),
  strategy: new Set([
    "delay",
    "soft_decline",
    "hard_boundary",
    "repair",
    "clarify",
    "redirect",
    "negotiate",
    "exit",
  ]),
};

const signalGroups = {
  authority: [
    "boss",
    "manager",
    "lead",
    "supervisor",
    "sef",
    "sefa",
    "sefka",
    "nadrizeny",
    "nadrizena",
  ],
  work: [
    "work",
    "office",
    "job",
    "colleague",
    "team",
    "prace",
    "pracovni",
    "kolega",
    "kolegyn",
  ],
  deadline: [
    "deadline",
    "due",
    "deliverable",
    "task",
    "project",
    "term",
    "timing",
    "termin",
    "dodat",
    "vystup",
    "ukol",
    "projekt",
    "odevzdat",
    "posunout",
    "nestiham",
  ],
  invitation: [
    "invite",
    "invited",
    "invitation",
    "party",
    "birthday",
    "dinner",
    "event",
    "pozval",
    "pozvala",
    "pozvani",
    "pozvanka",
    "oslava",
    "narozeniny",
    "vecirek",
    "akce",
    "obed",
    "vecere",
  ],
  decline: [
    "dont want",
    "do not want",
    "can't go",
    "cannot go",
    "not coming",
    "decline",
    "odmitnout",
    "nechci",
    "nemuzu",
    "neprijdu",
    "nejit",
    "jit nechci",
  ],
  clientScope: [
    "client",
    "customer",
    "scope",
    "budget",
    "price",
    "invoice",
    "klient",
    "zakaznik",
    "rozsah",
    "rozpocet",
    "cena",
    "faktura",
  ],
  family: [
    "family",
    "mom",
    "mother",
    "dad",
    "father",
    "parents",
    "rodina",
    "mama",
    "matka",
    "tata",
    "otec",
    "rodice",
  ],
  pressure: [
    "pressure",
    "guilt",
    "keeps pushing",
    "keeps asking",
    "tlak",
    "tlaci",
    "vycita",
    "vina",
    "vydira",
  ],
  moneyLoan: [
    "loan",
    "lend",
    "borrow",
    "money",
    "cash",
    "pujcit",
    "pujcka",
    "penize",
    "dluh",
  ],
  repair: [
    "sorry",
    "apologize",
    "mistake",
    "my fault",
    "sharply",
    "omluvit",
    "omluva",
    "promin",
    "chyba",
    "moje vina",
    "ostre",
  ],
};

export const forbiddenTermsByScenarioFamily = {
  work_social_invitation: [
    "termin",
    "deadline",
    "dodat",
    "vystup",
    "posunout",
    "deliverable",
    "realistic next date",
    "realisticky dalsi termin",
  ],
  authority_social_decline: [
    "termin",
    "deadline",
    "dodat",
    "vystup",
    "posunout",
    "deliverable",
    "realistic next date",
    "realisticky dalsi termin",
  ],
  social_invitation_decline: [
    "termin",
    "deadline",
    "dodat",
    "vystup",
    "posunout",
    "deliverable",
    "realistic next date",
    "realisticky dalsi termin",
  ],
  family_pressure_boundary: [
    "moc se omlouvam",
    "je to cele moje vina",
    "udelam cokoli",
    "i am so sorry",
    "this is all my fault",
    "i will do anything",
  ],
  money_refuse_loan: ["rozsah", "scope", "zadani", "brief", "deliverable"],
  client_scope_negotiation: ["fake excuse", "fake illness", "fake emergency"],
};

const refusalForbiddenTerms = [
  "believable excuse",
  "fake illness",
  "fake emergency",
  "blame someone else",
  "uveritelna vymluva",
  "falesna nemoc",
  "falesna nouze",
  "svalit vinu",
];

export function detectReplyContext(userInput, selected = {}) {
  const text = normalizeText(userInput);
  const matched = collectSignals(text);
  const language = detectLanguage(userInput, text);
  const domain = inferDomain(matched, selected);
  const scenarioFamily = inferScenarioFamily(matched, selected, domain);
  const suggestions = inferSuggestions(matched, selected, domain, scenarioFamily);
  const reasons = buildReasons(matched);
  const warnings = buildWarnings(matched, selected, scenarioFamily);
  const confidence = inferConfidence(matched, scenarioFamily, reasons, warnings);

  return {
    language,
    domain,
    scenarioFamily,
    relationshipSuggestion: suggestions.relationshipId,
    strategySuggestion: suggestions.strategyId,
    channelSuggestion: suggestions.channelId,
    toneSuggestion: suggestions.toneId,
    confidence,
    reasons,
    warnings,
  };
}

export function detectIntentConflict(detected, selected = {}) {
  const conflicts = [];
  const selectedStrategy = selected.strategyId;

  if (
    selectedStrategy === "delay" &&
    ["work_social_invitation", "authority_social_decline", "social_invitation_decline"].includes(
      detected.scenarioFamily
    )
  ) {
    conflicts.push({
      type: "invitation_vs_deadline_delay",
      severity: "medium",
      message:
        detected.language === "cs"
          ? "Tohle vypadá spíš jako pozvánka než termín. Chceš získat čas, nebo rovnou odmítnout hezky?"
          : "This looks more like an invitation than a deadline. Do you want to buy time, or decline kindly?",
      recommendedStrategyId: "soft_decline",
    });
  }

  if (
    selectedStrategy === "negotiate" &&
    detected.scenarioFamily === "money_refuse_loan"
  ) {
    conflicts.push({
      type: "loan_refusal_vs_scope_negotiation",
      severity: "medium",
      message:
        detected.language === "cs"
          ? "Tohle vypadá jako odmítnutí půjčky, ne vyjednávání rozsahu."
          : "This looks like refusing a loan, not scope negotiation.",
      recommendedStrategyId: "hard_boundary",
    });
  }

  return conflicts;
}

export function applyReplyIntelligenceRouting(selected = {}, detected) {
  const adjusted = { ...selected };
  const warnings = [];
  const scenario = detected.scenarioFamily;
  const selectedStrategy = selected.strategyId;

  if (
    selectedStrategy === "delay" &&
    ["work_social_invitation", "authority_social_decline", "social_invitation_decline"].includes(
      scenario
    )
  ) {
    adjusted.strategyId = "soft_decline";
    warnings.push("delay_strategy_adapted_to_invitation_decline");
  }

  if (scenario === "money_refuse_loan") {
    adjusted.strategyId = "hard_boundary";
  }

  if (scenario === "client_scope_negotiation") {
    adjusted.strategyId = "negotiate";
  }

  if (scenario === "repair_after_mistake") {
    adjusted.strategyId = "repair";
  }

  return { selected: adjusted, warnings };
}

export function qaReplyOutput({ input, output, detected, selected = {} }) {
  void input;
  const text = normalizeText(Object.values(output || {}).join(" "));
  const forbiddenTerms = [
    ...(forbiddenTermsByScenarioFamily[detected.scenarioFamily] || []),
    ...(["soft_decline", "hard_boundary"].includes(selected.strategyId)
      ? refusalForbiddenTerms
      : []),
  ];
  const forbiddenTermsHit = forbiddenTerms.filter((term) =>
    text.includes(normalizeText(term))
  );
  const conflicts = detectIntentConflict(detected, selected);
  const contextFit = forbiddenTermsHit.length ? 45 : conflicts.length ? 72 : 92;
  const strategyFit = conflicts.length ? 68 : 90;
  const sendability = forbiddenTermsHit.length ? 55 : 88;
  const reasons = [];

  if (forbiddenTermsHit.length) {
    reasons.push("forbidden_scenario_terms_hit");
  }

  if (conflicts.length) {
    reasons.push(...conflicts.map((conflict) => conflict.type));
  }

  if (detected.confidence === "low") {
    reasons.push("low_context_confidence");
  }

  return {
    verdict: forbiddenTermsHit.length ? "rewrite" : "pass",
    contextFit,
    strategyFit,
    relationshipFit: selected.relationshipId === detected.relationshipSuggestion ? 92 : 76,
    channelFit: selected.channelId === detected.channelSuggestion ? 90 : 78,
    toneFit: selected.toneId === detected.toneSuggestion ? 90 : 80,
    sendability,
    reasons,
    forbiddenTermsHit,
    mismatchType:
      forbiddenTermsHit.length > 0
        ? "forbidden_terms"
        : conflicts[0]?.type || undefined,
  };
}

function inferSuggestions(matched, selected, domain, scenarioFamily) {
  if (scenarioFamily === "work_deadline_delay") {
    return {
      relationshipId: has(matched, "authority") ? "authority" : "peer",
      strategyId: "delay",
      channelId: "work_chat",
      toneId: "concise",
    };
  }

  if (scenarioFamily === "work_social_invitation") {
    return {
      relationshipId: "authority",
      strategyId: "soft_decline",
      channelId: "work_chat",
      toneId: "soft",
    };
  }

  if (scenarioFamily === "authority_social_decline") {
    return {
      relationshipId: "authority",
      strategyId: "soft_decline",
      channelId: "work_chat",
      toneId: "formal",
    };
  }

  if (scenarioFamily === "client_scope_negotiation") {
    return {
      relationshipId: "client",
      strategyId: "negotiate",
      channelId: "email",
      toneId: "formal",
    };
  }

  if (scenarioFamily === "family_pressure_boundary") {
    return {
      relationshipId: "family",
      strategyId: "hard_boundary",
      channelId: "face_to_face",
      toneId: "assertive",
    };
  }

  if (scenarioFamily === "money_refuse_loan") {
    return {
      relationshipId: selected.relationshipId || "friend",
      strategyId: "hard_boundary",
      channelId: "messenger_1to1",
      toneId: "assertive",
    };
  }

  if (scenarioFamily === "repair_after_mistake") {
    return {
      relationshipId: selected.relationshipId || "peer",
      strategyId: "repair",
      channelId: selected.channelId || "messenger_1to1",
      toneId: "apologetic",
    };
  }

  if (domain === "family") {
    return {
      relationshipId: "family",
      strategyId: has(matched, "pressure") ? "hard_boundary" : "clarify",
      channelId: "face_to_face",
      toneId: "soft",
    };
  }

  return {
    relationshipId: selected.relationshipId || "friend",
    strategyId: has(matched, "decline") ? "soft_decline" : "clarify",
    channelId: "messenger_1to1",
    toneId: "soft",
  };
}

function inferScenarioFamily(matched, selected, domain) {
  const hasInvitation = has(matched, "invitation");
  const hasDeadline = has(matched, "deadline");
  const hasAuthority = has(matched, "authority") || selected.relationshipId === "authority";

  if (has(matched, "repair")) return "repair_after_mistake";
  if (has(matched, "clientScope")) return "client_scope_negotiation";
  if (has(matched, "moneyLoan") && has(matched, "decline")) return "money_refuse_loan";
  if (has(matched, "family") && has(matched, "pressure")) {
    return "family_pressure_boundary";
  }
  if (hasAuthority && hasInvitation && !hasDeadline) return "work_social_invitation";
  if (domain === "work" && hasDeadline) return "work_deadline_delay";
  if (hasInvitation && has(matched, "decline")) {
    return hasAuthority ? "authority_social_decline" : "social_invitation_decline";
  }
  if (domain === "family") return "family_pressure_boundary";
  if (domain === "dating") return "dating_clarity";

  return "social_invitation_decline";
}

function inferDomain(matched, selected) {
  if (has(matched, "clientScope") || selected.relationshipId === "client") {
    return "business";
  }
  if (has(matched, "moneyLoan")) return "money";
  if (has(matched, "family") || selected.relationshipId === "family") return "family";
  if (
    has(matched, "authority") ||
    has(matched, "work") ||
    selected.relationshipId === "authority" ||
    selected.relationshipId === "peer" ||
    selected.channelId === "work_chat"
  ) {
    return "work";
  }
  if (selected.relationshipId === "partner") return "dating";
  if (selected.relationshipId === "stranger_public") return "digital";
  return "social";
}

function collectSignals(text) {
  const matched = {};

  for (const [group, signals] of Object.entries(signalGroups)) {
    matched[group] = signals.filter((signal) => text.includes(normalizeText(signal)));
  }

  return matched;
}

function buildReasons(matched) {
  return Object.entries(matched).flatMap(([group, values]) =>
    values.map((value) => `${group}:${value}`)
  );
}

function buildWarnings(matched, selected, scenarioFamily) {
  const warnings = [];

  if (
    selected.strategyId === "delay" &&
    ["work_social_invitation", "authority_social_decline", "social_invitation_decline"].includes(
      scenarioFamily
    )
  ) {
    warnings.push("selected_delay_conflicts_with_invitation");
  }

  if (!has(matched, "deadline") && scenarioFamily === "work_social_invitation") {
    warnings.push("deadline_terms_forbidden_without_task_signal");
  }

  return warnings;
}

function inferConfidence(matched, scenarioFamily, reasons, warnings) {
  if (reasons.length >= 4 && warnings.length === 0) return "high";
  if (
    [
      "work_social_invitation",
      "work_deadline_delay",
      "client_scope_negotiation",
      "money_refuse_loan",
      "family_pressure_boundary",
    ].includes(scenarioFamily) &&
    reasons.length >= 2
  ) {
    return "medium";
  }

  return "low";
}

function detectLanguage(raw, text) {
  if (/[áčďéěíňóřšťúůýž]/i.test(raw)) return "cs";
  if (/\b(the|and|but|need|want|client|deadline|invite|birthday)\b/.test(text)) {
    return "en";
  }
  return "cs";
}

function has(matched, group) {
  return (matched[group] || []).length > 0;
}

export function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSelectorSources(sources = {}) {
  return {
    tone: normalizeSource(sources.tone),
    relationship: normalizeSource(sources.relationship),
    channel: normalizeSource(sources.channel),
    strategy: normalizeSource(sources.strategy),
  };
}

function normalizeSource(source) {
  return ["auto", "manual", "default"].includes(source) ? source : "default";
}

export function isFinalSelectorId(group, id) {
  return finalSelectorIds[group]?.has(id) || false;
}
