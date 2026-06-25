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
      <div className="container-shell flex min-h-16 items-center justify-between gap-6">
        <Link href="/" className="focus-ring flex items-center" aria-label="Alexandra Pintea — home">
          <Image
            src="/logo-cropped.png"
            alt="Alexandra Pintea"
            width={120}
            height={34}
            className="mix-blend-multiply dark:mix-blend-screen"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-6 text-xs uppercase tracking-[0.1em] text-graphite md:flex">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="focus-ring transition-colors hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/account"
            className="focus-ring text-xs uppercase tracking-[0.1em] text-graphite transition-colors hover:text-ink"
          >
            Account
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
