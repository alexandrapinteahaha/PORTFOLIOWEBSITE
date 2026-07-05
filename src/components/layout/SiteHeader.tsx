"use client";

import Link from "next/link";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-line">
      <div className="container-shell flex h-16 items-center justify-between">

        {/* Name — far left, thin, text only */}
        <Link
          href="/"
          aria-label="Alexandra Pintea — home"
          className="focus-ring select-none"
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

        {/* Icons + hamburger — far right */}
        <div className="flex items-center gap-5">

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

          {/* Hamburger */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
