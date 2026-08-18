import type { Metadata } from "next";
import Image from "next/image";
import { SubscribeButton } from "@/components/forms/SubscribeButton";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
export const metadata: Metadata = {
  title: "Print Club"
};

export default async function PrintClubPage() {

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-[42vh] flex-col items-center justify-center overflow-hidden" style={{ backgroundColor: "#171717" }}>
        {/* Same concrete texture as homepage */}
        <Image
          src="/hero-bg.avif"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.52)" }} />

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <Image
            src="/print-club-logo.png"
            alt="Collectors Club"
            width={900}
            height={200}
            className="w-full max-w-[clamp(280px,80vw,900px)] object-contain opacity-75"
            priority
          />
        </div>
      </section>

      {/* ─── Next Shipment / Subscribe ────────────────────── */}
      <section className="bg-chalk border-b border-line">
        <div className="container-shell py-20 md:py-28 text-center max-w-2xl mx-auto">
          <Reveal>
            <h2 className="font-title text-4xl md:text-5xl">
              Next Shipment: 26th July
            </h2>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] leading-8 text-ink">
              Subscribe before the 26th to receive the current month&apos;s print.
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.1em] text-ink opacity-50">
              New sign-ups will receive July&apos;s edition.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-10 flex justify-center">
            <SubscribeButton />
          </Reveal>
        </div>
      </section>

      {/* ─── What's included ──────────────────────────────── */}
      <section className="bg-paper border-b border-line">
        <div className="container-shell py-16 md:py-20">
          <Reveal className="border-b border-line pb-6 max-w-2xl">
            <p className="label text-graphite">Membership</p>
            <h2 className="mt-2 font-title text-2xl md:text-3xl">What Is Included</h2>
          </Reveal>
          <div className="mt-10 max-w-2xl">
            <ul className="grid gap-0">
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
                  className="flex items-baseline gap-4 border-b border-line py-4 text-sm leading-6 text-graphite last:border-b-0"
                >
                  <span className="h-px w-4 shrink-0 translate-y-[-3px] bg-graphite/30" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-graphite/60">
              One subscription tier. Account required to access subscriber files.
            </p>
          </div>
        </div>
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
