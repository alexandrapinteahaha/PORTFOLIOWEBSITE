import type { Metadata } from "next";
import Link from "next/link";
import { signOutPortal } from "./actions";

export const metadata: Metadata = {
  title: { default: "Commission Portal", template: "%s — Commission Portal" },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-line bg-white">
        <div className="container-shell flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <a
              href="/portal/dashboard"
              className="font-title text-sm font-bold uppercase tracking-[0.12em] text-ink"
            >
              Alexandra Pintea
            </a>
            <span className="hidden text-graphite/30 sm:inline">·</span>
            <span className="hidden text-xs text-graphite/50 sm:inline">Commission Portal</span>
          </div>
          <form action={signOutPortal}>
            <button
              type="submit"
              className="text-xs text-graphite/60 underline underline-offset-4 transition hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-line">
        <div className="container-shell flex flex-wrap items-center gap-5 py-6 text-xs text-graphite/40">
          <span>© {new Date().getFullYear()} Alexandra Pintea</span>
          <a href="/privacy-policy" className="hover:text-ink">Policies</a>
          <Link href="/" className="hover:text-ink">alexandrapintea.art ↗</Link>
        </div>
      </footer>
    </div>
  );
}
