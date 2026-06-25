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
        <div className="mt-4 grid gap-1">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-serif text-2xl font-medium leading-tight">
              {artwork.title}
            </h3>
            {artwork.status === "sold" && (
              <span className="shrink-0 text-xs uppercase tracking-[0.12em] text-rust">
                Sold
              </span>
            )}
          </div>
          <p className="text-sm text-graphite">
            {artwork.year}
            {artwork.medium ? `, ${artwork.medium}` : ""}
          </p>
          {artwork.printAvailable && artwork.status === "sold" && (
            <p className="text-xs uppercase tracking-[0.1em] text-moss">
              Print available
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
