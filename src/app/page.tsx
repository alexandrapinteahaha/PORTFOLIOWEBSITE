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
          2026 Print Club — Applications Opening Soon.{" "}
          <Link href="/print-club" className="underline underline-offset-4 hover:text-ink transition-colors">
            Learn more
          </Link>
        </p>
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────────
          Reduced to ~40vh — artwork must be visible without scrolling.
          Bottom-left text layout: editorial, gallery signage, not centred.
          Black box is a deliberate placeholder for a full-bleed artwork image.
          Name is large but not the only thing on screen.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[42vh] flex-col items-center justify-center bg-ink px-8 py-14 md:px-14">
        <div className="text-center">
          <p className="label text-chalk mb-4">Contemporary Artist · United Kingdom</p>

          <div
            className="font-title font-bold text-chalk"
            style={{ display: "inline-grid", lineHeight: 1.0 }}
          >
            <span style={{ fontSize: "clamp(2.2rem, 5.5vw, 5rem)", letterSpacing: "0.04em" }}>
              ALEXANDRA
            </span>
            <span
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "clamp(2.2rem, 5.5vw, 5rem)",
                letterSpacing: 0,
              }}
            >
              {["P","I","N","T","E","A"].map((c) => (
                <span key={c}>{c}</span>
              ))}
            </span>
          </div>

          <div className="mt-10 flex justify-center">
            <ButtonLink href="/archive" variant="ghost">
              View Selected Works
            </ButtonLink>
          </div>
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

      {/* ── Print Club ───────────────────────────────────────────────────────
          Framed as a collectors programme, not a shop product.
          Language: curated, limited, exclusive, certified — not "buy" or "shop".
          Dark section creates visual separation and elevates the offering.
          Details listed as quiet facts, not bullet-point marketing.
      ──────────────────────────────────────────────────────────────────────── */}
      <section className="border-t border-line bg-ink text-chalk">
        <div className="container-shell py-16 md:py-20">
          <div className="mb-10 flex items-start justify-between gap-6">
            <div>
              <p className="label text-chalk/40">Collectors Programme</p>
              <h2 className="mt-3 font-title text-3xl text-chalk md:text-4xl">Print Club</h2>
            </div>
            <div className="shrink-0 self-end">
              <ButtonLink href="/print-club" variant="ghost">
                Become a Member
              </ButtonLink>
            </div>
          </div>

          {/* Timeline — numbered circles connected by dashed line */}
          <div className="relative flex items-start justify-between">
            {/* Dashed connector */}
            <div
              className="absolute"
              style={{
                top: "21px",
                left: "calc(50% - 50vw + 1.5rem)",
                right: "calc(50% - 50vw + 1.5rem)",
                borderTop: "1.5px dashed rgba(251,250,247,0.25)"
              }}
            />
            {[
              ["1", "High Quality\nPrint"],
              ["2", "Personal\nLetter"],
              ["3", "Digital Studio\nJournal"],
            ].map(([num, label]) => (
              <div key={num} className="relative z-10 flex flex-1 flex-col items-center">
                <div
                  className="flex items-center justify-center rounded-full bg-chalk"
                  style={{ width: 42, height: 42 }}
                >
                  <span
                    className="font-title font-bold text-ink"
                    style={{ fontSize: "15px", lineHeight: 1 }}
                  >
                    {num}
                  </span>
                </div>
                <p
                  className="mt-4 max-w-[80px] whitespace-pre-line text-center"
                  style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(251,250,247,0.5)", lineHeight: 1.8 }}
                >
                  {label}
                </p>
              </div>
            ))}
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
