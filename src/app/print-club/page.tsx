import type { Metadata } from "next";
import Image from "next/image";
import { SubscribeButton } from "@/components/forms/SubscribeButton";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { getPrintClubMonths } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Print Club"
};

export default async function PrintClubPage() {
  const months = await getPrintClubMonths();

  return (
    <>
      {/* ─── Hero (dark) ───────────────────────────────────── */}
      <section className="bg-ink text-chalk">
        <div className="container-shell py-20 md:py-28">
          <div className="grid gap-14 md:grid-cols-[1fr_380px]">
            <div>
              <Reveal>
                <p className="label text-chalk/40">Membership</p>
                <h1 className="mt-3 font-title text-5xl text-chalk md:text-7xl">
                  Print Club
                </h1>
                <p className="mt-7 max-w-lg text-sm leading-8 text-chalk/55">
                  A slower way to collect. Each month, subscribers receive one
                  physical print from a yearly project of twelve works, alongside
                  process notes, a digital file, and a short letter from
                  Alexandra.
                </p>
              </Reveal>
              <Reveal delay={150} className="mt-10">
                <SubscribeButton />
              </Reveal>
            </div>

            {/* What's included */}
            <Reveal delay={200} className="self-center">
              <div className="border border-chalk/15 p-6">
                <p className="label text-chalk/40">What is included</p>
                <ul className="mt-5 grid gap-0">
                  {[
                    "One physical print per month",
                    "Digital print file (high-res)",
                    "Process PDF and studio notes",
                    "Monthly letter from Alexandra",
                    "Access to subscriber digital archive",
                    "Twelve prints across one year"
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-baseline gap-4 border-b border-chalk/10 py-3.5 text-sm leading-6 text-chalk/65 last:border-b-0"
                    >
                      <span className="h-px w-4 shrink-0 translate-y-[-3px] bg-chalk/25" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4 text-xs leading-6 text-chalk/30">
                One subscription tier. Account required to access subscriber files.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Ticker ───────────────────────────────────────── */}
      <Marquee
        items={[
          "Monthly Print",
          "Digital File",
          "Process Notes",
          "Monthly Letter",
          "Subscriber Archive",
          "Twelve Works Per Year",
          "£15 Per Month"
        ]}
        className="bg-paper"
      />

      {/* ─── Monthly archive ──────────────────────────────── */}
      <section className="container-shell py-16 md:py-24">
        <Reveal className="border-b border-line pb-6">
          <p className="label text-graphite">Archive</p>
          <h2 className="mt-2 font-title text-2xl md:text-3xl">Monthly Archive</h2>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-graphite">
            Each entry holds the main image alongside subscriber-only files: a
            digital print, process PDF, and monthly letter. Files are locked
            until your subscription is active.
          </p>
        </Reveal>

        {months.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {months.map((month, i) => (
              <Reveal key={month.id} delay={i % 2 === 0 ? 0 : 100}>
                <article className="group border border-line">
                  <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                    <Image
                      src={month.imageUrl}
                      alt={month.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-ink/0 transition-all duration-500 group-hover:bg-ink/20" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="label text-graphite">
                        {monthName(month.month)} {month.year}
                      </span>
                      <span className="label border border-ink bg-ink px-2 py-1 text-chalk">
                        Subscriber only
                      </span>
                    </div>
                    <h2 className="mt-3 font-title text-xl">{month.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-graphite">{month.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Digital print", "Process PDF", "Monthly letter"].map((tag) => (
                        <span key={tag} className="label border border-line px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-line bg-chalk px-8 py-16 text-center">
            <p className="label text-graphite">
              The first monthly release will appear here when the project begins.
            </p>
          </div>
        )}
      </section>

      {/* ─── Newsletter ───────────────────────────────────── */}
      <section className="border-t border-line bg-chalk">
        <div className="container-shell grid gap-10 py-16 md:grid-cols-[1fr_400px] md:py-20">
          <Reveal>
            <p className="label text-graphite">Stay informed</p>
            <h2 className="mt-2 font-title text-2xl md:text-3xl">Stay Informed</h2>
            <p className="mt-4 text-sm leading-8 text-graphite">
              Join the newsletter for Print Club release dates, new work, and updates.
            </p>
          </Reveal>
          <Reveal delay={150} className="self-end">
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

function monthName(month: number) {
  const names = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return names[month - 1] ?? month;
}
