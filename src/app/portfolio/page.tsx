import type { Metadata } from "next";
import { ArtworkCard } from "@/components/ArtworkCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Reveal } from "@/components/ui/Reveal";
import { getArtworks } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Portfolio"
};

export default async function PortfolioPage() {
  const artworks = await getArtworks();
  const visible = artworks.filter((a) => a.status !== "hidden");

  return (
    <>
      {/* Page header */}
      <section className="border-b border-line">
        <div className="container-shell py-14 md:py-20">
          <Reveal>
            <p className="label text-graphite">Practice</p>
            <h1 className="mt-2 font-title text-4xl md:text-6xl">Portfolio</h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-graphite">
              Selected work across sculpture, multimedia, photography, digital
              work, and print. Sold works remain visible as archive entries.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="container-shell py-16 md:py-20">
        {visible.length > 0 ? (
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3">
            {visible.map((artwork, i) => (
              <Reveal key={artwork.id} delay={Math.min(i % 3, 2) * 100}>
                <ArtworkCard artwork={artwork} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState message="No works to display yet." />
        )}
      </section>
    </>
  );
}
