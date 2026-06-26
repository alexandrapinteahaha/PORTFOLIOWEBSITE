import type { Metadata } from "next";
import { deleteProduct } from "@/app/admin/actions";
import { ProductForm } from "@/components/AdminForms";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin: Products"
};

export default async function AdminProductsPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("products")
    .select("id,title,product_type,price_gbp,stock_quantity,is_active")
    .order("created_at", { ascending: false });

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-title text-4xl font-light">Products</h1>
        <p className="mt-2 text-sm text-graphite">
          Products link purchases to artworks, stock levels, and Stripe checkout. Each artwork can have one original product, one print product, and one digital product.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
        <ProductForm />

        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
            All products ({(data ?? []).length})
          </h2>
          <div className="grid gap-2">
            {(data ?? []).length === 0 && (
              <p className="text-sm text-graphite">No products added yet.</p>
            )}
            {(data ?? []).map((product) => (
              <div
                key={product.id}
                className="grid gap-3 border border-line bg-chalk p-4 md:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-serif text-xl">{product.title}</p>
                  <p className="mt-1 text-xs text-graphite">
                    {product.product_type}
                    <span className="mx-1.5 text-line">|</span>
                    {product.price_gbp ? `GBP ${product.price_gbp}` : "enquire"}
                    <span className="mx-1.5 text-line">|</span>
                    stock: {product.stock_quantity ?? "n/a"}
                    <span className="mx-1.5 text-line">|</span>
                    {product.is_active ? "active" : "hidden"}
                  </p>
                </div>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={product.id} />
                  <button className="focus-ring border border-rust px-3 py-2 text-xs text-rust transition hover:bg-rust hover:text-chalk">
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
