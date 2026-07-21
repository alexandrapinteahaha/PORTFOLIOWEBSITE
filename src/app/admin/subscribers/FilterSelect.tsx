"use client";

import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "all", label: "All subscribers" },
  { value: "uk", label: "United Kingdom" },
  { value: "international", label: "International" },
  { value: "cancelled", label: "Cancelled" },
  { value: "birthday", label: "🎂 Birthday this month" },
];

export function FilterSelect({ current }: { current: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">Filter</span>
      <select
        value={current}
        onChange={(e) => router.push(`/admin/subscribers?filter=${e.target.value}`)}
        className="focus-ring border border-line bg-paper px-4 py-2 text-sm"
      >
        {OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
