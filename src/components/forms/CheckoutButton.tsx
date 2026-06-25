"use client";

import { useState } from "react";

export function CheckoutButton({
  productId,
  disabled,
  label = "Buy now"
}: {
  productId: string;
  disabled?: boolean;
  label?: string;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ productId, quantity: 1 })
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Checkout could not be started.");
      return;
    }

    window.location.assign(payload.url);
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={startCheckout}
        disabled={disabled || loading}
        className="focus-ring min-h-11 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Opening checkout" : label}
      </button>
      {error ? <p className="text-sm text-rust">{error}</p> : null}
    </div>
  );
}
