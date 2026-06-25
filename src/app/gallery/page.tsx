import type { Metadata } from "next";
import { Suspense } from "react";
import { ArtworkCard } from "@/components/ArtworkCard";
import { GalleryFilters } from "@/components/GalleryFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getArtworks } from "@/lib/data/loaders";
import type { ArtworkCategory, ArtworkStatus } from "@/lib/types";

export const metadata: Metadata = {
  title: "Gallery"
};

type GalleryPageProps = {
  searchParams: Promise<{
    category?: string;
    status?: string;
    year?: string;
    series?: string;
  }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const artworks = await getArtworks();

  const years = [...new Set(artworks.map((a) => a.year))].sort((a, b) => b - a);
  const series = [
    ...new Set(artworks.map((a) => a.series).filter(Boolean))
  ] as string[];

  const filtered = artworks.filter((artwork) => {
    if (artwork.status === "hidden") return false;
    const categoryMatch = isArtworkCategory(params.category)
      ? artwork.categories.includes(params.category)
      : true;
    const statusMatch = isArtworkStatus(params.status)
      ? artwork.status === params.status
      : true;
    const yearMatch = params.year ? artwork.year === Number(params.year) : true;
    const seriesMatch = params.series ? artwork.series === params.series : true;
    return categoryMatch && statusMatch && yearMatch && seriesMatch;
  });

  return (
    <section className="container-shell py-14 md:py-20">
      <SectionHeader
        title="Gallery"
        intro="The full picture archive. Filter by type, availability, series, or year."
      />
      <Suspense fallback={null}>
        <GalleryFilters
          years={years}
          series={series}
          current={{
            category: params.category,
            status: params.status,
            year: params.year,
            series: params.series
          }}
        />
      </Suspense>
      {filtered.length > 0 ? (
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
          {filtered.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <div className="mt-12">
          <EmptyState
            message="No works match the current filters."
            hint="Try adjusting or clearing the filters above."
          />
        </div>
      )}
    </section>
  );
}

function isArtworkCategory(value?: string): value is ArtworkCategory {
  return ["original", "sculpture", "multimedia", "photography", "digital", "print"].includes(
    value ?? ""
  );
}

function isArtworkStatus(value?: string): value is ArtworkStatus {
  return ["available", "sold", "archived", "hidden"].includes(value ?? "");
}
