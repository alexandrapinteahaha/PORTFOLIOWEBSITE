import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping and Returns"
};

export default function ShippingReturnsPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-title text-5xl font-light leading-tight">
            Shipping and Returns
          </h1>
          <p className="mt-4 text-sm leading-7 text-graphite">
            Alexandra ships from the United Kingdom.
          </p>
          <div className="mt-6 legal-note">
            This page contains placeholder information. All shipping, returns,
            and customs wording should be reviewed by an appropriate professional
            before launch.
          </div>
        </div>

        <div className="grid gap-0">
          <div className="policy-section">
            <h2 className="font-title text-xl font-medium">Dispatch and handling</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                Physical works are packed carefully and dispatched from the UK.
                Dispatch times vary depending on the work type, current studio
                schedule, and the time of year.
              </p>
              <p>
                Print Club prints are posted monthly as small letter or gift
                packages. Delivery times vary by destination.
              </p>
              <p>
                Original artworks and large prints may require individually
                arranged shipping, insurance, and agreed handling. Contact the
                studio before purchasing if you have specific requirements.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-medium">International shipping and customs</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                Alexandra ships to international destinations. International
                buyers are responsible for all customs duties, import taxes,
                tariffs, local charges, and handling fees charged by their
                country. These costs are not calculated or absorbed in the
                purchase price.
              </p>
              <p>
                If you are unsure of the charges applicable in your country,
                check with your local customs authority before placing an order.
                Refusal to pay import duties does not constitute grounds for a
                return or refund.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-medium">Digital editions and subscriber files</h2>
            <div className="mt-4 text-sm leading-7 text-graphite">
              <p>
                Digital editions and Print Club files are delivered via the
                account area. There is no physical shipping for digital
                purchases. These products are non-returnable once accessed.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-medium">Returns and damage</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                If a physical work arrives damaged, please contact the studio
                within 48 hours with photographs. Damaged works may be eligible
                for replacement, repair, or partial refund depending on the
                circumstances.
              </p>
              <p>
                Returns are not accepted for original artworks, limited prints,
                or any works that have been purchased as part of an edition.
                Returns policy for standard prints is to be confirmed before
                launch.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <div className="legal-note">
              Shipping rates, return eligibility, and customs handling should
              be reviewed and confirmed by an appropriate professional before
              the site is launched to the public.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
