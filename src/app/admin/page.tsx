import Link from "next/link";
import type { Metadata } from "next";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin"
};

const adminLinks = [
  ["Artworks", "/admin/artworks", "Manage the archive, add works, update status"],
  ["Products", "/admin/products", "Original works, prints, digital editions, and shop listings"],
  ["Print Club", "/admin/print-club", "Monthly entries, project management, file references"],
  ["Commissions", "/admin/commissions", "Review and respond to enquiries"],
  ["Newsletter", "/admin/newsletter", "Consented email signups"]
];

export default async function AdminPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const [artworks, products, enquiries, signups] = await Promise.all([
    supabase.from("artworks").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("commission_enquiries").select("id", { count: "exact", head: true }),
    supabase.from("newsletter_signups").select("id", { count: "exact", head: true })
  ]);

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-serif text-4xl font-light">Admin dashboard</h1>
        <p className="mt-2 text-sm text-graphite">
          Manage the archive, shop, Print Club, enquiries, and newsletter.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Artworks" value={artworks.count ?? 0} />
        <Metric label="Products" value={products.count ?? 0} />
        <Metric label="Enquiries" value={enquiries.count ?? 0} />
        <Metric label="Newsletter" value={signups.count ?? 0} />
      </div>

      <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {adminLinks.map(([label, href, desc]) => (
          <Link
            key={href}
            href={href}
            className="focus-ring group border border-line bg-chalk p-5 transition hover:border-ink"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.1em] group-hover:text-ink">
              {label}
            </p>
            <p className="mt-2 text-xs leading-5 text-graphite">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line bg-chalk p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">{label}</p>
      <p className="mt-3 font-serif text-4xl font-light">{value}</p>
    </div>
  );
}
