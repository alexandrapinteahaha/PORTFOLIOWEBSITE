import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProducts } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Shop"
};

export default async function ShopPage() {
  const products = await getProducts();
  const active = products.filter((p) => p.isActive);

  const originals = active.filter((p) => p.productType === "original");
  const prints = active.filter((p) => p.productType === "physical_print");
  const digital = active.filter((p) => p.productType === "digital_download");
  const other = active.filter(
    (p) => !["original", "physical_print", "digital_download"].includes(p.productType)
  );

  return (
    <section className="container-shell py-14 md:py-20">
      <SectionHeader
        title="Shop"
        intro="Original works, selected prints, and digital editions. Original artworks are unique and can only be purchased once. Sold originals remain visible in the archive."
      />

      <p className="mt-5 text-xs uppercase tracking-[0.12em] text-graphite">
        Ships from the UK. International buyers are responsible for customs duties, import taxes, and local handling fees.
      </p>

      {originals.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
            Original works
          </h2>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {originals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {prints.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
            Prints
          </h2>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {prints.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {digital.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
            Digital editions
          </h2>
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {digital.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {other.length > 0 && (
        <div className="mt-16">
          <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {other.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {active.length === 0 && (
        <div className="mt-12">
          <EmptyState
            message="No works currently available."
            hint="Check back soon, or join the newsletter for release updates."
          />
        </div>
      )}
    </section>
  );
}
