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
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
          {artwork.status === "sold" && (
            <div className="absolute inset-0 bg-ink/5" />
          )}
        </div>
        <div className="mt-4 border-t border-dotted border-line pt-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-title text-base leading-snug">{artwork.title}</h3>
            {artwork.status === "sold" && (
              <span className="label shrink-0 text-rust">Sold</span>
            )}
          </div>
          <p className="label mt-2 text-graphite">
            {artwork.year}{artwork.medium ? ` — ${artwork.medium}` : ""}
          </p>
          {artwork.printAvailable && artwork.status === "sold" && (
            <p className="label mt-1 text-moss">Print available</p>
          )}
        </div>
      </Link>
    </article>
  );
}
