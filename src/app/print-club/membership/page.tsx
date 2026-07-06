import type { Metadata } from "next";
import Link from "next/link";
import { MemberLoginForm } from "@/components/forms/MemberLoginForm";
import { PortalButton } from "@/components/forms/PortalButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  adminUpdateSubscriptionStatus,
  adminCancelSubscription,
  adminRemoveSubscription,
} from "./actions";

export const metadata: Metadata = { title: "Member Portal" };
export const dynamic = "force-dynamic";

type Subscription = {
  id: string;
  stripe_customer_id: string | null;
  status: string;
  created_at: string | null;
  current_period_end: string | null;
};

function StatusPill({ status }: { status: string }) {
  const colours: Record<string, string> = {
    active: "bg-moss/10 text-moss",
    trialing: "bg-moss/10 text-moss",
    cancelled: "bg-rust/10 text-rust",
    past_due: "bg-rust/10 text-rust",
    unpaid: "bg-rust/10 text-rust",
  };
  return (
    <span
      className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.08em] ${colours[status] ?? "bg-chalk text-graphite"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function fmt(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function MembershipPage() {
  /* ── 1. Resolve the current user without hard-redirecting ──────────────── */
  let user: { id: string; email?: string | null } | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    user = data.user ?? null;
  } catch {}

  /* ── 2. Not logged in — show login form ────────────────────────────────── */
  if (!user) {
    return (
      <section className="container-shell py-14 md:py-20">
        <div className="max-w-sm">
          <p className="label text-graphite mb-3">Print Club</p>
          <h1 className="font-title text-3xl mb-8">Member Portal</h1>
          <MemberLoginForm />
          <p className="mt-6 text-sm text-graphite">
            Not yet a member?{" "}
            <Link
              href="/print-club"
              className="underline underline-offset-4 hover:text-ink transition-colors"
            >
              Join Print Club
            </Link>
          </p>
        </div>
      </section>
    );
  }

  /* ── 3. Resolve admin flag + subscription data ─────────────────────────── */
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = !!user.email && adminEmails.includes(user.email.toLowerCase());

  let mySubscription: Subscription | null = null;
  let allSubscriptions: Subscription[] = [];

  try {
    const supabase = createSupabaseAdminClient();

    /* User's own subscription */
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profile?.stripe_customer_id) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id, stripe_customer_id, status, created_at, current_period_end")
        .eq("stripe_customer_id", profile.stripe_customer_id)
        .maybeSingle();
      mySubscription = sub ?? null;
    }

    /* Admin — all subscriptions */
    if (isAdmin) {
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("id, stripe_customer_id, status, created_at, current_period_end")
        .order("created_at", { ascending: false });
      allSubscriptions = subs ?? [];
    }
  } catch {}

  const isActive =
    mySubscription && ["active", "trialing"].includes(mySubscription.status);

  /* ── 4. Logged-in view ─────────────────────────────────────────────────── */
  return (
    <section className="container-shell py-14 md:py-20">
      <p className="label text-graphite mb-3">Print Club</p>
      <h1 className="font-title text-3xl mb-10">Member Portal</h1>

      {/* ── My subscription card */}
      <div className="max-w-2xl border border-line bg-chalk p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="grid gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
              Subscription
            </p>
            {mySubscription ? (
              <>
                <StatusPill status={mySubscription.status} />
                {mySubscription.current_period_end && (
                  <p className="text-xs text-graphite">
                    Renews {fmt(mySubscription.current_period_end)}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-graphite">No active subscription</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {isActive && <PortalButton />}
            {!mySubscription && (
              <ButtonLink href="/print-club">Join Print Club</ButtonLink>
            )}
          </div>
        </div>
      </div>

      {/* ── Admin section ─────────────────────────────────────────────────── */}
      {isAdmin && (
        <div className="mt-16 border-t border-line pt-10">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <p className="label text-graphite mb-1">Admin</p>
              <h2 className="font-title text-2xl">All Subscribers</h2>
            </div>
            <p className="text-sm text-graphite">
              {allSubscriptions.length} record
              {allSubscriptions.length !== 1 ? "s" : ""}
            </p>
          </div>

          {allSubscriptions.length === 0 ? (
            <p className="border border-line bg-chalk px-5 py-4 text-sm text-graphite">
              No subscriber records found.
            </p>
          ) : (
            <div className="grid gap-3">
              {allSubscriptions.map((sub) => (
                <div key={sub.id} className="border border-line bg-chalk p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Info */}
                    <div className="grid gap-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill status={sub.status} />
                        {sub.created_at && (
                          <span className="text-xs text-graphite">
                            Joined {fmt(sub.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs text-graphite truncate">
                        {sub.stripe_customer_id ?? "No Stripe ID"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Change status */}
                      <form action={adminUpdateSubscriptionStatus} className="flex items-center gap-1">
                        <input type="hidden" name="id" value={sub.id} />
                        <select
                          name="status"
                          defaultValue={sub.status}
                          className="focus-ring border border-line bg-paper px-2 py-1.5 text-xs"
                        >
                          <option value="active">Active</option>
                          <option value="trialing">Trialing</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="past_due">Past due</option>
                          <option value="unpaid">Unpaid</option>
                        </select>
                        <button
                          type="submit"
                          className="focus-ring border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition hover:border-ink hover:text-ink"
                        >
                          Update
                        </button>
                      </form>

                      {/* Cancel (only if not already cancelled) */}
                      {sub.status !== "cancelled" && (
                        <form action={adminCancelSubscription}>
                          <input type="hidden" name="id" value={sub.id} />
                          <button
                            type="submit"
                            className="focus-ring border border-line bg-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-rust transition hover:border-rust"
                          >
                            Cancel
                          </button>
                        </form>
                      )}

                      {/* Remove record entirely */}
                      <form action={adminRemoveSubscription}>
                        <input type="hidden" name="id" value={sub.id} />
                        <button
                          type="submit"
                          className="focus-ring border border-rust bg-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-rust transition hover:bg-rust hover:text-chalk"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-5 text-xs text-graphite">
            These actions update the database only. To cancel billing directly,
            use the{" "}
            <a
              href="https://dashboard.stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-ink"
            >
              Stripe dashboard
            </a>
            .
          </p>
        </div>
      )}
    </section>
  );
}
