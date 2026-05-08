import { z } from "zod";

const finalToneIds = [
  "neutral",
  "soft",
  "assertive",
  "formal",
  "apologetic",
  "warm",
  "concise",
  "playful",
] as const;

const legacyToneIds = [
  "kind",
  "direct",
  "light",
  "firm",
  "calm",
  "brief",
] as const;

const finalRelationshipIds = [
  "authority",
  "peer",
  "client",
  "friend",
  "close_friend",
  "partner",
  "family",
  "stranger_public",
] as const;

const legacyRelationshipIds = [
  "work",
  "dating",
  "service",
  "group",
  "acquaintance",
] as const;

const finalChannelIds = [
  "messenger_1to1",
  "group_chat",
  "email",
  "work_chat",
  "professional_dm",
  "social_dm",
  "voice_call",
  "face_to_face",
] as const;

const legacyChannelIds = [
  "whatsapp",
  "sms",
  "slack",
  "messenger",
  "instagram_dm",
  "signal",
  "teams",
] as const;

const finalStrategyIds = [
  "delay",
  "soft_decline",
  "hard_boundary",
  "redirect",
  "repair",
  "exit",
  "negotiate",
  "clarify",
] as const;

const legacyStrategyIds = [
  "truthful_boundary",
  "direct_boundary",
  "repair_accountability",
  "delay_update",
  "decline_capacity",
  "clarify_intent",
  "reschedule_option",
  "brief_exit",
] as const;

const legacyToneSchema = z.enum(["Milý", "Asertivní", "Formální", "Vtipný"]);
const legacyRelationshipSchema = z.enum([
  "Kamarádi",
  "Práce",
  "Rodina",
  "Randění",
]);
const legacyChannelSchema = z.enum(["WhatsApp", "SMS", "E-mail", "Slack"]);
const toneIdSchema = z.enum([...finalToneIds, ...legacyToneIds]);
const relationshipIdSchema = z.enum([
  ...finalRelationshipIds,
  ...legacyRelationshipIds,
]);
const channelIdSchema = z.enum([...finalChannelIds, ...legacyChannelIds]);
const strategyIdSchema = z.enum([...finalStrategyIds, ...legacyStrategyIds]);
const selectorSourceSchema = z.enum(["auto", "manual", "default"]);

type LegacyTone = z.infer<typeof legacyToneSchema>;
type LegacyRelationship = z.infer<typeof legacyRelationshipSchema>;
type LegacyChannel = z.infer<typeof legacyChannelSchema>;
type ToneId = z.infer<typeof toneIdSchema>;
type RelationshipId = z.infer<typeof relationshipIdSchema>;
type ChannelId = z.infer<typeof channelIdSchema>;

const legacyToneById: Record<ToneId, LegacyTone> = {
  neutral: "Milý",
  soft: "Milý",
  assertive: "Asertivní",
  formal: "Formální",
  apologetic: "Milý",
  warm: "Milý",
  concise: "Formální",
  playful: "Vtipný",
  kind: "Milý",
  direct: "Asertivní",
  light: "Vtipný",
  firm: "Asertivní",
  calm: "Milý",
  brief: "Formální",
};

const legacyRelationshipById: Record<RelationshipId, LegacyRelationship> = {
  authority: "Práce",
  peer: "Práce",
  client: "Práce",
  friend: "Kamarádi",
  close_friend: "Kamarádi",
  partner: "Randění",
  family: "Rodina",
  stranger_public: "Kamarádi",
  work: "Práce",
  dating: "Randění",
  service: "Práce",
  group: "Kamarádi",
  acquaintance: "Kamarádi",
};

const legacyChannelById: Record<ChannelId, LegacyChannel> = {
  messenger_1to1: "WhatsApp",
  group_chat: "WhatsApp",
  email: "E-mail",
  work_chat: "Slack",
  professional_dm: "Slack",
  social_dm: "WhatsApp",
  voice_call: "WhatsApp",
  face_to_face: "WhatsApp",
  whatsapp: "WhatsApp",
  sms: "SMS",
  slack: "Slack",
  messenger: "WhatsApp",
  instagram_dm: "WhatsApp",
  signal: "WhatsApp",
  teams: "Slack",
};

const generateRequestBaseSchema = z.object({
  situation: z
    .string()
    .min(8, "Popiš situaci trochu konkrétněji.")
    .max(800, "Situace je moc dlouhá. Zkrať ji prosím."),
  locale: z.enum(["cs", "en"]).optional(),
  appLocale: z.enum(["cs", "en"]).optional(),
  requestLocale: z.enum(["cs", "en"]).optional(),
  tone: legacyToneSchema.optional(),
  relationship: legacyRelationshipSchema.optional(),
  channel: legacyChannelSchema.optional(),
  toneId: toneIdSchema.optional(),
  relationshipId: relationshipIdSchema.optional(),
  channelId: channelIdSchema.optional(),
  strategyId: strategyIdSchema.optional(),
  selectorMixing: z
    .object({
      selected: z
        .object({
          toneId: toneIdSchema.optional(),
          relationshipId: relationshipIdSchema.optional(),
          channelId: channelIdSchema.optional(),
          strategyId: strategyIdSchema.optional(),
          tone: toneIdSchema.optional(),
          relationship: relationshipIdSchema.optional(),
          channel: channelIdSchema.optional(),
          strategy: strategyIdSchema.optional(),
        })
        .optional(),
    })
    .optional(),
  selectorSources: z
    .object({
      tone: selectorSourceSchema.optional(),
      relationship: selectorSourceSchema.optional(),
      channel: selectorSourceSchema.optional(),
      strategy: selectorSourceSchema.optional(),
    })
    .optional(),
});

type GenerateRequestBase = z.infer<typeof generateRequestBaseSchema>;

function normalizeGenerateRequest(input: GenerateRequestBase) {
  return {
    ...input,
    tone: input.tone ?? (input.toneId ? legacyToneById[input.toneId] : "Milý"),
    relationship:
      input.relationship ??
      (input.relationshipId ? legacyRelationshipById[input.relationshipId] : "Kamarádi"),
    channel:
      input.channel ?? (input.channelId ? legacyChannelById[input.channelId] : "WhatsApp"),
  };
}

export const generateRequestSchema = generateRequestBaseSchema
  .superRefine((input, context) => {
    if (!input.tone && !input.toneId) {
      context.addIssue({
        code: "custom",
        path: ["tone"],
        message: "Vyber tón odpovědi.",
      });
    }

    if (!input.relationship && !input.relationshipId) {
      context.addIssue({
        code: "custom",
        path: ["relationship"],
        message: "Vyber vztah.",
      });
    }

    if (!input.channel && !input.channelId) {
      context.addIssue({
        code: "custom",
        path: ["channel"],
        message: "Vyber kanál.",
      });
    }
  })
  .transform(normalizeGenerateRequest);

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export type GenerateResponse = {
  ok: true;
  remaining: number;
  limit: number;
  output: {
    shortReply: string;
    naturalReply: string;
    strongReply: string;
    followUpReply: string;
  };
  meta?: unknown;
};

export type GenerateErrorResponse = {
  ok: false;
  code:
    | "VALIDATION_ERROR"
    | "FREE_LIMIT_EXCEEDED"
    | "SERVER_ERROR";
  message: string;
  remaining?: number;
  limit?: number;
  issues?: unknown;
};
