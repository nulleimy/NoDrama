import { z } from "zod";

export const analyticsEventNameSchema = z.enum([
  "generate_clicked",
  "generate_success",
  "generate_failed",
  "copy_reply",
  "paywall_shown",
  "paywall_closed",
  "credit_pack_clicked",
  "credit_pack_purchase_started",
  "credit_pack_purchase_success",
  "credit_pack_purchase_failed",
  "pricing_cta_clicked",
]);

export const analyticsEventSchema = z.object({
  name: analyticsEventNameSchema,
  timestamp: z.string().datetime().optional(),
  sessionId: z.string().min(8).max(120).optional(),
  path: z.string().max(300).optional(),
  properties: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
    .optional(),
});

export type AnalyticsEventName = z.infer<typeof analyticsEventNameSchema>;
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

export type AnalyticsEventResponse =
  | {
      ok: true;
      accepted: true;
    }
  | {
      ok: false;
      code: "VALIDATION_ERROR" | "SERVER_ERROR";
      message: string;
      issues?: unknown;
    };
