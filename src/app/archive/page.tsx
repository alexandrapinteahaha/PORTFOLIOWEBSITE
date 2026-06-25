import type { Metadata } from "next";
import { ArtworkCard } from "@/components/ArtworkCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getArtworks } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Archive"
};

export default async function ArchivePage() {
  const artworks = await getArtworks();
  const archive = artworks.filter((a) => ["sold", "archived"].includes(a.status));

  return (
    <section className="container-shell py-14 md:py-20">
      <SectionHeader
        title="Archive"
        intro="Past works remain visible after sale or completion. The archive preserves a professional record for galleries, collectors, and future reference. Prints may still be available for sold originals."
      />
      {archive.length > 0 ? (
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {archive.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="mt-12">
          <EmptyState message="No archived works yet." />
        </div>
      )}
    </section>
  );
}
