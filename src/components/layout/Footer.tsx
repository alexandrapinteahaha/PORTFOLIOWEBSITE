import Link from "next/link";

const footerLinks: [string, string][] = [
  ["Archive", "/archive"],
  ["Print Club", "/print-club"],
  ["Commission", "/commissions"],
  ["About", "/about"],
  ["Privacy", "/privacy"],
  ["Admin", "/admin"],
];

export function Footer() {
  return (
    <footer className="border-t border-line mt-8">
      <div className="container-shell flex flex-wrap items-center justify-between gap-4 py-7">
        <span className="label text-graphite/50">
          © {new Date().getFullYear()} Alexandra Pintea
        </span>
        <nav className="flex flex-wrap items-center gap-6">
          {footerLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="label text-graphite/60 transition-colors hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
