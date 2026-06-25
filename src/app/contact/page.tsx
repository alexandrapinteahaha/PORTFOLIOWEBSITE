import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-serif text-5xl font-light leading-tight">Contact</h1>
          <p className="mt-4 text-sm leading-7 text-graphite">
            For artwork enquiries, commissions, gallery conversations, and press
            requests.
          </p>
        </div>

        <div className="grid gap-8">
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
              Studio
            </h2>
            <p className="mt-3 text-sm leading-7 text-graphite">
              Email:{" "}
              <a
                href="mailto:studio@alexandrapintea.com"
                className="text-ink underline underline-offset-4 hover:text-rust"
              >
                studio@alexandrapintea.com
              </a>
            </p>
            <p className="mt-2 text-xs text-graphite">
              Placeholder address. Replace with Alexandra&apos;s actual studio email before launch.
            </p>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
              Instagram
            </h2>
            <p className="mt-3 text-sm leading-7 text-graphite">
              <a
                href="https://instagram.com/alexandrapintea"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-4 hover:text-rust"
              >
                @alexandrapintea
              </a>
            </p>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
              Commissions
            </h2>
            <p className="mt-3 text-sm leading-7 text-graphite">
              Commission enquiries should be sent through the dedicated{" "}
              <Link href="/commissions" className="text-ink underline underline-offset-4 hover:text-rust">
                commission form
              </Link>
              , which collects the information needed to respond properly.
            </p>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
              Press and institutions
            </h2>
            <p className="mt-3 text-sm leading-7 text-graphite">
              Gallery enquiries, press requests, and institutional contact can be
              directed to the studio email above. A CV and press pack are
              available on request.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
