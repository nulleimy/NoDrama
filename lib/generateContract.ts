import { z } from "zod";

export const generateRequestSchema = z.object({
  situation: z
    .string()
    .min(8, "Popiš situaci trochu konkrétněji.")
    .max(800, "Situace je moc dlouhá. Zkrať ji prosím."),
  tone: z.enum(["Milý", "Asertivní", "Formální", "Vtipný"]),
  relationship: z.enum(["Kamarádi", "Práce", "Rodina", "Randění"]),
  channel: z.enum(["WhatsApp", "SMS", "E-mail", "Slack"]),
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
