import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "Complete Collections — Print Club"
};

export default function CollectionsPage() {
  return (
    <>
      <section className="border-b border-line">
        <div className="container-shell py-14 md:py-20">
          <Reveal>
            <p className="label text-graphite">
              <Link href="/print-club" className="hover:text-ink transition-colors">Print Club</Link>
              <span className="mx-2 text-graphite/40">·</span>
              Complete Collections
            </p>
            <h1 className="mt-2 font-title text-4xl md:text-5xl">Complete Collections</h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-graphite">
              Each Print Club year produces a complete collection of 12 prints
              plus a birthday print. Complete sets are offered as a bundle once
              a year&apos;s project closes.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-shell py-14 md:py-20">
        <Reveal>
          <div className="max-w-lg border border-dashed border-line bg-chalk px-8 py-12">
            <p className="label text-graphite">No completed collections yet</p>
            <p className="mt-3 text-sm leading-7 text-graphite">
              The first complete collection will be available at the end of the
              2026 project year. Subscribe now to follow the collection as it
              builds.
            </p>
            <div className="mt-6">
              <ButtonLink href="/print-club" variant="primary">
                Join Print Club
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
