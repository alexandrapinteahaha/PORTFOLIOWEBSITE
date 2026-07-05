import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About"
};

const labelStyle = {
  fontFamily: "'Myanmar Text', serif",
  fontWeight: 700,
  fontSize: "11px",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
};

export default function AboutPage() {
  return (
    <section className="container-shell py-16 md:py-24">
      <div className="max-w-2xl">

        {/* BIO */}
        <div>
          <p style={labelStyle} className="text-ink">Bio</p>
          <p className="mt-6 text-sm leading-8 text-ink">
            Alexandra (b. 2004) is a Romanian visual artist based in the United Kingdom.
          </p>
          <p className="mt-6 text-sm leading-8 text-ink">
            Working across sculpture, painting, and mixed media, her practice explores the
            relationship between Romanian folklore, industrial systems, and human connection.
            Through material experimentation, she investigates the tension between the organic
            and the mechanical, questioning what remains of the human spirit within an
            industrialised world.
          </p>
        </div>

        {/* INFORMATION */}
        <div className="mt-14">
          <p style={labelStyle} className="text-ink">Information</p>
          <div className="mt-6 grid gap-0 border-t border-line">
            {[
              ["Nationality", "Romanian"],
              ["Born",        "2004"],
              ["Based",       "United Kingdom"],
              ["Practice",    "Sculpture, Painting, Mixed Media"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[140px_1fr] border-b border-line py-3 text-sm"
              >
                <span className="text-graphite">{label}</span>
                <span className="text-ink">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div className="mt-14">
          <p style={labelStyle} className="text-ink">Contact</p>
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
