import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";

export const metadata: Metadata = {
  title: "Print Club FAQ"
};

const printClubFaqs = [
  {
    question: "International Shipping",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        International shipping usually holds a higher shipping price. No other
        fees or taxes are added on our end.
      </p>
    )
  },
  {
    question: "Shipment Date / Wait Time",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        All Print Club orders within each month&apos;s sign-up period have a cut-off
        date between the 22nd–26th — these are the shipment dates. To check the
        most accurate date, see the home page. Please allow up to{" "}
        <strong>7 business days</strong> for UK subscribers and up to{" "}
        <strong>30 business days</strong> for international orders.
      </p>
    )
  },
  {
    question: "Sign-up Period",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        Sign-up periods each month end on the <strong>20th</strong>. Signing up
        on the 21st or later will result in receiving the following month&apos;s
        print. If you sign up on or before the 20th you will receive the print
        for the month you signed up in.
      </p>
    )
  },
  {
    question: "Change Address / Email / Billing",
    answer: (
      <p className="text-sm leading-7 text-graphite">
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
    question: "Tracking",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        Print Club orders are mailed using stamps, which means there is no
        tracking available for Print Club orders.
      </p>
    )
  },
  {
    question: "Mail Not Received",
    answer: (
      <p className="text-sm leading-7 text-graphite">
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
    question: "Privacy Policy",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        Your data is used for internal purposes only and will never be shared
        with outside sources.
      </p>
    )
  },
  {
    question: "Process Time",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        When ordering a piece of work, please allow up to{" "}
        <strong>7 business days</strong> for COA preparation, packaging,
        documentation, and shipment. You will receive tracking information once
        your order has been shipped.
      </p>
    )
  },
  {
    question: "Damaged Orders",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        If your order arrives damaged or incorrect, please contact{" "}
        <a
          href="mailto:alexandrapinteaart@gmail.com"
          className="underline underline-offset-4 hover:text-ink transition-colors"
        >
          alexandrapinteaart@gmail.com
        </a>{" "}
        with your name, order number, and photo evidence of the damage or
        incorrect item. We offer a restoration process free of charge, or a
        refund in cases of damage.
      </p>
    )
  },
  {
    question: "Shipment",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        Domestic orders are shipped first class, aiming to arrive within{" "}
        <strong>4–5 business days</strong>. Please allow up to{" "}
        <strong>21 days</strong> for international orders.
      </p>
    )
  },
  {
    question: "Shipped Package Not Arrived",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        If your tracking shows as delivered but your package has not arrived,
        please contact your local post office with your tracking information.
        Packages are often waiting for collection.
      </p>
    )
  },
  {
    question: "Return Policy",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        All sales are final. Print Club is made to order — once payment is
        processed there are no cancellations.
      </p>
    )
  },
  {
    question: "Secure Payment",
    answer: (
      <p className="text-sm leading-7 text-graphite">
        All payments are processed through software that complies with PCI
        standards, uses HTTPS, and follows other security best practices.
      </p>
    )
  }
];

export default function PrintClubFaqPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">

        {/* Left — title */}
        <div>
          <p className="label text-graphite mb-3">Print Club</p>
          <h1 className="font-title text-5xl font-light leading-tight">FAQ</h1>
          <p className="mt-4 text-sm leading-7 text-graphite">
            Everything you need to know about the Print Club and general orders.
          </p>
          <p className="mt-4 text-sm text-graphite">
            Still have questions?{" "}
            <a
              href="mailto:alexandrapinteaart@gmail.com"
              className="underline underline-offset-4 hover:text-rust transition-colors"
            >
              Get in touch
            </a>
            .
          </p>
        </div>

        {/* Right — accordions */}
        <div className="grid gap-12">

          {/* Print Club section */}
          <div>
            <p className="label text-graphite mb-6 pb-4 border-b border-line">
              Print Club
            </p>
            <Accordion items={printClubFaqs} />
          </div>

          {/* General section */}
          <div>
            <p className="label text-graphite mb-6 pb-4 border-b border-line">
              General
            </p>
            <Accordion items={generalFaqs} />
          </div>

        </div>
      </div>
    </section>
  );
}
