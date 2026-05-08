import type { CzechAddressForms } from "./czechMorphology";

export type RealizerSlot =
  | "opener"
  | "reason"
  | "boundary"
  | "softener"
  | "nextStep"
  | "closing"
  | "pressureFollowUp";

export type RealizerFamily =
  | "repair"
  | "delay"
  | "decline"
  | "boundary"
  | "work"
  | "negotiate"
  | "clarify"
  | "redirect"
  | "exit";

export type CzechRealizerSlots = Record<RealizerSlot, string[]>;

type CzechPhraseInput = {
  family: RealizerFamily;
  toneId: string;
  channelId: string;
  address: CzechAddressForms;
};

export function getCzechRealizerSlots(input: CzechPhraseInput): CzechRealizerSlots {
  const formal = input.address.mode === "formal";
  const base = slotsByFamily(input.family, input.address, formal);

  return {
    opener: decorateOpeners(base.opener, input),
    reason: base.reason,
    boundary: decorateBoundaries(base.boundary, input),
    softener: decorateSofteners(base.softener, input),
    nextStep: decorateNextSteps(base.nextStep, input),
    closing: decorateClosings(base.closing, input),
    pressureFollowUp: base.pressureFollowUp,
  };
}

function slotsByFamily(
  family: RealizerFamily,
  address: CzechAddressForms,
  formal: boolean
): CzechRealizerSlots {
  if (family === "repair") {
    return {
      opener: formal ? ["Omlouvám se.", "Dobrý den, omlouvám se."] : ["Promiň.", "Mrzí mě to."],
      reason: [
        "Nechci to obcházet ani zahlcovat vysvětlováním.",
        "Dává smysl to pojmenovat jasně a napravit konkrétním krokem.",
      ],
      boundary: [
        "Beru to na sebe.",
        "Tohle je odpovědnost na mé straně.",
        "Potřebuji napravit dopad, ne přidávat další napětí.",
      ],
      softener: ["Díky za trpělivost.", "Vážím si toho, že to řešíme věcně."],
      nextStep: [
        "Pošlu jasný další krok.",
        "Navrhnu realistický postup a budu se ho držet.",
      ],
      closing: formal ? ["Děkuji za pochopení."] : ["Díky."],
      pressureFollowUp: [
        "Rozumím, že chcete víc detailů, ale nechci se schovávat za vysvětlování. Teď je důležitá náprava.",
        "Chápu, že chceš víc detailů, ale nechci se schovávat za vysvětlování. Teď je důležitá náprava.",
      ],
    };
  }

  if (family === "delay" || family === "work") {
    return {
      opener: formal ? ["Dobrý den,", "Děkuji za zprávu."] : ["Díky za zprávu.", "Ozývám se rovnou."],
      reason: [
        "Nechci potvrdit čas, který by nebyl realistický.",
        "Aby výsledek nebyl napůl, potřebuji upravit očekávání.",
      ],
      boundary: [
        "Potřebuji to posunout.",
        "Teď to nemohu slíbit v původním termínu.",
        "Nereálný termín teď nepotvrdím.",
      ],
      softener: ["Rozumím, že to může komplikovat plán.", "Díky za pochopení."],
      nextStep: [
        "Pošlu realistický další termín.",
        "Potvrdím, co je hotové a kdy dodám další krok.",
      ],
      closing: formal ? ["Děkuji za pochopení."] : ["Dám vědět co nejdřív."],
      pressureFollowUp: [
        "Rozumím urgentnosti, ale nechci dát nepřesný slib. Potvrdím čas, který opravdu dokážu dodržet.",
        "Chápu, že to spěchá, ale nechci slíbit něco, co by znovu selhalo. Pošlu reálný čas.",
      ],
    };
  }

  if (family === "negotiate") {
    return {
      opener: formal ? ["Dobrý den,", "Rozumím zadání."] : ["Chápu.", "Rozumím, co je potřeba."],
      reason: [
        "V tomhle rozsahu by to nebyl realistický závazek.",
        "Aby to dávalo smysl, potřebujeme upravit jednu z podmínek.",
      ],
      boundary: [
        "V aktuálních podmínkách to nepotvrdím.",
        "Mohu pokračovat jen po úpravě: rozsah, termín nebo rozpočet.",
        "Bez změny rozsahu by to nebylo fér očekávání.",
      ],
      softener: ["Chci, aby výsledek zůstal použitelný.", "Nechci blokovat postup, jen ho potřebuji nastavit realisticky."],
      nextStep: [
        "Navrhuji potvrdit prioritu a podle ní upravit zadání.",
        "Pojďme potvrdit, jestli se mění rozsah, cena nebo termín.",
      ],
      closing: formal ? ["Děkuji."] : ["Pak se můžu jasně zavázat."],
      pressureFollowUp: [
        "Rozumím, že chcete odpověď hned, ale bez jasného rozsahu bych slíbil něco nereálného.",
        "Chápu, že chceš rychlé ano, ale bez úpravy rozsahu bych sliboval něco nereálného.",
      ],
    };
  }

  if (family === "clarify") {
    return {
      opener: formal ? ["Než odpovím,", "Abych odpověděl přesně,"] : ["Než odpovím,", "Chci si to nejdřív ujasnit."],
      reason: [
        "Nechci reagovat na domněnku.",
        "Potřebuji vědět, co přesně je ode mě teď potřeba.",
      ],
      boundary: [
        "Bez jasného očekávání to teď nepotvrdím.",
        "Nejdřív potřebuji konkrétní požadavek.",
        "Na nejasné zadání nechci přikyvovat.",
      ],
      softener: ["Stačí stručně.", "Pomůže mi konkrétní odpověď."],
      nextStep: [
        `${address.can[0].toUpperCase()}${address.can.slice(1)} prosím upřesnit, co ode mě potřebujete?`,
        formal
          ? "Můžete prosím potvrdit konkrétní očekávání?"
          : "Můžeš prosím říct konkrétněji, co ode mě potřebuješ?",
      ],
      closing: ["Díky."],
      pressureFollowUp: [
        "Rozumím, ale nechci reagovat na domněnku. Nejdřív potřebuji jasně vědět, o co jde.",
        "Chápu, ale nechci hádat, co tím myslíš. Nejdřív to prosím upřesni.",
      ],
    };
  }

  if (family === "redirect" || family === "exit") {
    return {
      opener: formal ? ["Rozumím.", "Beru na vědomí."] : ["Chápu.", "Tady se zastavím."],
      reason: [
        "Tahle konverzace teď nepomáhá věcnému řešení.",
        "Nechci přidávat další napětí ani to řešit v nevhodném kanálu.",
      ],
      boundary: [
        "Tady v tom pokračovat nebudu.",
        "Tuhle konverzaci teď ukončím.",
        "V tomto kanálu to dál řešit nechci.",
      ],
      softener: ["Držme se prosím věcného postupu.", "Nechci to dál vyhrocovat."],
      nextStep: [
        "Prosím použijte vhodný kanál.",
        "Vrátím se k tomu, až to půjde řešit klidně.",
      ],
      closing: formal ? ["Děkuji za respektování."] : ["Díky za respektování."],
      pressureFollowUp: [
        "Rozumím, ale tady už pokračovat nebudu. Vraťme se k tomu jen ve vhodném kanálu a klidně.",
        "Chápu, ale tady už pokračovat nechci. Vrátím se k tomu jen v klidu.",
      ],
    };
  }

  return {
    opener: formal ? ["Dobrý den,", "Děkuji za pozvání."] : ["Díky za pozvání.", "Hele, díky."],
    reason: [
      "Nechci si vymýšlet důvody ani to zbytečně natahovat.",
      "Říkám to raději rovnou, aby v tom nebylo zbytečné očekávání.",
    ],
    boundary: [
      "Tentokrát do toho nepůjdu.",
      "Tohle teď nemohu přijmout.",
      "Moje odpověď je tentokrát ne.",
    ],
    softener: ["Vážím si toho, že jste na mě mysleli.", "Díky, že ses ozval."],
    nextStep: [
      "Nechám to tentokrát takhle.",
      `${address.please[0].toUpperCase()}${address.please.slice(1)}, ${address.respect} to.`,
    ],
    closing: formal ? ["Děkuji za pochopení."] : ["Díky za pochopení."],
    pressureFollowUp: [
      "Rozumím, že byste chtěli jinou odpověď, ale svoje rozhodnutí neměním.",
      "Chápu, že bys chtěl jinou odpověď, ale svoje rozhodnutí neměním.",
    ],
  };
}

function decorateOpeners(openers: string[], input: CzechPhraseInput): string[] {
  if (input.channelId === "voice_call" || input.channelId === "face_to_face") {
    return ["Řeknu to rovnou.", "Chci to říct klidně a jasně.", ...openers];
  }
  if (input.channelId === "work_chat") return ["Stručně:", "Díky za zprávu.", ...openers];
  if (input.toneId === "playful") return ["Beru, ale lehce brzda:", "Díky, jen to vezmu rovnou:", ...openers];
  if (input.toneId === "warm") return ["Díky, že to řešíme.", ...openers];
  return openers;
}

function decorateBoundaries(boundaries: string[], input: CzechPhraseInput): string[] {
  if (input.toneId === "assertive") {
    return [...boundaries, "Potřebuji, aby tohle bylo respektované.", "V tomhle mám jasno."];
  }
  if (input.toneId === "concise") return boundaries.slice(0, 2);
  return boundaries;
}

function decorateSofteners(softeners: string[], input: CzechPhraseInput): string[] {
  if (input.toneId === "apologetic") return ["Mrzí mě komplikace.", ...softeners];
  if (input.toneId === "soft") return ["Nechci kolem toho dělat napětí.", ...softeners];
  if (input.toneId === "playful") return ["Bez dramatu, jen realisticky.", ...softeners];
  return softeners;
}

function decorateNextSteps(nextSteps: string[], input: CzechPhraseInput): string[] {
  if (input.channelId === "email") return [...nextSteps, "Navrhnu další krok písemně."];
  if (input.channelId === "group_chat") return [...nextSteps, "Detaily případně dořešme mimo skupinu."];
  if (input.channelId === "professional_dm") return [...nextSteps, "Pošlu stručné potvrzení dalšího kroku."];
  return nextSteps;
}

function decorateClosings(closings: string[], input: CzechPhraseInput): string[] {
  if (input.channelId === "email") return [...closings, "S pozdravem"];
  if (input.toneId === "concise") return closings.slice(0, 1);
  return closings;
}
