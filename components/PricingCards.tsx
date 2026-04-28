import { pricingPlans } from "@/lib/pricing";

export function PricingCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {pricingPlans.map((plan) => (
        <article
          key={plan.name}
          className={[
            "rounded-3xl border p-6 shadow-sm transition",
            plan.highlighted
              ? "border-black bg-black text-white shadow-xl"
              : "border-neutral-200 bg-white text-neutral-950",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p
                className={[
                  "mt-2 text-sm leading-6",
                  plan.highlighted ? "text-neutral-300" : "text-neutral-600",
                ].join(" ")}
              >
                {plan.description}
              </p>
            </div>
            {plan.highlighted ? (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                Best
              </span>
            ) : null}
          </div>

          <div className="mt-6">
            <p className="text-3xl font-bold tracking-tight">{plan.price}</p>
            <p
              className={[
                "mt-2 text-sm",
                plan.highlighted ? "text-neutral-300" : "text-neutral-500",
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
              "mt-8 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition",
              plan.highlighted
                ? "bg-white text-black hover:bg-neutral-200"
                : "bg-neutral-950 text-white hover:bg-neutral-800",
            ].join(" ")}
            type="button"
          >
            {plan.name === "Free" ? "Vyzkoušet zdarma" : plan.name === "Emergency" ? "Koupit krizově" : "Vybrat plán"}
          </button>
        </article>
      ))}
    </div>
  );
}
