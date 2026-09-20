import type { Metadata } from "next";
import Link from "next/link";
import { DELIVERY_ZONES, SHIPPING_CARRIERS, SHIPPING_POLICY } from "@/lib/shipping-config";

export const metadata: Metadata = {
  title: "Shipping & Returns"
};

export default function ShippingReturnsPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">

        {/* Left column */}
        <div>
          <h1 className="font-title text-5xl font-bold leading-tight">
            Shipping &amp; Returns
          </h1>
          <p className="mt-4 text-sm leading-7 text-graphite">
            All physical works ship from the {SHIPPING_POLICY.studioLocation}.
            Shipping arrangements, costs and import responsibilities are
            detailed below and on the individual product page.
          </p>
          <p className="mt-4 text-sm text-graphite">
            Questions about a specific order?{" "}
            <Link href="/contact" className="underline underline-offset-4 hover:text-ink transition-colors">
              Contact the studio
            </Link>
            .
          </p>
        </div>

        {/* Right column */}
        <div className="grid gap-0">

          <div className="policy-section">
            <h2 className="font-title text-xl font-bold">Shipping</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                Original artworks are shipped using {SHIPPING_CARRIERS.originalArtwork}, selected according to the artwork&apos;s value, size, fragility and destination. Specialist carriers and bespoke art logistics may be arranged where appropriate.
              </p>
              <p>
                Prints and other artwork-related physical products are shipped using {SHIPPING_CARRIERS.internationalStandard} or a suitable tracked courier or postal service, depending on size and destination.
              </p>
              <p>
                Dispatch times vary depending on the product, studio schedule and the time of year. Estimated delivery information is provided on the individual product page where available.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-bold">International Shipping &amp; Duties</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                International orders are shipped using tracked professional delivery services. Original artworks are shipped using {SHIPPING_CARRIERS.internationalStandard} or specialist art logistics providers where appropriate, with arrangements selected according to the artwork&apos;s value, size, fragility and destination.
              </p>
              <p>
                Shipping costs, import duties and taxes vary depending on the artwork and destination. The applicable product page or order confirmation will identify which costs are included in the purchase and which, if any, remain the responsibility of the collector.
              </p>
              <p>
                International orders may be subject to import duties, VAT, sales and use taxes, customs charges, brokerage fees, local handling fees and other destination-country charges. The exact treatment depends on the destination and applicable law. The studio does not calculate or guarantee the import charges applicable in any country, and does not invent tax rates or thresholds on behalf of third-party authorities.
              </p>
              <p>
                For original artworks where the artist has agreed to cover shipping and applicable import charges, this will be clearly stated on the product page before purchase.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-bold">Estimated Delivery</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                Estimated delivery times are provided on the individual product page and may vary depending on destination, customs clearance and carrier conditions.
              </p>
              <div className="mt-1 grid gap-2">
                {Object.values(DELIVERY_ZONES).map((zone) => (
                  <div key={zone.label} className="flex items-baseline justify-between gap-4 border-b border-line pb-2 last:border-0">
                    <span className="text-graphite/80">{zone.label}</span>
                    <span className="text-right text-graphite/50">
                      {zone.estimateBusinessDays
                        ? `${zone.estimateBusinessDays} business days`
                        : "See product page"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-graphite/60">
                Estimates are indicative and do not account for customs clearance delays, carrier conditions or local public holidays.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-bold">Dispatch Notification &amp; Tracking</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                A dispatch confirmation will be sent to you by email once your order has been shipped. Where available, this will include the carrier name, tracking number and a link to track your shipment.
              </p>
              <p>
                Tracking information is also accessible through the collector portal where applicable. Please allow some time for tracking information to become active after the carrier has received the shipment — activation times vary by carrier and service.
              </p>
              <p>
                If your order has not arrived within the estimated delivery period, please contact the studio using the contact details in your order confirmation. We will investigate using the carrier tracking information.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-bold">Delivery Address</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                You are responsible for providing an accurate and complete delivery address, including full name, street address, postcode or ZIP code, country and any additional details required by the carrier. A contact telephone number may be required for certain carriers and destinations.
              </p>
              <p>
                If you need to change your delivery address after placing an order, please contact the studio as soon as possible at{" "}
                <a href={`mailto:${SHIPPING_POLICY.contactEmail}`} className="underline underline-offset-4 hover:text-ink transition-colors">
                  {SHIPPING_POLICY.contactEmail}
                </a>
                . If the order has already been dispatched, address changes may not be possible. The studio cannot guarantee that a carrier will accept address amendments once a shipment is in transit.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-bold">Customs &amp; Carrier Requests</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                International collectors may be required to provide information or documentation to customs authorities or the delivery carrier to clear the shipment. Failure to respond to reasonable customs or carrier requests may result in delays, return of the shipment, or additional charges.
              </p>
              <p>
                If a shipment is returned to the studio because the delivery address provided was incorrect, the collector was unavailable for delivery, or the collector failed to respond to customs or carrier requests, the studio may require additional shipping costs before resending the order. The treatment of a returned shipment depends on the circumstances and applicable law.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-bold">Lost or Damaged Shipments</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                If your order arrives damaged, please contact the studio as soon as reasonably possible and provide:
              </p>
              <ul className="ml-4 grid gap-1.5 list-disc">
                <li>Your order details</li>
                <li>Photographs of the external packaging</li>
                <li>Photographs of the internal packaging</li>
                <li>Photographs of the artwork or product</li>
                <li>Photographs of any visible damage</li>
              </ul>
              <p>
                For high-value original artworks, condition documentation may be prepared before dispatch. Responsibility for loss or damage during transit is determined by the applicable shipping, insurance and transaction arrangements, which will be set out in the individual artwork page or Contract of Sale.
              </p>
              <p>
                If you believe your order may be lost, please allow the full estimated delivery period plus a reasonable additional period before contacting the studio. The studio will investigate using carrier tracking information.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-bold">Digital Products</h2>
            <div className="mt-4 text-sm leading-7 text-graphite">
              <p>
                Digital editions and Print Club subscriber files are delivered electronically via the account area. There is no physical shipping for digital purchases. These products are non-returnable once accessed.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-bold">Returns</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                Returns are not accepted for original artworks, limited prints or editions. If a physical work arrives damaged, please contact the studio promptly with supporting photographs.
              </p>
              <p>
                Nothing in this policy is intended to exclude or limit any rights you may have under applicable law, including UK consumer distance selling regulations. If you have a question about your rights in relation to a specific order, please contact the studio or seek independent advice.
              </p>
              <p>
                Returns terms for standard prints are subject to the individual product page and applicable law.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <div className="text-xs leading-6 text-graphite/50">
              Version {SHIPPING_POLICY.version} &middot; {SHIPPING_POLICY.effectiveDate}. This page should be reviewed by an appropriate professional before the site launches to the public.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
