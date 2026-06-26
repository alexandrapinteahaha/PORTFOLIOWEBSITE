"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  ["Portfolio", "/portfolio"],
  ["Gallery", "/gallery"],
  ["Shop", "/shop"],
  ["Print Club", "/print-club"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Account", "/account"]
];

export function MobileMenu({ dark }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="focus-ring flex h-10 w-10 cursor-pointer items-center justify-center md:hidden"
      >
        <span className="grid gap-[5px]">
          <span
            className={[
              "block h-px w-5 transition-all duration-200",
              dark ? "bg-chalk" : "bg-ink",
              open ? "translate-y-[6px] rotate-45" : ""
            ].join(" ")}
          />
          <span
            className={[
              "block h-px w-5 transition-all duration-200",
              dark ? "bg-chalk" : "bg-ink",
              open ? "opacity-0" : ""
            ].join(" ")}
          />
          <span
            className={[
              "block h-px w-5 transition-all duration-200",
              dark ? "bg-chalk" : "bg-ink",
              open ? "-translate-y-[6px] -rotate-45" : ""
            ].join(" ")}
          />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 top-32 z-40 bg-paper md:hidden">
          <nav className="container-shell py-8">
            <ul className="grid gap-1">
              {navItems.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      "focus-ring block border-b border-line py-5 font-sans text-base uppercase tracking-[0.1em] transition",
                      pathname === href ? "text-ink" : "text-graphite hover:text-ink"
                    ].join(" ")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
