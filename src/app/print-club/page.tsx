import type { Metadata } from "next";
import Image from "next/image";
import { SubscribeButton } from "@/components/forms/SubscribeButton";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getPrintClubMonths } from "@/lib/data/loaders";

export const metadata: Metadata = {
  title: "Print Club"
};

export default async function PrintClubPage() {
  const months = await getPrintClubMonths();

  return (
    <>
      <section className="border-b border-line">
        <div className="container-shell py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_380px]">
            <div>
              <h1 className="font-serif text-6xl font-light leading-[0.92] tracking-tight md:text-8xl">
                Print Club
              </h1>
              <p className="mt-8 max-w-xl text-base leading-8 text-graphite md:text-lg">
                Print Club is a slower way to collect. Each month, subscribers
                receive one physical print from a yearly project of twelve works,
                alongside process notes, a digital file, and a short letter from
                Alexandra.
              </p>
              <div className="mt-10">
                <SubscribeButton />
              </div>
            </div>

            <div className="grid content-start gap-4">
              <div className="border border-line bg-chalk p-5 text-sm leading-8 text-graphite">
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink">
                  What is included
                </h2>
                <ul className="grid gap-2.5">
                  <li className="flex items-baseline gap-3">
                    <span className="mt-1 h-px w-3 shrink-0 bg-graphite" />
                    One physical print per month, posted as a letter or small package
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span className="mt-1 h-px w-3 shrink-0 bg-graphite" />
                    Digital file of each monthly print
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span className="mt-1 h-px w-3 shrink-0 bg-graphite" />
                    Process PDF and studio notes
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span className="mt-1 h-px w-3 shrink-0 bg-graphite" />
                    Monthly letter from Alexandra
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span className="mt-1 h-px w-3 shrink-0 bg-graphite" />
                    Access to the subscriber digital archive
                  </li>
                  <li className="flex items-baseline gap-3">
                    <span className="mt-1 h-px w-3 shrink-0 bg-graphite" />
                    Twelve prints across one yearly project
                  </li>
                </ul>
              </div>
              <p className="text-xs leading-6 text-graphite">
                One subscription tier. Account access required to view subscriber
                files. Non-subscribers can see previews and subscribe to unlock
                content.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-16 md:py-20">
        <SectionHeader
          title="Monthly archive"
          intro="Each entry holds the main image alongside subscriber-only files: a digital print, process PDF, and monthly letter. Files are locked until your subscription is active."
        />

        {months.length > 0 ? (
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {months.map((month) => (
              <article key={month.id} className="group border border-line bg-chalk">
                <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                  <Image
                    src={month.imageUrl}
                    alt={month.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
                      {monthName(month.month)} {month.year}
                    </span>
                    <span className="border border-ink bg-ink px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-chalk">
                      Subscriber only
                    </span>
                  </div>
                  <h2 className="mt-3 font-serif text-2xl font-medium">{month.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-graphite">{month.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.1em] text-graphite">
                    <span className="border border-line px-2 py-1">Digital print</span>
                    <span className="border border-line px-2 py-1">Process PDF</span>
                    <span className="border border-line px-2 py-1">Monthly letter</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-dashed border-line bg-chalk px-8 py-12 text-center">
            <p className="text-sm text-graphite">
              The first monthly release will appear here when the project begins.
            </p>
          </div>
        )}
      </section>

      <section className="border-t border-line bg-chalk">
        <div className="container-shell grid gap-10 py-16 md:grid-cols-[1fr_400px]">
          <SectionHeader
            title="Stay informed"
            intro="Join the newsletter for Print Club release dates, new work, and updates."
          />
          <div className="self-end">
            <NewsletterForm />
          </div>
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
