import type { Metadata } from "next";
import Link from "next/link";

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
                <span className="shrink-0 text-sm text-graphite/40 transition-transform details-open:rotate-45">+</span>
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
                    You also have the right to lodge a complaint with the Information
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

          {/* Original Purchase Policy */}
          <article className="policy-section">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
                <h2 className="font-title text-xl font-bold">Original Purchase Policy</h2>
                <span className="shrink-0 text-sm text-graphite/40">+</span>
              </summary>
              <div className="mt-6 grid gap-6 text-sm leading-7 text-graphite">
                <p>
                  The following terms apply to the purchase of original artworks from
                  alexandrapintea.art.
                </p>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Condition of Works</h3>
                  <p>
                    All original works are sold as described on the individual artwork page.
                    Condition notes, dimensions, and materials are provided in good faith. If you
                    would like additional photographs or information before purchasing, please
                    contact the studio prior to placing an order.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Certificate of Authenticity</h3>
                  <p>
                    Every original work is accompanied by a signed certificate of authenticity
                    confirming the title, medium, dimensions, year of creation, and the artist&apos;s
                    signature. This certificate should be retained as part of the work&apos;s provenance.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Shipping and Handling</h3>
                  <p>
                    Original works are shipped from the United Kingdom. All works are carefully
                    packaged and sent via insured courier. Shipping costs are calculated at
                    checkout based on destination and artwork size.
                  </p>
                  <p className="mt-3">
                    For large or high-value works, individual shipping arrangements may be required.
                    In these cases the studio will be in touch to confirm method, cost, and timing
                    before dispatch.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">International Orders and Customs</h3>
                  <p>
                    International buyers are responsible for any customs duties, import taxes,
                    tariffs, and handling fees charged by their country. These costs are not
                    included at checkout and are payable by the buyer upon delivery or clearance.
                    If you are unsure of the charges applicable in your country, please check with
                    your local customs authority before ordering.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Returns and Exchanges</h3>
                  <p>
                    Due to the nature of original artworks, all sales are final. We do not offer
                    returns or exchanges unless a work arrives damaged in transit. In the event of
                    damage, please contact the studio within 48 hours of delivery with photographic
                    evidence of the packaging and the damage. Claims made after this period cannot
                    be accepted.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Damaged in Transit</h3>
                  <p>
                    If your original work arrives damaged, please retain all original packaging and
                    contact the studio at{" "}
                    <a href="mailto:hello@alexandrapintea.art" className="underline underline-offset-4 hover:text-ink transition-colors">
                      hello@alexandrapintea.art
                    </a>{" "}
                    within 48 hours of receipt. We will work with you and the courier to resolve
                    the matter as quickly as possible.
                  </p>
                </div>

                <div>
                  <h3 className="font-title text-base font-bold text-ink mb-2">Payment</h3>
                  <p>
                    Payment is taken in full at the time of purchase via Stripe. We accept all
                    major credit and debit cards. Alexandra Pintea does not store payment
                    information — all transactions are handled securely by Stripe.
                  </p>
                </div>

                <div className="border-t border-line pt-5">
                  <h3 className="font-title text-base font-bold text-ink mb-2">Contact</h3>
                  <p>
                    For any questions regarding an original purchase, please contact the studio:
                  </p>
                  <a href="mailto:hello@alexandrapintea.art" className="underline underline-offset-4 hover:text-ink transition-colors">
                    hello@alexandrapintea.art
                  </a>
                </div>
              </div>
            </details>
          </article>

        </div>
      </div>
    </section>
  );
}
