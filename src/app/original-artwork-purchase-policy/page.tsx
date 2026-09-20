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
            Original Artwork Purchase Policy
          </h1>
          <p className="mt-5 text-sm leading-7 text-graphite">
            Original artworks are acquired directly from Alexandra Pintea and may involve
            additional terms depending on the work and transaction value.
          </p>
          <p className="mt-4 text-sm leading-7 text-graphite">
            For higher-value acquisitions, collectors may be asked to complete a reservation
            deposit, provide transaction verification and enter into a separate Contract of Sale.
          </p>
          <p className="mt-4 text-sm leading-7 text-graphite">
            International collectors should review the applicable shipping, customs, tax and
            payment arrangements before completing their acquisition.
          </p>
          <p className="mt-6 text-xs text-graphite/50">
            Version {CFG.policyVersion} &middot; Effective {CFG.policyEffectiveDate}
          </p>
          <p className="mt-4 text-xs text-graphite/50">
            Questions?{" "}
            <Link href="/contact" className="underline underline-offset-4 hover:text-ink transition-colors">
              Contact the studio
            </Link>
          </p>
        </div>

        {/* Right column — accordion sections */}
        <div className="grid gap-0">

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
                  digital editions and Print Club works.
                </p>
                <p>
                  Each original work is offered in a stock quantity of one. Once an original
                  is acquired, it is removed from sale and remains visible in the archive as a
                  permanent record. The artwork page, catalogue entry and image remain accessible.
                </p>
                <p>
                  Original artworks are accompanied by a Certificate of Authenticity and Provenance
                  where applicable. Care and installation guidance may be provided through the
                  collector portal.
                </p>
                <p>
                  Where an artwork is priced or identified as available for acquisition, this
                  constitutes an invitation to purchase subject to these terms and, where applicable,
                  a separate Contract of Sale. Nothing on this website constitutes a legally binding
                  offer to sell until payment has been confirmed and any required Contract of Sale
                  has been executed.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">High-Value Acquisitions</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Original artworks priced at or above approximately GBP £{CFG.highValueThresholdGbp.toLocaleString()} (USD ${CFG.highValueThresholdUsdDisplay} / EUR €{CFG.highValueThresholdEurDisplay} at indicative rates) are subject to additional acquisition terms. These thresholds are indicative; the GBP price shown on the artwork page is the operative amount.
                </p>
                <p>
                  For qualifying high-value works, the following may be required before the
                  acquisition is completed:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>A reservation deposit to secure the work</li>
                  <li>Collector verification appropriate to the transaction</li>
                  <li>Execution of a written Contract of Sale</li>
                  <li>Agreed shipping, insurance and customs arrangements</li>
                </ul>
                <p>
                  The studio will contact the collector directly upon receipt of a reservation
                  deposit to coordinate the Contract of Sale and balance payment. Acquisition of
                  a high-value work is not complete until all required steps have been fulfilled.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Reservation Deposit</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  For qualifying high-value acquisitions, the studio may require a reservation
                  deposit prior to completing the acquisition. An indicative deposit amount is
                  GBP £{CFG.reservationDepositGbp.toLocaleString()} (approximately USD ${CFG.reservationDepositUsdDisplay}), though the deposit applicable to any specific work will be
                  confirmed in advance.
                </p>
                <p>
                  The reservation deposit:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Reserves the artwork for the collector and temporarily removes it from public availability</li>
                  <li>Forms part of the total purchase price and is recorded against the transaction</li>
                  <li>Does not itself transfer legal ownership of the artwork</li>
                </ul>
                <p>
                  The website will not confirm receipt of a reservation deposit until payment has
                  been verified. The collector will be notified by the studio once the deposit
                  has been confirmed and the reservation is active.
                </p>
                <p>
                  The treatment of the reservation deposit, including the circumstances in which
                  it may be applied, retained or refunded, will be set out in the applicable
                  Contract of Sale and is subject to any mandatory rights that may apply to the
                  collector under applicable law. The deposit is not automatically non-refundable
                  in all circumstances.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Balance Payment</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Following confirmation of a reservation deposit, the remaining balance is
                  ordinarily due within {CFG.balancePaymentHours} hours, unless a different
                  period is agreed in writing with the studio.
                </p>
                <p>
                  Balance payment may be made by bank transfer, ACH or another method agreed with
                  the studio. Payment details will be communicated securely to the confirmed
                  collector and will not be published on this website.
                </p>
                <p>
                  Through the collector portal, the collector will be able to view:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Total artwork price</li>
                  <li>Reservation deposit amount and confirmation status</li>
                  <li>Remaining balance due</li>
                  <li>Balance payment deadline</li>
                  <li>Payment instructions (provided securely)</li>
                  <li>Contract of Sale status</li>
                </ul>
                <p>
                  If the balance is not received within the agreed period and no alternative
                  arrangement has been agreed, the studio may treat the reservation as cancelled
                  subject to the applicable Contract of Sale and mandatory applicable law.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Contract of Sale</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  This Original Artwork Purchase Policy sets out the general commercial framework
                  for original artwork acquisitions from Alexandra Pintea. It does not constitute
                  an individual Contract of Sale.
                </p>
                <p>
                  For higher-value acquisitions and where otherwise appropriate, the studio may
                  require a separate written Contract of Sale. The Contract of Sale establishes
                  the transaction-specific terms and typically includes:
                </p>
                <ul className="ml-4 grid gap-2 list-disc">
                  <li>Artist and collector details</li>
                  <li>Artwork title, description, year, dimensions and materials</li>
                  <li>Total price, currency, reservation deposit and balance</li>
                  <li>Payment deadlines and method</li>
                  <li>Shipping, insurance and customs arrangements</li>
                  <li>Conditions for transfer of legal title</li>
                  <li>Intellectual property terms</li>
                  <li>Certificate of Authenticity reference</li>
                  <li>Provenance and care requirements</li>
                  <li>Resale and transfer provisions where applicable</li>
                  <li>Exhibition loan provisions where applicable</li>
                  <li>Governing law and jurisdiction</li>
                </ul>
                <p>
                  The website policy should not be understood as a substitute for the individual
                  Contract of Sale. Where the two documents address the same matter, the individual
                  Contract of Sale will prevail in relation to that transaction.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Ownership & Intellectual Property</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  The acquisition of an original artwork conveys physical ownership of the work.
                  Legal title to the physical artwork transfers to the collector in accordance
                  with the applicable Contract of Sale and, unless otherwise agreed, following
                  receipt of full cleared payment.
                </p>
                <p>
                  The purchase of the physical artwork does not automatically transfer copyright
                  or any other intellectual property rights. Copyright and all related intellectual
                  property rights in the artwork remain with Alexandra Pintea unless expressly
                  assigned or licensed in a separate written agreement.
                </p>
                <p>
                  Without the artist&apos;s prior written permission, the collector does not acquire
                  the right to:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Reproduce the artwork commercially</li>
                  <li>Manufacture copies or create commercial derivative works</li>
                  <li>License the artwork or reproduce it on merchandise</li>
                  <li>Use the artwork as a commercial brand or marketing asset</li>
                  <li>Commercially exploit photographs or reproductions of the artwork</li>
                </ul>
                <p>
                  Private enjoyment of the artwork, including personal photographs for private
                  use, is not restricted. The distinction between private use and commercial
                  exploitation should be understood in its ordinary sense. Where a collector
                  wishes to use an image of the artwork beyond private enjoyment, they should
                  contact the studio in advance.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Certificate of Authenticity & Provenance</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Where applicable, original artworks are accompanied by a Certificate of
                  Authenticity and Provenance. The certificate typically records the artwork
                  title, medium, dimensions, year of creation and is signed by the artist.
                </p>
                <p>
                  The Certificate of Authenticity is intended to remain associated with the
                  artwork throughout its ownership history. Collectors are encouraged to retain
                  the certificate and to communicate its existence to any future purchaser,
                  institution or appraiser.
                </p>
                <p>
                  The studio maintains a provenance record for original works sold through this
                  website. Collectors should notify the studio of any change of ownership so that
                  provenance records can be maintained appropriately.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">International Shipping, Customs & Delivery</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Original artworks ship from the United Kingdom. International deliveries may
                  involve specialist art shipping, courier services, freight, customs clearance
                  and associated documentation. The studio will use appropriate packaging and,
                  for higher-value works, recommend or arrange specialist transport and insurance.
                </p>
                <p>
                  Shipping costs and import-related charges are distinct:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li><span className="font-medium text-ink">Shipping costs</span> — packing, courier or freight, and UK-side handling. These will be confirmed for each transaction.</li>
                  <li><span className="font-medium text-ink">Import charges</span> — customs duties, VAT, import tax, local handling fees and brokerage charged by the destination country. These are generally the responsibility of the collector unless otherwise agreed in the Contract of Sale.</li>
                </ul>
                <p>
                  The studio does not automatically cover every international tax or customs
                  charge. The specific allocation of shipping costs and import charges will be
                  set out in the individual transaction, artwork page or Contract of Sale.
                  International collectors should check applicable import requirements with their
                  local customs authority before completing a purchase.
                </p>
                <p>
                  For high-value works, the studio recommends that international collectors
                  discuss shipping, insurance and customs arrangements with the studio before
                  completing the acquisition.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Currency & International Payments</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Artwork prices on this website are shown in GBP (pound sterling). Indicative
                  USD and EUR equivalents may be displayed for reference. The GBP amount is the
                  operative transaction currency unless otherwise agreed in the Contract of Sale.
                </p>
                <p>
                  Where an indicative currency conversion is displayed, this is provided for
                  convenience only. Exchange rates fluctuate and the final amount payable in
                  another currency will depend on the exchange rate applicable at the time of
                  payment, the collector&apos;s payment provider and any banking or transfer fees.
                  The studio cannot guarantee any particular rate.
                </p>
                <p>
                  For high-value acquisitions settled by bank transfer, the Contract of Sale will
                  establish the agreed currency and amount due. The collector is responsible for
                  any transfer fees, currency conversion costs or bank charges incurred in making
                  payment.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Collector Verification</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  For high-value or unusual transactions, the studio may request reasonable
                  information to verify the identity of the collector and protect against fraud,
                  payment issues or other transaction risk. This may include:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Government-issued identification or proof of identity</li>
                  <li>Billing information or payment verification</li>
                  <li>Company information where a business is purchasing</li>
                  <li>Other reasonable documentation required for the transaction</li>
                </ul>
                <p>
                  Verification may also be requested where required by applicable law, payment
                  providers, financial institutions, insurers or transaction-risk procedures. The
                  studio will communicate any verification requirements to the collector directly.
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

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Reservation Cancellation</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  If a collector does not complete the required payment, documentation or
                  Contract of Sale within the agreed timeframe, the studio may cancel the
                  reservation and return the artwork to public availability or offer it to
                  another collector.
                </p>
                <p>
                  The treatment of a reservation deposit upon cancellation will be determined
                  by the applicable Contract of Sale and is subject to any mandatory rights that
                  may apply to the collector under applicable law. Whether and in what
                  circumstances a deposit may be retained, applied or refunded will be communicated
                  clearly to the collector before any commitment is made.
                </p>
                <p>
                  The studio will act reasonably in the event of cancellation and will not seek
                  to retain a deposit in circumstances where doing so would be inconsistent with
                  applicable law.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Resale, Transfer & Artist&apos;s Resale Right</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Collectors may resell original artworks they have acquired, subject to any
                  specific terms set out in the applicable Contract of Sale and applicable law.
                  The studio does not impose a blanket prohibition on resale.
                </p>
                <p>
                  Where a Contract of Sale is in place, it may include provisions regarding:
                </p>
                <ul className="ml-4 grid gap-1.5 list-disc">
                  <li>Notification of an intended resale</li>
                  <li>Preservation of provenance records and the Certificate of Authenticity</li>
                  <li>A contractual right of first refusal where agreed, including the process for notification, response period, offer terms and the consequences of the artist declining or the collector proceeding</li>
                  <li>Notification of a change of ownership</li>
                  <li>Reasonable cooperation with provenance and exhibition records</li>
                </ul>
                <p>
                  Any right of first refusal or resale provision is a matter for the individual
                  Contract of Sale. This website policy does not itself create enforceable resale
                  restrictions.
                </p>
                <p>
                  Certain qualifying resales of original artworks may be subject to
                  Artist&apos;s Resale Right or equivalent statutory resale royalty regimes
                  depending on the jurisdiction and circumstances of the resale. Where applicable,
                  the relevant statutory requirements and royalty arrangements will apply. The
                  applicability of Artist&apos;s Resale Right depends on factors including
                  jurisdiction, the sale price and the involvement of an art market professional,
                  and does not apply to every resale.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Exhibition & Institutional Loans</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Collectors are welcome to contact the studio regarding potential loans of their
                  artwork to museums, galleries, institutional exhibitions, curated projects or
                  significant public presentations.
                </p>
                <p>
                  Any loan should be agreed separately in writing and should establish loan
                  duration, transportation, insurance, condition reporting, installation, handling,
                  associated costs and return arrangements.
                </p>
                <p>
                  The studio may also invite a collector to consider a temporary loan for a
                  significant exhibition or institutional presentation. Any such request will be
                  discussed with the collector and, if agreed, documented separately. The studio
                  does not have the right to reclaim an artwork from a collector without agreement.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Care & Conservation</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Collectors will be provided with care information appropriate to their specific
                  artwork. This may cover light exposure, humidity, temperature, handling,
                  framing, hanging, cleaning, storage and transportation.
                </p>
                <p>
                  Where an artwork requires specialist care, detailed instructions will be
                  provided through the collector portal. Collectors are encouraged to follow the
                  care guidance provided and to consult a qualified conservator if in any doubt
                  about the condition or treatment of the work.
                </p>
                <p>
                  Improper storage, handling or environmental conditions may affect the condition
                  and value of an artwork. The studio is happy to advise collectors on appropriate
                  conservation practices.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Insurance & Risk</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  The individual Contract of Sale will establish when responsibility for loss or
                  damage transfers from the studio to the collector. Risk does not automatically
                  transfer at the moment of dispatch; the applicable arrangement will depend on
                  the shipping method and terms agreed.
                </p>
                <p>
                  For high-value artworks, collectors should maintain appropriate insurance once
                  responsibility for the artwork has transferred to them. The studio recommends
                  that collectors speak with a specialist art insurer before the work is
                  dispatched and ensure adequate coverage is in place for transit and at the
                  destination.
                </p>
                <p>
                  For international shipments, shipping and insurance arrangements will be
                  documented in the transaction and, where applicable, the Contract of Sale.
                  The studio will use appropriately insured shipping for original artworks.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Privacy & Collector Confidentiality</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Collector information is held in confidence. Purchase information, collector
                  names, addresses, contact details, purchase prices and provenance information
                  containing personal data will not be disclosed publicly without the appropriate
                  consent of the collector, except where required by law.
                </p>
                <p>
                  The studio does not publicise collector identities or acquisition prices without
                  agreement. Where provenance information is shared for exhibition, institutional
                  or resale purposes, the studio will handle it in accordance with the applicable
                  privacy obligations.
                </p>
                <p>
                  All personal information collected in connection with an original artwork
                  acquisition is handled in accordance with the studio&apos;s{" "}
                  <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-ink transition-colors">
                    Privacy Policy
                  </Link>{" "}
                  and applicable data protection law.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Governing Law</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-5 grid gap-4 text-sm leading-7 text-graphite">
                <p>
                  Alexandra Pintea is based in the United Kingdom. This policy and any individual
                  Contract of Sale are intended to be governed by the laws of England and Wales,
                  subject to any mandatory rights or protections that may apply to the collector
                  under applicable law in their own jurisdiction.
                </p>
                <p>
                  The precise governing law and jurisdiction clause for any transaction will be
                  set out in the applicable Contract of Sale. Nothing in this website policy is
                  intended to exclude, restrict or override any statutory rights that cannot
                  lawfully be excluded or restricted under the law applicable to the collector.
                </p>
                <p>
                  International collectors should be aware that mandatory local laws may apply to
                  transactions depending on where they are located. The studio acknowledges that
                  local consumer protection laws may apply to some transactions and does not
                  seek to override them.
                </p>
              </div>
            </details>
          </article>

          <article className="policy-section">
            <div className="pt-1 pb-2">
              <p className="text-xs leading-6 text-graphite/50">
                This policy does not constitute legal advice. Collectors with questions about
                applicable law should seek independent legal advice. For any questions about
                an acquisition, please{" "}
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
