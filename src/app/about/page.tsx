import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr]">
        <div>
          <h1 className="font-serif text-5xl font-light leading-tight">
            About the artist
          </h1>
          <p className="mt-4 text-sm leading-7 text-graphite">
            Alexandra Pintea is a contemporary artist working across sculpture,
            multimedia, photography, and digital practice.
          </p>
          <div className="mt-6">
            <ButtonLink href="/cv" variant="secondary">
              View CV
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-8">
          <div>
            <h2 className="font-serif text-2xl">Artist statement</h2>
            <div className="mt-4 grid gap-4 text-sm leading-8 text-graphite">
              <p>
                This section will hold Alexandra&apos;s artist statement: a
                considered, specific account of her practice, methods, and
                ongoing interests. The tone should remain direct and
                gallery-appropriate, without inflated claims or generic studio
                language.
              </p>
            </div>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="font-serif text-2xl">Biography</h2>
            <div className="mt-4 grid gap-4 text-sm leading-8 text-graphite">
              <p>
                Biographical notes and professional context to be added here.
                This section should introduce Alexandra&apos;s background,
                where she is based, and the scope of her practice.
              </p>
            </div>
          </div>

          <div className="border-t border-line pt-6">
            <h2 className="font-serif text-2xl">Selected projects</h2>
            <div className="mt-4 grid gap-4 text-sm leading-8 text-graphite">
              <p>
                Key projects, series, and bodies of work can be listed here
                with brief notes for context.
              </p>
            </div>
          </div>

          <div className="border-t border-line pt-5 text-xs leading-6 text-graphite">
            Press, gallery, and institutional enquiries can be sent via the{" "}
            <a href="/contact" className="underline underline-offset-4 hover:text-ink">
              contact page
            </a>
            .
          </div>
        </div>
      </div>
    </section>
  );
}
