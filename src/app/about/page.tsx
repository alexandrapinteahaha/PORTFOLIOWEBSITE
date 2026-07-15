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
            practice explores the connection between the human soul, cultural memory and the
            contemporary world. Through painting, sculpture and mixed media, she investigates how
            symbols, materials and inherited narratives can communicate experiences that exist beyond
            language.
          </p>
          <p className="mt-6 text-sm leading-8 text-ink">
            Drawing from Romanian folklore, traditional motifs and spiritual symbolism,
            Alexandra&apos;s paintings explore the relationship between cultural heritage and personal
            experience. By reinterpreting familiar symbols within new contexts, she creates visual
            narratives that examine themes of protection, femininity, freedom and the search for
            understanding beyond the physical body. Folklore becomes a symbolic language through
            which emotions, memories and unseen aspects of human existence are given form.
          </p>
          <p className="mt-6 text-sm leading-8 text-ink">
            Her sculptural practice extends this exploration through the relationship between organic
            forms and industrial materials. Combining elements such as metal and manufactured
            structures with softer, fluid forms, Alexandra reflects on the increasing fusion between
            humanity and technology. These contrasts explore the tension between the natural and
            constructed worlds, questioning how contemporary environments influence our sense of
            identity and connection.
          </p>
          <p className="mt-6 text-sm leading-8 text-ink">
            For Alexandra, the process of making is an exploration of transformation, where materials
            and symbols are altered to reveal hidden meanings. Her work creates a dialogue between
            past and present, spirituality and modernity, inviting reflection on the forces that
            shape human experience.
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
