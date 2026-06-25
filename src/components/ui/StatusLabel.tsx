import { clsx } from "clsx";

type StatusLabelProps = {
  children: React.ReactNode;
  tone?: "available" | "sold" | "locked" | "neutral";
};

export function StatusLabel({ children, tone = "neutral" }: StatusLabelProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
        tone === "available" && "border-moss text-moss",
        tone === "sold" && "border-rust text-rust",
        tone === "locked" && "border-ink bg-ink text-chalk",
        tone === "neutral" && "border-line text-graphite"
      )}
    >
      {children}
    </span>
  );
}
