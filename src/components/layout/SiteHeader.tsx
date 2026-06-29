"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useCart } from "@/lib/cart";

const navLinks: [string, string][] = [
  ["Archive", "/archive"],
  ["Print Club", "/print-club"],
  ["Commission", "/commissions"],
  ["About", "/about"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const isActive = (path: string) =>
    pathname.startsWith(path) ? "text-ink" : "text-graphite";

  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-line">
      <div className="container-shell flex h-16 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="focus-ring shrink-0" aria-label="Alexandra Pintea — home">
          <Image
            src="/logo-transparent.png"
            alt="Alexandra Pintea"
            width={170}
            height={42}
            priority
          />
        </Link>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`nav-link label transition-colors hover:text-ink ${isActive(href)}`}
            >
              {label}
            </Link>
          ))}

          <span className="h-3 w-px bg-line" />

          {/* Instagram */}
          <a
            href="https://instagram.com/alexandrapintea"
            target="_blank"
            rel="noopener noreferrer"
            className="text-graphite transition-colors hover:text-ink"
            aria-label="Instagram"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>

          {/* Email */}
          <a
            href="mailto:art@pinteaalexandra.com"
            className="text-graphite transition-colors hover:text-ink"
            aria-label="Email"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 7 10-7" />
            </svg>
          </a>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative text-graphite transition-colors hover:text-ink"
            aria-label="Open cart"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M3 4h14l-1.5 9.5H4.5L3 4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              <path d="M7.5 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="7.5" cy="17" r="1" fill="currentColor"/>
              <circle cx="13.5" cy="17" r="1" fill="currentColor"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] font-bold text-chalk">
                {itemCount}
              </span>
            )}
          </button>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
