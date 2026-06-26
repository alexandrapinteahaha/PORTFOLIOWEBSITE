import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact"
};

export default function ContactPage() {
  const channels = [
    {
      label: "Studio",
      title: "Email",
      content: (
        <a
          href="mailto:studio@alexandrapintea.com"
          className="text-ink underline-offset-4 hover:underline"
        >
          studio@alexandrapintea.com
        </a>
      ),
      note: "For artwork enquiries, gallery conversations, and press requests."
    },
    {
      label: "Social",
      title: "Instagram",
      content: (
        <a
          href="https://instagram.com/alexandrapintea"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink underline-offset-4 hover:underline"
        >
          @alexandrapintea
        </a>
      ),
      note: "Process, new work, and updates."
    },
    {
      label: "Commission",
      title: "Commission Enquiries",
      content: (
        <Link href="/commissions" className="text-ink underline-offset-4 hover:underline">
          Use the commission form →
        </Link>
      ),
      note: "The form collects the information needed to respond properly."
    },
    {
      label: "Press",
      title: "Press and Institutions",
      content: <span className="text-graphite">studio@alexandrapintea.com</span>,
      note: "A CV and press pack are available on request."
    }
  ];

  return (
    <>
      {/* Header */}
      <section className="border-b border-line">
        <div className="container-shell py-14 md:py-20">
          <Reveal>
            <p className="label text-graphite">Get in touch</p>
            <h1 className="mt-2 font-title text-4xl md:text-6xl">Contact</h1>
          </Reveal>
        </div>
      </section>

      {/* Channels */}
      <section className="container-shell py-16 md:py-24">
        <div className="grid gap-0">
          {channels.map((ch, i) => (
            <Reveal key={ch.label} delay={i * 80}>
              <div className="grid gap-4 border-b border-line py-10 md:grid-cols-[160px_1fr_1fr]">
                <p className="label text-graphite">{ch.label}</p>
                <div>
                  <p className="label mb-2 text-ink">{ch.title}</p>
                  <p className="text-sm">{ch.content}</p>
                </div>
                <p className="max-w-xs text-sm leading-7 text-graphite">{ch.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
