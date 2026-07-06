"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useCart } from "@/lib/cart";

const navLinks: [string, string][] = [
  ["Selected Works", "/archive"],
  ["About",          "/about"],
  ["Contact",        "/contact"],
];

const printClubDropdown: [string, string][] = [
  ["Join Print Club",      "/print-club"],
  ["Catchup Prints",       "/print-club/catchup"],
  ["Complete Collection",  "/print-club/collection"],
  ["Manage Membership",    "/print-club/membership"],
  ["FAQ",                  "/print-club/faq"],
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();
  const isActive = (path: string) =>
    pathname.startsWith(path) ? "text-ink" : "text-graphite";

  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-line">
      <div className="container-shell flex h-16 items-center justify-between">

        {/* Name — far left */}
        <Link
          href="/"
          aria-label="Alexandra Pintea — home"
          className="focus-ring shrink-0 select-none"
          style={{
            fontFamily: "'Minion Pro', Georgia, serif",
            fontWeight: 300,
            fontSize: "13px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-graphite)"
          }}
        >
          Alexandra Pintea
        </Link>

        {/* Nav + icons — desktop */}
        <nav className="hidden md:flex items-center gap-7">
          {/* Selected Works */}
          <Link
            href="/archive"
            className={`nav-link label transition-colors hover:text-ink ${isActive("/archive")}`}
          >
            Selected Works
          </Link>

          {/* Print Club with dropdown */}
          <div className="group relative">
            <Link
              href="/print-club"
              className={`nav-link label transition-colors hover:text-ink ${isActive("/print-club")}`}
            >
              Print Club
            </Link>
            {/* Dropdown panel */}
            <div className="pointer-events-none absolute right-0 top-full z-50 pt-3 opacity-0 transition-opacity duration-150 group-hover:pointer-events-auto group-hover:opacity-100">
              <div className="min-w-[196px] border border-line bg-paper shadow-sm">
                {printClubDropdown.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="block border-b border-line px-5 py-3 last:border-b-0 label text-graphite transition-colors hover:bg-chalk hover:text-ink"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* About + Contact */}
          {navLinks.slice(1).map(([label, href]) => (
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
            href="https://instagram.com/byalxndra"
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

          {/* Account */}
          <Link
            href="/login"
            className="text-graphite transition-colors hover:text-ink"
            aria-label="Account login"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </Link>

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

        {/* Mobile — icons + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <a
            href="https://instagram.com/byalxndra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-graphite"
            aria-label="Instagram"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <Link href="/login" className="text-graphite" aria-label="Account">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7" />
            </svg>
          </Link>
          <button onClick={openCart} className="relative text-graphite" aria-label="Cart">
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
          <MobileMenu />
        </div>

      </div>
    </header>
  );
}
