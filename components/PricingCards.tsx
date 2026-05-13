import { pricingPlans } from "@/lib/pricing";

export function PricingCards({ lang = "cs" }: { lang?: "cs" | "en" }) {
  const ctaLabel = lang === "cs" ? "Vybrat plán" : "Choose plan";
  const freeCtaLabel = lang === "cs" ? "Vyzkoušet zdarma" : "Try for free";

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-[#241f18]/10 bg-[#fffdf7]/85 p-4 text-[#171816] shadow-sm">
        <p className="text-sm font-semibold">Platíš za vyřešenou situaci, ne za klikání.</p>
        <p className="mt-1 text-sm text-[#645f54]">
          1 situace = hotová odpověď + varianty tónu + rychlé doladění.
        </p>
        <p className="mt-1 text-xs text-[#746d60]">Ceny jsou konečné pro zákazníka.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pricingPlans.map((plan) => (
          <article
            key={plan.name}
            className={[
              "group relative overflow-hidden rounded-[2rem] border p-6 shadow-sm transition duration-300 hover:-translate-y-1",
              plan.highlighted
                ? "border-[#B8FF4D]/45 bg-[#171816] text-white shadow-2xl shadow-[#B8FF4D]/10"
                : "border-[#241f18]/10 bg-[#fffdf7]/85 text-[#171816] shadow-[#241f18]/5 hover:border-[#B8FF4D]/40 hover:shadow-xl hover:shadow-[#B8FF4D]/10",
            ].join(" ")}
          >
            <div
              aria-hidden="true"
              className={[
                "absolute inset-x-6 top-0 h-px",
                plan.highlighted ? "bg-[#B8FF4D]/70" : "bg-[#b9a9ff]/40",
              ].join(" ")}
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p
                  className={[
                    "mt-2 text-sm leading-6",
                    plan.highlighted ? "text-[#e8e5d9]" : "text-[#645f54]",
                  ].join(" ")}
                >
                  {plan.description}
                </p>
              </div>
              {plan.highlighted ? (
                <span className="rounded-full bg-[#B8FF4D] px-3 py-1 text-xs font-black text-[#171816]">
                  {plan.badge}
                </span>
              ) : null}
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold tracking-tight">{plan.price}</p>
              <p
                className={[
                  "mt-2 text-sm",
                  plan.highlighted ? "text-[#d9d5c6]" : "text-[#746d60]",
                ].join(" ")}
              >
                {plan.limit}
              </p>
            </div>

            <ul className="mt-6 space-y-3 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <span aria-hidden="true">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={[
                "mt-8 w-full rounded-full px-4 py-3 text-sm font-black transition focus:outline-none focus:ring-4 focus:ring-[#B8FF4D]/35",
                plan.highlighted
                  ? "bg-[#B8FF4D] text-[#171816] hover:bg-[#d8ff8a]"
                  : "bg-[#171816] text-white hover:-translate-y-0.5 hover:bg-[#2a2d25]",
              ].join(" ")}
              type="button"
            >
              {plan.name === "Free" ? freeCtaLabel : ctaLabel}
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
