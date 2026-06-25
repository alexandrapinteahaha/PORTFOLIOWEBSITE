import type { Metadata } from "next";
import { ArtworkCard } from "@/components/ArtworkCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getArtworks } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Portfolio"
};

export default async function PortfolioPage() {
  const artworks = await getArtworks();
  const visible = artworks.filter((a) => a.status !== "hidden");

  return (
    <section className="container-shell py-14 md:py-20">
      <SectionHeader
        title="Portfolio"
        intro="Selected work across sculpture, multimedia, photography, digital work, and print. Sold works remain visible as archive entries."
      />
      {visible.length > 0 ? (
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {visible.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="mt-12">
          <EmptyState message="No works to display yet." />
        </div>
      )}
    </section>
  );
}
