import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <section className="container-shell py-16 md:py-24">
      <div className="max-w-2xl">

        {/* BIO */}
        <div>
          <p className="font-title text-sm font-bold uppercase tracking-[0.2em] text-ink">Bio</p>
          <p className="mt-6 text-sm leading-8 text-ink">
            Alexandra Pintea (b. 2004) is a Romanian-born, UK-based multidisciplinary artist whose
            practice explores the relationship between folklore, spirituality and contemporary culture.
            Through symbolic imagery and the combination of organic and industrial materials, she
            examines the human soul, identity and the unseen forces that shape our understanding of
            ourselves. Working across painting, sculpture and mixed media, her practice is driven by
            the creation of symbolic forms that invite reflection on the boundaries between the
            physical and the intangible.
          </p>
        </div>

        {/* CONTACT */}
        <div className="mt-14">
          <p className="font-title text-sm font-bold uppercase tracking-[0.2em] text-ink">Contact</p>
          <div className="mt-6 grid gap-0 border-t border-line">
            <div className="grid grid-cols-[140px_1fr] border-b border-line py-3 text-sm">
              <span className="text-graphite">Email</span>
              <a
                href="mailto:alexandrapinteaart@gmail.com"
                className="text-ink underline-offset-4 hover:underline"
              >
                alexandrapinteaart@gmail.com
              </a>
            </div>
            <div className="grid grid-cols-[140px_1fr] border-b border-line py-3 text-sm">
              <span className="text-graphite">Instagram</span>
              <a
                href="https://instagram.com/byalxndra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline-offset-4 hover:underline"
              >
                @byalxndra
              </a>
            </div>
            <div className="grid grid-cols-[140px_1fr] border-b border-line py-3 text-sm">
              <span className="text-graphite">Press &amp; Enquiries</span>
              <Link
                href="/contact"
                className="text-ink underline-offset-4 hover:underline"
              >
                Contact page →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
