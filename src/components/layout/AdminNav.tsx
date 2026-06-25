import Link from "next/link";

const links = [
  ["Dashboard", "/admin"],
  ["Artworks", "/admin/artworks"],
  ["Products", "/admin/products"],
  ["Print Club", "/admin/print-club"],
  ["Commissions", "/admin/commissions"],
  ["Newsletter", "/admin/newsletter"]
];

export function AdminNav() {
  return (
    <nav className="mb-10 border-b border-line pb-5">
      <div className="flex flex-wrap items-center gap-1">
        <span className="mr-3 text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
          Admin
        </span>
        {links.map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="focus-ring px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-graphite transition hover:text-ink border border-transparent hover:border-line"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
