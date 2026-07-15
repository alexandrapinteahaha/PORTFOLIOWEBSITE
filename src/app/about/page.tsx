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
            practice explores the relationship between the human soul and the contemporary world.
            Working across painting, sculpture and mixed media, she examines identity, spirituality
            and the ways meaning is carried through symbols, materials and form.
          </p>
          <p className="mt-6 text-sm leading-8 text-ink">
            Her paintings draw upon Romanian folklore, traditional motifs and symbolic imagery,
            reinterpreting inherited narratives through a contemporary lens. Rather than preserving
            folklore as history, she transforms its visual language into new stories that explore
            protection, femininity, freedom and the emotional complexities of human experience.
          </p>
          <p className="mt-6 text-sm leading-8 text-ink">
            Alongside her paintings, Alexandra&apos;s sculptural practice investigates the
            intersection of the organic and the industrial. Combining fluid forms with metal and
            manufactured materials, her sculptures reflect the growing entanglement of humanity and
            machine, questioning how the contemporary world shapes our understanding of the soul,
            the body and identity.
          </p>
          <p className="mt-6 text-sm leading-8 text-ink">
            Across her practice, symbolism functions as a universal language rather than a decorative
            device. Whether through folklore or material contrast, Alexandra creates works that invite
            viewers to consider the unseen forces that shape our lives and the enduring search for
            connection beyond the physical.
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
