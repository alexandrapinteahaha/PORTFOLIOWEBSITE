"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useCart } from "@/lib/cart";

type DropdownKey = "archive" | "printclub" | null;

const printClubLinks: [string, string][] = [
  ["Join Print Club", "/print-club/join"],
  ["Catch Up Prints", "/print-club/catch-up"],
  ["Complete Collections", "/print-club/collections"],
  ["Manage Subscription", "/account/print-club"]
];

// Shared class for every nav item — buttons and links identical
const navItem = [
  "nav-link inline-flex h-11 items-center gap-1 pr-10",
  "label transition-colors hover:text-ink"
].join(" ");

function ChevronDown() {
  return (
    <svg width="9" height="5" viewBox="0 0 9 5" fill="none" className="shrink-0">
      <path d="M1 1l3.5 3L8 1" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<DropdownKey>(null);
  const { itemCount, openCart } = useCart();

  const close = () => setOpen(null);
  const toggle = (key: DropdownKey) => setOpen((prev) => (prev === key ? null : key));
  const isActive = (path: string) => pathname.startsWith(path) ? "text-ink" : "text-graphite";

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper">

        {/* ── Announcement bar ───────────────────────────── */}
        <div className="bg-ink">
          <div className="container-shell py-2.5 text-center">
            <Link
              href="/print-club/join"
              className="transition-colors hover:opacity-80"
              style={{ fontSize: "11px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#fbfaf7" }}
            >
              Print Club 2026 — A Mini Collection · Exploring Identity · 12 prints + birthday print
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* ── Logo row — flush left ───────────────────────── */}
        <div className="border-b border-line">
          <div className="flex items-center py-5 pl-1 md:pl-2">
            <Link href="/" className="focus-ring" aria-label="Alexandra Pintea — home">
              <Image
                src="/logo-transparent.png"
                alt="Alexandra Pintea"
                width={190}
                height={48}
                priority
              />
            </Link>
          </div>
        </div>

        {/* ── Nav row ─────────────────────────────────────── */}
        <div className="border-b border-line">
          <div className="container-shell flex h-11 items-center justify-between">

            {/* Left nav */}
            <nav className="flex items-center">

              {/* Archive ↓ */}
              <div
                className="relative"
                onMouseEnter={() => setOpen("archive")}
                onMouseLeave={close}
              >
                <button
                  onClick={() => toggle("archive")}
                  className={`${navItem} ${isActive("/archive")} cursor-pointer bg-transparent`}
                >
                  Archive <ChevronDown />
                </button>

                {open === "archive" && (
                  <div className="absolute left-0 top-full z-50 min-w-[200px] border border-line bg-paper shadow-sm">
                    <Link
                      href="/archive"
                      onClick={close}
                      className="block px-5 py-3.5 label text-graphite transition-colors hover:bg-chalk hover:text-ink"
                    >
                      Archive
                    </Link>
                    <div className="border-t border-line px-5 py-3">
                      <p className="label text-graphite/40">Collections coming soon</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Print Club ↓ */}
              <div
                className="relative"
                onMouseEnter={() => setOpen("printclub")}
                onMouseLeave={close}
              >
                <button
                  onClick={() => toggle("printclub")}
                  className={`${navItem} ${isActive("/print-club")} cursor-pointer bg-transparent`}
                >
                  Print Club <ChevronDown />
                </button>

                {open === "printclub" && (
                  <div className="absolute left-0 top-full z-50 min-w-[200px] border border-line bg-paper shadow-sm">
                    {printClubLinks.map(([label, href]) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={close}
                        className="block px-5 py-3.5 label text-graphite transition-colors hover:bg-chalk hover:text-ink"
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Commission */}
              <Link
                href="/commissions"
                className={`${navItem} ${isActive("/commissions")}`}
                data-active={pathname === "/commissions" ? "true" : undefined}
              >
                Commission
              </Link>

              {/* About */}
              <Link
                href="/about"
                className={`${navItem} pr-0 ${isActive("/about")}`}
                data-active={pathname === "/about" ? "true" : undefined}
              >
                About
              </Link>
            </nav>

            {/* Right: Account + Cart + mobile toggle */}
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                className={`hidden ${navItem} pr-0 md:inline-flex ${isActive("/account")}`}
                data-active={pathname === "/account" ? "true" : undefined}
              >
                Account
              </Link>

              {/* Cart icon */}
              <button
                onClick={openCart}
                className="relative flex h-11 items-center text-graphite transition-colors hover:text-ink"
                aria-label="Open cart"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 4h14l-1.5 9.5H4.5L3 4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M7.5 4V3a2.5 2.5 0 015 0v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="7.5" cy="17" r="1" fill="currentColor"/>
                  <circle cx="13.5" cy="17" r="1" fill="currentColor"/>
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] font-bold text-chalk">
                    {itemCount}
                  </span>
                )}
              </button>

              <MobileMenu />
            </div>

          </div>
        </div>
      </header>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-40" onClick={close} />}
    </>
  );
}
