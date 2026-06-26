import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";

const navItems = [
  ["Portfolio", "/portfolio"],
  ["Gallery", "/gallery"],
  ["Shop", "/shop"],
  ["Print Club", "/print-club"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="container-shell flex min-h-32 items-center justify-between gap-8">
        <Link href="/" className="focus-ring flex items-center" aria-label="Alexandra Pintea — home">
          <Image
            src="/logo-transparent.png"
            alt="Alexandra Pintea"
            width={220}
            height={56}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="focus-ring label transition-colors hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Link href="/account" className="focus-ring label transition-colors hover:text-ink">
            Account
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
