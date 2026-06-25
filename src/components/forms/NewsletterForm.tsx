"use client";

import { useActionState } from "react";
import { submitNewsletter } from "@/app/actions/newsletter";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [state, formAction, pending] = useActionState(submitNewsletter, {
    ok: false,
    message: ""
  });

  return (
    <form action={formAction} className="grid gap-3">
      <label className="sr-only" htmlFor={dark ? "footer-email" : "newsletter-email"}>
        Email address
      </label>
      <input
        id={dark ? "footer-email" : "newsletter-email"}
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="focus-ring min-h-11 border border-line bg-chalk px-3 text-sm text-ink"
      />
      <label className="flex gap-2 text-xs leading-5 text-graphite has-[:checked]:text-ink">
        <input className="mt-1" type="checkbox" name="consent" required />
        I agree to receive occasional updates about new work, Print Club releases,
        and future drops.
      </label>
      <button
        type="submit"
        disabled={pending}
        className="focus-ring min-h-11 border border-current px-4 text-sm font-semibold uppercase tracking-[0.1em] disabled:opacity-60"
      >
        {pending ? "Signing up" : "Sign up"}
      </button>
      {state.message ? (
        <p className={state.ok ? "text-sm text-moss" : "text-sm text-rust"}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
