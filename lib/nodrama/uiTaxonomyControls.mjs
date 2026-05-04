import {
  lockedChannelTaxonomyV2,
  lockedRelationshipTaxonomyV2,
} from "./taxonomySchemaV2.mjs";

const toneLegacyValueById = {
  neutral: "Milý",
  soft: "Milý",
  assertive: "Asertivní",
  formal: "Formální",
  apologetic: "Milý",
  warm: "Milý",
  concise: "Asertivní",
  playful: "Vtipný",
};

const lockedToneControlOptions = [
  { id: "neutral", label: { cs: "Neutrální", en: "Neutral" } },
  { id: "soft", label: { cs: "Jemný", en: "Soft" } },
  { id: "assertive", label: { cs: "Asertivní", en: "Assertive" } },
  { id: "formal", label: { cs: "Formální", en: "Formal" } },
  { id: "apologetic", label: { cs: "Omluvný", en: "Apologetic" } },
  { id: "warm", label: { cs: "Vřelý", en: "Warm" } },
  { id: "concise", label: { cs: "Stručný", en: "Concise" } },
  { id: "playful", label: { cs: "Vtipný / odlehčený", en: "Light / playful" } },
];

const strategyControlOrder = [
  "delay",
  "soft_decline",
  "hard_boundary",
  "repair",
  "clarify",
  "redirect",
  "negotiate",
  "exit",
];

const strategyLabelById = {
  delay: { cs: "Získat čas", en: "Buy time" },
  soft_decline: { cs: "Odmítnout hezky", en: "Decline kindly" },
  hard_boundary: { cs: "Nastavit hranici", en: "Set a boundary" },
  repair: { cs: "Omluvit se / napravit", en: "Apologize / repair" },
  clarify: { cs: "Vyjasnit situaci", en: "Clarify" },
  redirect: { cs: "Přesměrovat", en: "Redirect" },
  negotiate: { cs: "Vyjednat podmínky", en: "Negotiate terms" },
  exit: { cs: "Ukončit to", en: "Exit conversation" },
};

const channelLegacyValueById = {
  messenger_1to1: "WhatsApp",
  group_chat: "WhatsApp",
  email: "E-mail",
  work_chat: "Slack",
  professional_dm: "Slack",
  social_dm: "WhatsApp",
  voice_call: "SMS",
  face_to_face: "SMS",
};

const relationshipLegacyValueById = {
  authority: "Práce",
  peer: "Práce",
  client: "Práce",
  friend: "Kamarádi",
  close_friend: "Kamarádi",
  partner: "Randění",
  family: "Rodina",
  stranger_public: "Kamarádi",
};

const channelLabelById = {
  messenger_1to1: { cs: "Soukromá zpráva", en: "Private message" },
  group_chat: { cs: "Skupinový chat", en: "Group chat" },
  email: { cs: "E-mail", en: "Email" },
  work_chat: { cs: "Pracovní appka", en: "Work chat" },
  professional_dm: { cs: "Profesní DM", en: "Professional DM" },
  social_dm: { cs: "Sociální DM", en: "Social DM" },
  voice_call: { cs: "Telefon", en: "Phone / voice" },
  face_to_face: { cs: "Osobně", en: "Face to face" },
};

const relationshipLabelById = {
  authority: { cs: "Autorita", en: "Authority" },
  peer: { cs: "Kolega / spolužák", en: "Peer" },
  client: { cs: "Klient / zákazník", en: "Client / customer" },
  friend: { cs: "Kamarád / známý", en: "Friend / acquaintance" },
  close_friend: { cs: "Blízký kamarád", en: "Close friend" },
  partner: { cs: "Partner / dating", en: "Partner / dating" },
  family: { cs: "Rodina", en: "Family" },
  stranger_public: { cs: "Cizí člověk / veřejnost", en: "Stranger / public" },
};

export const publicGeneratorTaxonomyControls = {
  tone: lockedToneControlOptions.map((tone) => ({
    id: tone.id,
    label: tone.label,
    legacyValue: toneLegacyValueById[tone.id],
  })),
  relationship: lockedRelationshipTaxonomyV2.map((relationship) => ({
    id: relationship.id,
    label: relationshipLabelById[relationship.id],
    legacyValue: relationshipLegacyValueById[relationship.id],
  })),
  channel: lockedChannelTaxonomyV2.map((channel) => ({
    id: channel.id,
    label: channelLabelById[channel.id],
    legacyValue: channelLegacyValueById[channel.id],
  })),
  strategy: strategyControlOrder.map((strategyId) => ({
    id: strategyId,
    label: strategyLabelById[strategyId],
    legacyValue: strategyId,
  })),
};

export const publicGeneratorTaxonomySourceIds = {
  tone: lockedToneControlOptions.map((tone) => tone.id),
  relationship: lockedRelationshipTaxonomyV2.map((item) => item.id),
  channel: lockedChannelTaxonomyV2.map((item) => item.id),
  strategy: strategyControlOrder,
};
