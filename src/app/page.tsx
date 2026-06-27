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
            className="animate-fade-up mt-6 font-title font-bold text-chalk delay-200"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", letterSpacing: "0.08em", lineHeight: 1.1 }}
          >
            Alexandra
            <br />
            Pintea
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
      <section className="bg-ink text-chalk overflow-x-hidden">
        <div className="container-shell py-20 md:py-28">

          {/* Title + description */}
          {/* Title + description — flush left */}
          <Reveal className="pl-0">
            <p style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(251,250,247,0.4)" }}>
              2026 Collection
            </p>
            <h2 className="mt-3 font-title text-5xl text-chalk md:text-6xl" style={{ marginLeft: 0 }}>
              Print Club
            </h2>
            <p className="mt-6 whitespace-nowrap leading-8" style={{ fontSize: "20px", color: "rgba(251,250,247,0.75)" }}>
              A hand-signed art print every single month, (plus a bonus for your birthday!) for just £10.
            </p>
          </Reveal>

          {/* Timeline */}
          <Reveal delay={100} className="mt-10">
            <div className="relative flex items-start justify-between">
              {/* Dashed connector — full viewport width */}
              <div
                className="absolute"
                style={{
                  top: "21px",
                  left: "calc(50% - 50vw)",
                  right: "calc(50% - 50vw)",
                  borderTop: "1.5px dashed rgba(251,250,247,0.4)"
                }}
              />
              {[
                ["1", "Letter"],
                ["2", "Print"],
                ["3", "Process\nLog"],
                ["4", "Birthday\nPrint"],
              ].map(([num, title]) => (
                <div key={num} className="relative z-10 flex flex-1 flex-col items-center">
                  <div
                    className="rounded-full bg-chalk"
                    style={{ width: 44, height: 44, position: "relative" }}
                  >
                    <span style={{
                      position: "absolute",
                      top: "54%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontFamily: "'Myanmar Text', serif",
                      fontWeight: 700,
                      fontSize: "15px",
                      lineHeight: 1,
                      color: "#171717"
                    }}>
                      {num}
                    </span>
                  </div>
                  <p className="mt-5 max-w-[90px] whitespace-pre-line text-center" style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(251,250,247,0.6)", lineHeight: 1.8 }}>
                    {title}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Join button — centred below timeline */}
          <Reveal delay={200} className="mt-12 flex justify-center">
            <ButtonLink href="/print-club/join" variant="ghost">
              Join Print Club
            </ButtonLink>
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
