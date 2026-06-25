"use client";

import { useState } from "react";

export function SubscribeButton() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        productId: "print-club-subscription",
        quantity: 1
      })
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Subscription checkout could not be started.");
      return;
    }

    window.location.assign(payload.url);
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={subscribe}
        disabled={loading}
        className="focus-ring min-h-11 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk disabled:opacity-60"
      >
        {loading ? "Opening checkout" : "Join Print Club"}
      </button>
      {error ? <p className="text-sm text-rust">{error}</p> : null}
    </div>
  );
}
