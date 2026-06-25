import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions"
};

export default function TermsPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-serif text-5xl font-light leading-tight">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-sm text-graphite">
            Terms for artwork sales, Print Club, digital files, and use of this
            site.
          </p>
          <div className="mt-6 legal-note">
            These are placeholder terms. They should be reviewed and completed
            by an appropriate professional before the site is launched. These
            terms are written for a UK-based seller.
          </div>
        </div>

        <div className="grid gap-0">
          <div className="policy-section">
            <h2 className="font-serif text-xl font-medium">Original artworks</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                Original artworks are unique and can only be purchased once.
                When a purchase is confirmed, the work is marked sold and no
                further purchases of that original will be accepted. The sold
                work remains visible in the archive.
              </p>
              <p>
                A signed certificate of authenticity is included with original
                works where noted on the artwork page.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-serif text-xl font-medium">Prints and editions</h2>
            <div className="mt-4 text-sm leading-7 text-graphite">
              <p>
                Physical prints are shipped from the UK. Edition size, edition
                number, and signing details are noted on the individual product
                page. Print availability is managed separately from original
                availability.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-serif text-xl font-medium">Digital editions and subscriber files</h2>
            <div className="mt-4 text-sm leading-7 text-graphite">
              <p>
                Digital products and subscriber files are for the purchaser or
                active subscriber only. They should not be shared publicly,
                distributed, or used commercially. Each digital edition includes
                a purchase record and edition note.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-serif text-xl font-medium">Print Club</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                Print Club is a recurring monthly subscription. By subscribing,
                you authorise a recurring payment to be charged each month.
                Subscriptions can be cancelled at any time via the Stripe
                customer portal in your account area, and cancellation takes
                effect at the end of the current billing period.
              </p>
              <p>
                Access to subscriber files and the digital archive requires an
                active subscription. If your subscription is cancelled or
                payment fails, access will be suspended.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-serif text-xl font-medium">International purchases and customs</h2>
            <div className="mt-4 text-sm leading-7 text-graphite">
              <p>
                Alexandra ships from the United Kingdom. International buyers
                are solely responsible for all customs duties, import taxes,
                tariffs, local charges, and handling fees charged by their
                country. These costs are not included in the purchase price and
                are payable by the buyer upon delivery or customs clearance.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-serif text-xl font-medium">Intellectual property</h2>
            <div className="mt-4 text-sm leading-7 text-graphite">
              <p>
                Purchase of an artwork, print, or digital file does not transfer
                copyright. All intellectual property rights remain with
                Alexandra Pintea. Works may not be reproduced, adapted, or used
                commercially without written permission.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <div className="legal-note">
              These terms should be reviewed and completed by an appropriate
              legal professional before the site is launched to the public.
              UK consumer contract regulations, distance selling rules, and
              your specific product types should all be considered.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
