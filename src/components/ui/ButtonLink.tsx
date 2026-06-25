import Link from "next/link";
import { clsx } from "clsx";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "quiet";
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "focus-ring inline-flex min-h-11 items-center justify-center border px-5 py-2 text-sm font-semibold uppercase tracking-[0.08em] transition",
        variant === "primary" &&
          "border-ink bg-ink text-chalk hover:bg-rust hover:border-rust",
        variant === "secondary" &&
          "border-ink bg-transparent text-ink hover:bg-ink hover:text-chalk",
        variant === "quiet" &&
          "border-transparent bg-transparent px-0 text-ink underline-offset-4 hover:underline"
      )}
    >
      {children}
    </Link>
  );
}
