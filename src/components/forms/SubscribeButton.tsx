"use client";

import { useState } from "react";

type Region = "uk" | "intl";

export function SubscribeButton() {
  const [region, setRegion] = useState<Region>("uk");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function subscribe() {
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

  return (
    <div className="grid gap-3">
      {/* Region selector */}
      <div className="flex border border-chalk/20">
        <button
          type="button"
          onClick={() => setRegion("uk")}
          className={[
            "flex-1 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
            region === "uk"
              ? "bg-chalk text-ink"
              : "text-chalk/50 hover:text-chalk",
          ].join(" ")}
        >
          UK — £8/mo
        </button>
        <button
          type="button"
          onClick={() => setRegion("intl")}
          className={[
            "flex-1 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
            region === "intl"
              ? "bg-chalk text-ink"
              : "text-chalk/50 hover:text-chalk",
          ].join(" ")}
        >
          International — £10/mo
        </button>
      </div>

      <button
        type="button"
        onClick={subscribe}
        disabled={loading}
        className="focus-ring min-h-11 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite disabled:opacity-60"
      >
        {loading ? "Opening checkout…" : "Join Print Club"}
      </button>

      {error ? <p className="text-sm text-rust">{error}</p> : null}
    </div>
  );
}
