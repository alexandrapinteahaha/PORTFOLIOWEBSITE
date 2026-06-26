"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !isHome || scrolled;

  return (
    <header
      className={[
        "sticky top-0 z-50 transition-all duration-500",
        solid
          ? "bg-paper/96 backdrop-blur-md border-b border-line"
          : "bg-transparent"
      ].join(" ")}
    >
      <div className="container-shell flex min-h-32 items-center justify-between gap-8">
        <Link
          href="/"
          className="focus-ring flex items-center"
          aria-label="Alexandra Pintea — home"
        >
          <Image
            src="/logo-transparent.png"
            alt="Alexandra Pintea"
            width={220}
            height={56}
            priority
            className={solid ? "" : "invert"}
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navItems.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={[
                "nav-link focus-ring label transition-colors",
                !solid ? "text-chalk/80 hover:text-chalk" : "hover:text-ink"
              ].join(" ")}
              data-active={pathname === href ? "true" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center md:flex">
          <Link
            href="/account"
            className={[
              "nav-link focus-ring label transition-colors",
              !solid ? "text-chalk/80 hover:text-chalk" : "hover:text-ink"
            ].join(" ")}
            data-active={pathname === "/account" ? "true" : undefined}
          >
            Account
          </Link>
        </div>

        <MobileMenu dark={!solid} />
      </div>
    </header>
  );
}
