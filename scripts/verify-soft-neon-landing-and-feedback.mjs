import fs from "node:fs";

const page = fs.readFileSync("app/[lang]/page.tsx", "utf8");
const generator = fs.readFileSync("components/InteractiveGenerator.tsx", "utf8");
const pricing = fs.readFileSync("components/PricingCards.tsx", "utf8");
const packs = fs.readFileSync("components/CreditPacks.tsx", "utf8");

function fail(message) {
  console.error(`Soft neon landing verification failed: ${message}`);
  process.exit(1);
}

const requiredLandingCopy = [
  "Na zprávy, které nechceš řešit hned.",
  "For messages you don’t want to handle right away.",
  "Pracovní zpoždění",
  "Řekni realistický termín bez paniky.",
  "Milé odmítnutí",
  "Odmítni pozvání bez dlouhých výmluv.",
  "Hranice",
  "Nastav hranici jasně, ale bez tvrdého tónu.",
  "Omluva",
  "Převezmi odpovědnost a navrhni další krok.",
  "Trapné randění",
  "Zpomal nebo ukonči konverzaci lidsky.",
  "Rodinný tlak",
  "Nastav limit bez zbytečné eskalace.",
  "Přesměrování",
  "Vrať konverzaci k užitečnému tématu.",
  "Work delays",
  "Share a realistic timeline without panic.",
  "Kind declines",
  "Say no without long excuses.",
  "Boundaries",
  "Be clear without sounding harsh.",
  "Apologies",
  "Take responsibility and suggest the next step.",
  "Awkward dating",
  "Slow down or end the conversation humanly.",
  "Family pressure",
  "Set a limit without unnecessary escalation.",
  "Redirects",
  "Bring the conversation back to something useful.",
  "dog ate my homework",
  "dog locked child outside",
  "squirrel in chimney",
  "goldfish drowning",
  "pea stuck in nose",
  "Důvěra a bezpečí",
  "Trust and AI",
  "One-time reply packs",
];

for (const text of requiredLandingCopy) {
  if (!page.includes(text)) fail(`missing landing copy: ${text}`);
}

const requiredChipCopy = [
  "Sedí ti to?",
  "Sedí",
  "Nesedí",
  "Jiná verze",
  "Chceš to doladit?",
  "Jemnější",
  "Důraznější",
  "Kratší",
  "Přirozenější",
  "Více jako já",
  "Méně trapné",
  "Does this feel right?",
  "Feels right",
  "Not quite",
  "Try another",
  "Tune it",
  "Softer",
  "Stronger",
  "Shorter",
  "More natural",
  "More like me",
  "Less awkward",
  "If they push back",
];

for (const text of requiredChipCopy) {
  if (!generator.includes(text)) fail(`missing reply chip copy: ${text}`);
}

for (const source of [page, generator, pricing, packs]) {
  if (!source.includes("#B8FF4D")) fail("acid green accent #B8FF4D must be present in polished UI.");
}

if (!generator.includes('action === "try_again"') || !generator.includes("disabled={isUnavailable}")) {
  fail("try-another feedback must be disabled until regeneration exists.");
}

if (!generator.includes("ReplyTuningChips") || !generator.includes("disabled")) {
  fail("tuning chips must be rendered as disabled prepared controls.");
}

if (!generator.includes("navigator.clipboard.writeText(text)")) {
  fail("specific reply copy behavior is missing.");
}

if (!page.includes("<PricingCards lang={lang} />") || !page.includes("<CreditPacks lang={lang} />")) {
  fail("localized pricing and pack UI should receive the active route language.");
}

console.log("OK: soft neon landing and feedback UI verified");
