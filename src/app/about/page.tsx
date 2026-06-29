import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-line bg-ink text-chalk">
        <div className="container-shell py-16 md:py-24">
          <Reveal>
            <p className="label text-chalk/40">Artist</p>
            <h1 className="mt-2 font-title text-4xl text-chalk md:text-6xl">
              About
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-8 text-chalk/55">
              Alexandra Pintea is a contemporary artist working across sculpture,
              multimedia, photography, and digital practice.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-8">
            <ButtonLink href="/cv" variant="ghost">
              View CV
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* Content */}
      <section className="container-shell py-16 md:py-24">
        <div className="grid gap-16 md:grid-cols-[1fr_1.6fr]">

          {/* Sidebar info */}
          <Reveal>
            <div className="sticky top-40 grid gap-8">
              <div>
                <p className="label text-graphite">Based</p>
                <p className="mt-2 text-sm text-ink">United Kingdom</p>
              </div>
              <hr className="dotted-rule" />
              <div>
                <p className="label text-graphite">Practice</p>
                <ul className="mt-2 grid gap-1.5 text-sm text-ink">
                  {["Sculpture", "Multimedia", "Photography", "Digital Studies", "Print"].map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
              <hr className="dotted-rule" />
              <div>
                <p className="label text-graphite">Contact</p>
                <a
                  href="mailto:studio@alexandrapintea.com"
                  className="mt-2 block text-sm text-ink underline-offset-4 hover:underline"
                >
                  studio@alexandrapintea.com
                </a>
              </div>
              <hr className="dotted-rule" />
              <div>
                <p className="label text-graphite">Instagram</p>
                <a
                  href="https://instagram.com/alexandrapintea"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-ink underline-offset-4 hover:underline"
                >
                  @alexandrapintea
                </a>
              </div>
            </div>
          </Reveal>

          {/* Main text */}
          <div className="grid gap-14">
            <Reveal>
              <p className="label text-graphite">Statement</p>
              <h2 className="mt-3 font-title text-2xl">Artist Statement</h2>
              <div className="mt-5 grid gap-4 text-sm leading-8 text-graphite">
                <p>
                  Alexandra Pintea is a Romanian multidisciplinary artist whose practice explores
                  the intersection of folklore, industrial systems and female identity. Through
                  sculpture and painting, she investigates how cultural traditions, labour and
                  mechanisms of production shape the body, transforming familiar symbols into
                  unsettling industrial forms that question the connection between the human and
                  the industrial.
                </p>
              </div>
            </Reveal>


            <Reveal className="border-t border-line pt-12">
              <p className="label text-graphite">Work</p>
              <h2 className="mt-3 font-title text-2xl">Selected Projects</h2>
              <div className="mt-5 grid gap-4 text-sm leading-8 text-graphite">
                <p>
                  Key projects, series, and bodies of work can be listed here
                  with brief notes for context.
                </p>
              </div>
            </Reveal>

            <Reveal className="border-t border-line pt-10">
              <p className="text-xs leading-6 text-graphite">
                Press, gallery, and institutional enquiries can be sent via the{" "}
                <Link href="/contact" className="text-ink underline underline-offset-4 hover:text-rust">
                  contact page
                </Link>
                . A CV and press pack are available on request.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
