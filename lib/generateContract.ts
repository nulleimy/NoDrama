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

export const generateRequestSchema = z.object({
  situation: z
    .string()
    .min(8, "Popiš situaci trochu konkrétněji.")
    .max(800, "Situace je moc dlouhá. Zkrať ji prosím."),
  tone: z.enum(["Milý", "Asertivní", "Formální", "Vtipný"]),
  relationship: z.enum(["Kamarádi", "Práce", "Rodina", "Randění"]),
  channel: z.enum(["WhatsApp", "SMS", "E-mail", "Slack"]),
  toneId: z.enum([...finalToneIds, ...legacyToneIds]).optional(),
  relationshipId: z
    .enum([...finalRelationshipIds, ...legacyRelationshipIds])
    .optional(),
  channelId: z.enum([...finalChannelIds, ...legacyChannelIds]).optional(),
  strategyId: z.enum([...finalStrategyIds, ...legacyStrategyIds]).optional(),
});

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
