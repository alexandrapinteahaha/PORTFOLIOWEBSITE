"use client";

import { useState } from "react";
import Link from "next/link";

export function CheckoutButton({
  productId,
  disabled,
  label = "Buy now",
  isOriginal = false,
}: {
  productId: string;
  disabled?: boolean;
  label?: string;
  isOriginal?: boolean;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

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

  const isBlocked = disabled || loading || (isOriginal && !acknowledged);

  return (
    <div className="grid gap-3 w-full">
      {isOriginal && !disabled && (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-0.5 shrink-0 h-3.5 w-3.5 accent-ink"
          />
          <span className="text-xs leading-5 text-graphite">
            I acknowledge that this acquisition may be subject to additional{" "}
            <Link
              href="/original-artwork-purchase-policy"
              target="_blank"
              className="underline underline-offset-4 hover:text-ink transition-colors"
            >
              Original Artwork Purchase Terms
            </Link>{" "}
            and, where applicable, a separate Contract of Sale.
          </span>
        </label>
      )}
      <button
        type="button"
        onClick={startCheckout}
        disabled={isBlocked}
        className="focus-ring min-h-11 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Opening checkout" : label}
      </button>
      {error ? <p className="text-sm text-rust">{error}</p> : null}
    </div>
  );
}
