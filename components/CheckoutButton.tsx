"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics/trackEvent";

export function CheckoutButton({
  sku,
  children,
  className,
  eventSource = "pricing",
}: {
  sku: string;
  children: React.ReactNode;
  className?: string;
  eventSource?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    if (loading) return;

    setLoading(true);
    setError(null);

    void trackEvent("pricing_cta_clicked", {
      sku,
      source: eventSource,
    });

    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sku }),
      });

      const data = (await response.json()) as {
        ok?: boolean;
        checkoutUrl?: string;
        message?: string;
      };

      if (!response.ok || !data.ok || !data.checkoutUrl) {
        throw new Error(data.message || "Checkout není dostupný.");
      }

      window.location.href = data.checkoutUrl;
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout se nepodařilo spustit."
      );
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={startCheckout}
        disabled={loading}
        className={className}
      >
        {loading ? "Přesměrovávám na platbu..." : children}
      </button>
      {error ? <p className="mt-2 text-xs font-semibold text-red-600">{error}</p> : null}
    </div>
  );
}
