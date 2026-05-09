"use client";

import { pricingPlans } from "@/lib/pricing";
import { useLang } from "@/components/i18n/LanguageProvider";

const englishPlans = [
  {
    name: "Free",
    price: "0 Kč",
    description: "For a quick try without commitment.",
    limit: "2 free situations, then 1 situation per week",
    features: ["Core tones", "Finished reply with variants", "Czech and English", "Light history"],
  },
  {
    name: "Starter",
    price: "79 Kč / month",
    description: "For occasional messages when you do not want to think through every line.",
    limit: "20 situations per month",
    features: ["Less awkward", "No over-explaining", "Core tones", "Work, school, and everyday life"],
  },
  {
    name: "Pro",
    price: "149 Kč / month",
    description: "The main plan for fast, safely worded replies without overdoing it.",
    limit: "45 situations per month",
    badge: "Most popular",
    highlighted: true,
    features: ["All tones", "Follow-up tuning", "History", "Work / dating / client modes", "More natural phrasing"],
  },
  {
    name: "Power",
    price: "299 Kč / month",
    description: "For frequent work, client, and personal situations.",
    limit: "100 situations per month",
    features: ["Templates", "Saved profiles", "Heavy-use modes", "More human wording"],
  },
];

export function PricingCards() {
  const { lang } = useLang();
  const plans = lang === "cs" ? pricingPlans : englishPlans;
  const cta = lang === "cs" ? "Vybrat plán" : "Choose plan";
  const freeCta = lang === "cs" ? "Vyzkoušet zdarma" : "Try free";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {plans.map((plan) => (
        <article
          key={plan.name}
          className={[
            "relative overflow-hidden rounded-[2rem] border p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl",
            plan.highlighted
              ? "border-[#B8FF4D] bg-[#151821] text-white shadow-2xl shadow-[#B8FF4D]/20 ring-4 ring-[#B8FF4D]/15"
              : "border-[#111218]/[0.08] bg-white text-[#111218] hover:shadow-[#111218]/10",
          ].join(" ")}
        >
          {plan.highlighted ? (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(90deg,rgba(184,255,77,0.2),rgba(255,255,255,0.05),rgba(184,255,77,0))]" />
          ) : null}
          <div className="relative flex min-h-28 items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black">{plan.name}</h3>
              <p
                className={[
                  "mt-3 text-sm leading-6",
                  plan.highlighted ? "text-white/68" : "text-[#5F6673]",
                ].join(" ")}
              >
                {plan.description}
              </p>
            </div>
            {plan.highlighted ? (
              <span className="shrink-0 rounded-full bg-[#B8FF4D] px-3 py-1 text-xs font-black text-[#111218] shadow-lg shadow-[#B8FF4D]/25">
                {plan.badge}
              </span>
            ) : null}
          </div>

          <div className="relative mt-6">
            <p className="text-3xl font-black tracking-normal">{plan.price}</p>
            <p className={["mt-2 text-sm", plan.highlighted ? "text-white/60" : "text-[#5F6673]"].join(" ")}>
              {plan.limit}
            </p>
          </div>

          <ul className="relative mt-6 space-y-3 text-sm">
            {plan.features.map((feature) => (
              <li key={feature} className="flex gap-2 leading-6">
                <span className={plan.highlighted ? "text-[#B8FF4D]" : "text-[#7DC914]"} aria-hidden="true">
                  ✓
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            className={[
              "relative mt-8 w-full rounded-full px-4 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-[#B8FF4D]/35",
              plan.highlighted
                ? "bg-[#B8FF4D] text-[#111218] hover:brightness-105"
                : "bg-[#111218] text-white hover:bg-[#262B36]",
            ].join(" ")}
            type="button"
          >
            {plan.name === "Free" ? freeCta : cta}
          </button>
        </article>
      ))}
    </div>
  );
}
