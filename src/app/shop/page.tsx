import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
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
    <>
      {/* Page header */}
      <section className="border-b border-line">
        <div className="container-shell py-14 md:py-20">
          <Reveal>
            <p className="label text-graphite">Collect</p>
            <h1 className="mt-2 font-title text-4xl md:text-6xl">Shop</h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-graphite">
              Original works, selected prints, and digital editions. Original
              artworks are unique and can only be purchased once. Sold originals
              remain visible in the archive.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-5">
            <p className="label text-graphite">
              Ships from the UK — international buyers responsible for customs duties.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-shell py-16 md:py-20">
        {active.length === 0 && (
          <EmptyState
            message="No works currently available."
            hint="Check back soon, or join the newsletter for release updates."
          />
        )}

        {originals.length > 0 && (
          <div className="mb-20">
            <Reveal className="mb-10 border-b border-line pb-5">
              <p className="label text-graphite">Category</p>
              <h2 className="mt-1 font-title text-xl">Original Works</h2>
            </Reveal>
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
              {originals.map((product, i) => (
                <Reveal key={product.id} delay={Math.min(i % 3, 2) * 100}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {prints.length > 0 && (
          <div className="mb-20">
            <Reveal className="mb-10 border-b border-line pb-5">
              <p className="label text-graphite">Category</p>
              <h2 className="mt-1 font-title text-xl">Prints</h2>
            </Reveal>
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
              {prints.map((product, i) => (
                <Reveal key={product.id} delay={Math.min(i % 3, 2) * 100}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {digital.length > 0 && (
          <div className="mb-20">
            <Reveal className="mb-10 border-b border-line pb-5">
              <p className="label text-graphite">Category</p>
              <h2 className="mt-1 font-title text-xl">Digital Editions</h2>
            </Reveal>
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
              {digital.map((product, i) => (
                <Reveal key={product.id} delay={Math.min(i % 3, 2) * 100}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {other.length > 0 && (
          <div>
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
              {other.map((product, i) => (
                <Reveal key={product.id} delay={Math.min(i % 3, 2) * 100}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
