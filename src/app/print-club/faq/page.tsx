import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Print Club FAQ"
};

const printClubFaqs = [
  {
    title: "International Shipping",
    body: "International shipping usually holds a higher shipping price. No other fees or taxes are added on our end."
  },
  {
    title: "Change Address / Email / Billing",
    body: null,
    bodyJsx: (
      <p className="mt-2 text-sm leading-7 text-graphite">
        You can edit your address, email, and billing information through your{" "}
        <Link
          href="/print-club/membership"
          className="underline underline-offset-4 hover:text-ink transition-colors"
        >
          membership portal
        </Link>
        .
      </p>
    )
  },
  {
    title: "Shipment Date / Wait Time",
    body: "All Print Club orders within each month's sign-up period have a cut-off date between the 22nd–26th — these are the shipment dates. To check the most accurate date, see the home page. Please allow up to 7 business days for UK subscribers and up to 30 business days for international orders."
  },
  {
    title: "Tracking",
    body: "Print Club orders are mailed using stamps, which means there is no tracking available for Print Club orders."
  },
  {
    title: "Sign-Up Period",
    body: "Sign-up periods each month end on the 20th. Signing up on the 21st or later will result in receiving the following month's print. If you sign up on or before the 20th you will receive the print for the month you signed up in."
  },
  {
    title: "Mail Not Received",
    body: null,
    bodyJsx: (
      <p className="mt-2 text-sm leading-7 text-graphite">
        If your mail has not been received, please email{" "}
        <a
          href="mailto:alexandrapinteaart@gmail.com"
          className="underline underline-offset-4 hover:text-ink transition-colors"
        >
          alexandrapinteaart@gmail.com
        </a>{" "}
        with your account details so we can verify your information is correct.
        Please also check with your local post office.
      </p>
    )
  }
];

const generalFaqs = [
  {
    title: "Privacy Policy",
    body: "Your data is used for internal purposes only and will never be shared with outside sources."
  },
  {
    title: "Process Time",
    body: "When ordering a piece of work, please allow up to 7 business days for COA preparation, packaging, documentation, and shipment. You will receive tracking information once your order has been shipped."
  },
  {
    title: "Damaged Orders",
    body: null,
    bodyJsx: (
      <p className="mt-2 text-sm leading-7 text-graphite">
        If your order arrives damaged or incorrect, please contact{" "}
        <a
          href="mailto:alexandrapinteaart@gmail.com"
          className="underline underline-offset-4 hover:text-ink transition-colors"
        >
          alexandrapinteaart@gmail.com
        </a>{" "}
        with your name, order number, and photo evidence. We offer a restoration
        process free of charge, or a refund in cases of damage.
      </p>
    )
  },
  {
    title: "Shipment",
    body: "Domestic orders are shipped first class, aiming to arrive within 4–5 business days. Please allow up to 21 days for international orders."
  },
  {
    title: "Shipped Package Not Arrived",
    body: "If your tracking shows as delivered but your package has not arrived, please contact your local post office with your tracking information. Packages are often waiting for collection."
  },
  {
    title: "Return Policy",
    body: "All sales are final. Print Club is made to order — once payment is processed there are no cancellations."
  },
  {
    title: "Secure Payment",
    body: "All payments are processed through software that complies with PCI standards, uses HTTPS, and follows other security best practices."
  }
];

type FaqItem = {
  title: string;
  body?: string | null;
  bodyJsx?: React.ReactNode;
};

function FaqCard({ title, body, bodyJsx }: FaqItem) {
  return (
    <div className="rounded-sm p-6" style={{ backgroundColor: "#f3f2f0" }}>
      <h3 className="font-title font-bold text-ink" style={{ fontSize: "15px", letterSpacing: "0.01em" }}>
        {title}
      </h3>
      {body && (
        <p className="mt-2 text-sm leading-7 text-graphite">{body}</p>
      )}
      {bodyJsx}
    </div>
  );
}

export default function PrintClubFaqPage() {
  return (
    <section className="container-shell py-14 md:py-20">

      {/* Page title */}
      <h1 className="font-title font-bold text-ink mb-10" style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)" }}>
        Print Club FAQ
      </h1>

      {/* Print Club cards */}
      <div className="grid gap-4 sm:grid-cols-2 mb-14">
        {printClubFaqs.map((faq) => (
          <FaqCard key={faq.title} {...faq} />
        ))}
      </div>

      {/* General FAQ */}
      <h2 className="font-title font-bold text-ink mb-8" style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}>
        General FAQ
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {generalFaqs.map((faq) => (
          <FaqCard key={faq.title} {...faq} />
        ))}
      </div>

      <p className="mt-10 text-sm text-graphite">
        Still have questions?{" "}
        <a
          href="mailto:alexandrapinteaart@gmail.com"
          className="underline underline-offset-4 hover:text-ink transition-colors"
        >
          Get in touch
        </a>
        .
      </p>
    </section>
  );
}
