import type { GenerateRequest, GenerateResponse } from "@/lib/generateContract";

function channelPrefix(channel: GenerateRequest["channel"]) {
  if (channel === "E-mail") return "Dobrý den,";
  if (channel === "Slack") return "Ahoj,";
  return "Hele,";
}

function toneSoftener(tone: GenerateRequest["tone"]) {
  if (tone === "Milý") return "mrzí mě to";
  if (tone === "Asertivní") return "dávám vědět narovinu";
  if (tone === "Formální") return "omlouvám se za komplikace";
  if (tone === "Vtipný") return "dneska nejsem ve své nejslavnější životní epizodě";
  return "radši to říkám rovnou";
}

function relationshipLine(relationship: GenerateRequest["relationship"]) {
  if (relationship === "Práce") {
    return "Nechci to lámat přes koleno a radši to posunu férově.";
  }

  if (relationship === "Rodina") {
    return "Potřebuju si dneska nechat trochu prostoru a nechci dorazit napůl mimo.";
  }

  if (relationship === "Randění") {
    return "Nechci to hrát do ztracena, radši ti to řeknu normálně.";
  }

  return "Nechci slibovat něco, co dneska nedám.";
}

export function generateServerDemoReply(
  input: GenerateRequest,
  remaining: number,
  limit: number
): GenerateResponse {
  const prefix = channelPrefix(input.channel);
  const softener = toneSoftener(input.tone);
  const relation = relationshipLine(input.relationship);

  return {
    ok: true,
    remaining,
    limit,
    output: {
      shortReply: `${prefix} dneska to bohužel nedám. ${softener}. Ozvu se později.`,
      naturalReply: `${prefix} k tomu dnešku — ${softener}, ale nakonec to nezvládnu. ${relation}`,
      strongReply: `${prefix} potřebuju to dneska zrušit. Nechci kolem toho dělat drama ani vymýšlet zbytečné detaily. Díky za pochopení.`,
      followUpReply:
        "Kdyby se ptali dál: „Je to trochu osobní/praktické, nechci to moc rozebírat. Dávám vědět hlavně proto, abys s tím mohl/a počítat.“",
    },
  };
}
