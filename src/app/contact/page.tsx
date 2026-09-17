import type { Metadata } from "next";
import Link from "next/link";
import { submitContactForm } from "./actions";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  return (
    <>
      {/* ── Hero heading ──────────────────────────────────────────────────── */}
      <section className="container-shell border-b border-line pb-10 pt-16 md:pt-24">
        <p className="label mb-4 text-graphite">Get in touch</p>
        <h1
          className="font-title font-bold leading-[0.9] text-ink"
          style={{ fontSize: "clamp(3.5rem, 12vw, 9rem)" }}
        >
          Contact.
        </h1>
      </section>

      {/* ── Main grid ─────────────────────────────────────────────────────── */}
      <section className="container-shell py-16 md:py-20">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">

          {/* Left — studio info */}
          <div className="grid content-start gap-10">
            <div>
              <p className="label mb-3 text-graphite">Studio</p>
              <p className="font-title text-sm font-bold">Alexandra Pintea</p>
              <p className="mt-1 text-sm text-graphite">United Kingdom</p>
            </div>

            <div>
              <p className="label mb-3 text-graphite">Email</p>
              <a
                href="mailto:alexandrapinteaart@gmail.com"
                className="text-sm text-ink underline-offset-4 hover:underline"
              >
                alexandrapinteaart@gmail.com
              </a>
            </div>

            <div>
              <p className="label mb-3 text-graphite">Instagram</p>
              <a
                href="https://instagram.com/byalxndra"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ink underline-offset-4 hover:underline"
              >
                @byalxndra
              </a>
              <p className="mt-1 text-xs text-graphite/60">Process, new work, and updates.</p>
            </div>

            <div>
              <p className="label mb-3 text-graphite">Commissions</p>
              <Link
                href="/commissions"
                className="text-sm text-ink underline-offset-4 hover:underline"
              >
                Commission enquiry form →
              </Link>
              <p className="mt-1 text-xs text-graphite/60">
                For bespoke artwork requests.
              </p>
            </div>

            <div>
              <p className="label mb-3 text-graphite">Press</p>
              <p className="text-sm text-graphite">
                CV and press pack available on request.
              </p>
            </div>
          </div>

          {/* Right — contact form */}
          <div>
            {sent ? (
              <div className="border border-line bg-chalk px-8 py-10">
                <p className="font-title text-2xl font-bold">Message sent.</p>
                <p className="mt-3 text-sm text-graphite">
                  Thank you — I&apos;ll be in touch soon.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-block text-xs underline underline-offset-4 hover:text-ink"
                >
                  Send another →
                </Link>
              </div>
            ) : (
              <>
                {error === "missing_fields" && (
                  <p className="mb-6 text-xs text-red-600">
                    Please fill in your name, email and message.
                  </p>
                )}
                <form action={submitContactForm} className="grid gap-8">

                  {/* Name */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField label="First name *">
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="Alexandra"
                        className={inputCls}
                      />
                    </FormField>
                    <FormField label="Email address *">
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="hello@example.com"
                        className={inputCls}
                      />
                    </FormField>
                  </div>

                  {/* Subject */}
                  <FormField label="Subject">
                    <select name="subject" className={inputCls}>
                      <option value="">Select a topic</option>
                      <option value="General enquiry">General enquiry</option>
                      <option value="Artwork purchase">Artwork purchase</option>
                      <option value="Commission enquiry">Commission enquiry</option>
                      <option value="Press & media">Press &amp; media</option>
                      <option value="Gallery & exhibition">Gallery &amp; exhibition</option>
                      <option value="Other">Other</option>
                    </select>
                  </FormField>

                  {/* Message */}
                  <FormField label="Message *">
                    <textarea
                      name="message"
                      required
                      rows={6}
                      placeholder="Tell me what you have in mind…"
                      className={`${inputCls} resize-none`}
                    />
                  </FormField>

                  <div>
                    <button
                      type="submit"
                      className="border border-ink bg-ink px-8 py-3 font-title text-xs font-bold uppercase tracking-[0.15em] text-chalk transition hover:bg-graphite"
                    >
                      Send message
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Big email footer ──────────────────────────────────────────────── */}
      <section className="border-t border-line">
        <div className="container-shell py-14">
          <a
            href="mailto:alexandrapinteaart@gmail.com"
            className="block font-title font-bold leading-tight text-ink transition hover:text-graphite"
            style={{ fontSize: "clamp(1.4rem, 4.5vw, 3.5rem)" }}
          >
            alexandrapinteaart@gmail.com
          </a>
          <p className="mt-3 text-xs text-graphite/50">
            I aim to reply within 2–3 business days.
          </p>
        </div>
      </section>
    </>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const inputCls =
  "w-full border-0 border-b border-line bg-transparent pb-2 pt-1 text-sm text-ink placeholder:text-graphite/40 focus:border-ink focus:outline-none transition-colors";

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="label text-graphite">{label}</span>
      {children}
    </label>
  );
}
