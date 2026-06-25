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
            {isAvailable && <StatusLabel tone="available">Available</StatusLabel>}
            {artwork.printAvailable && (
              <StatusLabel tone="neutral">Print available</StatusLabel>
            )}
          </div>

          <h1 className="mt-5 font-serif text-5xl font-light leading-tight">
            {artwork.title}
          </h1>
          <p className="mt-2 text-base text-graphite">
            {artwork.year}
            {artwork.medium ? `, ${artwork.medium}` : ""}
          </p>

          <dl className="mt-8 grid gap-0 border-y border-line py-6 text-sm">
            {artwork.dimensions && (
              <MetaRow label="Dimensions" value={artwork.dimensions} />
            )}
            {artwork.series && (
              <MetaRow label="Series" value={artwork.series} />
            )}
            {artwork.editionInfo && (
              <MetaRow label="Edition" value={artwork.editionInfo} />
            )}
            {artwork.priceGbp && isAvailable ? (
              <MetaRow label="Price" value={`GBP ${artwork.priceGbp}`} />
            ) : null}
          </dl>

          {artwork.description && (
            <p className="mt-7 text-sm leading-8 text-graphite">
              {artwork.description}
            </p>
          )}

          {artwork.certificateNote && (
            <p className="mt-5 text-xs leading-6 text-graphite">
              {artwork.certificateNote}
            </p>
          )}

          {artwork.shippingNotes && (
            <p className="mt-3 text-xs leading-6 text-graphite">
              {artwork.shippingNotes}
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
            {!isAvailable && !artwork.printAvailable ? (
              <ButtonLink href="/commissions" variant="quiet">
                Enquire
              </ButtonLink>
            ) : (
              <ButtonLink href="/commissions" variant="quiet">
                Enquire
              </ButtonLink>
            )}
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
    <div className="grid grid-cols-[130px_1fr] gap-4 border-b border-line py-3 last:border-b-0">
      <dt className="text-graphite">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
