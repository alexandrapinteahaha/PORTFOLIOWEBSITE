import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { StatusLabel } from "@/components/ui/StatusLabel";
import { getArtworkBySlug, getArtworks, getProducts } from "@/lib/data/loaders";

type ArtworkPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ArtworkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const artwork = await getArtworkBySlug(slug);
  return {
    title: artwork?.title ?? "Artwork"
  };
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { slug } = await params;
  const [artwork, products, artworks] = await Promise.all([
    getArtworkBySlug(slug),
    getProducts(),
    getArtworks()
  ]);

  if (!artwork) {
    notFound();
  }

  const originalProduct = products.find(
    (p) => p.artworkId === artwork.id && p.productType === "original"
  );
  const printProduct = products.find(
    (p) => p.artworkId === artwork.id && p.productType === "physical_print"
  );
  const related = artworks
    .filter((a) => a.id !== artwork.id && a.series === artwork.series && a.status !== "hidden")
    .slice(0, 4);

  const isAvailable = artwork.status === "available";
  const isSold = artwork.status === "sold";

  const categoryMedium = artwork.categories
    .filter((c) => c !== "original")
    .map((c) => {
      if (c === "multimedia") return "Mixed Media";
      if (c === "photography") return "Photography";
      if (c === "digital") return "Digital";
      if (c === "print") return "Print";
      return c.charAt(0).toUpperCase() + c.slice(1);
    })[0] ?? null;

  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="grid gap-3">
          <div className="relative aspect-[4/5] overflow-hidden bg-mist">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 55vw, 100vw"
              priority
            />
          </div>
          {artwork.gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {artwork.gallery.slice(1).map((image, i) => (
                <div
                  key={image}
                  className="relative aspect-square overflow-hidden bg-mist"
                >
                  <Image
                    src={image}
                    alt={`${artwork.title}, view ${i + 2}`}
                    fill
                    className="object-cover"
                    sizes="15vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24">
          <div className="flex flex-wrap items-center gap-2">
            {isSold && <StatusLabel tone="sold">Sold</StatusLabel>}
            {artwork.printAvailable && (
              <StatusLabel tone="neutral">Print available</StatusLabel>
            )}
          </div>

          <h1 className="mt-5 font-title text-5xl leading-tight">
            {artwork.title}
          </h1>
          <p className="mt-2 text-base text-graphite">
            {artwork.year}
          </p>

          <dl className="mt-8 border border-line text-sm">
            {categoryMedium && (
              <MetaRow label="MEDIUM" value={categoryMedium} />
            )}
            {artwork.medium && (
              <MetaRow label="MATERIALS" value={artwork.medium} />
            )}
            {artwork.dimensions && (
              <MetaRow label="SIZE" value={artwork.dimensions} />
            )}
            {artwork.editionInfo && (
              <MetaRow label="RARITY" value={artwork.editionInfo} />
            )}
            {artwork.certificateNote && (
              <MetaRow label="COA" value={artwork.certificateNote} />
            )}
            {artwork.shippingNotes && (
              <MetaRow label="FRAME" value={artwork.shippingNotes} />
            )}
            <MetaRow label="SIGNATURE" value="Hand-signed by artist" />
          </dl>

          {artwork.description && (
            <p className="mt-7 text-sm leading-8 text-graphite">
              {artwork.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {isAvailable && originalProduct ? (
              <ButtonLink href={`/shop/${originalProduct.slug}`}>
                Collect this work
              </ButtonLink>
            ) : null}
            {(printProduct || artwork.printAvailable) ? (
              <ButtonLink
                href={printProduct ? `/shop/${printProduct.slug}` : "/shop"}
                variant="secondary"
              >
                Order a print
              </ButtonLink>
            ) : null}
            <ButtonLink href="/commissions" variant="secondary">
              Enquire
            </ButtonLink>
          </div>

          {related.length > 0 && (
            <div className="mt-12 border-t border-line pt-7">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
                Related works
              </h2>
              <ul className="mt-4 grid gap-2">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/artwork/${item.slug}`}
                      className="focus-ring text-sm transition-colors hover:text-rust"
                    >
                      {item.title}, {item.year}
                      {item.status === "sold" && (
                        <span className="ml-2 text-graphite">(sold)</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 items-center border-b border-line last:border-b-0">
      <dt className="border-r border-line px-5 py-3.5 font-title text-xs font-bold tracking-[0.12em] text-graphite">{label}</dt>
      <dd className="px-5 py-3.5 text-sm text-ink">{value}</dd>
    </div>
  );
}
