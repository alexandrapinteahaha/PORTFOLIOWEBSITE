import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy"
};

export default function PrivacyPage() {
  return (
    <section className="container-shell py-16 md:py-24">
      <div className="max-w-2xl">

        <p className="label text-graphite">Legal</p>
        <h1 className="mt-2 font-title text-4xl md:text-6xl">Privacy Policy</h1>

        <div className="mt-12 space-y-10 text-graphite">

          <div>
            <p>
              Alexandra Pintea is committed to providing quality services to you and this policy
              outlines our ongoing obligations to you in respect of how we manage your Personal
              Information.
            </p>
            <p className="mt-4">
              We have adopted the principles contained in the UK General Data Protection Regulation
              (UK GDPR) and the Data Protection Act 2018. These principles govern the way in which
              we collect, use, disclose, store, secure and dispose of your Personal Information.
            </p>
          </div>

          <div>
            <h2 className="font-title text-xl mb-4">Personal Information</h2>
            <p>We collect your Personal Information for the primary purpose of providing our services to you, including:</p>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              <li>Processing and delivering orders</li>
              <li>Sending you service messages and order updates via email or message</li>
              <li>Sending you information about new products or announcements</li>
              <li>Fraud prevention and detection against both you and Alexandra Pintea</li>
            </ul>
            <p className="mt-4">
              We only collect the personal information you choose to provide, including names,
              addresses, email addresses, and phone numbers.
            </p>
            <p className="mt-4">
              You may unsubscribe from our mailing list at any time by clicking the unsubscribe
              link located at the bottom of any email received, or by contacting us at{" "}
              <a href="mailto:alexandrapinteaart@gmail.com" className="underline underline-offset-4 hover:text-ink transition-colors">
                alexandrapinteaart@gmail.com
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-title text-xl mb-4">Payment Information</h2>
            <p>
              Payment information collected is used solely to take payment, to give refunds, and
              to prevent and detect fraud against either you or Alexandra Pintea.
            </p>
          </div>

          <div>
            <h2 className="font-title text-xl mb-4">Third Parties</h2>
            <p>
              Where reasonable and practicable to do so, we will collect your Personal Information
              only from you. However, in some circumstances we may be provided with information by
              third parties. In such a case we will take reasonable steps to ensure that you are
              made aware of the information provided to us by the third party.
            </p>
          </div>

          <div>
            <h2 className="font-title text-xl mb-4">Security of Personal Information</h2>
            <p>
              Your Personal Information is stored in a manner that reasonably protects it from
              misuse and loss and from unauthorised access, modification or disclosure.
            </p>
            <p className="mt-4">
              When your Personal Information is no longer needed for the purpose for which it was
              obtained, we will take reasonable steps to destroy or permanently de-identify your
              Personal Information. However, most of the Personal Information is or will be stored
              in client files which will be kept by us for a minimum of 7 years.
            </p>
          </div>

          <div>
            <h2 className="font-title text-xl mb-4">Access to Your Personal Information</h2>
            <p>
              You have the right to access the Personal Information we hold about you and to
              update and/or correct it, subject to certain exceptions. If you wish to access your
              Personal Information, please contact us in writing.
            </p>
            <p className="mt-4">
              Alexandra Pintea will not charge any fee for your access request.
            </p>
            <p className="mt-4">
              In order to protect your Personal Information we may require identification from you
              before releasing the requested information.
            </p>
            <p className="mt-4">
              It is important to us that your Personal Information is up to date. We will take
              reasonable steps to make sure that your Personal Information is accurate, complete
              and up-to-date. If you find that the information we have is not up to date or is
              inaccurate, please advise us as soon as practicable so we can update our records and
              ensure we can continue to provide quality services to you.
            </p>
          </div>

          <div>
            <h2 className="font-title text-xl mb-4">Your Rights Under UK GDPR</h2>
            <p>Under UK GDPR you have the right to:</p>
            <ul className="mt-4 space-y-2 list-disc pl-5">
              <li>Request a copy of the personal data we hold about you</li>
              <li>Request that we correct any inaccurate or incomplete data</li>
              <li>Request that we delete your personal data</li>
              <li>Object to or restrict our processing of your data</li>
              <li>Withdraw consent at any time where processing is based on consent</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:alexandrapinteaart@gmail.com" className="underline underline-offset-4 hover:text-ink transition-colors">
                alexandrapinteaart@gmail.com
              </a>.
              You also have the right to lodge a complaint with the Information Commissioner&apos;s
              Office (ICO) at{" "}
              <span className="text-ink">ico.org.uk</span> if you believe your data has been
              handled unlawfully.
            </p>
          </div>

          <div>
            <h2 className="font-title text-xl mb-4">Policy Updates</h2>
            <p>
              This Policy may change from time to time and is available on our website.
            </p>
          </div>

          <div className="border-t border-line pt-8">
            <h2 className="font-title text-xl mb-4">Contact Us</h2>
            <p>
              If you have any queries or complaints about our Privacy Policy please contact us at:
            </p>
            <div className="mt-4">
              <p className="font-title text-sm">Alexandra Pintea</p>
              <a href="mailto:alexandrapinteaart@gmail.com" className="underline underline-offset-4 hover:text-ink transition-colors">
                alexandrapinteaart@gmail.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
