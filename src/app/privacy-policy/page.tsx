import type { Metadata } from "next";
import Link from "next/link";
import { ACQUISITION_CONFIG as CFG } from "@/lib/acquisition-config";

export const metadata: Metadata = {
  title: "Policies"
};

export default function PoliciesPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">

        {/* Left column */}
        <div>
          <h1 className="font-title text-5xl font-bold leading-tight">Policies</h1>
          <p className="mt-4 text-sm leading-7 text-graphite">
            Information on how we handle your personal data and the terms that
            apply when purchasing original works.
          </p>
          <p className="mt-4 text-sm text-graphite">
            Questions can be directed to the{" "}
            <Link href="/contact" className="underline underline-offset-4 hover:text-rust">
              contact page
            </Link>
            .
          </p>
        </div>

        {/* Right column — accordion sections */}
        <div className="grid gap-0">

          {/* Privacy Policy */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Privacy Policy</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-6 grid gap-6 text-sm leading-7 text-graphite">
                <p>
                  Alexandra Pintea is committed to providing quality services to you and this policy
                  outlines our ongoing obligations to you in respect of how we manage your Personal
                  Information.
                </p>
                <p>
                  We have adopted the principles contained in the UK General Data Protection
                  Regulation (UK GDPR) and the Data Protection Act 2018. These principles govern
                  the way in which we collect, use, disclose, store, secure and dispose of your
                  Personal Information.
                </p>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Personal Information</h3>
                  <p>We collect your Personal Information for the primary purpose of providing our services to you, including:</p>
                  <ul className="mt-3 ml-4 grid gap-1.5 list-disc">
                    <li>Processing and delivering orders</li>
                    <li>Sending you service messages and order updates via email or message</li>
                    <li>Sending you information about new products or announcements</li>
                    <li>Fraud prevention and detection</li>
                  </ul>
                  <p className="mt-3">
                    We only collect the personal information you choose to provide, including names,
                    addresses, email addresses, and phone numbers.
                  </p>
                  <p className="mt-3">
                    You may unsubscribe from our mailing list at any time by clicking the unsubscribe
                    link in any email received, or by contacting us at{" "}
                    <a href="mailto:hello@alexandrapintea.art" className="underline underline-offset-4 hover:text-ink transition-colors">
                      hello@alexandrapintea.art
                    </a>.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Payment Information</h3>
                  <p>
                    Payment information is used solely to take payment, give refunds, and prevent
                    fraud. Payment details are processed by Stripe — Alexandra Pintea does not store
                    or handle card information directly. Stripe is PCI DSS compliant.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Third Parties</h3>
                  <p>
                    Where reasonable and practicable to do so, we will collect your Personal
                    Information only from you. If we receive information from third parties we will
                    take reasonable steps to make you aware of it.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Security of Personal Information</h3>
                  <p>
                    Your Personal Information is stored in a manner that reasonably protects it from
                    misuse, loss, and unauthorised access, modification, or disclosure.
                  </p>
                  <p className="mt-3">
                    When your Personal Information is no longer needed for the purpose for which it
                    was obtained, we will take reasonable steps to destroy or permanently de-identify
                    it. Most Personal Information held in client files will be kept for a minimum of
                    7 years.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Access to Your Personal Information</h3>
                  <p>
                    You have the right to access the Personal Information we hold about you and to
                    update or correct it. Alexandra Pintea will not charge a fee for access requests.
                    We may require identification before releasing the requested information.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Your Rights Under UK GDPR</h3>
                  <p>Under UK GDPR you have the right to:</p>
                  <ul className="mt-3 ml-4 grid gap-1.5 list-disc">
                    <li>Request a copy of the personal data we hold about you</li>
                    <li>Request that we correct any inaccurate or incomplete data</li>
                    <li>Request that we delete your personal data</li>
                    <li>Object to or restrict our processing of your data</li>
                    <li>Withdraw consent at any time where processing is based on consent</li>
                  </ul>
                  <p className="mt-3">
                    To exercise any of these rights, contact us at{" "}
                    <a href="mailto:hello@alexandrapintea.art" className="underline underline-offset-4 hover:text-ink transition-colors">
                      hello@alexandrapintea.art
                    </a>.
                    {" "}You also have the right to lodge a complaint with the Information
                    Commissioner&apos;s Office (ICO) at{" "}
                    <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-ink transition-colors">
                      ico.org.uk
                    </a>
                    {" "}if you believe your data has been handled unlawfully.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Policy Updates</h3>
                  <p>This Policy may change from time to time and is available on our website.</p>
                </div>

                <div className="border-t border-line pt-5">
                  <h3 className="font-title text-base font-bold text-ink mb-2">Contact</h3>
                  <p>Alexandra Pintea</p>
                  <a href="mailto:hello@alexandrapintea.art" className="underline underline-offset-4 hover:text-ink transition-colors">
                    hello@alexandrapintea.art
                  </a>
                </div>
              </div>
            </details>
          </article>

          {/* Original Purchase Policy — full international acquisition terms */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Original Purchase Policy</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-6 grid gap-8 text-sm leading-7 text-graphite">

                <p>
                  Original artworks are acquired directly from Alexandra Pintea and are subject
                  to these terms, which operate alongside any applicable individual Contract of
                  Sale. For higher-value acquisitions, collectors may be required to complete a
                  reservation deposit, provide identity verification and enter into a separate
                  Contract of Sale before the acquisition is finalised. International collectors
                  should review the applicable shipping, customs, tax and payment arrangements
                  before completing their acquisition.
                </p>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Original Works</h3>
                  <p>
                    Original artworks sold through this website are unique, one-of-a-kind works.
                    Each original is offered with a stock quantity of one. Once acquired, the
                    original is removed from sale and remains visible in the archive. Where an
                    artwork is identified as available for acquisition, this constitutes an
                    invitation to purchase, subject to these terms and — where applicable — the
                    execution of a separate Contract of Sale. Nothing on this website constitutes
                    a legally binding agreement to sell until payment has been confirmed and any
                    required Contract of Sale has been executed.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">High-Value Acquisitions &amp; Reservation Deposit</h3>
                  <p>
                    Original artworks with a purchase price at or above approximately GBP
                    £{CFG.highValueThresholdGbp.toLocaleString()} (USD ${CFG.highValueThresholdUsdDisplay} / EUR €{CFG.highValueThresholdEurDisplay} at indicative rates) are subject to
                    additional acquisition terms. The GBP price shown on the artwork page is the
                    operative figure.
                  </p>
                  <p className="mt-3">
                    For qualifying works, the studio may require a Reservation Deposit before the
                    artwork is reserved. The indicative deposit amount is GBP £{CFG.reservationDepositGbp.toLocaleString()} (approximately USD ${CFG.reservationDepositUsdDisplay}). The
                    deposit applicable to a specific work will be confirmed on the artwork page and
                    in the Contract of Sale before the collector commits.
                  </p>
                  <p className="mt-3">The Reservation Deposit is intended to:</p>
                  <ul className="mt-2 ml-4 grid gap-1.5 list-disc">
                    <li>Secure the artwork for the collector</li>
                    <li>Remove the artwork from public availability while the transaction is progressing</li>
                    <li>Constitute a formal commitment toward completing the acquisition</li>
                    <li>Be credited in full toward the total purchase price</li>
                  </ul>
                  <p className="mt-3">
                    The artwork will not be marked as reserved until the deposit has been received
                    and successfully confirmed. Whether the deposit may be retained in the event of
                    a failure to complete — and in what circumstances a refund may apply — will be
                    set out clearly in the Contract of Sale before the collector commits to payment,
                    and is subject to applicable law.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Balance of Payment</h3>
                  <p>
                    Following confirmation of a Reservation Deposit, the remaining balance is
                    ordinarily due within {CFG.balancePaymentHours} hours, unless a different
                    deadline is agreed in writing. Balance payment may be made by bank wire
                    transfer, ACH where appropriate, or another method agreed with the studio.
                    Bank account details will be communicated securely to the confirmed collector
                    and will not be publicly displayed.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Contract of Sale</h3>
                  <p>
                    All original artwork purchases may be subject to a separate written Contract
                    of Sale / Bill of Sale. This website policy sets out the general commercial
                    framework and does not replace the individual Contract of Sale. Where the two
                    documents address the same matter, the Contract of Sale will prevail in
                    relation to that transaction. The Contract of Sale will address, where
                    applicable: artist and collector details; artwork title, description, year,
                    dimensions and materials; total price, currency, deposit and balance; payment
                    deadlines; delivery and shipping; insurance; customs arrangements; title
                    transfer; intellectual property; Certificate of Authenticity; provenance; care;
                    resale and transfer provisions; exhibition loans; and governing law.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Reservation Cancellation</h3>
                  <p>
                    If the studio does not receive the required balance payment and any required
                    signed Contract of Sale within the agreed {CFG.balancePaymentHours}-hour
                    period, the studio may cancel the reservation and make the artwork available
                    to another collector. The treatment of the Reservation Deposit following a
                    cancellation is determined by the applicable Contract of Sale and is subject
                    to any mandatory rights applicable to the collector under applicable law. Any
                    arrangement under which a deposit may be retained must be proportionate,
                    clearly disclosed in advance and consistent with applicable law.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Identity Verification</h3>
                  <p>
                    For high-value transactions and where otherwise appropriate, the studio may
                    require reasonable identity and transaction verification information before the
                    acquisition is finalised. This may include government-issued identification,
                    proof of identity, billing information, payment verification, company
                    information where a business is purchasing, or other reasonable documentation.
                    Verification may be requested where required by applicable law, payment
                    providers, banks, insurers, fraud-prevention or transaction-risk procedures.
                    All information is handled in accordance with the Privacy Policy above and
                    applicable data protection law.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Ownership &amp; Intellectual Property</h3>
                  <p>
                    <span className="font-medium text-ink">Physical ownership.</span>{" "}
                    Legal title to the physical artwork transfers to the collector in accordance
                    with the applicable Contract of Sale and, unless otherwise agreed, following
                    receipt of full cleared payment.
                  </p>
                  <p className="mt-3">
                    <span className="font-medium text-ink">Intellectual property.</span>{" "}
                    The purchase of the physical artwork does not transfer copyright or any other
                    intellectual property rights. Copyright remains with Alexandra Pintea unless
                    expressly assigned or licensed in a separate written agreement. Without the
                    artist&apos;s prior written permission, the collector does not acquire the
                    right to reproduce the artwork commercially, manufacture copies, create
                    commercial derivative works, license the artwork, place it on merchandise, use
                    it as a commercial brand asset, or commercially exploit reproductions or images
                    of the artwork. Private enjoyment of the artwork, including personal
                    photographs taken for private use, is not restricted.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Certificate of Authenticity &amp; Provenance</h3>
                  <p>
                    Where applicable, original artworks are accompanied by a unique Certificate of
                    Authenticity and Provenance recording the artwork title, medium, dimensions,
                    year of creation and the artist&apos;s signature. The certificate is intended
                    to remain associated with the artwork throughout its ownership history.
                    Where the artwork is permitted to be transferred or sold, the Certificate of
                    Authenticity and provenance documentation should be passed to the new owner.
                    The studio maintains a provenance record and collector identity will not be
                    disclosed publicly without consent.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Shipping, Insurance &amp; Care</h3>
                  <p>
                    Original artworks ship from the United Kingdom. Shipping and delivery
                    arrangements — including responsibility for shipping costs, packaging,
                    handling, specialist transport, insurance, customs clearance, import duties,
                    VAT, local taxes and brokerage charges — will be confirmed for each individual
                    transaction. The individual artwork page and Contract of Sale will identify
                    which charges are included and which are the responsibility of the collector
                    or another party. The Contract of Sale establishes when responsibility for
                    loss or damage transfers. For high-value works, the studio recommends that
                    collectors arrange appropriate specialist insurance effective from the point
                    at which responsibility transfers to them. Once the collector has
                    responsibility for the artwork, they should maintain it to appropriate
                    professional conservation standards.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Resale &amp; Transfer</h3>

                  <p className="font-medium text-ink mt-1">Initial {CFG.resaleRestrictionMonths}-month period</p>
                  <p className="mt-2">
                    Where the applicable Contract of Sale includes a resale restriction, the
                    collector agrees not to sell, auction, lend or otherwise transfer the artwork
                    during the first {CFG.resaleRestrictionMonths} months following execution of
                    the Contract of Sale, without the artist&apos;s prior written consent. This
                    restriction applies to the extent permitted by applicable law and as provided
                    for in the individual Contract of Sale. If a transfer occurs in breach of an
                    agreed contractual restriction, the artist may exercise the remedies available
                    under the Contract of Sale and applicable law.
                  </p>

                  <p className="font-medium text-ink mt-5">After the {CFG.resaleRestrictionMonths}-month period — Right of First Refusal</p>
                  <p className="mt-2">
                    Where the applicable Contract of Sale includes a right of first refusal, the
                    following process applies if the collector wishes to sell the artwork after the
                    initial restriction period:
                  </p>
                  <ol className="mt-3 ml-4 grid gap-2 list-decimal">
                    <li>The collector must give the artist written notice of the intended sale, specifying the proposed price and relevant terms.</li>
                    <li>The artist has {CFG.rightOfFirstRefusalDays} days to decide whether to exercise the right of first refusal and acquire the artwork at the notified price.</li>
                    <li>If the artist declines or does not respond within {CFG.rightOfFirstRefusalDays} days, the collector may proceed with a third-party sale within a {CFG.thirdPartySaleWindowMonths}-month window.</li>
                    <li>Where the Contract of Sale provides for it, the third-party sale should not be completed at a price lower than the price offered to the artist.</li>
                    <li>The new collector should receive the provenance documentation and Certificate of Authenticity, and the studio should be notified of the change of ownership.</li>
                  </ol>
                  <p className="mt-3">
                    Any right of first refusal or resale restriction is contractual and subject to
                    applicable law. This website policy does not itself create enforceable resale
                    restrictions independent of the individual Contract of Sale.
                  </p>

                  <p className="font-medium text-ink mt-5">Breach of agreed resale or transfer terms</p>
                  <p className="mt-2">
                    Where a collector breaches agreed resale or transfer restrictions, the artist
                    may exercise the remedies available under the Contract of Sale and applicable
                    law, which may include recovery of losses where legally available. The artist
                    may also reserve the right, where legally permitted and contractually provided
                    for, to decline future sales to a collector who has materially breached the
                    terms of a prior acquisition.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Artist&apos;s Resale Right</h3>
                  <p>
                    Certain qualifying resales of original artworks may be subject to statutory
                    Artist&apos;s Resale Right (droit de suite) requirements or equivalent resale
                    royalty laws, depending on where the resale occurs, who is involved, the nature
                    and value of the transaction, and the applicable jurisdiction. Where
                    Artist&apos;s Resale Right or an equivalent statutory regime applies, the
                    relevant statutory requirements and royalty arrangements will apply. These
                    statutory rights cannot be contracted out of where they apply. Artist&apos;s
                    Resale Right does not apply to every resale.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Exhibition &amp; Institutional Loans</h3>
                  <p>
                    Where the applicable Contract of Sale includes a requirement for consent,
                    the collector should obtain the artist&apos;s written agreement before lending
                    the artwork for public exhibition, including to museums, galleries, institutional
                    exhibitions or curated projects. Any loan arrangement should be separately
                    documented, establishing loan period, transportation, insurance, condition
                    reporting, installation, handling, costs and return arrangements. The artist
                    may invite a collector to consider a temporary loan for a significant
                    institutional or exhibition presentation, which must be separately agreed.
                    The artist does not have the right to reclaim an artwork without the
                    collector&apos;s agreement.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Taxes, VAT &amp; Customs</h3>
                  <p>
                    The artwork price shown on this website does not automatically include all
                    applicable taxes, duties and import-related charges. VAT or sales tax where
                    applicable, customs duties, import taxes, local handling and brokerage charges,
                    shipping and insurance costs may all be distinct from the artwork price
                    depending on the transaction and destination. The individual artwork page and
                    Contract of Sale will identify which charges are included and which are the
                    responsibility of the collector. International collectors should seek
                    independent advice regarding the import obligations applicable in their country.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Currency &amp; Payments</h3>
                  <p>
                    Artwork prices are shown in GBP. Indicative USD or EUR equivalents are for
                    reference only; the GBP price is the operative amount unless the Contract of
                    Sale provides otherwise. Exchange rates fluctuate and the studio cannot
                    guarantee any particular rate. The collector is responsible for any currency
                    conversion costs or bank transfer fees.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Governing Law &amp; International Collectors</h3>
                  <p>
                    Alexandra Pintea is based in the United Kingdom. This policy and any individual
                    Contract of Sale are intended to be governed by the laws of England and Wales,
                    subject to any mandatory rights or protections that apply to the collector under
                    applicable law in their own jurisdiction. The studio sells internationally and
                    acknowledges that mandatory local laws may apply to transactions depending on
                    where the collector is located.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Consumer Rights</h3>
                  <p>
                    Nothing in these terms is intended to exclude, restrict or override any rights
                    or protections that cannot lawfully be excluded or restricted under applicable
                    law. The studio does not seek to use this policy to remove or limit any
                    entitlement a collector may have under applicable consumer protection law.
                  </p>
                </div>

                <div className="border-t border-line pt-5">
                  <p className="text-xs leading-6 text-graphite/50">
                    This policy sets out the commercial framework for original artwork acquisitions
                    and does not constitute legal advice. It does not replace the individual
                    Contract of Sale applicable to each transaction. Version {CFG.policyVersion} &middot; {CFG.policyEffectiveDate}.
                  </p>
                </div>

              </div>
            </details>
          </article>

        </div>
      </div>
    </section>
  );
}
