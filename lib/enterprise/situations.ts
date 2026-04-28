import type { ChannelId, RelationshipId, StrategyId, ToneId } from "@/lib/generateContract";

export type RiskLevel = "low" | "medium" | "high";
export type PressureLevel = "low" | "medium" | "high";

export type MicroSituation = {
  id: string;
  category: string;
  subcategory: string;
  microSituationCs: string;
  microSituationEn: string;
  defaultStrategy: StrategyId;
  riskLevel: RiskLevel;
  pressureLevel: PressureLevel;
  recommendedTones: ToneId[];
  blockedTones: ToneId[];
  recommendedChannels: ChannelId[];
  recommendedRelationships: RelationshipId[];
  constraintsCs: string[];
  constraintsEn: string[];
  badExampleCs: string;
  goodExampleCs: string;
  topExampleCs: string;
  badExampleEn: string;
  goodExampleEn: string;
  topExampleEn: string;
};

export const microSituations: MicroSituation[] = [
  {
    id: "WORK_DEADLINE_001",
    category: "work",
    subcategory: "deadline_pressure",
    microSituationCs:
      "Nestíháš dodat výstup, už jsi jednou posunula termín a šéf čeká update ve Slacku.",
    microSituationEn:
      "You are late with a deliverable, already moved the deadline once, and your boss is waiting for an update on Slack.",
    defaultStrategy: "repair",
    riskLevel: "high",
    pressureLevel: "medium",
    recommendedTones: ["formal", "apologetic", "assertive"],
    blockedTones: ["absurd", "funny"],
    recommendedChannels: ["work_chat", "email"],
    recommendedRelationships: ["authority"],
    constraintsCs: [
      "nepůsobit jako výmluva",
      "převzít odpovědnost",
      "dát konkrétní nový termín",
    ],
    constraintsEn: [
      "do not sound like an excuse",
      "take responsibility",
      "provide a concrete new timeline",
    ],
    badExampleCs: "Nestíhám, pošlu později.",
    goodExampleCs: "Nestíhám to dnes dokončit, pošlu update zítra.",
    topExampleCs:
      "Vidím, že dnešní termín už nedodržím. Je to na mě — podcenila jsem čas. Pošlu dnes stručný stav a hotovou verzi zítra do 12:00.",
    badExampleEn: "I won’t make it, I’ll send it later.",
    goodExampleEn: "I won’t be able to finish it today, I’ll send an update tomorrow.",
    topExampleEn:
      "I can see I won’t make today’s deadline. That’s on me — I underestimated the timing. I’ll send a short status today and the completed version tomorrow by 12:00.",
  },
  {
    id: "SOCIAL_INVITE_001",
    category: "social",
    subcategory: "decline_invite",
    microSituationCs: "Kamarádi tě zvou ven a ty potřebuješ odmítnout bez dramatu.",
    microSituationEn: "Friends invited you out and you need to decline without drama.",
    defaultStrategy: "soft_decline",
    riskLevel: "low",
    pressureLevel: "low",
    recommendedTones: ["kind", "friendly", "minimal"],
    blockedTones: [],
    recommendedChannels: ["messenger_1to1", "group_chat", "social_dm"],
    recommendedRelationships: ["friend", "close_friend"],
    constraintsCs: ["být stručný", "nebýt chladný", "nenabízet falešné důvody"],
    constraintsEn: ["stay short", "avoid sounding cold", "do not invent fake reasons"],
    badExampleCs: "Nepřijdu. Neřeš to.",
    goodExampleCs: "Díky za pozvání, dnes to nedám.",
    topExampleCs:
      "Díky za pozvání, dneska si dám klidový režim. Užijte to a příště se rád/a přidám.",
    badExampleEn: "I’m not coming. Don’t ask.",
    goodExampleEn: "Thanks for the invite, I can’t make it today.",
    topExampleEn:
      "Thanks for inviting me — I need a quiet evening today. Hope you have fun and I’ll join next time.",
  },
  {
    id: "FAMILY_BOUNDARY_001",
    category: "family",
    subcategory: "visit_boundary",
    microSituationCs: "Rodina tlačí na návštěvu, ale ty potřebuješ prostor.",
    microSituationEn: "Family is pushing for a visit, but you need personal space.",
    defaultStrategy: "hard_boundary",
    riskLevel: "medium",
    pressureLevel: "high",
    recommendedTones: ["kind", "assertive", "minimal"],
    blockedTones: ["absurd"],
    recommendedChannels: ["messenger_1to1", "voice_call", "face_to_face"],
    recommendedRelationships: ["family"],
    constraintsCs: ["udržet respekt", "držet hranici", "neslibovat, co nedáš"],
    constraintsEn: ["stay respectful", "hold the boundary", "do not promise what you can't do"],
    badExampleCs: "Neotravuj mě s tím.",
    goodExampleCs: "Dnes návštěvu nezvládnu.",
    topExampleCs:
      "Mám vás rád/a, ale dnes potřebuju čas pro sebe. Na návštěvu teď nepřijedu a ozvu se, až budu mít kapacitu.",
    badExampleEn: "Stop bothering me.",
    goodExampleEn: "I can’t do a visit today.",
    topExampleEn:
      "I care about you, but I need space today. I won’t come over now, and I’ll reach out when I have capacity.",
  },
  {
    id: "CLIENT_SCOPE_001",
    category: "client_business",
    subcategory: "scope_boundary",
    microSituationCs: "Klient chce další úkol navíc bez rozpočtu.",
    microSituationEn: "A client asks for extra work outside scope and budget.",
    defaultStrategy: "negotiate",
    riskLevel: "medium",
    pressureLevel: "medium",
    recommendedTones: ["formal", "assertive"],
    blockedTones: ["funny", "absurd"],
    recommendedChannels: ["email", "professional_dm", "work_chat"],
    recommendedRelationships: ["client"],
    constraintsCs: ["oddělit scope a cenu", "nabídnout varianty", "zachovat profesionalitu"],
    constraintsEn: ["separate scope and fee", "offer options", "stay professional"],
    badExampleCs: "Tohle dělat nebudu.",
    goodExampleCs: "Tento požadavek je mimo původní rozsah.",
    topExampleCs:
      "Díky za upřesnění. Tento požadavek je mimo původní scope, rád/a ho ale nacením zvlášť nebo přesuneme do další fáze.",
    badExampleEn: "I’m not doing that.",
    goodExampleEn: "This request is outside the original scope.",
    topExampleEn:
      "Thanks for clarifying. This request sits outside the original scope, and I can either quote it separately or include it in the next phase.",
  },
];
