"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function MemberLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
        return;
      }
      window.location.assign("/print-club/membership");
    } catch {
      setMessage("Sign in is not yet configured on this deployment. Please check back soon or contact alexandrapinteaart@gmail.com.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={signIn} className="grid gap-4">
      <label className="grid gap-2 text-sm">
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          autoComplete="email"
          className="focus-ring min-h-11 border border-line bg-paper px-3 text-sm"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Password
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          autoComplete="current-password"
          className="focus-ring min-h-11 border border-line bg-paper px-3 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="focus-ring min-h-11 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk transition hover:bg-graphite disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
      {message && <p className="text-sm text-rust">{message}</p>}
    </form>
  );
}
