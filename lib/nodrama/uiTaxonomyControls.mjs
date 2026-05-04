import {
  lockedChannelTaxonomyV2,
  lockedRelationshipTaxonomyV2,
  lockedStrategyTaxonomyV2,
} from "./taxonomySchemaV2.mjs";

const toneLegacyValueById = {
  kind: "Milý",
  direct: "Asertivní",
  formal: "Formální",
  light: "Vtipný",
  warm: "Milý",
  firm: "Asertivní",
  calm: "Milý",
  brief: "Asertivní",
};

const lockedToneControlOptions = [
  { id: "kind", label: { cs: "Milý", en: "Kind" } },
  { id: "direct", label: { cs: "Přímý", en: "Direct" } },
  { id: "formal", label: { cs: "Formální", en: "Formal" } },
  { id: "light", label: { cs: "Lehký", en: "Light" } },
  { id: "warm", label: { cs: "Vřelý", en: "Warm" } },
  { id: "firm", label: { cs: "Pevný", en: "Firm" } },
  { id: "calm", label: { cs: "Klidný", en: "Calm" } },
  { id: "brief", label: { cs: "Stručný", en: "Brief" } },
];

const strategyLabelById = {
  truthful_boundary: { cs: "Pravdivě", en: "Truthful" },
  direct_boundary: { cs: "Přímo", en: "Direct" },
  repair_accountability: { cs: "Náprava", en: "Repair" },
  delay_update: { cs: "Zpoždění", en: "Delay" },
  decline_capacity: { cs: "Kapacita", en: "Capacity" },
  clarify_intent: { cs: "Ujasnit", en: "Clarify" },
  reschedule_option: { cs: "Přesunout", en: "Reschedule" },
  brief_exit: { cs: "Ukončit", en: "Exit" },
};

export const publicGeneratorTaxonomyControls = {
  tone: lockedToneControlOptions.map((tone) => ({
    id: tone.id,
    label: tone.label,
    legacyValue: toneLegacyValueById[tone.id],
  })),
  relationship: [
    {
      id: "friend",
      label: { cs: "Kamarádi", en: "Friends" },
      legacyValue: "Kamarádi",
    },
    {
      id: "work",
      label: { cs: "Práce", en: "Work" },
      legacyValue: "Práce",
    },
    {
      id: "family",
      label: { cs: "Rodina", en: "Family" },
      legacyValue: "Rodina",
    },
    {
      id: "dating",
      label: { cs: "Randění", en: "Dating" },
      legacyValue: "Randění",
    },
    {
      id: "service",
      label: { cs: "Služba", en: "Service" },
      legacyValue: "Práce",
    },
    {
      id: "group",
      label: { cs: "Skupina", en: "Group" },
      legacyValue: "Kamarádi",
    },
    {
      id: "partner",
      label: { cs: "Partner", en: "Partner" },
      legacyValue: "Randění",
    },
    {
      id: "acquaintance",
      label: { cs: "Známý", en: "Acquaintance" },
      legacyValue: "Kamarádi",
    },
  ],
  channel: [
    {
      id: "whatsapp",
      label: { cs: "WhatsApp", en: "WhatsApp" },
      legacyValue: "WhatsApp",
    },
    {
      id: "sms",
      label: { cs: "SMS", en: "SMS" },
      legacyValue: "SMS",
    },
    {
      id: "email",
      label: { cs: "E-mail", en: "E-mail" },
      legacyValue: "E-mail",
    },
    {
      id: "slack",
      label: { cs: "Slack", en: "Slack" },
      legacyValue: "Slack",
    },
    {
      id: "messenger",
      label: { cs: "Messenger", en: "Messenger" },
      legacyValue: "WhatsApp",
    },
    {
      id: "instagram_dm",
      label: { cs: "Instagram DM", en: "Instagram DM" },
      legacyValue: "WhatsApp",
    },
    {
      id: "signal",
      label: { cs: "Signal", en: "Signal" },
      legacyValue: "WhatsApp",
    },
    {
      id: "teams",
      label: { cs: "Teams", en: "Teams" },
      legacyValue: "Slack",
    },
  ],
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
