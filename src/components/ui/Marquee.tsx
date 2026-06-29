type MarqueeProps = {
  items: string[];
  className?: string;
};

export function Marquee({ items, className = "" }: MarqueeProps) {
  const text = items.join("                    ·                    ") + "                    ·                    ";
  const repeated = text.repeat(6);

  return (
    <div
      aria-hidden="true"
      className={[
        "overflow-hidden border-y border-line py-4 select-none",
        className
      ].join(" ")}
    >
      <span
        className="animate-marquee whitespace-nowrap text-graphite"
        style={{ fontSize: "15px", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "'Minion Pro', Georgia, serif" }}
      >
        {repeated}
      </span>
    </div>
  );
}
