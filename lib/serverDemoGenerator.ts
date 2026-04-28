import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";

function channelPrefix(channel: GenerateRequest["channel"], language: GenerateRequest["language"]) {
  if (channel === "email") return language === "cs" ? "Dobrý den," : "Hello,";
  if (channel === "work_chat") return language === "cs" ? "Ahoj," : "Hey,";
  return language === "cs" ? "Ahoj," : "Hi,";
}

export function generateServerDemoReply(
  input: GenerateRequest,
  remaining: number,
  limit: number
): GenerateResponse {
  const prefix = channelPrefix(input.channel, input.language);
  const isCzech = input.language === "cs";

  return {
    ok: true,
    remaining,
    limit,
    text: isCzech ? "Dnes to bohužel nedám." : "I won’t make it today.",
    output: {
      shortReply: isCzech
        ? `${prefix} dnes to bohužel nedám.`
        : `${prefix} I won’t make it today.`,
      naturalReply: isCzech
        ? `${prefix} dávám vědět včas, dnes to nestihnu.`
        : `${prefix} giving you a heads-up, I won’t make it today.`,
      strongReply: isCzech
        ? `${prefix} dnes se nezúčastním.`
        : `${prefix} I won’t be joining today.`,
      followUpReply: isCzech
        ? "Kdyby se ptali dál: Nechci to teď víc rozebírat."
        : "If they ask more: I’d rather not go into details right now.",
    },
  };
}
