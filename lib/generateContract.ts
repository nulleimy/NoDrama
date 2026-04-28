import { z } from "zod";

export const toneEnum = z.enum([
  "kind",
  "friendly",
  "assertive",
  "formal",
  "apologetic",
  "funny",
  "absurd",
  "minimal",
]);

export const relationshipEnum = z.enum([
  "authority",
  "peer",
  "client",
  "friend",
  "close_friend",
  "partner",
  "family",
  "stranger_public",
]);

export const channelEnum = z.enum([
  "messenger_1to1",
  "group_chat",
  "email",
  "work_chat",
  "professional_dm",
  "social_dm",
  "voice_call",
  "face_to_face",
]);

export const strategyEnum = z.enum([
  "delay",
  "soft_decline",
  "hard_boundary",
  "redirect",
  "repair",
  "exit",
  "negotiate",
  "clarify",
]);

export const languageEnum = z.enum(["cs", "en"]);

export type ToneId = z.infer<typeof toneEnum>;
export type RelationshipId = z.infer<typeof relationshipEnum>;
export type ChannelId = z.infer<typeof channelEnum>;
export type StrategyId = z.infer<typeof strategyEnum>;
export type LanguageId = z.infer<typeof languageEnum>;

const legacyToneMap: Record<string, z.infer<typeof toneEnum>> = {
  "Milý": "kind",
  "Asertivní": "assertive",
  "Formální": "formal",
  "Vtipný": "funny",
  mily: "kind",
  asertivni: "assertive",
  formalni: "formal",
  vtipny: "funny",
};

const legacyRelationshipMap: Record<string, z.infer<typeof relationshipEnum>> = {
  "Kamarádi": "friend",
  "Práce": "peer",
  "Rodina": "family",
  "Randění": "partner",
  kamaradi: "friend",
  prace: "peer",
  rodina: "family",
  randeni: "partner",
};

const legacyChannelMap: Record<string, z.infer<typeof channelEnum>> = {
  WhatsApp: "messenger_1to1",
  SMS: "messenger_1to1",
  "E-mail": "email",
  Slack: "work_chat",
  whatsapp: "messenger_1to1",
  sms: "messenger_1to1",
  email: "email",
  slack: "work_chat",
};

function mapLegacyValue<T extends string>(
  value: unknown,
  map: Record<string, T>,
  fallback: T
): T {
  if (typeof value !== "string") return fallback;
  return map[value] ?? (value as T);
}

export const generateRequestSchema = z
  .object({
    situation: z
      .string()
      .min(8, "Popiš situaci trochu konkrétněji.")
      .max(800, "Situace je moc dlouhá. Zkrať ji prosím."),
    tone: z.string().optional(),
    relationship: z.string().optional(),
    relation: z.string().optional(),
    channel: z.string().optional(),
    strategy: z.string().optional(),
    language: z.string().optional(),
  })
  .transform((input) => ({
    situation: input.situation,
    tone: mapLegacyValue(input.tone, legacyToneMap, "friendly"),
    relationship: mapLegacyValue(
      input.relationship ?? input.relation,
      legacyRelationshipMap,
      "friend"
    ),
    channel: mapLegacyValue(input.channel, legacyChannelMap, "messenger_1to1"),
    strategy: (input.strategy ?? "soft_decline") as z.infer<typeof strategyEnum>,
    language: (input.language ?? "cs") as z.infer<typeof languageEnum>,
  }))
  .pipe(
    z.object({
      situation: z.string(),
      tone: toneEnum,
      relationship: relationshipEnum,
      channel: channelEnum,
      strategy: strategyEnum,
      language: languageEnum,
    })
  );

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export type GenerateResponse = {
  ok: true;
  remaining: number;
  limit: number;
  text?: string;
  output: {
    shortReply: string;
    naturalReply: string;
    strongReply: string;
    followUpReply: string;
  };
  enterprise?: {
    badExample: string;
    goodExample: string;
    topExample: string;
    shortVersion: string;
    longVersion: string;
    whatNotToSay: string[];
    riskNote: string;
  };
  meta?: unknown;
};

export type GenerateErrorResponse = {
  ok: false;
  code: "VALIDATION_ERROR" | "FREE_LIMIT_EXCEEDED" | "SERVER_ERROR";
  message: string;
  remaining?: number;
  limit?: number;
  issues?: unknown;
};
