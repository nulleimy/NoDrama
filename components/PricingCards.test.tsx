import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PricingCards } from "./PricingCards";

vi.mock("@/components/CheckoutButton", () => ({
  CheckoutButton: ({
    children,
    sku,
  }: {
    children: ReactNode;
    sku: string;
  }) => (
    <button data-sku={sku} type="button">
      {children}
    </button>
  ),
}));

describe("PricingCards", () => {
  it("renders every plan and the Czech calls to action", () => {
    render(<PricingCards lang="cs" />);

    expect(screen.getAllByRole("article")).toHaveLength(4);

    for (const plan of ["Free", "Starter", "Pro", "Power"]) {
      expect(
        screen.getByRole("heading", {
          name: plan,
        })
      ).toBeInTheDocument();
    }

    expect(
      screen.getByRole("button", {
        name: "Vyzkoušet zdarma",
      })
    ).toBeInTheDocument();

    const paidButtons = screen.getAllByRole("button", {
      name: "Vybrat plán",
    });

    expect(paidButtons).toHaveLength(3);
    expect(
      paidButtons.map((button) => button.getAttribute("data-sku"))
    ).toEqual([
      "starter_monthly",
      "pro_monthly",
      "power_monthly",
    ]);
  });

  it("renders the English calls to action", () => {
    render(<PricingCards lang="en" />);

    expect(
      screen.getByRole("button", {
        name: "Try for free",
      })
    ).toBeInTheDocument();

    expect(
      screen.getAllByRole("button", {
        name: "Choose plan",
      })
    ).toHaveLength(3);
  });
});
