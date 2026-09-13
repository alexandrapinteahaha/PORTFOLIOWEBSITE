import type { Metadata } from "next";
import Link from "next/link";
import { requirePortalClient } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  COMMISSION_STATUS_LABELS,
  formatCurrency,
  formatDate,
} from "@/lib/portal";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
  const { client } = await requirePortalClient();
  const supabase = createSupabaseAdminClient();

  const [{ data: commissions }, { data: payments }] = await Promise.all([
    supabase
      .from("commissions")
      .select("id, reference, artwork_title, status, estimated_completion, created_at")
      .eq("client_id", client.id)
      .neq("status", "archived")
      .order("created_at", { ascending: false }),
    supabase
      .from("commission_payments")
      .select("commission_id, status, amount_gbp, payment_type")
      .eq("client_id", client.id),
  ]);

  const activeCommissions = (commissions ?? []).filter(
    (c) => !["delivered", "archived"].includes(c.status)
  );
  const completedCommissions = (commissions ?? []).filter((c) =>
    ["delivered"].includes(c.status)
  );

  return (
    <div className="container-shell py-12">
      {/* Greeting */}
      <div className="mb-10">
        <p className="label text-graphite">Your portal</p>
        <h1 className="mt-2 font-title text-4xl font-bold">
          Welcome, {client.name.split(" ")[0]}
        </h1>
      </div>

      {(commissions ?? []).length === 0 && (
        <div className="border border-line bg-chalk p-8 text-center">
          <p className="text-sm text-graphite">
            Your commission portal is ready. Your commission will appear here once it has been set up.
          </p>
          <p className="mt-3 text-xs text-graphite/60">
            Questions? Contact{" "}
            <a href="mailto:hello@alexandrapintea.art" className="underline">
              hello@alexandrapintea.art
            </a>
          </p>
        </div>
      )}

      {/* Active commissions */}
      {activeCommissions.length > 0 && (
        <section className="mb-10">
          <div className="grid gap-4">
            {activeCommissions.map((commission) => {
              const commPayments = (payments ?? []).filter(
                (p) => p.commission_id === commission.id
              );
              const paidAmount = commPayments
                .filter((p) => p.status === "paid")
                .reduce((sum, p) => sum + Number(p.amount_gbp), 0);
              const pendingAmount = commPayments
                .filter((p) => p.status === "pending")
                .reduce((sum, p) => sum + Number(p.amount_gbp), 0);

              return (
                <article
                  key={commission.id}
                  className="border border-line bg-white"
                >
                  <div className="border-b border-line px-6 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="label text-graphite">{commission.reference}</p>
                        <h2 className="mt-1 font-title text-2xl font-bold leading-snug">
                          {commission.artwork_title}
                        </h2>
                      </div>
                      <span className="inline-block border border-ink px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em]">
                        {COMMISSION_STATUS_LABELS[commission.status] ?? commission.status}
                      </span>
                    </div>

                    {commission.estimated_completion && (
                      <p className="mt-3 text-xs text-graphite">
                        Estimated completion:{" "}
                        <span className="font-semibold text-ink">
                          {formatDate(commission.estimated_completion)}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 px-6 py-4">
                    {paidAmount > 0 && (
                      <div>
                        <p className="text-xs text-graphite">Paid</p>
                        <p className="font-title text-base font-bold text-green-700">
                          {formatCurrency(paidAmount)}
                        </p>
                      </div>
                    )}
                    {pendingAmount > 0 && (
                      <div>
                        <p className="text-xs text-graphite">Due</p>
                        <p className="font-title text-base font-bold text-ink">
                          {formatCurrency(pendingAmount)}
                        </p>
                      </div>
                    )}
                    <div className="ml-auto">
                      <Link
                        href={`/portal/commission/${commission.reference}`}
                        className="inline-block border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition hover:bg-ink hover:text-chalk"
                      >
                        View commission →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Completed commissions */}
      {completedCommissions.length > 0 && (
        <section>
          <h2 className="mb-4 font-title text-sm font-bold uppercase tracking-[0.1em] text-graphite">
            Completed
          </h2>
          <div className="grid gap-3">
            {completedCommissions.map((commission) => (
              <Link
                key={commission.id}
                href={`/portal/commission/${commission.reference}`}
                className="flex items-center justify-between border border-line bg-chalk px-6 py-4 transition hover:border-ink"
              >
                <div>
                  <p className="label text-graphite">{commission.reference}</p>
                  <p className="mt-0.5 font-title text-sm font-bold">
                    {commission.artwork_title}
                  </p>
                </div>
                <span className="text-xs text-graphite">View →</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
