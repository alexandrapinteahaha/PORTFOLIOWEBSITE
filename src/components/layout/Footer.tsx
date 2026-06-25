import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const infoLinks = [
  ["FAQ", "/faq"],
  ["Shipping and Returns", "/shipping-returns"],
  ["Privacy Policy", "/privacy-policy"],
  ["Terms and Conditions", "/terms-and-conditions"],
  ["Contact", "/contact"]
];

const practiceLinks = [
  ["Portfolio", "/portfolio"],
  ["Gallery", "/gallery"],
  ["Archive", "/archive"],
  ["Print Club", "/print-club"],
  ["Commissions", "/commissions"],
  ["CV", "/cv"]
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-chalk">
      <div className="container-shell grid gap-12 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl font-medium">Alexandra Pintea</p>
          <p className="mt-4 max-w-xs text-sm leading-7 text-chalk/70">
            A living archive of sculpture, multimedia work, photography, and
            digital studies.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.1em] text-chalk/40">
            Instagram
          </p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 block text-sm text-chalk/60 transition-colors hover:text-chalk"
            aria-label="Alexandra Pintea on Instagram"
          >
            @alexandrapintea
          </a>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-chalk/40">
            Practice
          </p>
          <ul className="mt-4 grid gap-2.5 text-sm text-chalk/70">
            {practiceLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="focus-ring transition-colors hover:text-chalk">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-chalk/40">
            Information
          </p>
          <ul className="mt-4 grid gap-2.5 text-sm text-chalk/70">
            {infoLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="focus-ring transition-colors hover:text-chalk">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/admin"
                className="focus-ring transition-colors hover:text-chalk"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-chalk/40">
            Newsletter
          </p>
          <p className="mt-4 text-sm leading-6 text-chalk/60">
            Occasional updates on new work and Print Club releases.
          </p>
          <div className="mt-4">
            <NewsletterForm dark />
          </div>
        </div>
      </div>

      <div className="border-t border-chalk/10">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-chalk/35">
          <span>Alexandra Pintea. All rights reserved.</span>
          <span>Ships from the United Kingdom.</span>
        </div>
      </div>
    </footer>
  );
}
