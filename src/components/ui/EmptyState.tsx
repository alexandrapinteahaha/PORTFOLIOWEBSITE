export function EmptyState({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="border border-dashed border-line bg-chalk px-8 py-12 text-center">
      <p className="text-sm text-graphite">{message}</p>
      {hint && <p className="mt-2 text-xs text-graphite/70">{hint}</p>}
    </div>
  );
}
