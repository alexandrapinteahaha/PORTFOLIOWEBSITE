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

const ACTIVE = ["active", "trialing"];
const CANCELLED = ["canceled", "cancelled", "unpaid", "past_due"];

type Subscriber = {
  id: string;
  name: string | null;
  email: string;
  birthday_month: number | null;
  shipping_address: string | null;
  stripe_customer_id: string;
  status: string;
  current_period_end: string | null;
};

function SubscriberRow({
  sub,
  currentMonth,
}: {
  sub: Subscriber;
  currentMonth: number;
}) {
  const isBirthday = sub.birthday_month === currentMonth;
  const isCancelled = CANCELLED.includes(sub.status);
  const displayName = sub.name ?? sub.email;
  const birthdayMonth = sub.birthday_month ? MONTHS[sub.birthday_month - 1] : null;

  return (
    <div className="flex items-start justify-between gap-4 border-b border-line py-3 last:border-b-0">
      <div className="grid gap-0.5">
        <p className={[
          "text-sm",
          isCancelled ? "text-rust" : "text-ink",
          isBirthday ? "font-bold" : "font-normal",
        ].join(" ")}>
          {isBirthday && <span className="mr-1.5">🎂</span>}
          {displayName}
          {isCancelled && (
            <span className="ml-2 text-xs font-normal uppercase tracking-[0.1em] text-rust/70">
              Cancelled
            </span>
          )}
        </p>
        <p className="text-xs text-graphite">
          {birthdayMonth ?? "No birthday set"}
          {sub.shipping_address && (
            <>
              <span className="mx-1.5 text-line">·</span>
              {sub.shipping_address.replace(/\n/g, ", ")}
            </>
          )}
        </p>
        <p className="text-xs text-graphite/60">{sub.email}</p>
      </div>

      {isCancelled && (
        <form action={archiveSubscriber}>
          <input type="hidden" name="stripe_customer_id" value={sub.stripe_customer_id} />
          <button
            type="submit"
            className="shrink-0 border border-line px-3 py-1 text-xs text-graphite transition hover:border-rust hover:text-rust"
          >
            Remove
          </button>
        </form>
      )}
    </div>
  );
}

function Section({
  title,
  subscribers,
  currentMonth,
}: {
  title: string;
  subscribers: Subscriber[];
  currentMonth: number;
}) {
  if (subscribers.length === 0) return null;
  const active = subscribers.filter((s) => ACTIVE.includes(s.status)).length;

  return (
    <div className="border border-line bg-chalk">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">{title}</p>
        <p className="text-xs text-graphite">
          {active} active · {subscribers.length} total
        </p>
      </div>
      <div className="px-5">
        {subscribers.map((sub) => (
          <SubscriberRow key={sub.id} sub={sub} currentMonth={currentMonth} />
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
      .select("id, name, birthday_month, shipping_address, billing_address, stripe_customer_id")
      .not("stripe_customer_id", "is", null)
      .neq("stripe_customer_id", ""),
    supabase
      .from("subscriptions")
      .select("stripe_customer_id, status, current_period_end")
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
    .map((p) => ({
      id: p.id,
      name: p.name ?? null,
      email: emailMap.get(p.id) ?? "",
      birthday_month: p.birthday_month ?? null,
      shipping_address: p.shipping_address ?? null,
      stripe_customer_id: p.stripe_customer_id,
      status: subMap.get(p.stripe_customer_id)!.status,
      current_period_end: subMap.get(p.stripe_customer_id)!.current_period_end ?? null,
    }));

  const uk = subscribers.filter((s) => isUK(s.shipping_address));
  const international = subscribers.filter((s) => !isUK(s.shipping_address));
  const totalActive = subscribers.filter((s) => ACTIVE.includes(s.status)).length;
  const currentMonth = new Date().getMonth() + 1;

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-title text-4xl font-bold">Subscribers</h1>
        <p className="mt-2 text-sm text-graphite">
          Subscription statuses update automatically via Stripe webhook.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          { label: "Total Active", value: totalActive },
          { label: "UK", value: uk.filter((s) => ACTIVE.includes(s.status)).length },
          { label: "International", value: international.filter((s) => ACTIVE.includes(s.status)).length },
        ].map(({ label, value }) => (
          <div key={label} className="border border-line bg-chalk p-5">
            <p className="font-title text-3xl font-bold">{value}</p>
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
