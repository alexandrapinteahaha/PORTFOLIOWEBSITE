import Image from "next/image";
import Link from "next/link";
import { getArtworks } from "@/lib/data/loaders";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const artworks = await getArtworks();
  const visible = artworks.filter((a) => a.status !== "hidden");

  return (
    <>
      {/* ── Announcement bar ─────────────────────────────────────────────────
          Static, single line. Scrolling marquees read as promotional/retail.
          A quiet confident strip reads as gallery institution.
      ──────────────────────────────────────────────────────────────────────── */}
      <div className="border-b border-line bg-paper">
        <p className="py-2.5 text-center label text-graphite">
          2026 Print Club — Opening Soon.{" "}
          <Link href="/print-club" className="underline underline-offset-4 hover:text-ink transition-colors opacity-50 hover:opacity-100">
            Learn More
          </Link>
        </p>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────
          Reduced to ~40vh — artwork must be visible without scrolling.
          Bottom-left text layout: editorial, gallery signage, not centred.
          Black box is a deliberate placeholder for a full-bleed artwork image.
          Name is large but not the only thing on screen.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[42vh] flex-col items-center justify-center px-8 py-14 md:px-14" style={{ backgroundColor: "#171717" }}>
        {/* Background image */}
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dark overlay so white text remains legible */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.52)" }} />

        <div className="relative z-10 flex flex-col items-center text-center">
          <p className="label mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
            Contemporary Artist · United Kingdom
          </p>

          <h1
            className="font-title font-bold"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 5rem)", letterSpacing: "0.08em", lineHeight: 1.0, color: "rgba(255,255,255,0.88)" }}
          >
            ALEXANDRA PINTEA
          </h1>
        </div>
      </section>


      {/* ── Selected Works ───────────────────────────────────────────────────
          Primary content focus. Minimal top padding so the first row of
          artwork cards breaks into the viewport immediately after the hero —
          the visitor should see artwork before any other content.
          "View all" link bottom-right so it doesn't compete with the work.
      ──────────────────────────────────────────────────────────────────────── */}
      {visible.length > 0 && (
        <section className="container-shell pt-10 pb-20 md:pt-14 md:pb-28">
          <div className="mb-8 flex items-baseline justify-between">
            <p className="label text-graphite">Selected Works</p>
            <Link href="/archive" className="label text-graphite/60 hover:text-ink transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

      {/* ── Print Club ───────────────────────────────────────────────────────
          Framed as a collectors programme, not a shop product.
          Language: curated, limited, exclusive, certified — not "buy" or "shop".
          Dark section creates visual separation and elevates the offering.
          Details listed as quiet facts, not bullet-point marketing.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="border-t border-line" style={{ backgroundColor: "#f0eeec" }}>
        <div className="grid md:grid-cols-[1fr_1fr] md:items-stretch">

            {/* Left — image, no padding, flush to edges */}
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-mist md:aspect-auto md:min-h-[320px]">
              <Image
                src="/print-club-feature.png"
                alt="Print Club — monthly art print"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={95}
              />
            </div>

            {/* Right — text */}
            <div className="flex flex-col justify-center px-8 py-8 md:px-12 md:py-10">
              <h2
                className="font-title font-bold text-ink"
                style={{ fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)", lineHeight: 1.15 }}
              >
                The Print Club — Built For Collectors.
              </h2>
              <p className="mt-4 leading-7 text-graphite max-w-xs" style={{ fontSize: "14px" }}>
                Receive a hand-signed, numbered print every month and exclusive access to Studio Archive.
              </p>

              <div className="mt-6">
                <ButtonLink href="/print-club" variant="primary">
                  Sign me up
                </ButtonLink>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Commission ───────────────────────────────────────────────────────
          Secondary placement. Brief, conversational, no pressure.
          One-row layout signals this is an offer, not a hard sell.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="border-t border-line">
        <div className="container-shell flex flex-wrap items-center justify-between gap-6 py-14">
          <div>
            <p className="label text-graphite">Bespoke</p>
            <h2 className="mt-2 font-title text-xl md:text-2xl">Commission a Work</h2>
            <p className="mt-3 max-w-sm text-sm leading-7 text-graphite">
              Original commissions in sculpture and painting, developed in close collaboration.
            </p>
          </div>
          <ButtonLink href="/commissions" variant="secondary">
            Start a conversation
          </ButtonLink>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────────────────────────
          Near the footer, understated. Not a marketing push — framed as
          staying informed. Palette switch to chalk keeps it visually quiet.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="border-t border-line bg-chalk">
        <div className="container-shell grid gap-10 py-12 md:grid-cols-[1fr_360px] md:items-center md:py-14">
          <div>
            <p className="label text-graphite">Updates</p>
            <h2 className="mt-2 font-title text-lg">Stay in touch</h2>
            <p className="mt-2 text-sm leading-7 text-graphite">
              Occasional updates on new work, Print Club releases, and announcements. No schedule, no noise.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
