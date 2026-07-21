import type { Metadata } from "next";
import { archiveSubscriber } from "@/app/admin/actions";
import { AdminNav } from "@/components/layout/AdminNav";
import { FilterSelect } from "./FilterSelect";
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
  if (["uk","united kingdom","england","scotland","wales","northern ireland","great britain"]
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
          <p className={["font-title text-2xl font-bold leading-tight", isCancelled ? "text-red-600" : "text-ink"].join(" ")}>
            {isBirthday && <span className="mr-2">🎂</span>}
            {displayName}
          </p>

          <div className="flex items-center gap-3">
            {isActive && (
              <span className="inline-block border-2 border-green-600 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-green-600">
                Active
              </span>
            )}
            {isCancelled && (
              <span className="inline-block border-2 border-red-600 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-red-600">
                Cancelled
              </span>
            )}
            {!isActive && !isCancelled && (
              <span className="inline-block border border-line bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-graphite">
                {sub.status}
              </span>
            )}
          </div>

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

          <p className="text-xs text-graphite">
            <span className="font-semibold uppercase tracking-[0.08em]">Birthday</span>{" "}
            {birthdayMonthName ?? "Not set"}
            {isBirthday && " 🎂"}
          </p>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.08em] text-graphite">Address</p>
            {sub.shipping_address ? (
              <p className="whitespace-pre-line text-xs leading-5 text-graphite">{sub.shipping_address}</p>
            ) : (
              <p className="text-xs text-graphite/50">No address provided</p>
            )}
          </div>

          <p className="text-xs text-graphite/50">{sub.email}</p>
        </div>

        {isCancelled && (
          <form action={archiveSubscriber} className="shrink-0">
            <input type="hidden" name="stripe_customer_id" value={sub.stripe_customer_id} />
            <button type="submit" className="border border-red-300 px-4 py-1.5 text-xs text-red-500 transition hover:border-red-600 hover:bg-red-600 hover:text-white">
              Remove
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function SubscriberSection({ title, subscribers, currentMonth }: {
  title: string;
  subscribers: Subscriber[];
  currentMonth: number;
}) {
  if (subscribers.length === 0) {
    return (
      <div className="border border-line bg-white px-6 py-8 text-center text-sm text-graphite">
        No subscribers in this category.
      </div>
    );
  }
  return (
    <div className="border border-line bg-white">
      <div className="flex items-center justify-between border-b border-line bg-chalk px-6 py-3">
        <p className="font-title text-sm font-bold uppercase tracking-[0.14em]">{title}</p>
        <p className="text-xs text-graphite">{subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="px-6">
        {subscribers.map((sub) => (
          <SubscriberCard key={sub.id} sub={sub} currentMonth={currentMonth} />
        ))}
      </div>
    </div>
  );
}

export default async function AdminSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  await requireAdmin();
  const { filter = "all" } = await searchParams;
  const supabase = createSupabaseAdminClient();

  const [profilesRes, subscriptionsRes, authRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, birthday_month, shipping_address, stripe_customer_id")
      .not("stripe_customer_id", "is", null)
      .neq("stripe_customer_id", ""),
    supabase
      .from("subscriptions")
      .select("stripe_customer_id, status, current_period_end, created_at")
      .neq("status", "admin_archived"),
    supabase.auth.admin.listUsers({ perPage: 1000 }).catch(() => ({ data: { users: [] } })),
  ]);

  const profiles = profilesRes.data ?? [];
  const subscriptions = subscriptionsRes.data ?? [];
  const authData = authRes.data;

  const subMap = new Map(subscriptions.map((s) => [s.stripe_customer_id, s]));
  const emailMap = new Map((authData?.users ?? []).map((u) => [u.id, u.email ?? ""]));

  const subscribers: Subscriber[] = profiles
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

  const currentMonth = new Date().getMonth() + 1;

  const ukSubs = subscribers.filter((s) => isUK(s.shipping_address));
  const intlSubs = subscribers.filter((s) => !isUK(s.shipping_address));
  const cancelledSubs = subscribers.filter((s) => CANCELLED_STATUSES.includes(s.status));
  const birthdaySubs = subscribers.filter((s) => s.birthday_month === currentMonth);

  const stats = [
    { label: "Total Active", value: subscribers.filter((s) => ACTIVE_STATUSES.includes(s.status)).length },
    { label: "UK Active", value: ukSubs.filter((s) => ACTIVE_STATUSES.includes(s.status)).length },
    { label: "International Active", value: intlSubs.filter((s) => ACTIVE_STATUSES.includes(s.status)).length },
    { label: "Cancelled", value: cancelledSubs.length },
    { label: `🎂 Birthdays in ${MONTHS[currentMonth - 1]}`, value: birthdaySubs.length },
  ];

  // Apply filter
  const sections: { title: string; subscribers: Subscriber[] }[] =
    filter === "uk" ? [{ title: "United Kingdom", subscribers: ukSubs }]
    : filter === "international" ? [{ title: "International", subscribers: intlSubs }]
    : filter === "cancelled" ? [{ title: "Cancelled", subscribers: cancelledSubs }]
    : filter === "birthday" ? [{ title: `🎂 Birthdays — ${MONTHS[currentMonth - 1]}`, subscribers: birthdaySubs }]
    : [
        { title: "United Kingdom", subscribers: ukSubs },
        { title: "International", subscribers: intlSubs },
      ];

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-title text-4xl font-bold">Subscribers</h1>
        <p className="mt-2 text-sm text-graphite">
          Statuses update automatically via Stripe. Cancelled subscribers can be removed manually.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map(({ label, value }) => (
          <div key={label} className="border border-line bg-chalk p-4">
            <p className="font-title text-3xl font-bold">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-graphite">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mb-6">
        <FilterSelect current={filter} />
      </div>

      {/* Subscriber sections */}
      <div className="grid gap-6">
        {sections.map((s) => (
          <SubscriberSection key={s.title} title={s.title} subscribers={s.subscribers} currentMonth={currentMonth} />
        ))}
      </div>
    </section>
  );
}
