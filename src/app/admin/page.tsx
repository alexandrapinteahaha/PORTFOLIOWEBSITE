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
  ["Subscribers", "/admin/subscribers", "View subscribers, addresses, birthday months, and cancellations"],
  ["Commissions", "/admin/commissions", "Review enquiries and manage active commissions"],
  ["Clients", "/admin/clients", "Commission portal clients — create commissions and send invitations"],
  ["Newsletter", "/admin/newsletter", "Consented email signups"],
];

export default async function AdminPage() {
  await requireAdmin();

  let artworks = { count: 0 }, products = { count: 0 }, enquiries = { count: 0 }, signups = { count: 0 };
  let activeCommissions = { count: 0 }, portalClients = { count: 0 };
  try {
    const supabase = createSupabaseAdminClient();
    [artworks, products, enquiries, signups, activeCommissions, portalClients] = await Promise.all([
      supabase.from("artworks").select("id", { count: "exact", head: true }),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("commission_enquiries").select("id", { count: "exact", head: true }),
      supabase.from("newsletter_signups").select("id", { count: "exact", head: true }),
      supabase.from("commissions").select("id", { count: "exact", head: true }).neq("status", "archived"),
      supabase.from("portal_clients").select("id", { count: "exact", head: true }),
    ]) as [typeof artworks, typeof products, typeof enquiries, typeof signups, typeof activeCommissions, typeof portalClients];
  } catch {
    // Supabase not configured — show zero counts
  }

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-title text-4xl font-bold">Admin dashboard</h1>
        <p className="mt-2 text-sm text-graphite">
          Manage the archive, shop, subscribers, enquiries, and newsletter.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <Metric label="Artworks" value={artworks.count ?? 0} />
        <Metric label="Products" value={products.count ?? 0} />
        <Metric label="Enquiries" value={enquiries.count ?? 0} />
        <Metric label="Newsletter" value={signups.count ?? 0} />
        <Metric label="Commissions" value={activeCommissions.count ?? 0} href="/admin/commissions" />
        <Metric label="Clients" value={portalClients.count ?? 0} href="/admin/clients" />
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

function Metric({ label, value, href }: { label: string; value: number; href?: string }) {
  const inner = (
    <div className="border border-line bg-chalk p-5 transition hover:border-ink">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">{label}</p>
      <p className="mt-3 font-serif text-4xl font-light">{value}</p>
    </div>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return inner;
}
