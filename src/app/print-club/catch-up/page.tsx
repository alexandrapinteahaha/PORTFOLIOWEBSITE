import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Catch Up Prints — Print Club"
};

export default function CatchUpPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-shell py-14 md:py-20">
          <Reveal>
            <p className="label text-graphite">
              <Link href="/print-club" className="hover:text-ink transition-colors">Print Club</Link>
              <span className="mx-2 text-graphite/40">·</span>
              Catch Up Prints
            </p>
            <h1 className="mt-2 font-title text-4xl md:text-5xl">Catch Up Prints</h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-graphite">
              Missed a month? Catch up prints allow you to purchase individual
              monthly prints from the current year&apos;s collection — outside of the
              subscription cycle.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-shell py-14 md:py-20">
        <Reveal>
          <div className="max-w-lg border border-dashed border-line bg-chalk px-8 py-12">
            <p className="label text-graphite">Coming soon</p>
            <p className="mt-3 text-sm leading-7 text-graphite">
              Catch up prints will be available once the 2026 collection is
              underway. Subscribe to the newsletter to be notified when
              individual prints become available.
            </p>
            <div className="mt-6 flex gap-3">
              <ButtonLink href="/print-club" variant="primary">
                Join Print Club
              </ButtonLink>
              <ButtonLink href="/archive" variant="secondary">
                View archive
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
