import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/ButtonLink";

export const metadata: Metadata = {
  title: "CV"
};

type CvEntry = {
  year: string;
  description: string;
  note?: string;
};

type CvSection = {
  title: string;
  entries: CvEntry[];
};

const cvSections: CvSection[] = [
  {
    title: "Education",
    entries: [
      { year: "–", description: "Education entries to be added." }
    ]
  },
  {
    title: "Solo exhibitions",
    entries: [
      { year: "–", description: "Exhibition entries to be added." }
    ]
  },
  {
    title: "Group exhibitions",
    entries: [
      { year: "–", description: "Group exhibition entries to be added." }
    ]
  },
  {
    title: "Residencies",
    entries: [
      { year: "–", description: "Residency entries to be added." }
    ]
  },
  {
    title: "Publications and press",
    entries: [
      { year: "–", description: "Publication and press entries to be added." }
    ]
  },
  {
    title: "Awards",
    entries: [
      { year: "–", description: "Award entries to be added." }
    ]
  },
  {
    title: "Collections",
    entries: [
      { year: "–", description: "Collection entries to be added." }
    ]
  }
];

export default function CvPage() {
  return (
    <section className="container-shell py-14 md:py-20">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-title text-5xl font-light leading-tight">
            Alexandra Pintea
          </h1>
          <p className="mt-3 text-sm text-graphite">Artist CV</p>
        </div>
        <ButtonLink href="/about" variant="quiet">
          About the artist
        </ButtonLink>
      </div>

      <div className="mt-12 grid gap-0">
        {cvSections.map((section) => (
          <div key={section.title} className="policy-section">
            <h2 className="font-title text-2xl font-light">{section.title}</h2>
            <dl className="mt-5 grid gap-4">
              {section.entries.map((entry, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[80px_1fr] gap-6 text-sm"
                >
                  <dt className="text-graphite">{entry.year}</dt>
                  <dd className="leading-7 text-graphite">
                    {entry.description}
                    {entry.note && (
                      <span className="block text-xs text-graphite/70">
                        {entry.note}
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-line pt-6 text-xs leading-6 text-graphite">
        A downloadable CV will be available here. Contact via the{" "}
        <a href="/contact" className="underline underline-offset-4 hover:text-ink">
          contact page
        </a>{" "}
        for full CV or press pack requests.
      </div>
    </section>
  );
}
