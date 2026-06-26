import type { Metadata } from "next";
import { updateCommissionStatus } from "@/app/admin/actions";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin: Commissions"
};

export default async function AdminCommissionsPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("commission_enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-title text-4xl font-light">Commission enquiries</h1>
        <p className="mt-2 text-sm text-graphite">
          Review enquiries and update status as they are processed.
        </p>
      </div>

      {(data ?? []).length === 0 && (
        <p className="text-sm text-graphite">No enquiries yet.</p>
      )}

      <div className="grid gap-4">
        {(data ?? []).map((enquiry) => (
          <article key={enquiry.id} className="border border-line bg-chalk">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line p-4">
              <div>
                <h2 className="font-title text-2xl font-light">{enquiry.name}</h2>
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
                  year: "numeric"
                })}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
