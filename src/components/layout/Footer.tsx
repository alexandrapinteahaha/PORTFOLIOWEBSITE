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
    <footer className="border-t border-dotted border-line bg-ink text-chalk">
      <div className="container-shell grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="text-sm uppercase tracking-label text-chalk/90">Alexandra Pintea</p>
          <p className="mt-5 max-w-xs text-xs leading-7 text-chalk/50 tracking-wide">
            A living archive of sculpture, multimedia work, photography, and
            digital studies.
          </p>
          <p className="mt-6 text-[11px] uppercase tracking-label text-chalk/30">Instagram</p>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1.5 block text-xs tracking-wide text-chalk/50 transition-colors hover:text-chalk"
            aria-label="Alexandra Pintea on Instagram"
          >
            @alexandrapintea
          </a>
        </div>

        <div>
          <p className="label text-chalk/40">Practice</p>
          <ul className="mt-5 grid gap-3 text-xs tracking-wide text-chalk/55">
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
          <p className="label text-chalk/40">Information</p>
          <ul className="mt-5 grid gap-3 text-xs tracking-wide text-chalk/55">
            {infoLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="focus-ring transition-colors hover:text-chalk">
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="focus-ring transition-colors hover:text-chalk">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="label text-chalk/40">Newsletter</p>
          <p className="mt-5 text-xs leading-7 tracking-wide text-chalk/45">
            Occasional updates on new work and Print Club releases.
          </p>
          <div className="mt-5">
            <NewsletterForm dark />
          </div>
        </div>
      </div>

      <hr className="dotted-rule border-chalk/10" />
      <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-5">
        <span className="label text-chalk/30">Alexandra Pintea. All rights reserved.</span>
        <span className="label text-chalk/30">Ships from the United Kingdom.</span>
      </div>
    </footer>
  );
}
