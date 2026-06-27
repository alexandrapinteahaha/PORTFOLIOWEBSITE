import { ButtonLink } from "@/components/ui/ButtonLink";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export default async function HomePage() {

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: "72vh" }}>
        {/* Background — replace src with real artwork once uploaded */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1c1917 0%, #292524 40%, #1c1917 100%)"
          }}
        />

        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px"
          }}
        />

        {/* Hero content — centered like Maura K Spain */}
        <div className="relative z-10 flex min-h-[72vh] flex-col items-center justify-center px-6 text-center">
          <p className="animate-fade-in delay-100" style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#fbfaf7" }}>
            Contemporary Artist · United Kingdom
          </p>

          <h1
            className="animate-fade-up mt-6 whitespace-nowrap font-title font-bold text-chalk delay-200"
            style={{ fontSize: "clamp(2rem, 6vw, 5.5rem)", letterSpacing: "0.08em", lineHeight: 1.05 }}
          >
            Alexandra Pintea
          </h1>

          <p className="animate-fade-up mt-7 max-w-md text-sm leading-8 delay-300" style={{ color: "#fbfaf7" }}>
            A living archive of sculpture, multimedia work, photography, and
            digital studies.
          </p>

          <div className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4 delay-400">
            <ButtonLink href="/archive" variant="ghost">
              View Archive
            </ButtonLink>
            <ButtonLink href="/print-club" variant="ghost">
              Join Print Club
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────── */}
      <Marquee
        items={[
          "Print Club 2026",
          "Coming Soon",
          "New Mini Collection",
          "Print Club 2026",
          "Coming Soon",
          "New Mini Collection"
        ]}
      />


      {/* ── Print Club (dark editorial) ───────────────────── */}
      <section className="bg-ink text-chalk">
        <div className="container-shell py-20 md:py-28">

          {/* Title + CTA */}
          <Reveal>
            <p style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(251,250,247,0.4)" }}>
              2026 Collection
            </p>
            <h2 className="mt-3 font-title text-5xl text-chalk md:text-6xl">
              Print Club
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <ButtonLink href="/print-club/join" variant="ghost">
              Join Print Club
            </ButtonLink>
          </Reveal>

          {/* Timeline */}
          <Reveal delay={200} className="mt-16 md:mt-20">
            <div className="relative flex items-start justify-between">
              {/* Dashed connector */}
              <div
                className="absolute left-0 right-0"
                style={{ top: "11px", borderTop: "1px dashed rgba(251,250,247,0.5)" }}
              />
              {[
                ["01", "A Personal Letter"],
                ["02", "High Quality Print"],
                ["03", "Process Log Access"],
                ["04", "Birthday Print"],
              ].map(([num, title]) => (
                <div key={num} className="relative z-10 flex flex-1 flex-col items-center">
                  {/* Ball */}
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-chalk">
                    <span className="font-title text-[8px] font-bold leading-none text-ink">{num}</span>
                  </div>
                  {/* Label */}
                  <p className="mt-4 max-w-[90px] text-center" style={{ fontSize: "10px", letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(251,250,247,0.6)", lineHeight: 1.7 }}>
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── Commission teaser ────────────────────────────── */}
      <section className="border-y border-line">
        <div className="container-shell py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <Reveal>
              <p className="label text-graphite">Bespoke work</p>
              <h2 className="mt-2 font-title text-2xl md:text-3xl">Commission a Work</h2>
              <p className="mt-4 max-w-lg text-sm leading-8 text-graphite">
                Original commissions across sculpture, multimedia, photography, and digital
                practice. Each commission is developed in close collaboration.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <ButtonLink href="/commissions" variant="secondary">
                Start a conversation
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Newsletter ───────────────────────────────────── */}
      <section className="bg-chalk">
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
