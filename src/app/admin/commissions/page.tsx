import type { Metadata } from "next";
import { updateCommissionStatus } from "@/app/admin/actions";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { COMMISSION_STATUS_LABELS, formatDate } from "@/lib/portal";

export const metadata: Metadata = { title: "Admin: Commissions" };
export const dynamic = "force-dynamic";

export default async function AdminCommissionsPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const [{ data: enquiries }, { data: commissions }, { data: clients }] = await Promise.all([
    supabase
      .from("commission_enquiries")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("commissions")
      .select("id, reference, artwork_title, status, client_id, estimated_completion, created_at")
      .neq("status", "archived")
      .order("created_at", { ascending: false }),
    supabase
      .from("portal_clients")
      .select("id, name, email"),
  ]);

  const clientMap = new Map((clients ?? []).map((c) => [c.id, c]));

  return (
    <section className="container-shell py-14">
      <AdminNav />

      {/* ── Active commissions ───────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="font-title text-4xl font-bold">Commissions</h1>
          <a
            href="/admin/clients"
            className="border border-ink px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition hover:bg-ink hover:text-chalk"
          >
            Manage clients →
          </a>
        </div>

        {(commissions ?? []).length === 0 ? (
          <p className="text-sm text-graphite">No active commissions. Create one from a client's record.</p>
        ) : (
          <div className="grid gap-3">
            {(commissions ?? []).map((c) => {
              const client = clientMap.get(c.client_id);
              return (
                <a
                  key={c.id}
                  href={`/admin/commissions/${c.id}`}
                  className="group flex flex-wrap items-center justify-between gap-4 border border-line bg-chalk px-5 py-4 transition hover:border-ink"
                >
                  <div>
                    <p className="font-title text-base font-bold group-hover:underline">
                      {c.reference} — {c.artwork_title}
                    </p>
                    {client && (
                      <p className="mt-0.5 text-xs text-graphite">
                        {client.name} · {client.email}
                      </p>
                    )}
                    {c.estimated_completion && (
                      <p className="mt-0.5 text-xs text-graphite/60">
                        Est. completion: {formatDate(c.estimated_completion)}
                      </p>
                    )}
                  </div>
                  <span className="border border-ink px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em]">
                    {COMMISSION_STATUS_LABELS[c.status] ?? c.status}
                  </span>
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Enquiries ────────────────────────────────────────────────────────── */}
      <div>
        <h2 className="mb-5 font-title text-2xl font-bold">Enquiries</h2>
        <p className="mb-6 text-sm text-graphite">
          Review enquiries and update their status. To create a commission, first add the client in{" "}
          <a href="/admin/clients" className="underline underline-offset-4 hover:text-ink">
            Clients
          </a>{" "}
          and then create the commission from their record.
        </p>

        {(enquiries ?? []).length === 0 && (
          <p className="text-sm text-graphite">No enquiries yet.</p>
        )}

        <div className="grid gap-4">
          {(enquiries ?? []).map((enquiry) => (
            <article key={enquiry.id} className="border border-line bg-chalk">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-4">
                <div>
                  <h3 className="font-title text-xl font-bold">{enquiry.name}</h3>
                  <p className="mt-1 text-xs text-graphite">
                    <a href={`mailto:${enquiry.email}`} className="hover:underline">
                      {enquiry.email}
                    </a>
                    {enquiry.phone && (
                      <>{" "}&middot; {enquiry.phone}</>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-graphite">
                    {enquiry.commission_type}
                    <span className="mx-1.5 text-line">|</span>
                    Budget: {enquiry.budget_range}
                    <span className="mx-1.5 text-line">|</span>
                    Timeframe: {enquiry.timeframe}
                  </p>
                  {enquiry.commission_id && (
                    <a
                      href={`/admin/commissions/${enquiry.commission_id}`}
                      className="mt-1 inline-block text-xs underline underline-offset-4 hover:text-ink"
                    >
                      → View commission
                    </a>
                  )}
                </div>
                <form action={updateCommissionStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={enquiry.id} />
                  <select
                    name="status"
                    defaultValue={enquiry.status}
                    className="focus-ring border border-line bg-paper px-2 py-2 text-xs"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="replied">Replied</option>
                    <option value="accepted">Accepted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button className="focus-ring border border-ink px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition hover:bg-ink hover:text-chalk">
                    Update
                  </button>
                </form>
              </div>
              <div className="p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-graphite">
                  {enquiry.message}
                </p>
                <p className="mt-3 text-xs text-graphite/60">
                  {new Date(enquiry.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
