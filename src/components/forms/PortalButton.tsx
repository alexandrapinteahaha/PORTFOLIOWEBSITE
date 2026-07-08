"use client";

import { useState } from "react";

export function PortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function openPortal() {
    setLoading(true);
    setError("");
    const response = await fetch("/api/stripe/create-portal-session", {
      method: "POST"
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Portal could not be opened.");
      return;
    }

    window.location.assign(payload.url);
  }

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={openPortal}
        disabled={loading}
        className="focus-ring btn-fill min-h-11 border border-ink bg-ink px-8 text-xs font-semibold uppercase tracking-[0.18em] text-chalk transition hover:border-rust disabled:opacity-60"
      >
        {loading ? "Opening portal" : "Manage subscription"}
      </button>
      {error ? <p className="text-sm text-rust">{error}</p> : null}
    </div>
  );
}
