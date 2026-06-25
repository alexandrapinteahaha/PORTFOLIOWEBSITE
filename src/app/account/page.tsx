import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { requireUser } from "@/lib/access";

export const metadata: Metadata = {
  title: "Account"
};

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <section className="container-shell py-14 md:py-20">
      <SectionHeader
        title="Account"
        intro="Your subscriber area, purchases, and subscription management."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-[280px_1fr]">
        <nav className="grid content-start gap-1 border border-line bg-chalk p-4">
          <p className="mb-3 border-b border-line pb-3 text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
            Account
          </p>
          <Link
            href="/account"
            className="focus-ring block px-2 py-2 text-sm font-medium text-ink transition-colors hover:text-rust"
          >
            Overview
          </Link>
          <Link
            href="/account/print-club"
            className="focus-ring block px-2 py-2 text-sm text-graphite transition-colors hover:text-ink"
          >
            Print Club
          </Link>
        </nav>

        <div className="grid content-start gap-6">
          <div className="border border-line bg-chalk p-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
              Signed in as
            </h2>
            <p className="mt-2 text-sm">{user.email}</p>
          </div>

          <div className="border border-line p-5">
            <h2 className="font-serif text-2xl">Print Club</h2>
            <p className="mt-3 text-sm leading-7 text-graphite">
              View your subscription status, access monthly files, digital
              prints, process PDFs, and your monthly letter archive.
            </p>
            <div className="mt-5">
              <ButtonLink href="/account/print-club" variant="secondary">
                View Print Club account
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
