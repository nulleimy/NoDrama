import {
  lockedChannelTaxonomyV2,
  lockedRelationshipTaxonomyV2,
  lockedStrategyTaxonomyV2,
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

const strategyLabelById = {
  delay: { cs: "Odklad", en: "Delay" },
  soft_decline: { cs: "Jemně odmítnout", en: "Soft decline" },
  hard_boundary: { cs: "Pevná hranice", en: "Hard boundary" },
  redirect: { cs: "Přesměrovat", en: "Redirect" },
  repair: { cs: "Náprava", en: "Repair" },
  exit: { cs: "Ukončit", en: "Exit" },
  negotiate: { cs: "Vyjednat", en: "Negotiate" },
  clarify: { cs: "Ujasnit", en: "Clarify" },
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
  messenger_1to1: { cs: "Messenger 1:1", en: "Messenger 1:1" },
  group_chat: { cs: "Skupinový chat", en: "Group chat" },
  email: { cs: "E-mail", en: "Email" },
  work_chat: { cs: "Pracovní chat", en: "Work chat" },
  professional_dm: { cs: "Profesní DM", en: "Professional DM" },
  social_dm: { cs: "Sociální DM", en: "Social DM" },
  voice_call: { cs: "Telefonát", en: "Voice call" },
  face_to_face: { cs: "Osobně", en: "Face to face" },
};

const relationshipLabelById = {
  authority: { cs: "Autorita", en: "Authority" },
  peer: { cs: "Rovnocenný vztah", en: "Peer" },
  client: { cs: "Klient", en: "Client" },
  friend: { cs: "Kamarád", en: "Friend" },
  close_friend: { cs: "Blízký kamarád", en: "Close friend" },
  partner: { cs: "Partner", en: "Partner" },
  family: { cs: "Rodina", en: "Family" },
  stranger_public: { cs: "Cizí / veřejnost", en: "Stranger / public" },
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
  strategy: lockedStrategyTaxonomyV2.map((strategy) => ({
    id: strategy.id,
    label: strategyLabelById[strategy.id],
    legacyValue: strategy.id,
  })),
};

export const publicGeneratorTaxonomySourceIds = {
  tone: lockedToneControlOptions.map((tone) => tone.id),
  relationship: lockedRelationshipTaxonomyV2.map((item) => item.id),
  channel: lockedChannelTaxonomyV2.map((item) => item.id),
  strategy: lockedStrategyTaxonomyV2.map((item) => item.id),
};
