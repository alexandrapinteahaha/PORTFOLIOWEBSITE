import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createCommission } from "@/app/admin/portal-actions";

export const metadata: Metadata = { title: "Admin: New Commission" };

export default async function NewCommissionPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>;
}) {
  await requireAdmin();
  const { client_id } = await searchParams;

  if (!client_id) notFound();

  const supabase = createSupabaseAdminClient();

  const [{ data: client }, { data: enquiries }] = await Promise.all([
    supabase
      .from("portal_clients")
      .select("id, name, email")
      .eq("id", client_id)
      .single(),
    supabase
      .from("commission_enquiries")
      .select("id, commission_type, budget_range, created_at")
      .eq("email", "")  // placeholder — will be replaced below
      .limit(0),
  ]);

  if (!client) notFound();

  // Fetch enquiries by email match
  const { data: clientEnquiries } = await supabase
    .from("commission_enquiries")
    .select("id, commission_type, budget_range, created_at, commission_id")
    .eq("email", client.email)
    .is("commission_id", null)
    .order("created_at", { ascending: false });

  const inputCls = "w-full border border-line bg-white px-3 py-2 text-xs focus:border-ink focus:outline-none";
  const textareaCls = `${inputCls} resize-y`;

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <a href="/admin/clients" className="text-xs text-graphite underline underline-offset-4 hover:text-ink">
          ← Clients
        </a>
        <h1 className="mt-3 font-title text-4xl font-bold">New commission</h1>
        <p className="mt-2 text-sm text-graphite">
          For <span className="font-semibold">{client.name}</span> ({client.email})
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form action={createCommission} className="grid gap-6 border border-line p-6">
          <input type="hidden" name="client_id" value={client_id} />

          <div className="grid gap-4 sm:grid-cols-2">
            <Label text="Artwork title *">
              <input type="text" name="artwork_title" required placeholder="e.g. Family Portrait" className={inputCls} />
            </Label>
            <Label text="Medium">
              <input type="text" name="medium" placeholder="e.g. Oil on canvas" className={inputCls} />
            </Label>
            <Label text="Dimensions">
              <input type="text" name="dimensions" placeholder="e.g. 60 × 80 cm" className={inputCls} />
            </Label>
            <Label text="Estimated completion">
              <input type="date" name="estimated_completion" className={inputCls} />
            </Label>
            <Label text="Agreed price (£)">
              <input type="number" step="0.01" name="agreed_price_gbp" placeholder="2500.00" className={inputCls} />
            </Label>
            <Label text="Deposit amount (£)">
              <input type="number" step="0.01" name="deposit_amount_gbp" placeholder="625.00" className={inputCls} />
            </Label>
          </div>

          <Label text="Description (shown to client)">
            <textarea name="description" rows={3} className={textareaCls} placeholder="Brief description of the commission…" />
          </Label>

          <Label text="Admin notes (private — never shown to client)">
            <textarea name="admin_notes" rows={3} className={`${textareaCls} bg-amber-50`} placeholder="Internal notes…" />
          </Label>

          {(clientEnquiries ?? []).length > 0 && (
            <Label text="Link to enquiry (optional)">
              <select name="enquiry_id" className={inputCls}>
                <option value="">— No linked enquiry —</option>
                {(clientEnquiries ?? []).map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.commission_type} · {new Date(e.created_at).toLocaleDateString("en-GB")}
                    {e.budget_range ? ` · Budget: ${e.budget_range}` : ""}
                  </option>
                ))}
              </select>
            </Label>
          )}

          <button
            type="submit"
            className="justify-self-start border border-ink bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-chalk transition hover:bg-graphite"
          >
            Create commission
          </button>
        </form>

        <div className="border border-line bg-chalk p-5 self-start">
          <p className="font-title text-xs font-bold uppercase tracking-[0.12em]">Client</p>
          <p className="mt-3 font-title text-base font-bold">{client.name}</p>
          <p className="mt-0.5 text-xs text-graphite">{client.email}</p>
          <p className="mt-5 text-xs leading-5 text-graphite/70">
            Once created, you can upload documents, concepts, and send the portal invitation from the commission page.
          </p>
        </div>
      </div>
    </section>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5 text-xs uppercase tracking-[0.1em] text-graphite">
      {text}
      {children}
    </label>
  );
}
