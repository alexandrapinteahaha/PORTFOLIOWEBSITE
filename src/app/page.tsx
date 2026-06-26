import { ArtworkCard } from "@/components/ArtworkCard";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { getArtworks, getProducts } from "@/lib/data/loaders";

export default async function HomePage() {
  const [artworks, products] = await Promise.all([getArtworks(), getProducts()]);
  const featuredArtworks = artworks.filter((a) => a.status !== "hidden").slice(0, 3);
  const featuredProducts = products.filter((p) => p.isActive).slice(0, 3);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative -mt-32 min-h-screen overflow-hidden bg-ink">
        {/* Placeholder gradient — replace with real image */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 40%, #2a2520 0%, #171717 100%)"
          }}
        />

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px"
          }}
        />

        {/* Content */}
        <div className="container-shell relative z-10 flex min-h-screen flex-col justify-between pb-12 pt-56 md:pt-64">
          {/* Top label */}
          <div className="animate-fade-in delay-100">
            <p className="label text-chalk/40">Contemporary Artist · UK</p>
          </div>

          {/* Main text block */}
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <h1 className="animate-fade-up delay-200 font-title text-[clamp(3.5rem,10vw,8rem)] leading-none text-chalk">
                Alexandra
                <br />
                Pintea
              </h1>
              <p className="animate-fade-up delay-300 mt-6 max-w-md text-sm leading-8 text-chalk/55">
                A living archive of sculpture, multimedia work, photography, and
                digital studies. Original works, selected prints, and monthly
                Print Club releases.
              </p>
            </div>

            {/* CTAs */}
            <div className="animate-fade-up delay-400 flex flex-col gap-3 md:items-end">
              <ButtonLink href="/portfolio" variant="ghost">
                View portfolio
              </ButtonLink>
              <ButtonLink href="/print-club" variant="ghost">
                Join Print Club
              </ButtonLink>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="animate-fade-in delay-600 flex items-center gap-3">
            <span className="h-px w-8 bg-chalk/25" />
            <span className="label text-chalk/30">Scroll</span>
          </div>
        </div>
      </section>

      {/* ─── Ticker ───────────────────────────────────────── */}
      <Marquee
        items={[
          "Sculpture",
          "Multimedia",
          "Photography",
          "Digital Studies",
          "Print Club",
          "Based in the UK",
          "Ships Internationally",
          "Original Works",
          "Monthly Prints"
        ]}
      />

      {/* ─── Selected Works ───────────────────────────────── */}
      {featuredArtworks.length > 0 && (
        <section className="container-shell py-20 md:py-28">
          <Reveal className="flex items-end justify-between gap-6 border-b border-line pb-6">
            <div>
              <p className="label text-graphite">Selected works</p>
              <h2 className="mt-2 font-title text-2xl md:text-3xl">Recent Archive</h2>
            </div>
            <ButtonLink href="/gallery" variant="quiet">
              View all
            </ButtonLink>
          </Reveal>

          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {featuredArtworks.map((artwork, i) => (
              <Reveal key={artwork.id} delay={i * 120}>
                <ArtworkCard artwork={artwork} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ─── Print Club (dark editorial) ──────────────────── */}
      <section className="bg-ink text-chalk">
        <div className="container-shell py-20 md:py-28">
          <div className="grid gap-16 md:grid-cols-[1fr_1fr]">
            {/* Left: text */}
            <div>
              <Reveal>
                <p className="label text-chalk/40">Membership</p>
                <h2 className="mt-3 font-title text-3xl text-chalk md:text-4xl">
                  Print Club
                </h2>
                <p className="mt-6 text-sm leading-8 text-chalk/55">
                  A slower way to collect. One physical print each month from a
                  yearly project of twelve works — alongside process notes, a
                  digital file, and a short letter from Alexandra.
                </p>
                <p className="mt-4 text-sm leading-8 text-chalk/55">
                  One subscription tier. Subscriber archive and digital content
                  unlocked immediately after subscribing.
                </p>
              </Reveal>
              <Reveal delay={150} className="mt-10">
                <ButtonLink href="/print-club" variant="ghost">
                  Join Print Club — £15 / month
                </ButtonLink>
              </Reveal>
            </div>

            {/* Right: feature list */}
            <Reveal delay={100} className="self-center">
              <ul className="grid gap-0">
                {[
                  ["01", "Monthly physical print", "Posted directly to your door"],
                  ["02", "Digital file", "High-resolution print-ready file"],
                  ["03", "Process notes", "Studio PDF + monthly letter"],
                  ["04", "Subscriber archive", "Digital access unlocked"]
                ].map(([num, title, sub]) => (
                  <li
                    key={num}
                    className="flex items-start gap-6 border-t border-chalk/10 py-5 last:border-b last:border-chalk/10"
                  >
                    <span className="label mt-0.5 text-chalk/25">{num}</span>
                    <div>
                      <p className="label text-chalk/80">{title}</p>
                      <p className="mt-1 text-xs leading-6 text-chalk/35">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Available Works ──────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="container-shell py-20 md:py-28">
          <Reveal className="flex items-end justify-between gap-6 border-b border-line pb-6">
            <div>
              <p className="label text-graphite">Shop</p>
              <h2 className="mt-2 font-title text-2xl md:text-3xl">Available Works</h2>
            </div>
            <ButtonLink href="/shop" variant="quiet">
              Visit shop
            </ButtonLink>
          </Reveal>

          <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {featuredProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 120}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ─── Newsletter ───────────────────────────────────── */}
      <section className="border-t border-line bg-chalk">
        <div className="container-shell py-20 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_440px] md:items-end">
            <Reveal>
              <p className="label text-graphite">Stay informed</p>
              <h2 className="mt-2 font-title text-2xl md:text-3xl">Newsletter</h2>
              <p className="mt-4 max-w-sm text-sm leading-8 text-graphite">
                Occasional updates for Print Club releases, new work, and
                announcements. No regular schedule, no noise.
              </p>
            </Reveal>
            <Reveal delay={150} className="self-end">
              <NewsletterForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
