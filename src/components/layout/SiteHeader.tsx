"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "@/components/layout/MobileMenu";

type DropdownKey = "archive" | "printclub" | null;

const printClubLinks: [string, string][] = [
  ["Join Print Club", "/print-club"],
  ["Catch Up Prints", "/print-club/catch-up"],
  ["Complete Collections", "/print-club/collections"],
  ["Manage Subscription", "/account/print-club"]
];

function ChevronDown() {
  return (
    <svg
      width="9"
      height="5"
      viewBox="0 0 9 5"
      fill="none"
      className="ml-1 inline-block shrink-0"
    >
      <path
        d="M1 1l3.5 3L8 1"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<DropdownKey>(null);

  const close = () => setOpen(null);
  const toggle = (key: DropdownKey) => setOpen((prev) => (prev === key ? null : key));

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper">
        {/* ── Announcement bar ──────────────────────────── */}
        <div className="bg-ink">
          <div className="container-shell py-2.5 text-center">
            <Link
              href="/print-club"
              className="label text-chalk/70 transition-colors hover:text-chalk"
            >
              Print Club 2026 — A Mini Collection · Exploring Identity · 12 prints + birthday print
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>

        {/* ── Logo row (right-aligned) ───────────────────── */}
        <div className="border-b border-line">
          <div className="container-shell flex items-center justify-end py-5">
            <Link
              href="/"
              className="focus-ring"
              aria-label="Alexandra Pintea — home"
            >
              <Image
                src="/logo-transparent.png"
                alt="Alexandra Pintea"
                width={240}
                height={60}
                priority
              />
            </Link>
          </div>
        </div>

        {/* ── Nav row ───────────────────────────────────── */}
        <div className="relative border-b border-line">
          <div className="container-shell flex items-center justify-between">
            <nav className="flex items-center">
              {/* Archive */}
              <div
                className="relative"
                onMouseEnter={() => setOpen("archive")}
                onMouseLeave={close}
              >
                <button
                  onClick={() => toggle("archive")}
                  className={[
                    "flex items-center py-4 pr-8 label transition-colors hover:text-ink",
                    pathname.startsWith("/archive") ? "text-ink" : "text-graphite"
                  ].join(" ")}
                >
                  Archive
                  <ChevronDown />
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

              {/* Print Club */}
              <div
                className="relative"
                onMouseEnter={() => setOpen("printclub")}
                onMouseLeave={close}
              >
                <button
                  onClick={() => toggle("printclub")}
                  className={[
                    "flex items-center py-4 pr-8 label transition-colors hover:text-ink",
                    pathname.startsWith("/print-club") ? "text-ink" : "text-graphite"
                  ].join(" ")}
                >
                  Print Club
                  <ChevronDown />
                </button>

                {open === "printclub" && (
                  <div className="absolute left-0 top-full z-50 w-[580px] border border-line bg-paper shadow-sm">
                    <div className="grid grid-cols-[1fr_190px]">
                      {/* Description */}
                      <div className="border-r border-line p-6">
                        <p className="label text-graphite">About Print Club</p>
                        <p className="mt-3 text-sm leading-7 text-graphite">
                          Each year, a mini project begins — creating 12 pieces
                          in total, with an additional birthday print.
                        </p>
                        <div className="mt-5 border-t border-line pt-4">
                          <p className="label mb-1.5 text-ink">2026 Collection</p>
                          <p className="text-sm text-graphite">Explores Identity</p>
                        </div>
                        <div className="mt-4 border-t border-line pt-4">
                          <p className="label mb-3 text-graphite">What&apos;s included</p>
                          <ul className="grid gap-2 text-xs leading-6 text-graphite">
                            <li>— A personal letter</li>
                            <li>— High quality physical print</li>
                            <li>— Digital access to a process log</li>
                            <li>— Inspiration, influence and process</li>
                          </ul>
                          <p className="mt-3 text-xs leading-6 text-graphite/60">
                            Making a creative process accessible.
                          </p>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="py-2">
                        {printClubLinks.map(([label, href]) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={close}
                            className="block px-4 py-3.5 label text-graphite transition-colors hover:bg-chalk hover:text-ink"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Commission */}
              <Link
                href="/commissions"
                className={[
                  "nav-link py-4 pr-8 label transition-colors hover:text-ink",
                  pathname === "/commissions" ? "text-ink" : "text-graphite"
                ].join(" ")}
                data-active={pathname === "/commissions" ? "true" : undefined}
              >
                Commission
              </Link>

              {/* About */}
              <Link
                href="/about"
                className={[
                  "nav-link py-4 label transition-colors hover:text-ink",
                  pathname === "/about" ? "text-ink" : "text-graphite"
                ].join(" ")}
                data-active={pathname === "/about" ? "true" : undefined}
              >
                About
              </Link>
            </nav>

            {/* Account + mobile */}
            <div className="flex items-center gap-4">
              <Link
                href="/account"
                className="hidden nav-link label text-graphite transition-colors hover:text-ink md:block"
                data-active={pathname === "/account" ? "true" : undefined}
              >
                Account
              </Link>
              <MobileMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop to close dropdowns */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={close}
        />
      )}
    </>
  );
}
