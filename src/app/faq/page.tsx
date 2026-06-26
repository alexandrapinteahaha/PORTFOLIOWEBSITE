import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ"
};

const faqs = [
  {
    question: "Do sold artworks disappear from the site?",
    answer:
      "No. Sold works remain visible in the archive as a permanent record. The purchase option is removed once a work is sold, but the artwork page, catalogue information, and image remain accessible."
  },
  {
    question: "Can a sold original still be available as a print?",
    answer:
      "Yes. Alexandra can enable print availability separately from original availability. If prints are available for a sold work, a print purchase option will appear on the artwork page."
  },
  {
    question: "Who is responsible for customs and import charges?",
    answer:
      "International buyers are responsible for any customs duties, import taxes, tariffs, local charges, and handling fees charged by their country. These costs are not calculated at checkout and are payable by the buyer on delivery or clearance. If you are unsure of the charges applicable in your country, please check with your local customs authority before ordering."
  },
  {
    question: "Where does Alexandra ship from?",
    answer:
      "All physical works and Print Club prints ship from the United Kingdom. Delivery times vary by destination. Originals may require individually arranged insured shipping depending on size and value."
  },
  {
    question: "What does Print Club include?",
    answer:
      "Print Club subscribers receive one physical print per month from a yearly project of twelve works. Each monthly entry also includes a digital file of the print, a process PDF, and a short letter from Alexandra. Subscribers also gain access to the digital archive via their account area."
  },
  {
    question: "How do I access my Print Club files?",
    answer:
      "After subscribing, sign in to your account and go to the Print Club section. Monthly files are unlocked once your subscription is active. If you have trouble accessing files after subscribing, contact via the contact page."
  },
  {
    question: "Can I cancel my Print Club subscription?",
    answer:
      "Yes. Subscriptions can be managed or cancelled through the Stripe customer portal, accessible from your account area. Cancellation takes effect at the end of the current billing period."
  },
  {
    question: "Are digital editions limited?",
    answer:
      "Yes, where noted. Edition size and number are shown on the product page. Each digital edition includes a purchase record and edition note."
  },
  {
    question: "How do I enquire about a commission?",
    answer:
      "Use the commission enquiry form. Include the type of work, budget range, and timeframe so Alexandra can respond properly."
  }
];

export default function FaqPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-title text-5xl font-light leading-tight">FAQ</h1>
          <p className="mt-4 text-sm leading-7 text-graphite">
            Practical information for collecting work, joining Print Club, and
            understanding how the site works.
          </p>
          <p className="mt-4 text-sm text-graphite">
            Other questions can be directed to the{" "}
            <Link href="/contact" className="underline underline-offset-4 hover:text-rust">
              contact page
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-0">
          {faqs.map((faq) => (
            <article key={faq.question} className="policy-section">
              <h2 className="font-title text-xl font-medium">{faq.question}</h2>
              <p className="mt-3 text-sm leading-7 text-graphite">{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
