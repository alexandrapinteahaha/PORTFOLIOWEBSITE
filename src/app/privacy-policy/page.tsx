import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy"
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-title text-5xl font-light leading-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-graphite">
            How Alexandra Pintea collects and uses personal data.
          </p>
          <div className="mt-6 legal-note">
            This is a placeholder privacy policy. It should be reviewed and
            completed by an appropriate professional before the site is launched.
            UK GDPR and the Data Protection Act 2018 will apply.
          </div>
        </div>

        <div className="grid gap-0">
          <div className="policy-section">
            <h2 className="font-title text-xl font-medium">Data collected</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                This site collects the following categories of personal data in
                order to provide its services:
              </p>
              <ul className="ml-4 grid gap-2 list-disc">
                <li>Email addresses submitted via the newsletter signup form</li>
                <li>Contact details submitted via the commission enquiry form</li>
                <li>Account information created on signup or via Supabase Auth</li>
                <li>Order records needed to fulfil purchases</li>
                <li>Subscription records needed to manage Print Club access</li>
              </ul>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-medium">Payment processing</h2>
            <div className="mt-4 text-sm leading-7 text-graphite">
              <p>
                Payment details are processed by Stripe. Alexandra Pintea does
                not store or handle card information directly. Stripe is a PCI
                DSS compliant payment processor. Please refer to Stripe&apos;s
                privacy policy for details of how Stripe handles payment data.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-medium">How data is used</h2>
            <div className="mt-4 grid gap-4 text-sm leading-7 text-graphite">
              <p>
                Personal data is used only for the purposes for which it was
                collected: to fulfil orders, manage subscriptions, respond to
                commission enquiries, and send newsletters where consent has
                been given.
              </p>
              <p>
                Newsletter signups require explicit consent. You can withdraw
                consent at any time by contacting the studio.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-medium">Data retention</h2>
            <div className="mt-4 text-sm leading-7 text-graphite">
              <p>
                Data retention periods and deletion rights should be defined
                before launch, in line with UK GDPR requirements. Contact the
                studio to request deletion of your personal data.
              </p>
            </div>
          </div>

          <div className="policy-section">
            <h2 className="font-title text-xl font-medium">Contact</h2>
            <div className="mt-4 text-sm leading-7 text-graphite">
              <p>
                For any data or privacy enquiries, contact the studio via the
                contact page. The full data controller contact details should be
                added here before launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
