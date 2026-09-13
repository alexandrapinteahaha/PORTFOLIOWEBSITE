import type { Metadata } from "next";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createPortalClient } from "@/app/admin/portal-actions";
import { formatDate } from "@/lib/portal";

export const metadata: Metadata = { title: "Admin: Clients" };
export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const [{ data: clients }, { data: commissions }] = await Promise.all([
    supabase
      .from("portal_clients")
      .select("id, name, email, phone, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("commissions")
      .select("id, client_id, reference, artwork_title, status")
      .neq("status", "archived"),
  ]);

  const commissionsByClient = new Map<string, typeof commissions>();
  for (const c of commissions ?? []) {
    if (!commissionsByClient.has(c.client_id)) {
      commissionsByClient.set(c.client_id, []);
    }
    commissionsByClient.get(c.client_id)!.push(c);
  }

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-title text-4xl font-bold">Clients</h1>
          <p className="mt-2 text-sm text-graphite">
            Commission portal clients. Each client can log in to their private portal using their email address.
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_340px]">

        {/* ── Client list ─────────────────────────────────────────────────── */}
        <div>
          {(clients ?? []).length === 0 ? (
            <p className="text-sm text-graphite">No clients yet. Add one using the form.</p>
          ) : (
            <div className="grid gap-3">
              {(clients ?? []).map((client) => {
                const clientCommissions = commissionsByClient.get(client.id) ?? [];
                return (
                  <article key={client.id} className="border border-line bg-white">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-4">
                      <div>
                        <p className="font-title text-base font-bold">{client.name}</p>
                        <p className="mt-0.5 text-xs text-graphite">{client.email}</p>
                        {client.phone && (
                          <p className="mt-0.5 text-xs text-graphite">{client.phone}</p>
                        )}
                      </div>
                      <p className="text-xs text-graphite/50">
                        Added {formatDate(client.created_at)}
                      </p>
                    </div>

                    <div className="px-5 py-3">
                      {clientCommissions.length === 0 ? (
                        <p className="text-xs text-graphite/50">No commissions yet.</p>
                      ) : (
                        <div className="grid gap-1">
                          {clientCommissions.map((c) => (
                            <a
                              key={c.id}
                              href={`/admin/commissions/${c.id}`}
                              className="flex items-center justify-between text-xs hover:underline"
                            >
                              <span className="font-semibold">{c.reference} — {c.artwork_title}</span>
                              <span className="text-graphite/60 capitalize">{c.status.replace(/_/g, " ")}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="border-t border-line px-5 py-3">
                      <a
                        href={`/admin/commissions/new?client_id=${client.id}`}
                        className="text-xs underline underline-offset-4 hover:text-ink"
                      >
                        + Create commission for {client.name.split(" ")[0]}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Add new client ───────────────────────────────────────────────── */}
        <div className="border border-line bg-chalk p-6">
          <h2 className="mb-4 font-title text-sm font-bold uppercase tracking-[0.12em]">
            Add client
          </h2>
          <form action={createPortalClient} className="grid gap-4">
            <Label text="Full name *">
              <input
                type="text"
                name="name"
                required
                placeholder="Jane Smith"
                className={inputCls}
              />
            </Label>
            <Label text="Email address *">
              <input
                type="email"
                name="email"
                required
                placeholder="jane@example.com"
                className={inputCls}
              />
            </Label>
            <Label text="Phone (optional)">
              <input
                type="tel"
                name="phone"
                placeholder="+44 7700 000000"
                className={inputCls}
              />
            </Label>
            <button
              type="submit"
              className="border border-ink bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-chalk transition hover:bg-graphite"
            >
              Add client
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}

const inputCls =
  "w-full border border-line bg-white px-3 py-2 text-xs focus:border-ink focus:outline-none";

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-xs uppercase tracking-[0.1em] text-graphite">
      {text}
      {children}
    </label>
  );
}
