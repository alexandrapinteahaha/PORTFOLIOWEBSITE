type SectionHeaderProps = {
  title: string;
  intro?: string;
};

export function SectionHeader({ title, intro }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <h2 className="font-title text-2xl md:text-3xl">{title}</h2>
      {intro ? (
        <p className="mt-4 text-sm leading-7 text-graphite">{intro}</p>
      ) : null}
    </div>
  );
}
