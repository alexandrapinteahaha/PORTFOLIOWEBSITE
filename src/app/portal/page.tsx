import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { requestPortalMagicLink } from "./actions";

export const metadata: Metadata = { title: "Commission Portal — Alexandra Pintea" };

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  // If already authenticated, go straight to dashboard
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect("/portal/dashboard");
  } catch {}

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6 py-16">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="mb-10">
          <p className="label text-graphite">Alexandra Pintea</p>
          <h1 className="mt-2 font-title text-3xl font-bold tracking-tight">
            Commission Portal
          </h1>
        </div>

        {sent ? (
          /* Success state — generic message regardless of whether email exists */
          <div className="border border-line bg-chalk p-6">
            <p className="font-title text-sm font-bold uppercase tracking-[0.1em]">
              Check your email
            </p>
            <p className="mt-3 text-sm leading-7 text-graphite">
              If a portal is associated with this address, you&apos;ll receive a
              secure access link shortly. Check your inbox and spam folder.
            </p>
            <p className="mt-4 text-xs text-graphite/60">
              The link will expire after 1 hour.
            </p>
          </div>
        ) : (
          <>
            {error === "no_access" && (
              <div className="mb-6 border border-line bg-chalk p-4">
                <p className="text-sm leading-6 text-graphite">
                  No commission portal is associated with this account.
                  Please contact Alexandra directly if you believe this is an error.
                </p>
              </div>
            )}

            <p className="mb-6 text-sm leading-7 text-graphite">
              Enter the email address associated with your commission to receive
              a secure access link.
            </p>

            <form action={requestPortalMagicLink} className="grid gap-4">
              <label className="grid gap-1.5 text-xs uppercase tracking-[0.1em] text-graphite">
                Email address
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-graphite/40 focus:border-ink focus:outline-none"
                />
              </label>

              <button
                type="submit"
                className="border border-ink bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-chalk transition hover:bg-graphite"
              >
                Send access link
              </button>
            </form>

            <p className="mt-8 text-xs leading-5 text-graphite/50">
              This portal is for invited commission clients only.{" "}
              <a href="/commissions" className="underline underline-offset-4 hover:text-ink">
                Enquire about a commission →
              </a>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
