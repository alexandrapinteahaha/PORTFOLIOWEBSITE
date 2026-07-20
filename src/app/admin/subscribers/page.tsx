import type { Metadata } from "next";
import { archiveSubscriber } from "@/app/admin/actions";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Admin: Subscribers" };

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function isUK(address: string | null): boolean {
  if (!address) return false;
  const lower = address.toLowerCase();
  if (["uk", "united kingdom", "england", "scotland", "wales", "northern ireland", "great britain"]
    .some((kw) => lower.includes(kw))) return true;
  return /\b[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}\b/i.test(address);
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const ACTIVE_STATUSES = ["active", "trialing"];
const CANCELLED_STATUSES = ["canceled", "cancelled", "unpaid", "past_due", "incomplete_expired"];

type Subscriber = {
  id: string;
  name: string | null;
  email: string;
  birthday_month: number | null;
  shipping_address: string | null;
  stripe_customer_id: string;
  status: string;
  current_period_end: string | null;
  joined_at: string | null;
};

function SubscriberCard({ sub, currentMonth }: { sub: Subscriber; currentMonth: number }) {
  const isBirthday = sub.birthday_month !== null && sub.birthday_month === currentMonth;
  const isCancelled = CANCELLED_STATUSES.includes(sub.status);
  const isActive = ACTIVE_STATUSES.includes(sub.status);
  const displayName = sub.name ?? sub.email;
  const birthdayMonthName = sub.birthday_month ? MONTHS[sub.birthday_month - 1] : null;

  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-6">
        <div className="grid gap-3 min-w-0">

          {/* Name */}
          <p className={[
            "font-title text-2xl font-bold leading-tight",
            isCancelled ? "text-red-600" : "text-ink",
          ].join(" ")}>
            {isBirthday && <span className="mr-2">🎂</span>}
            {displayName}
          </p>

          {/* Status badge */}
          <div className="flex items-center gap-3">
            {isActive && (
              <span className="inline-block border-2 border-green-600 bg-white px-3 py-1 text-xs font-bold text-green-600 uppercase tracking-[0.1em]">
                Active
              </span>
            )}
            {isCancelled && (
              <span className="inline-block border-2 border-red-600 bg-white px-3 py-1 text-xs font-bold text-red-600 uppercase tracking-[0.1em]">
                Cancelled
              </span>
            )}
            {!isActive && !isCancelled && (
              <span className="inline-block border border-line bg-white px-3 py-1 text-xs font-bold text-graphite uppercase tracking-[0.1em]">
                {sub.status}
              </span>
            )}
          </div>

          {/* Joined + renewal/end date */}
          <p className="text-xs text-graphite">
            <span className="font-semibold uppercase tracking-[0.08em]">Joined</span>{" "}
            {formatDate(sub.joined_at)}
            {sub.current_period_end && (
              <>
                <span className="mx-2 text-line">·</span>
                <span className="font-semibold uppercase tracking-[0.08em]">
                  {isCancelled ? "Ended" : "Renews"}
                </span>{" "}
                {formatDate(sub.current_period_end)}
              </>
            )}
          </p>

          {/* Birthday month */}
          <p className="text-xs text-graphite">
            <span className="font-semibold uppercase tracking-[0.08em]">Birthday</span>{" "}
            {birthdayMonthName ?? "Not set"}
            {isBirthday && " 🎂"}
          </p>

          {/* Address */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-graphite mb-1">Address</p>
            {sub.shipping_address ? (
              <p className="text-xs text-graphite whitespace-pre-line leading-5">
                {sub.shipping_address}
              </p>
            ) : (
              <p className="text-xs text-graphite/50">No address provided</p>
            )}
          </div>

          {/* Email */}
          <p className="text-xs text-graphite/50">{sub.email}</p>
        </div>

        {/* Remove button — only for cancelled */}
        {isCancelled && (
          <form action={archiveSubscriber} className="shrink-0">
            <input type="hidden" name="stripe_customer_id" value={sub.stripe_customer_id} />
            <button
              type="submit"
              className="border border-red-300 px-4 py-1.5 text-xs text-red-500 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
            >
              Remove
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Section({ title, subscribers, currentMonth }: {
  title: string;
  subscribers: Subscriber[];
  currentMonth: number;
}) {
  if (subscribers.length === 0) return null;
  const activeCount = subscribers.filter((s) => ACTIVE_STATUSES.includes(s.status)).length;

  return (
    <div className="border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line bg-chalk px-6 py-3">
        <p className="font-title text-sm font-bold uppercase tracking-[0.14em]">{title}</p>
        <p className="text-xs text-graphite">
          {activeCount} active · {subscribers.length} total
        </p>
      </div>
      <div className="px-6">
        {subscribers.map((sub) => (
          <SubscriberCard key={sub.id} sub={sub} currentMonth={currentMonth} />
        ))}
      </div>
    </div>
  );
}

export default async function AdminSubscribersPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const [{ data: profiles }, { data: subscriptions }, { data: authData }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, birthday_month, shipping_address, stripe_customer_id")
      .not("stripe_customer_id", "is", null)
      .neq("stripe_customer_id", ""),
    supabase
      .from("subscriptions")
      .select("stripe_customer_id, status, current_period_end, created_at")
      .neq("status", "admin_archived"),
    supabase.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const subMap = new Map(
    (subscriptions ?? []).map((s) => [s.stripe_customer_id, s])
  );
  const emailMap = new Map(
    (authData?.users ?? []).map((u) => [u.id, u.email ?? ""])
  );

  const subscribers: Subscriber[] = (profiles ?? [])
    .filter((p) => subMap.has(p.stripe_customer_id))
    .map((p) => {
      const sub = subMap.get(p.stripe_customer_id)!;
      return {
        id: p.id,
        name: p.name ?? null,
        email: emailMap.get(p.id) ?? "",
        birthday_month: p.birthday_month ?? null,
        shipping_address: p.shipping_address ?? null,
        stripe_customer_id: p.stripe_customer_id,
        status: sub.status,
        current_period_end: sub.current_period_end ?? null,
        joined_at: sub.created_at ?? null,
      };
    });

  const uk = subscribers.filter((s) => isUK(s.shipping_address));
  const international = subscribers.filter((s) => !isUK(s.shipping_address));
  const totalActive = subscribers.filter((s) => ACTIVE_STATUSES.includes(s.status)).length;
  const currentMonth = new Date().getMonth() + 1;

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-title text-4xl font-bold">Subscribers</h1>
        <p className="mt-2 text-sm text-graphite">
          Statuses update automatically via Stripe. Cancelled subscribers can be removed manually.
        </p>
      </div>

      {/* Summary tiles */}
      <div className="mb-10 grid grid-cols-3 gap-3">
        {[
          { label: "Total Active", value: totalActive },
          { label: "UK Active", value: uk.filter((s) => ACTIVE_STATUSES.includes(s.status)).length },
          { label: "International Active", value: international.filter((s) => ACTIVE_STATUSES.includes(s.status)).length },
        ].map(({ label, value }) => (
          <div key={label} className="border border-line bg-chalk p-5">
            <p className="font-title text-4xl font-bold">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-graphite">{label}</p>
          </div>
        ))}
      </div>

      {subscribers.length === 0 && (
        <p className="text-sm text-graphite">No subscribers yet.</p>
      )}

      <div className="grid gap-6">
        <Section title="United Kingdom" subscribers={uk} currentMonth={currentMonth} />
        <Section title="International" subscribers={international} currentMonth={currentMonth} />
      </div>
    </section>
  );
}
