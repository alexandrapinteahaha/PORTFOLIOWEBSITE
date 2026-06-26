type MarqueeProps = {
  items: string[];
  className?: string;
};

export function Marquee({ items, className = "" }: MarqueeProps) {
  const text = items.join("  ·  ") + "  ·  ";
  const repeated = text.repeat(6);

  return (
    <div
      aria-hidden="true"
      className={[
        "overflow-hidden border-y border-line py-3.5 select-none",
        className
      ].join(" ")}
    >
      <span className="animate-marquee label whitespace-nowrap text-graphite">
        {repeated}
      </span>
    </div>
  );
}
