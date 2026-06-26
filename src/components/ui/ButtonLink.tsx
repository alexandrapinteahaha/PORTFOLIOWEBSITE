import Link from "next/link";
import { clsx } from "clsx";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "quiet" | "ghost";
};

export function ButtonLink({ href, children, variant = "primary" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "focus-ring inline-flex min-h-11 items-center justify-center px-6 py-2.5",
        "text-xs font-normal uppercase tracking-[0.18em] transition-all duration-300",
        variant === "primary" && [
          "btn-fill border border-ink bg-ink text-chalk",
          "hover:border-rust"
        ],
        variant === "secondary" && [
          "border border-ink bg-transparent text-ink",
          "hover:bg-ink hover:text-chalk"
        ],
        variant === "quiet" && [
          "border border-transparent bg-transparent px-0 text-ink",
          "underline-offset-4 hover:underline"
        ],
        variant === "ghost" && [
          "border border-chalk/30 bg-transparent text-chalk",
          "hover:bg-chalk/10 hover:border-chalk/60"
        ]
      )}
    >
      {children}
    </Link>
  );
}
