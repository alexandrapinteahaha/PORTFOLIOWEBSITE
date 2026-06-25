import { ArtworkCard } from "@/components/ArtworkCard";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getArtworks, getProducts } from "@/lib/data/loaders";

export default async function HomePage() {
  const [artworks, products] = await Promise.all([getArtworks(), getProducts()]);
  const featuredArtworks = artworks.slice(0, 3);
  const featuredProducts = products.filter((p) => p.isActive).slice(0, 3);

  return (
    <>
      <section className="border-b border-line">
        <div className="container-shell py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1fr_380px]">
            <div>
              <h1 className="font-serif text-6xl font-light leading-[0.92] tracking-tight md:text-8xl">
                Alexandra Pintea
              </h1>
              <p className="mt-8 max-w-lg text-base leading-8 text-graphite md:text-lg">
                A living archive of sculpture, multimedia work, photography,
                and digital studies. Original works, selected prints, and
                monthly Print Club releases.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <ButtonLink href="/portfolio">View portfolio</ButtonLink>
                <ButtonLink href="/print-club" variant="secondary">
                  Join Print Club
                </ButtonLink>
                <ButtonLink href="/commissions" variant="quiet">
                  Commission work
                </ButtonLink>
              </div>
            </div>
            <div className="border-l border-line pl-8 md:pt-2">
              <p className="text-sm leading-8 text-graphite">
                Sold works remain visible as part of the archive. Prints can
                remain available after an original sells. Print Club
                subscribers receive one physical print each month, alongside
                digital access, process notes, and a monthly letter.
              </p>
              <div className="mt-6 border-t border-line pt-6 text-xs uppercase tracking-[0.12em] text-graphite">
                Based in the UK. Ships internationally.
              </div>
            </div>
          </div>
        </div>
      </section>

      {featuredArtworks.length > 0 && (
        <section className="container-shell py-16 md:py-20">
          <div className="flex items-baseline justify-between gap-6">
            <SectionHeader
              title="Selected works"
              intro="A small selection from the current archive."
            />
            <ButtonLink href="/gallery" variant="quiet">
              View all
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featuredArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-line bg-chalk">
        <div className="container-shell py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_420px]">
            <div>
              <SectionHeader
                title="Print Club"
                intro="A slower way to collect. One physical print each month from a yearly project of twelve works."
              />
              <div className="mt-8 grid gap-4 text-sm leading-8 text-graphite md:grid-cols-2">
                <p>
                  Each month subscribers receive a physical print, a digital
                  file, a process PDF, and a short letter from Alexandra.
                </p>
                <p>
                  One subscription tier. Digital archive and subscriber-only
                  content unlocked after subscribing.
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-6">
              <dl className="grid gap-3 border border-line bg-paper p-5 text-sm">
                <Row label="Format" value="Monthly physical print" />
                <Row label="Includes" value="Digital file, process PDF, letter" />
                <Row label="Project" value="12 prints across one year" />
                <Row label="Access" value="Subscriber archive unlocked" />
              </dl>
              <ButtonLink href="/print-club">Join Print Club</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section className="container-shell py-16 md:py-20">
          <div className="flex items-baseline justify-between gap-6">
            <SectionHeader
              title="Available works"
              intro="Original works, prints, and digital editions."
            />
            <ButtonLink href="/shop" variant="quiet">
              Visit shop
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <div className="container-shell grid gap-10 py-16 md:grid-cols-[1fr_400px] md:py-20">
          <SectionHeader
            title="Newsletter"
            intro="Occasional updates for Print Club releases, new work, and announcements. No regular schedule."
          />
          <div className="self-end">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3 last:border-b-0 last:pb-0">
      <dt className="text-graphite">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
