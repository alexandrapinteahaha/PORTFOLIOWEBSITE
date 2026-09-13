import type { Metadata } from "next";
import Link from "next/link";
import { signOutPortal } from "./actions";

export const metadata: Metadata = {
  title: { default: "Commission Portal", template: "%s — Commission Portal" },
};

/**
 * Portal layout — completely separate from the public site header/footer.
 * Only commission clients should reach these pages.
 */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      {/* ── Minimal portal header ──────────────────────────────────────────── */}
      <header className="border-b border-line bg-paper">
        <div className="container-shell flex items-center justify-between py-4">
          <div>
            <a
              href="/portal/dashboard"
              className="font-title text-sm font-bold uppercase tracking-[0.1em] text-ink"
            >
              Alexandra Pintea
            </a>
            <span className="ml-2 text-xs text-graphite/60">· Commission Portal</span>
          </div>

          <form action={signOutPortal}>
            <button
              type="submit"
              className="text-xs text-graphite underline underline-offset-4 hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <main>{children}</main>

      {/* ── Minimal footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-line">
        <div className="container-shell flex flex-wrap items-center gap-4 py-6 text-xs text-graphite/50">
          <span>© {new Date().getFullYear()} Alexandra Pintea</span>
          <a href="/privacy-policy" className="hover:text-ink">Privacy Policy</a>
          <Link href="/" className="hover:text-ink">alexandrapintea.art</Link>
        </div>
      </footer>
    </div>
  );
}
