import type { Metadata } from "next";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin: Newsletter"
};

export default async function AdminNewsletterPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("newsletter_signups")
    .select("email,source,created_at,consent")
    .order("created_at", { ascending: false });

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-serif text-4xl font-light">Newsletter signups</h1>
        <p className="mt-2 text-sm text-graphite">
          All email addresses are collected with explicit consent. Total:{" "}
          {(data ?? []).length}
        </p>
      </div>

      {(data ?? []).length === 0 ? (
        <p className="text-sm text-graphite">No signups yet.</p>
      ) : (
        <div className="overflow-x-auto border border-line bg-chalk">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-graphite">
                  Email
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-graphite">
                  Source
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-graphite">
                  Consent
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-graphite">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((signup) => (
                <tr key={signup.email} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${signup.email}`}
                      className="text-ink hover:underline"
                    >
                      {signup.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-graphite">{signup.source}</td>
                  <td className="px-4 py-3 text-graphite">
                    {signup.consent ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3 text-graphite">
                    {new Date(signup.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
