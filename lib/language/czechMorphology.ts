export type CzechAddressMode = "formal" | "informal";
export type CzechSpeakerGender = "female" | "male" | "unknown";

export type CzechAddressForms = {
  mode: CzechAddressMode;
  pronoun: "ty" | "vy";
  can: "můžeš" | "můžete";
  please: "prosím tě" | "prosím vás";
  respect: "respektuj" | "respektujte";
  send: "pošli" | "pošlete";
  confirm: "potvrď" | "potvrďte";
  understand: "chápu" | "rozumím";
};

type AddressInput = {
  relationshipId?: string;
  channelId?: string;
  toneId?: string;
};

const formalRelationships = new Set(["authority", "client", "stranger_public"]);
const informalRelationships = new Set(["friend", "close_friend", "partner", "family"]);
const formalChannels = new Set(["email", "professional_dm"]);

export function resolveCzechAddress(input: AddressInput): CzechAddressForms {
  const mode = resolveCzechAddressMode(input);

  if (mode === "formal") {
    return {
      mode,
      pronoun: "vy",
      can: "můžete",
      please: "prosím vás",
      respect: "respektujte",
      send: "pošlete",
      confirm: "potvrďte",
      understand: "rozumím",
    };
  }

  return {
    mode,
    pronoun: "ty",
    can: "můžeš",
    please: "prosím tě",
    respect: "respektuj",
    send: "pošli",
    confirm: "potvrď",
    understand: "chápu",
  };
}

export function resolveCzechAddressMode(input: AddressInput): CzechAddressMode {
  if (input.toneId === "formal") return "formal";
  if (input.relationshipId && formalRelationships.has(input.relationshipId)) {
    return "formal";
  }
  if (input.channelId && formalChannels.has(input.channelId)) return "formal";
  if (input.relationshipId && informalRelationships.has(input.relationshipId)) {
    return "informal";
  }
  return input.channelId === "work_chat" ? "formal" : "informal";
}

export function inferCzechSpeakerGender(text: string): CzechSpeakerGender {
  const normalized = normalizeCzech(text);

  if (
    /\b(rekla|rikala|byla|mohla|chtela|potrebovala|poslala|napsala|slibila|prisla|udelala)\b/.test(
      normalized
    )
  ) {
    return "female";
  }

  if (
    /\b(rekl|rikal|byl|mohl|chtel|potreboval|poslal|napsal|slibil|prisel|udelal)\b/.test(
      normalized
    )
  ) {
    return "male";
  }

  return "unknown";
}

export function neutralizeCzechSlashForms(text: string): string {
  return text
    .replace(/\bposlal\/a\b/gi, "poslat")
    .replace(/\bpotvrdil\/a\b/gi, "potvrdit")
    .replace(/\bslíbil\/a\b/gi, "dávat slib")
    .replace(/\brád\/a\b/gi, "klidně")
    .replace(/\bchtěl\/a\b/gi, "chtěl bych")
    .replace(/\bbyl\/a\b/gi, "bylo to")
    .replace(/\brespektoval\/a\b/gi, "respektovat");
}

export function chooseCzechSpeakerForm(
  gender: CzechSpeakerGender,
  forms: { female: string; male: string; neutral: string }
): string {
  if (gender === "female") return forms.female;
  if (gender === "male") return forms.male;
  return forms.neutral;
}

function normalizeCzech(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");
}
