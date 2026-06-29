"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: [string, string][] = [
  ["Works", "/archive"],
  ["Print Club", "/print-club"],
  ["Commission", "/commissions"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["Account", "/login"]
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

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
          <span className={`block h-px w-5 bg-ink transition-all duration-200 ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`block h-px w-5 bg-ink transition-all duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-px w-5 bg-ink transition-all duration-200 ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 top-[calc(var(--header-h,8rem)+2px)] z-40 bg-paper md:hidden overflow-y-auto">
          <nav className="container-shell py-6">
            <ul className="grid gap-0">
              {navItems.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={[
                      "focus-ring block border-b border-line py-4 label transition-colors",
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
