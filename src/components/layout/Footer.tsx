import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const practiceLinks = [
  ["Archive", "/archive"],
  ["Print Club", "/print-club"],
  ["Commissions", "/commissions"],
  ["CV", "/cv"]
];

const infoLinks = [
  ["FAQ", "/faq"],
  ["Shipping and Returns", "/shipping-returns"],
  ["Privacy Policy", "/privacy"],
  ["Terms and Conditions", "/terms-and-conditions"],
  ["Contact", "/contact"],
  ["Admin", "/admin"]
];

export function Footer() {
  return (
    <footer className="bg-ink text-chalk">
      <div className="container-shell grid gap-12 py-16 md:grid-cols-[1.6fr_1fr_1fr_1.4fr] md:py-20">

        {/* Brand */}
        <div>
          <p className="label text-chalk/80">Alexandra Pintea</p>
          <p className="mt-5 max-w-xs text-xs leading-7 text-chalk/40">
            A living archive of sculpture, multimedia work, photography, and
            digital studies. Original works, selected prints, and monthly Print
            Club releases.
          </p>
          <div className="mt-8 grid gap-2">
            <p className="label text-chalk/25">Instagram</p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link text-xs tracking-wide text-chalk/45 transition-colors hover:text-chalk"
              aria-label="Alexandra Pintea on Instagram"
            >
              @alexandrapintea
            </a>
          </div>
        </div>

        {/* Practice */}
        <div>
          <p className="label text-chalk/30">Practice</p>
          <ul className="mt-5 grid gap-3">
            {practiceLinks.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="nav-link text-xs tracking-wide text-chalk/50 transition-colors hover:text-chalk"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information */}
        <div>
          <p className="label text-chalk/30">Information</p>
          <ul className="mt-5 grid gap-3">
            {infoLinks.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="nav-link text-xs tracking-wide text-chalk/50 transition-colors hover:text-chalk"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="label text-chalk/30">Newsletter</p>
          <p className="mt-5 text-xs leading-7 text-chalk/40">
            Occasional updates on new work and Print Club releases. No regular
            schedule.
          </p>
          <div className="mt-5">
            <NewsletterForm dark />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-chalk/10">
        <div className="container-shell flex flex-wrap items-center justify-between gap-3 py-5">
          <span className="label text-chalk/25">
            © {new Date().getFullYear()} Alexandra Pintea. All rights reserved.
          </span>
          <span className="label text-chalk/25">Ships from the United Kingdom.</span>
        </div>
      </div>
    </footer>
  );
}
