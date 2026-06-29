import Image from "next/image";
import Link from "next/link";
import { Marquee } from "@/components/ui/Marquee";
import { getArtworks } from "@/lib/data/loaders";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const artworks = await getArtworks();
  const visible = artworks.filter((a) => a.status !== "hidden");

  return (
    <>
      {/* ── Marquee ──────────────────────────────────────── */}
      <Marquee items={["UPCOMING — 2026 PRINT CLUB"]} />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[60vh] flex-col items-center justify-center bg-ink px-6 text-center">
        <p className="label text-chalk/60">Contemporary Artist · United Kingdom</p>
        <h1
          className="mt-4 font-title font-bold text-chalk"
          style={{ fontSize: "clamp(2.8rem, 8vw, 6.5rem)", lineHeight: 1.05, letterSpacing: "0.06em" }}
        >
          Alexandra<br />Pintea
        </h1>
      </section>

      {/* ── Works grid ───────────────────────────────────── */}
      {visible.length > 0 && (
        <section className="container-shell pt-16 pb-24 md:pt-20 md:pb-32">
          <p className="label mb-10 text-graphite">Selected Works</p>
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {visible.map((artwork) => (
              <Link
                key={artwork.id}
                href={`/artwork/${artwork.slug}`}
                className="group focus-ring block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-mist">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
                  {artwork.status === "available" && artwork.priceGbp && (
                    <div className="absolute inset-x-0 bottom-0 translate-y-1 p-3 opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="label bg-paper/90 px-2 py-1 text-ink backdrop-blur-sm">
                        £{artwork.priceGbp}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <h2 className="font-title text-sm font-bold leading-snug">{artwork.title}</h2>
                  <p className="label mt-1 text-graphite">
                    {artwork.year}{artwork.medium ? ` — ${artwork.medium}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
