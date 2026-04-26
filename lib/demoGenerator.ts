export type DemoGeneratorInput = {
  situation: string;
  tone: string;
  relationship: string;
  channel: string;
};

export type DemoGeneratorOutput = {
  shortReply: string;
  naturalReply: string;
  strongReply: string;
  followUpReply: string;
};

function channelPrefix(channel: string) {
  if (channel === "E-mail") return "Dobrý den,";
  if (channel === "Slack") return "Ahoj,";
  return "Hele,";
}

function toneSoftener(tone: string) {
  if (tone === "Milý") return "mrzí mě to";
  if (tone === "Asertivní") return "dávám vědět narovinu";
  if (tone === "Formální") return "omlouvám se za komplikace";
  if (tone === "Vtipný") return "dneska nejsem ve své nejslavnější životní epizodě";
  return "radši to říkám rovnou";
}

export function generateDemoReply(input: DemoGeneratorInput): DemoGeneratorOutput {
  const prefix = channelPrefix(input.channel);
  const softener = toneSoftener(input.tone);
  const relation =
    input.relationship === "Práce"
      ? "Nechci to lámat přes koleno a radši to posunu férově."
      : input.relationship === "Rodina"
        ? "Potřebuju si dneska nechat trochu prostoru a nechci dorazit napůl mimo."
        : input.relationship === "Randění"
          ? "Nechci to hrát do ztracena, radši ti to řeknu normálně."
          : "Nechci slibovat něco, co dneska nedám.";

  const cleanSituation = input.situation.trim();

  return {
    shortReply: `${prefix} dneska to bohužel nedám. ${softener}. Ozvu se později.`,
    naturalReply: `${prefix} k tomu dnešku — ${softener}, ale nakonec to nezvládnu. ${relation}`,
    strongReply: `${prefix} potřebuju to dneska zrušit. Nechci kolem toho dělat drama ani vymýšlet zbytečné detaily. Díky za pochopení.`,
    followUpReply: cleanSituation
      ? `Kdyby se ptali dál: „Je to trochu osobní/praktické, nechci to moc rozebírat. Dávám vědět hlavně proto, abys s tím mohl/a počítat.“`
      : `Kdyby se ptali dál: „Nechci to moc rozebírat, ale díky za pochopení.“`,
  };
}
