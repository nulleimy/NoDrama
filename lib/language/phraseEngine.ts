import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";
import { generateEnterpriseReply } from "@/lib/enterprise/multiApplicator";

export function generatePhraseEngineReply(
  input: GenerateRequest,
  remaining: number,
  limit: number
): GenerateResponse & {
  meta: {
    engine: "enterprise-multiapplicator";
    situationId: string;
    category: string;
    strategy: string;
    language: string;
  };
} {
  const enterprise = generateEnterpriseReply(input);

  return {
    ok: true,
    remaining,
    limit,
    text: enterprise.topExample,
    output: {
      shortReply: enterprise.shortVersion,
      naturalReply: enterprise.goodExample,
      strongReply: enterprise.topExample,
      followUpReply:
        input.language === "cs"
          ? `Když přitlačí: „${enterprise.riskNote}“`
          : `If pressed: “${enterprise.riskNote}”`,
    },
    enterprise: {
      badExample: enterprise.badExample,
      goodExample: enterprise.goodExample,
      topExample: enterprise.topExample,
      shortVersion: enterprise.shortVersion,
      longVersion: enterprise.longVersion,
      whatNotToSay: enterprise.whatNotToSay,
      riskNote: enterprise.riskNote,
    },
    meta: {
      engine: "enterprise-multiapplicator",
      situationId: enterprise.situation.id,
      category: enterprise.situation.category,
      strategy: input.strategy,
      language: input.language,
    },
  };
}
