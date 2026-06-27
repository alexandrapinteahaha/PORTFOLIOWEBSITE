import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SubscribeButton } from "@/components/forms/SubscribeButton";

export const metadata: Metadata = {
  title: "Join Print Club"
};

export default function JoinPrintClubPage() {
  return (
    <>
      {/* ── Header (dark) ────────────────────────────────── */}
      <section className="bg-ink text-chalk">
        <div className="container-shell py-20 md:py-28">
          <Reveal>
            <p className="label text-chalk/40">
              <Link href="/print-club" className="hover:text-chalk/70 transition-colors">
                Print Club
              </Link>
              <span className="mx-2 opacity-30">·</span>
              Join
            </p>
            <h1 className="mt-3 font-title text-5xl text-chalk md:text-7xl">
              Join Print Club
            </h1>
            <p className="mt-7 max-w-lg text-sm leading-8 text-chalk/55">
              Each year, a mini project begins — creating 12 pieces in total,
              with an additional birthday print. A slower way to collect.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-10">
            <SubscribeButton />
          </Reveal>
        </div>
      </section>

      {/* ── 2026 Collection ──────────────────────────────── */}
      <section className="border-b border-line">
        <div className="container-shell py-16 md:py-20">
          <div className="grid gap-14 md:grid-cols-[1fr_1fr]">
            <Reveal>
              <p className="label text-graphite">2026 Collection</p>
              <h2 className="mt-2 font-title text-2xl md:text-3xl">Explores Identity</h2>
              <p className="mt-5 text-sm leading-8 text-graphite">
                The 2026 mini collection is a year-long project of twelve
                monthly prints — each one a study in identity. What we
                carry, what we inherit, what we become.
              </p>
              <p className="mt-4 text-sm leading-8 text-graphite">
                Making a creative process accessible — inspiration, influence and
                process are shared with subscribers throughout the year alongside
                each monthly release.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <p className="label text-graphite">Timeline</p>
              <ul className="mt-4 grid gap-0">
                {[
                  ["January 2026", "Collection begins — first print dispatched"],
                  ["Monthly", "One print per month, plus digital file"],
                  ["Throughout", "Process log updated with each release"],
                  ["December 2026", "Twelfth and final print of the year"],
                  ["Birthday month", "Additional birthday print — one per year"]
                ].map(([date, desc]) => (
                  <li
                    key={date}
                    className="flex gap-8 border-b border-line py-4 text-sm last:border-b-0"
                  >
                    <span className="w-36 shrink-0 text-graphite">{date}</span>
                    <span className="text-ink">{desc}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── What's included ──────────────────────────────── */}
      <section className="container-shell py-16 md:py-20">
        <Reveal className="border-b border-line pb-6">
          <p className="label text-graphite">Membership</p>
          <h2 className="mt-2 font-title text-2xl md:text-3xl">What&apos;s Included</h2>
        </Reveal>

        <div className="mt-10 grid gap-0">
          {[
            {
              num: "01",
              title: "A personal letter",
              body: "Each month includes a handwritten letter from Alexandra — thoughts on the work, the process, the month."
            },
            {
              num: "02",
              title: "High quality physical print",
              body: "A museum-quality physical print, posted directly to your door as part of the subscription."
            },
            {
              num: "03",
              title: "Digital access to a process log",
              body: "Subscribers receive access to an ongoing digital log — inspiration, influences, and working notes for each piece."
            },
            {
              num: "04",
              title: "Inspiration, influence and process",
              body: "The creative process made visible. What sparked the work, what shaped it, how it was made."
            },
            {
              num: "05",
              title: "Birthday print",
              body: "Every subscriber receives an additional birthday print each year — a thirteenth piece, personal and separate from the main collection."
            }
          ].map(({ num, title, body }) => (
            <Reveal key={num}>
              <div className="grid gap-6 border-b border-line py-8 md:grid-cols-[60px_260px_1fr]">
                <span className="label text-graphite/30">{num}</span>
                <h3 className="font-title text-sm font-bold uppercase tracking-[0.12em] text-ink">{title}</h3>
                <p className="text-sm leading-7 text-graphite">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-chalk border-t border-line">
        <div className="container-shell py-16 md:py-20">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <Reveal>
              <p className="label text-graphite">One subscription tier</p>
              <h2 className="mt-2 font-title text-2xl md:text-3xl">Ready to Join?</h2>
              <p className="mt-4 max-w-md text-sm leading-8 text-graphite">
                £15 per month. Cancel any time. Account required to access
                subscriber files and the digital archive.
              </p>
            </Reveal>
            <Reveal delay={100} className="self-center">
              <SubscribeButton />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
