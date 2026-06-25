type SectionHeaderProps = {
  title: string;
  intro?: string;
};

export function SectionHeader({ title, intro }: SectionHeaderProps) {
  return (
    <div className="max-w-3xl">
      <h2 className="font-serif text-3xl leading-tight md:text-5xl">{title}</h2>
      {intro ? <p className="mt-4 text-base leading-7 text-graphite md:text-lg">{intro}</p> : null}
    </div>
  );
}
