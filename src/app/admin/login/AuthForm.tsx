"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthForm() {
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      window.location.assign("/admin");
    } catch {
      setMessage("Supabase is not configured yet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={signIn} className="grid max-w-md gap-4 border border-line bg-chalk p-5">
      <label className="grid gap-2 text-sm">
        Email
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
          className="focus-ring min-h-11 border border-line bg-paper px-3"
        />
      </label>
      <label className="grid gap-2 text-sm">
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          required
          className="focus-ring min-h-11 border border-line bg-paper px-3"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="focus-ring min-h-11 border border-ink bg-ink px-5 text-sm font-semibold uppercase tracking-[0.1em] text-chalk disabled:opacity-60"
      >
        {loading ? "Signing in" : "Sign in"}
      </button>
      {message ? <p className="text-sm text-rust">{message}</p> : null}
    </form>
  );
}
