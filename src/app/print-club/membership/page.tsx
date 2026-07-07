import type { Metadata } from "next";
import Link from "next/link";
import { MemberAuthPanel } from "@/components/forms/MemberAuthPanel";
import { PortalButton } from "@/components/forms/PortalButton";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { FileUploadForm } from "./FileUploadForm";
import { ProfileEditForm } from "./ProfileEditForm";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  adminUpdateSubscriptionStatus,
  adminCancelSubscription,
  adminRemoveSubscription,
  deleteSubscriberFile,
} from "./actions";

export const metadata: Metadata = { title: "Member Portal" };
export const dynamic = "force-dynamic";

/* ── Types ─────────────────────────────────────────────────────────────────── */

type Subscription = {
  id: string;
  stripe_customer_id: string | null;
  status: string;
  created_at: string | null;
  current_period_end: string | null;
};

type SubscriberRow = Subscription & {
  email: string;
  name: string;
  birthday_month: number | null;
  shipping_address: string;
  billing_address: string;
};

type StorageFile = {
  name: string;
  created_at: string | null;
  signedUrl: string;
};

/* ── Helpers ────────────────────────────────────────────────────────────────── */

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

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function monthName(n: number | null) {
  if (!n) return null;
  return MONTH_NAMES[n - 1] ?? null;
}

function fileLabel(name: string) {
  // "january-2025-digital-print-1748392091234.pdf" → "january-2025-digital-print"
  const withoutExt = name.replace(/\.[^.]+$/, "");
  const withoutTimestamp = withoutExt.replace(/-\d{10,}$/, "");
  return withoutTimestamp.replace(/-/g, " ");
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

export default async function MembershipPage({
  searchParams,
}: {
  searchParams: Promise<{ subscribed?: string }>;
}) {
  const params = await searchParams;
  const justSubscribed = params.subscribed === "true";

  /* 1. Resolve current user without hard-redirecting */
  let user: { id: string; email?: string | null } | null = null;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    user = data.user ?? null;
  } catch {}

  /* 2. Not logged in */
  if (!user) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <p className="label text-graphite mb-3 text-center">Print Club</p>
          <h1 className="font-title text-3xl mb-8 text-center">Member Portal</h1>
          <MemberAuthPanel />
        </div>
      </section>
    );
  }

  /* 3. Admin check */
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const isAdmin = !!user.email && adminEmails.includes(user.email.toLowerCase());

  /* 4. Fetch data */
  let mySubscription: Subscription | null = null;
  let myProfile = { name: "", birthday_month: null as number | null, shipping_address: "", billing_address: "" };
  let allSubscribers: SubscriberRow[] = [];
  let storageFiles: StorageFile[] = [];

  try {
    const supabase = createSupabaseAdminClient();

    /* Own subscription + profile */
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, name, birthday_month, shipping_address, billing_address")
      .eq("id", user.id)
      .single();

    if (profile) {
      myProfile = {
        name: (profile as { name?: string }).name ?? "",
        birthday_month: (profile as { birthday_month?: number }).birthday_month ?? null,
        shipping_address: (profile as { shipping_address?: string }).shipping_address ?? "",
        billing_address: (profile as { billing_address?: string }).billing_address ?? "",
      };
    }

    if (profile?.stripe_customer_id) {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id, stripe_customer_id, status, created_at, current_period_end")
        .eq("stripe_customer_id", profile.stripe_customer_id)
        .maybeSingle();
      mySubscription = sub ?? null;
    }

    /* Admin: all subscribers with emails */
    if (isAdmin) {
      const [{ data: subs }, { data: profiles }, { data: authData }] =
        await Promise.all([
          supabase
            .from("subscriptions")
            .select("id, stripe_customer_id, status, created_at, current_period_end")
            .order("created_at", { ascending: false }),
          supabase.from("profiles").select("id, stripe_customer_id, name, birthday_month, shipping_address, billing_address"),
          supabase.auth.admin.listUsers({ perPage: 1000 }),
        ]);

      const emailMap = new Map(
        (authData?.users ?? []).map((u) => [u.id, u.email ?? ""])
      );
      // stripe_customer_id → user_id
      const stripeToUserId = new Map(
        (profiles ?? [])
          .filter((p) => p.stripe_customer_id)
          .map((p) => [p.stripe_customer_id as string, p.id as string])
      );

      allSubscribers = (subs ?? []).map((sub) => {
        const profile = (profiles ?? []).find(
          (p) => p.stripe_customer_id === sub.stripe_customer_id
        );
        const userId = profile?.id ?? stripeToUserId.get(sub.stripe_customer_id ?? "");
        return {
          ...sub,
          email: userId ? (emailMap.get(userId) ?? "—") : "—",
          name: (profile as { name?: string } | undefined)?.name ?? "—",
          birthday_month: (profile as { birthday_month?: number } | undefined)?.birthday_month ?? null,
          shipping_address: (profile as { shipping_address?: string } | undefined)?.shipping_address ?? "—",
          billing_address: (profile as { billing_address?: string } | undefined)?.billing_address ?? "—",
        };
      });
    }

    /* Files for admin or active subscriber */
    const isActive =
      mySubscription && ["active", "trialing"].includes(mySubscription.status);

    if (isAdmin || isActive) {
      const { data: rawFiles } = await supabase.storage
        .from("subscriber-files")
        .list("", { sortBy: { column: "created_at", order: "desc" }, limit: 200 });

      if (rawFiles && rawFiles.length > 0) {
        const { data: urlData } = await supabase.storage
          .from("subscriber-files")
          .createSignedUrls(rawFiles.map((f) => f.name), 3600);

        storageFiles = rawFiles.map((file) => ({
          name: file.name,
          created_at: (file as { created_at?: string }).created_at ?? null,
          signedUrl:
            urlData?.find((u) => u.path === file.name)?.signedUrl ?? "",
        }));
      }
    }
  } catch {}

  const isActive =
    mySubscription && ["active", "trialing"].includes(mySubscription.status);

  /* 5. Render */
  return (
    <section className="container-shell py-14 md:py-20">
      <p className="label text-graphite mb-3">Print Club</p>
      <h1 className="font-title text-3xl mb-10">Member Portal</h1>

      {justSubscribed && (
        <div className="mb-8 max-w-2xl border border-moss bg-moss/5 px-5 py-4">
          <p className="text-sm font-semibold text-moss">Welcome to Print Club!</p>
          <p className="mt-1 text-sm text-graphite">
            Your subscription is being set up — it may take a moment to appear below.
            You&apos;ll receive a confirmation email from Stripe shortly.
          </p>
        </div>
      )}

      {/* ── My subscription card ─────────────────────────────────────────── */}
      <div className="max-w-2xl border border-line bg-chalk p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div className="grid gap-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
              My Subscription
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

      {/* ── My details (all logged-in subscribers, not admin) ────────────── */}
      {!isAdmin && (
        <div className="mt-12 max-w-2xl border-t border-line pt-10">
          <h2 className="font-title text-xl mb-2">My Details</h2>
          <p className="text-sm text-graphite mb-6">
            Update your name, shipping address, and billing address. We use your
            birthday month to send a bonus print.
          </p>
          <ProfileEditForm initial={myProfile} />
        </div>
      )}

      {/* ── Member downloads (active non-admin subscribers) ──────────────── */}
      {!isAdmin && isActive && (
        <div className="mt-12 max-w-2xl">
          <h2 className="font-title text-xl mb-5">Member Downloads</h2>
          {storageFiles.length === 0 ? (
            <p className="border border-line bg-chalk px-5 py-4 text-sm text-graphite">
              No files available yet — check back after your first shipment.
            </p>
          ) : (
            <div className="grid gap-2">
              {storageFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between gap-4 border border-line bg-chalk px-5 py-3"
                >
                  <p className="text-sm capitalize">{fileLabel(file.name)}</p>
                  <a
                    href={file.signedUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring shrink-0 border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition hover:border-ink hover:text-ink"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Admin section ────────────────────────────────────────────────── */}
      {isAdmin && (
        <>
          {/* All subscribers */}
          <div className="mt-16 border-t border-line pt-10">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p className="label text-graphite mb-1">Admin</p>
                <h2 className="font-title text-2xl">All Subscribers</h2>
              </div>
              <p className="text-sm text-graphite">
                {allSubscribers.length} record
                {allSubscribers.length !== 1 ? "s" : ""}
              </p>
            </div>

            {allSubscribers.length === 0 ? (
              <p className="border border-line bg-chalk px-5 py-4 text-sm text-graphite">
                No subscriber records found.
              </p>
            ) : (
              <div className="grid gap-3">
                {allSubscribers.map((sub) => (
                  <div key={sub.id} className="border border-line bg-chalk p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      {/* Info */}
                      <div className="grid gap-1.5 min-w-0">
                        {/* Name + email */}
                        <div>
                          {sub.name !== "—" && (
                            <p className="text-sm font-semibold text-ink">{sub.name}</p>
                          )}
                          <p className="text-xs text-graphite truncate">{sub.email}</p>
                        </div>

                        {/* Status + dates */}
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusPill status={sub.status} />
                          {sub.created_at && (
                            <span className="text-xs text-graphite">
                              Joined {fmt(sub.created_at)}
                            </span>
                          )}
                          {sub.current_period_end && (
                            <span className="text-xs text-graphite">
                              · renews {fmt(sub.current_period_end)}
                            </span>
                          )}
                        </div>

                        {/* Birthday + shipping */}
                        <div className="flex flex-wrap gap-x-5 gap-y-1">
                          {monthName(sub.birthday_month) && (
                            <p className="text-xs text-graphite">
                              <span className="font-semibold text-ink">Birthday:</span>{" "}
                              {monthName(sub.birthday_month)}
                            </p>
                          )}
                          {sub.shipping_address !== "—" && (
                            <p className="text-xs text-graphite whitespace-pre-line">
                              <span className="font-semibold text-ink">Ships to:</span>{" "}
                              {sub.shipping_address}
                            </p>
                          )}
                        </div>

                        <p className="font-mono text-xs text-graphite/50 truncate">
                          {sub.stripe_customer_id ?? "No Stripe ID"}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Change status */}
                        <form
                          action={adminUpdateSubscriptionStatus}
                          className="flex items-center gap-1"
                        >
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

          {/* File management */}
          <div className="mt-16 border-t border-line pt-10">
            <p className="label text-graphite mb-1">Admin</p>
            <h2 className="font-title text-2xl mb-8">Subscriber Files</h2>

            {/* Upload */}
            <div className="mb-10">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] mb-4">
                Upload New File
              </h3>
              <FileUploadForm />
            </div>

            {/* Existing files */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] mb-4">
                Uploaded Files
                {storageFiles.length > 0 && (
                  <span className="ml-2 font-normal normal-case text-graphite">
                    ({storageFiles.length})
                  </span>
                )}
              </h3>

              {storageFiles.length === 0 ? (
                <p className="border border-line bg-chalk px-5 py-4 text-sm text-graphite">
                  No files uploaded yet.
                </p>
              ) : (
                <div className="grid gap-2">
                  {storageFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between gap-4 border border-line bg-chalk px-5 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm capitalize">{fileLabel(file.name)}</p>
                        <p className="font-mono text-xs text-graphite truncate">
                          {file.name}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <a
                          href={file.signedUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring border border-line px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] transition hover:border-ink hover:text-ink"
                        >
                          Preview
                        </a>
                        <form action={deleteSubscriberFile}>
                          <input type="hidden" name="path" value={file.name} />
                          <button
                            type="submit"
                            className="focus-ring border border-rust bg-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-rust transition hover:bg-rust hover:text-chalk"
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
