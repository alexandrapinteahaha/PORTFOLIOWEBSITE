"use client";

import { useState } from "react";

type Region = "uk" | "intl";

async function checkout(
  region: Region,
  setLoading: (v: boolean) => void,
  setError: (v: string) => void
) {
  setLoading(true);
  setError("");

  const response = await fetch("/api/stripe/create-checkout-session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      productId: `print-club-subscription-${region}`,
      quantity: 1,
    }),
  });

  const payload = await response.json();
  setLoading(false);

  if (response.status === 401) {
    window.location.assign("/print-club/membership");
    return;
  }

  if (!response.ok) {
    setError(payload.error ?? "Subscription checkout could not be started.");
    return;
  }

  window.location.assign(payload.url);
}

export function SubscribeButton() {
  const [loading, setLoading] = useState<Region | null>(null);
  const [error, setError] = useState("");

  function handleClick(region: Region) {
    if (loading) return;
    checkout(
      region,
      (v) => setLoading(v ? region : null),
      setError
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex gap-8">
        <button
          type="button"
          onClick={() => handleClick("uk")}
          disabled={!!loading}
          className="focus-ring border border-ink bg-ink px-8 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-chalk transition hover:bg-graphite disabled:opacity-60"
        >
          {loading === "uk" ? "Opening…" : "UK Members"}
        </button>
        <button
          type="button"
          onClick={() => handleClick("intl")}
          disabled={!!loading}
          className="focus-ring border border-ink px-8 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-ink transition hover:bg-ink hover:text-chalk disabled:opacity-60"
        >
          {loading === "intl" ? "Opening…" : "International Members"}
        </button>
      </div>
      {error ? <p className="text-sm text-rust">{error}</p> : null}
    </div>
  );
}
