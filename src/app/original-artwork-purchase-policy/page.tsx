import type { Metadata } from "next";
import Link from "next/link";
import { ACQUISITION_CONFIG as CFG } from "@/lib/acquisition-config";

export const metadata: Metadata = {
  title: "Original Artwork Purchase Policy"
};

export default function OriginalArtworkPurchasePolicyPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">

        {/* Left column */}
        <div className="md:sticky md:top-24 md:self-start">
          <p className="label text-graphite">Acquisition</p>
          <h1 className="mt-3 font-title text-5xl font-bold leading-tight">
            Original Artwork<br />Purchase Policy
          </h1>
          <p className="mt-5 text-sm leading-7 text-graphite">
            Original artworks are acquired directly from Alexandra Pintea and
            are subject to these terms, which operate alongside any applicable
            individual Contract of Sale.
          </p>
          <p className="mt-4 text-sm leading-7 text-graphite">
            For higher-value acquisitions, collectors may be required to
            complete a reservation deposit, provide identity verification and
            enter into a separate Contract of Sale before the acquisition
            is finalised.
          </p>
          <p className="mt-4 text-sm leading-7 text-graphite">
            International collectors should review the applicable shipping,
            customs, tax and payment arrangements before completing their
            acquisition.
          </p>
          <div className="mt-6 border-t border-line pt-5">
            <p className="text-xs leading-6 text-graphite/50">
              Version {CFG.policyVersion} &middot; Effective {CFG.policyEffectiveDate}
            </p>
            <p className="mt-2 text-xs text-graphite/50">
              Questions?{" "}
              <Link href="/contact" className="underline underline-offset-4 hover:text-ink transition-colors">
                Contact the studio
              </Link>
            </p>
          </div>
        </div>

        {/* Right column */}
        <div className="grid gap-0">

          {/* 1 — Original Works */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Original Works</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Original artworks sold through this website are unique, one-of-a-kind works
                  created by Alexandra Pintea. They are distinct from limited-edition prints,
                  digital editions and Print Club works, each of which is subject to its own
                  terms.
                </p>
                <p>
                  Each original work is offered with a stock quantity of one. Once acquired,
                  the original is removed from sale and remains visible in the archive as a
                  permanent record. The artwork page, catalogue entry and image remain
                  accessible.
                </p>
                <p>
                  Where an artwork is identified as available for acquisition, this constitutes
                  an invitation to purchase, subject to these terms and — where applicable —
                  the execution of a separate Contract of Sale. Nothing on this website
                  constitutes a legally binding agreement to sell until payment has been
                  confirmed and any required Contract of Sale has been executed.
                </p>
              </div>
            </details>
          </article>

          {/* 2 — High-Value Acquisitions & Reservation Deposit */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">High-Value Acquisitions &amp; Reservation Deposit</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Original artworks with a purchase price at or above approximately
                  GBP £{CFG.highValueThresholdGbp.toLocaleString()} (USD ${CFG.highValueThresholdUsdDisplay} / EUR €{CFG.highValueThresholdEurDisplay} at indicative rates) are
                  subject to additional acquisition terms. The GBP price shown on the artwork
                  page is the operative figure.
                </p>
                <p>
                  For qualifying works, the studio may require a Reservation Deposit before
                  the artwork is reserved. The indicative deposit amount is GBP
                  £{CFG.reservationDepositGbp.toLocaleString()} (approximately USD
                  ${CFG.reservationDepositUsdDisplay}). The deposit applicable to any specific
                  work will be confirmed on the artwork page and in the applicable Contract of
                  Sale before the collector commits.
                </p>
                <p>The Reservation Deposit is intended to:</p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Secure the artwork for the collector</li>
                  <li>Remove the artwork from public availability while the transaction is progressing</li>
                  <li>Constitute a formal commitment toward completing the acquisition</li>
                  <li>Be credited in full toward the total purchase price</li>
                </ul>
                <p>
                  The artwork will not be marked as reserved until the Reservation Deposit
                  has been received and successfully confirmed. The studio will notify the
                  collector once the deposit has been verified and the reservation is active.
                </p>
                <p>
                  The applicable terms for the Reservation Deposit — including whether the
                  deposit may be retained in the event of a failure to complete the acquisition,
                  and in what circumstances a refund may apply — will be set out clearly in the
                  individual Contract of Sale before the collector commits to payment. Whether
                  the deposit may be retained is subject to applicable law and the terms of the
                  Contract of Sale. The studio will not retain a deposit in circumstances where
                  doing so would be unlawful.
                </p>
              </div>
            </details>
          </article>

          {/* 3 — Balance of Payment */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Balance of Payment</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Following confirmation of a Reservation Deposit, the remaining balance of
                  the total purchase price is ordinarily due within {CFG.balancePaymentHours} hours,
                  unless a different deadline is agreed in writing with the studio.
                </p>
                <p>Balance payment may be made by:</p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Bank wire transfer</li>
                  <li>ACH transfer where appropriate</li>
                  <li>Another payment method expressly agreed with the studio</li>
                </ul>
                <p>
                  Bank account and payment details will be communicated securely and directly
                  to the confirmed collector. They will not be publicly displayed on this
                  website.
                </p>
                <p>Through the collector portal, the collector will be able to view:</p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Total artwork price</li>
                  <li>Reservation deposit amount and confirmation status</li>
                  <li>Remaining balance</li>
                  <li>Balance payment deadline</li>
                  <li>Payment instructions (provided securely)</li>
                  <li>Contract of Sale status</li>
                </ul>
              </div>
            </details>
          </article>

          {/* 4 — Contract of Sale */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Contract of Sale</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  All purchases of original artwork made through this website may be subject
                  to the execution of a separate written Contract of Sale / Bill of Sale
                  between the artist and the collector. This website Purchase Policy sets out
                  the general commercial framework and does not replace or constitute an
                  individual Contract of Sale.
                </p>
                <p>
                  Where the two documents address the same matter, the individual Contract of
                  Sale will prevail in relation to that transaction. The collector should not
                  regard the acquisition as finally agreed until any required Contract of Sale
                  has been executed and the required payments have been received.
                </p>
                <p>The individual Contract of Sale will, where applicable, address:</p>
                <ul className="ml-4 grid gap-2 list-disc">
                  <li>Artist and collector details</li>
                  <li>Artwork title, description, creation year, dimensions and materials</li>
                  <li>Total purchase price, currency, Reservation Deposit and balance</li>
                  <li>Payment deadlines and agreed payment method</li>
                  <li>Delivery, shipping, packaging and handling arrangements</li>
                  <li>Insurance, customs clearance and import arrangements</li>
                  <li>Conditions for transfer of legal title</li>
                  <li>Intellectual property terms</li>
                  <li>Certificate of Authenticity reference</li>
                  <li>Provenance documentation</li>
                  <li>Care requirements</li>
                  <li>Resale and transfer provisions</li>
                  <li>Exhibition loan provisions</li>
                  <li>Identity verification requirements where applicable</li>
                  <li>Governing law and jurisdiction</li>
                </ul>
              </div>
            </details>
          </article>

          {/* 5 — Reservation Cancellation */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Reservation Cancellation</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  If the studio does not receive the required balance payment and any required
                  signed Contract of Sale within the agreed {CFG.balancePaymentHours}-hour
                  period — or such other deadline as has been agreed in writing — the studio
                  may cancel the reservation and make the artwork available to another
                  collector.
                </p>
                <p>
                  The treatment of the Reservation Deposit following a cancellation will be
                  determined by the applicable Contract of Sale and is subject to any mandatory
                  rights that apply to the collector under applicable law. The studio will
                  clearly communicate the applicable deposit terms to the collector before any
                  commitment is made, including the circumstances in which a deposit may be
                  retained.
                </p>
                <p>
                  Where the studio is legally entitled to retain a deposit following the
                  collector&apos;s failure to complete the transaction, the Contract of Sale
                  will specify those circumstances. Any such arrangement must be proportionate,
                  clearly disclosed in advance and consistent with applicable law.
                </p>
                <p>
                  The studio will not seek to retain a Reservation Deposit in circumstances
                  where doing so would be unlawful or inconsistent with mandatory consumer
                  protections applicable to the collector.
                </p>
              </div>
            </details>
          </article>

          {/* 6 — Identity Verification */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Identity Verification</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  For high-value transactions and where otherwise appropriate, the studio may
                  require the collector to provide reasonable identity and transaction
                  verification information before the acquisition is finalised. This may
                  include:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Government-issued identification or proof of identity</li>
                  <li>Billing information or payment verification</li>
                  <li>Company information where a business or entity is the purchaser</li>
                  <li>Other reasonable documentation required for the transaction</li>
                </ul>
                <p>
                  Verification may be requested where appropriate or where required by
                  applicable law, payment providers, banks or financial institutions, insurance
                  providers, fraud-prevention procedures or other transaction-risk requirements.
                  The studio will communicate any verification requirements to the collector
                  directly.
                </p>
                <p>
                  All personal information collected for verification purposes is handled in
                  accordance with the studio&apos;s{" "}
                  <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-ink transition-colors">
                    Privacy Policy
                  </Link>{" "}
                  and applicable data protection law.
                </p>
              </div>
            </details>
          </article>

          {/* 7 — Ownership & IP */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Ownership &amp; Intellectual Property</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  <span className="font-medium text-ink">Physical ownership.</span>{" "}
                  The acquisition of an original artwork conveys physical ownership of
                  the work. Legal title to the physical artwork transfers to the collector
                  in accordance with the applicable Contract of Sale and, unless otherwise
                  agreed in writing, following receipt of full cleared payment.
                </p>
                <p>
                  <span className="font-medium text-ink">Intellectual property.</span>{" "}
                  The purchase of the physical artwork does not transfer copyright or any
                  other intellectual property rights. Copyright and all related intellectual
                  property rights remain with Alexandra Pintea unless expressly assigned or
                  licensed in a separate written agreement.
                </p>
                <p>
                  Without the artist&apos;s prior written permission, the collector does
                  not acquire the right to:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Reproduce the artwork commercially</li>
                  <li>Manufacture copies or create commercial derivative works</li>
                  <li>License the artwork or reproduce it on merchandise</li>
                  <li>Use the artwork as a commercial brand, marketing or advertising asset</li>
                  <li>Commercially exploit photographs or reproductions of the artwork</li>
                </ul>
                <p>
                  Private enjoyment of the artwork, including personal photographs taken for
                  private use, is not restricted. The distinction between private use and
                  commercial exploitation should be understood in its ordinary sense. Where a
                  collector wishes to use an image of the artwork beyond private enjoyment,
                  they should contact the studio in advance.
                </p>
              </div>
            </details>
          </article>

          {/* 8 — Certificate of Authenticity */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Certificate of Authenticity &amp; Provenance</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Where applicable, original artworks are accompanied by a unique Certificate
                  of Authenticity and Provenance. The certificate typically records the artwork
                  title, medium, dimensions, year of creation and is signed by the artist.
                </p>
                <p>
                  The Certificate of Authenticity is intended to remain associated with the
                  artwork throughout its ownership history. Where the artwork is permitted to
                  be transferred or sold in accordance with these terms, the Certificate of
                  Authenticity and relevant provenance documentation should be passed to the
                  new owner.
                </p>
                <p>
                  The studio maintains a provenance record for original works sold through
                  this website. Collectors are encouraged to notify the studio of any
                  permitted change of ownership so that provenance records can be appropriately
                  maintained. Collector identity and private acquisition details will not be
                  disclosed publicly without the collector&apos;s consent.
                </p>
                <p>
                  Relevant provenance information may be accessible through the collector
                  portal where applicable.
                </p>
              </div>
            </details>
          </article>

          {/* 9 — Shipping, Insurance & Care */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Shipping, Insurance &amp; Care</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Original artworks ship from the United Kingdom. The studio will handle or
                  coordinate appropriate logistics for delivery where agreed. Shipping and
                  delivery arrangements, including the allocation of responsibility for
                  shipping costs, packaging, handling, specialist art transportation,
                  insurance, customs clearance, import duties, VAT, local taxes and brokerage
                  or handling charges, will be confirmed for each individual transaction.
                </p>
                <p>
                  The individual artwork page and Contract of Sale will identify which charges
                  are included in the transaction and which may be payable separately by the
                  collector or another party. International collectors should check the
                  applicable import requirements with their local customs authority before
                  completing an acquisition.
                </p>
                <p>
                  The individual Contract of Sale will establish when responsibility for loss
                  or damage transfers from the studio to the collector. For high-value works,
                  the studio recommends that collectors arrange appropriate specialist
                  insurance, effective from the point at which responsibility transfers
                  to them.
                </p>
                <p>
                  Once the collector has responsibility for the artwork, they should maintain
                  it to appropriate professional conservation standards and in conditions
                  suited to the work&apos;s medium. Care guidance will be provided through
                  the collector portal where applicable.
                </p>
              </div>
            </details>
          </article>

          {/* 10 — Resale & Transfer Restrictions */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Resale &amp; Transfer</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">

                <div>
                  <p className="font-medium text-ink">Initial {CFG.resaleRestrictionMonths}-month period</p>
                  <p className="mt-2">
                    Where the applicable Contract of Sale includes a resale restriction, the
                    collector agrees not to sell, auction, lend or otherwise transfer the
                    artwork during the first {CFG.resaleRestrictionMonths} months following
                    execution of the Contract of Sale, without the artist&apos;s prior written
                    consent. This restriction applies to the extent permitted by applicable law
                    and as provided for in the individual Contract of Sale.
                  </p>
                  <p className="mt-3">
                    If a transfer occurs during this period in breach of an agreed contractual
                    restriction, the artist may exercise the remedies available under the
                    applicable Contract of Sale and applicable law. The legal consequences of
                    any such breach — including whether a purported transfer can be treated as
                    ineffective — will depend on the terms of the Contract of Sale and the law
                    applicable to the transaction.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-ink">After the {CFG.resaleRestrictionMonths}-month period — Right of First Refusal</p>
                  <p className="mt-2">
                    Where the applicable Contract of Sale includes a right of first refusal, the
                    following process applies if the collector wishes to sell the artwork after
                    the initial restriction period:
                  </p>
                  <ol className="ml-4 mt-3 grid gap-2 list-decimal">
                    <li>
                      The collector must give the artist written notice of the intended sale,
                      specifying the proposed sale price and relevant terms.
                    </li>
                    <li>
                      The artist has {CFG.rightOfFirstRefusalDays} days from receipt of written
                      notice to decide whether to exercise the right of first refusal and
                      acquire the artwork at the notified price and terms.
                    </li>
                    <li>
                      If the artist declines or does not respond within the {CFG.rightOfFirstRefusalDays}-day
                      period, the collector may proceed with a third-party sale within a
                      {" "}{CFG.thirdPartySaleWindowMonths}-month window from the date the artist
                      declines or the period expires.
                    </li>
                    <li>
                      Where the Contract of Sale provides for it, the third-party sale should
                      not be completed at a price lower than the price offered to the artist
                      under the right of first refusal.
                    </li>
                    <li>
                      The new collector should be provided with the applicable provenance
                      documentation and Certificate of Authenticity, and the studio should
                      be notified of the change of ownership.
                    </li>
                  </ol>
                  <p className="mt-3">
                    Any right of first refusal or resale restriction is contractual in nature.
                    Its enforceability and the remedies available for breach are governed by
                    the applicable Contract of Sale and applicable law. The website policy does
                    not itself create enforceable resale restrictions independent of the
                    individual Contract of Sale.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-ink">Breach of agreed resale or transfer terms</p>
                  <p className="mt-2">
                    Where a collector breaches agreed resale or transfer restrictions contained
                    in the Contract of Sale, the artist may exercise the remedies available
                    under the Contract of Sale and applicable law. These may include, where
                    legally available and contractually provided for, recovery of losses
                    suffered as a result of the breach or other remedies under the agreement.
                  </p>
                  <p className="mt-3">
                    The artist may also reserve the right, where legally permitted and
                    contractually provided for, to decline future sales to a collector who has
                    materially breached the terms of a prior acquisition. This is a commercial
                    decision available to the artist and does not constitute an automatic legal
                    consequence.
                  </p>
                  <p className="mt-3 text-graphite/60 text-xs">
                    Note: The specific remedies available for breach of resale or transfer
                    restrictions — including whether and to what extent financial recovery is
                    available — depend on the governing law and the terms of the individual
                    Contract of Sale. Collectors and the studio should seek independent legal
                    advice in the event of any dispute.
                  </p>
                </div>

              </div>
            </details>
          </article>

          {/* 11 — Artist's Resale Right */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Artist&apos;s Resale Right</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Certain qualifying resales of original artworks may be subject to statutory
                  Artist&apos;s Resale Right (droit de suite) requirements or equivalent
                  resale royalty laws, depending on where the resale occurs, who is involved,
                  the nature and value of the transaction, and the applicable jurisdiction.
                </p>
                <p>
                  Where Artist&apos;s Resale Right or an equivalent statutory regime applies,
                  the relevant statutory requirements and royalty arrangements will apply in
                  accordance with the applicable law. These statutory rights cannot be
                  contracted out of where they apply.
                </p>
                <p>
                  Artist&apos;s Resale Right does not apply to every resale. Whether it applies
                  depends on factors including the jurisdiction of the resale, the sale price,
                  the nature of the parties involved and whether an art market professional
                  is involved. The website makes no representation as to the applicability of
                  resale royalty laws to any specific future transaction.
                </p>
              </div>
            </details>
          </article>

          {/* 12 — Exhibition & Loans */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Exhibition &amp; Institutional Loans</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Where the applicable Contract of Sale includes a requirement for consent,
                  the collector should obtain the artist&apos;s written agreement before
                  lending the artwork for public exhibition. Potential exhibition contexts
                  include museums, galleries, institutional exhibitions, significant public
                  exhibitions and curated projects.
                </p>
                <p>
                  Any loan arrangement should be separately agreed and documented in writing,
                  establishing: loan period, transportation, insurance, condition reporting,
                  installation, handling, associated costs and return arrangements.
                </p>
                <p>
                  The artist may invite a collector to consider a temporary loan of a work for
                  a significant museum, institutional or exhibition presentation. Any such
                  request will be put to the collector and, if agreed, documented separately.
                  The artist does not have the right to reclaim an artwork from a collector
                  without the collector&apos;s agreement.
                </p>
                <p>
                  Where the artist or an organising institution arranges a loan, the written
                  loan agreement should establish responsibility for shipping, insurance,
                  condition reporting and return of the work.
                </p>
              </div>
            </details>
          </article>

          {/* 13 — Taxes, VAT & Customs */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Taxes, VAT &amp; Customs</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  The artwork price shown on this website does not automatically include
                  all applicable taxes, duties and import-related charges. The following may
                  be distinct from the artwork price depending on the transaction:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>VAT or sales tax where applicable</li>
                  <li>Customs duties and import taxes</li>
                  <li>Local handling and brokerage charges</li>
                  <li>Shipping and insurance costs</li>
                  <li>Any other charges imposed by the destination country</li>
                </ul>
                <p>
                  The individual artwork page and Contract of Sale will identify which charges
                  are collected by the studio and which are the responsibility of the collector
                  or another party. The studio makes no representation regarding the tax
                  treatment of any transaction in any jurisdiction.
                </p>
                <p>
                  International collectors should seek independent advice regarding the
                  import obligations applicable in their country before completing an
                  acquisition.
                </p>
              </div>
            </details>
          </article>

          {/* 14 — Currency & Payments */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Currency &amp; Payments</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Artwork prices on this website are shown in GBP (pound sterling). Where
                  indicative USD or EUR equivalents are displayed, these are for reference only.
                  The GBP price is the operative amount unless the Contract of Sale expressly
                  provides otherwise.
                </p>
                <p>
                  Exchange rates fluctuate. Where a collector pays in a currency other than
                  GBP, the amount actually paid will depend on the exchange rate applied by
                  the collector&apos;s payment provider at the time of payment. The studio
                  cannot guarantee any particular rate. The collector is responsible for any
                  currency conversion costs or bank transfer fees.
                </p>
                <p>
                  For high-value acquisitions settled by bank transfer, the Contract of Sale
                  will establish the agreed currency and amount due.
                </p>
              </div>
            </details>
          </article>

          {/* 15 — Governing Law & International Sales */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Governing Law &amp; International Collectors</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Alexandra Pintea is based in the United Kingdom. This policy and any
                  individual Contract of Sale are intended to be governed by the laws of
                  England and Wales, subject to any mandatory rights or protections that apply
                  to the collector under applicable law in their own jurisdiction.
                </p>
                <p>
                  The precise governing law and jurisdiction clause will be set out in the
                  individual Contract of Sale. This website policy does not claim that English
                  law automatically overrides the mandatory consumer or commercial protections
                  applicable to a collector in their own country.
                </p>
                <p>
                  The studio sells to collectors internationally, including in the United
                  Kingdom, European Union, United States, Canada, Switzerland, Australia, the
                  Middle East, Asia and other jurisdictions. The studio acknowledges that
                  mandatory local laws may apply to transactions depending on where the
                  collector is located, and does not seek to override them.
                </p>
                <p>
                  In the event of any dispute, the studio and collector should seek to resolve
                  the matter directly in the first instance. The applicable dispute resolution
                  procedure will be set out in the individual Contract of Sale.
                </p>
              </div>
            </details>
          </article>

          {/* 16 — Consumer Rights */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Consumer Rights</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Nothing in these terms is intended to exclude, restrict or override any
                  rights or protections that cannot lawfully be excluded or restricted under
                  applicable law.
                </p>
                <p>
                  This policy is designed to operate within the artist&apos;s UK-based
                  commercial framework. Where a collector has mandatory statutory rights under
                  the law of their own jurisdiction — including rights relating to cancellation,
                  refund, conformity of goods or consumer protection — those rights are not
                  affected by these terms to the extent they cannot lawfully be excluded.
                </p>
                <p>
                  The studio does not seek to use this policy to remove or limit any
                  entitlement a collector may have under applicable consumer protection law.
                  The individual Contract of Sale will identify and respect applicable
                  mandatory legal requirements where known.
                </p>
              </div>
            </details>
          </article>

          {/* 17 — Privacy */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Privacy &amp; Collector Confidentiality</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Collector information is held in confidence. Purchase information, collector
                  names, addresses, contact details, purchase prices and provenance information
                  containing personal data will not be publicly disclosed without the
                  collector&apos;s consent, except where required by law.
                </p>
                <p>
                  All personal information collected in connection with an acquisition —
                  including information provided for identity verification — is handled in
                  accordance with the studio&apos;s{" "}
                  <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-ink transition-colors">
                    Privacy Policy
                  </Link>{" "}
                  and applicable data protection law, including UK GDPR.
                </p>
              </div>
            </details>
          </article>

          {/* Legal note */}
          <article className="policy-section">
            <div className="py-2">
              <p className="text-xs leading-6 text-graphite/50">
                This policy sets out the commercial framework for original artwork acquisitions.
                It does not constitute legal advice and does not replace the individual Contract
                of Sale applicable to each transaction. Collectors and the studio should seek
                independent legal advice where required. For acquisition enquiries,{" "}
                <Link href="/contact" className="underline underline-offset-4 hover:text-ink transition-colors">
                  contact the studio
                </Link>
                . Version {CFG.policyVersion} &middot; {CFG.policyEffectiveDate}.
              </p>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
