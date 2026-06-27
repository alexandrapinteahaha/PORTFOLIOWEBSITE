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
          <p className="animate-fade-in label text-chalk/40 delay-100">
            Contemporary Artist · United Kingdom
          </p>

          <h1
            className="animate-fade-up mt-6 font-title font-bold text-chalk delay-200"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)", letterSpacing: "0.08em", lineHeight: 1.05 }}
          >
            Alexandra
            <br />
            Pintea
          </h1>

          <p className="animate-fade-up mt-7 max-w-md text-sm leading-8 text-chalk/50 delay-300">
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
          "Archive",
          "Sculpture",
          "Multimedia",
          "Photography",
          "Digital Studies",
          "Print Club",
          "Original Works",
          "UK Based",
          "Ships Internationally"
        ]}
      />


      {/* ── Print Club (dark editorial) ───────────────────── */}
      <section className="bg-ink text-chalk">
        <div className="container-shell py-20 md:py-28">
          <div className="grid gap-16 md:grid-cols-[1fr_1fr]">
            <Reveal>
              <p className="label text-chalk/40">2026 Collection</p>
              <h2 className="mt-3 font-title text-3xl text-chalk md:text-4xl">
                Print Club
              </h2>
              <p className="mt-6 text-sm leading-8 text-chalk/55">
                Each year, a mini project begins — creating 12 pieces in total,
                with an additional birthday print. A mini collection 2026
                explores identity.
              </p>
              <p className="mt-4 text-sm leading-8 text-chalk/45">
                Making a creative process accessible. Inspiration, influence and
                process — shared with subscribers each month.
              </p>
              <div className="mt-10">
                <ButtonLink href="/print-club" variant="ghost">
                  Join Print Club
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={100} className="self-center">
              <ul className="grid gap-0">
                {[
                  ["01", "A personal letter", "Handwritten and included monthly"],
                  ["02", "High quality print", "Physical print posted to your door"],
                  ["03", "Process log access", "Digital access to inspiration & influence"],
                  ["04", "Birthday print", "An additional print each year"]
                ].map(([num, title, sub]) => (
                  <li
                    key={num}
                    className="flex items-start gap-6 border-t border-chalk/10 py-5 last:border-b last:border-chalk/10"
                  >
                    <span className="label mt-0.5 text-chalk/20">{num}</span>
                    <div>
                      <p className="label text-chalk/75">{title}</p>
                      <p className="mt-1 text-xs leading-6 text-chalk/35">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
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
