import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { getArtworks } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Archive"
};

export default async function ArchivePage() {
  const artworks = await getArtworks();
  const visible = artworks.filter((a) => a.status !== "hidden");

  return (
    <>
      {/* Page header */}
      <section className="border-b border-line">
        <div className="container-shell py-14 md:py-20">
          <Reveal>
            <p className="label text-graphite">Works</p>
            <h1 className="mt-2 font-title text-4xl md:text-6xl">Archive</h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-graphite">
              All works across sculpture, multimedia, photography, digital
              practice, and print. Each piece is individually priced. Sold
              originals remain visible — prints may still be available.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="container-shell py-14 md:py-20">
        {visible.length > 0 ? (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((artwork, i) => (
              <Reveal key={artwork.id} delay={Math.min(i % 4, 3) * 80}>
                <Link href={`/artwork/${artwork.slug}`} className="group focus-ring block">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-mist">
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-ink/0 transition-all duration-500 group-hover:bg-ink/15" />

                    {/* Status badge */}
                    {artwork.status === "sold" && (
                      <div className="absolute top-3 left-3">
                        <span className="label bg-ink/80 px-2 py-1 text-chalk backdrop-blur-sm">
                          Sold
                        </span>
                      </div>
                    )}

                    {/* Price on hover */}
                    {artwork.priceGbp && artwork.status === "available" && (
                      <div className="absolute inset-x-0 bottom-0 translate-y-1 p-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                        <span className="label bg-paper/90 px-2 py-1 text-ink backdrop-blur-sm">
                          £{artwork.priceGbp}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-3">
                    <h2 className="font-title text-sm leading-snug">{artwork.title}</h2>
                    <div className="mt-1.5 flex items-center justify-between gap-3">
                      <p className="label text-graphite">
                        {artwork.year}
                        {artwork.medium ? ` — ${artwork.medium}` : ""}
                      </p>
                      {artwork.status === "available" && artwork.priceGbp && (
                        <p className="label text-ink">£{artwork.priceGbp}</p>
                      )}
                      {artwork.status === "sold" && (
                        <p className="label text-graphite/50">Sold</p>
                      )}
                    </div>
                    {artwork.printAvailable && (
                      <p className="label mt-1 text-moss">Print available</p>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState message="No works in the archive yet." />
        )}
      </section>
    </>
  );
}
