import { z } from "zod";
import { analyticsEventNames } from "@/lib/analytics/funnelEvents";

export const analyticsEventNameSchema = z.enum(analyticsEventNames);

export const analyticsEventSchema = z.object({
  name: analyticsEventNameSchema,
  timestamp: z.string().datetime().optional(),
  sessionIdHash: z.string().min(8).max(120).optional(),
  clientIdHash: z.string().min(8).max(120).optional(),
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
