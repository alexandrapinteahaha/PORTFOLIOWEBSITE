import Image from "next/image";
import Link from "next/link";
import type { Artwork } from "@/lib/types";

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  return (
    <article className="group">
      <Link href={`/artwork/${artwork.slug}`} className="focus-ring block">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(min-width: 768px) 33vw, 100vw"
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-ink/0 transition-all duration-500 group-hover:bg-ink/20" />

          {/* Status badge */}
          {artwork.status === "sold" && (
            <div className="absolute top-3 right-3">
              <span className="label bg-paper/90 px-2 py-1 text-ink backdrop-blur-sm">
                Sold
              </span>
            </div>
          )}

          {/* Hover reveal: medium + year */}
          <div className="absolute inset-x-0 bottom-0 translate-y-1.5 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <p className="label text-chalk/90">
              {artwork.year}{artwork.medium ? ` — ${artwork.medium}` : ""}
            </p>
          </div>
        </div>

        <div className="mt-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-title text-sm leading-snug">{artwork.title}</h3>
            {artwork.printAvailable && artwork.status === "sold" && (
              <span className="label mt-0.5 shrink-0 text-moss">Print</span>
            )}
          </div>
          <p className="label mt-1.5 text-graphite">
            {artwork.year}{artwork.medium ? ` — ${artwork.medium}` : ""}
          </p>
        </div>
      </Link>
    </article>
  );
}
