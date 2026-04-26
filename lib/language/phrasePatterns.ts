import type {
  LanguageCode,
  PublicRiskLevel,
  ReplyChannel,
  ReplyIntent,
  ReplyStyle,
} from "@/lib/language/phraseTypes";

export type PhrasePattern = {
  id: string;
  language: LanguageCode;
  style: ReplyStyle;
  intent: ReplyIntent;
  channels: ReplyChannel[];
  intensity: 1 | 2 | 3;
  risk: PublicRiskLevel;
  tags: string[];
  openings: string[];
  cores: string[];
  closings: string[];
};

export const phrasePatterns: PhrasePattern[] = [
  {
    id: "cs_cancel_casual_pattern",
    language: "cs",
    style: "casual",
    intent: "cancel",
    channels: ["sms", "whatsapp"],
    intensity: 1,
    risk: "low",
    tags: ["chat", "natural"],
    openings: ["Hele,", "Upřímně,", "Jen dávám vědět,"],
    cores: [
      "dneska mi to nakonec nevyjde",
      "dneska to radši odpískám",
      "tentokrát z toho radši couvnu",
    ],
    closings: ["ozvu se později.", "díky za pochopení.", "ať s tím můžeš počítat."],
  },
  {
    id: "cs_cancel_neutral_pattern",
    language: "cs",
    style: "neutral",
    intent: "cancel",
    channels: ["sms", "whatsapp", "email"],
    intensity: 1,
    risk: "low",
    tags: ["safe", "plain"],
    openings: ["Dávám vědět,", "Omlouvám se,", "Bohužel,"],
    cores: [
      "dnešní termín mi nakonec nevyhovuje",
      "dnes se z toho omluvím",
      "tentokrát se nezúčastním",
    ],
    closings: ["děkuji za pochopení.", "ozvu se později.", "nechci to nechávat na poslední chvíli."],
  },
  {
    id: "cs_cancel_formal_pattern",
    language: "cs",
    style: "formal",
    intent: "cancel",
    channels: ["email", "slack"],
    intensity: 1,
    risk: "low",
    tags: ["professional"],
    openings: ["Dobrý den,", "Omlouvám se,", "Rád/a bych dal/a vědět,"],
    cores: [
      "dnešního setkání se bohužel nemohu zúčastnit",
      "dnešní termín mi nakonec nevyhovuje",
      "potřebuji dnešní schůzku přesunout",
    ],
    closings: ["děkuji za pochopení.", "navrhnu prosím náhradní termín.", "omlouvám se za komplikace."],
  },
  {
    id: "cs_cancel_firm_pattern",
    language: "cs",
    style: "firm",
    intent: "cancel",
    channels: ["sms", "whatsapp", "email", "slack"],
    intensity: 1,
    risk: "low",
    tags: ["boundary"],
    openings: ["Dávám vědět rovnou,", "Tentokrát jasně říkám,", "Nechci to komplikovat,"],
    cores: [
      "dnes se nezúčastním",
      "dnes to ruším",
      "dnes na to nebudu mít prostor",
    ],
    closings: ["díky za respektování.", "ať s tím můžeš počítat.", "bez zbytečného rozebírání."],
  },
  {
    id: "cs_cancel_funny_pattern",
    language: "cs",
    style: "funny",
    intent: "cancel",
    channels: ["sms", "whatsapp"],
    intensity: 1,
    risk: "low",
    tags: ["non_cringe", "light"],
    openings: ["Hele,", "Dneska hlásím,", "Oficiálně oznamuju,"],
    cores: [
      "moje sociální baterka bliká červeně",
      "jsem v režimu úspory energie",
      "můj interní výkon je dneska podezřele nízko",
    ],
    closings: ["ozvu se později.", "díky za pochopení.", "nebudu to dneska lámat přes koleno."],
  },
  {
    id: "cs_cancel_absurd_pattern",
    language: "cs",
    style: "absurd",
    intent: "cancel",
    channels: ["sms", "whatsapp"],
    intensity: 2,
    risk: "low",
    tags: ["absurd", "playful"],
    openings: ["Dneska bohužel,", "Interní komise rozhodla,", "Systém hlásí,"],
    cores: [
      "probíhá neplánovaná odstávka člověka",
      "můj osobní operační systém odmítl společenský režim",
      "uživatel je dočasně nekompatibilní s venkovním provozem",
    ],
    closings: ["návrat do provozu očekávám později.", "díky za pochopení systému.", "další pokus proběhne jindy."],
  },
  {
    id: "en_cancel_casual_pattern",
    language: "en",
    style: "casual",
    intent: "cancel",
    channels: ["sms", "whatsapp"],
    intensity: 1,
    risk: "low",
    tags: ["chat", "natural"],
    openings: ["Hey,", "Just letting you know,", "Honestly,"],
    cores: [
      "I won’t be able to make it today",
      "I’m going to sit this one out today",
      "today doesn’t work for me after all",
    ],
    closings: ["thanks for understanding.", "I’ll catch up with you later.", "wanted to let you know directly."],
  },
  {
    id: "en_cancel_formal_pattern",
    language: "en",
    style: "formal",
    intent: "cancel",
    channels: ["email", "slack"],
    intensity: 1,
    risk: "low",
    tags: ["professional"],
    openings: ["Hello,", "I apologize,", "I wanted to let you know,"],
    cores: [
      "I will not be able to attend today",
      "today’s timing no longer works for me",
      "I need to reschedule today’s meeting",
    ],
    closings: ["thank you for your understanding.", "I apologize for the inconvenience.", "I will suggest an alternative time."],
  },
  {
    id: "en_cancel_funny_pattern",
    language: "en",
    style: "funny",
    intent: "cancel",
    channels: ["sms", "whatsapp"],
    intensity: 1,
    risk: "low",
    tags: ["non_cringe", "light"],
    openings: ["Hey,", "Official update:", "Tiny life admin note:"],
    cores: [
      "my social battery is flashing red today",
      "I’m running on low power mode today",
      "my human bandwidth is not looking heroic today",
    ],
    closings: ["I’ll catch up later.", "thanks for understanding.", "I’m not forcing it today."],
  },
  {
    id: "en_cancel_absurd_pattern",
    language: "en",
    style: "absurd",
    intent: "cancel",
    channels: ["sms", "whatsapp"],
    intensity: 2,
    risk: "low",
    tags: ["absurd", "playful"],
    openings: ["Unfortunately,", "System notice:", "Internal management has decided"],
    cores: [
      "today’s human operating system is under unscheduled maintenance",
      "the user is temporarily incompatible with outdoor operations",
      "social mode failed to boot this morning",
    ],
    closings: ["service may resume later.", "thanks for understanding the system.", "we’ll attempt a restart another day."],
  },
];
