"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

type GalleryFiltersProps = {
  years: number[];
  series: string[];
  current: {
    category?: string;
    status?: string;
    year?: string;
    series?: string;
  };
};

export function GalleryFilters({ years, series, current }: GalleryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  function clearAll() {
    router.push(pathname);
  }

  const hasFilters = !!(current.category || current.status || current.year || current.series);

  return (
    <div className="mt-8 border border-line bg-chalk p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <FilterSelect
          name="category"
          label="Type"
          value={current.category ?? ""}
          onChange={(v) => updateFilter("category", v)}
        >
          <option value="">All types</option>
          <option value="original">Original artwork</option>
          <option value="sculpture">Sculpture</option>
          <option value="multimedia">Multimedia</option>
          <option value="photography">Photography</option>
          <option value="digital">Digital</option>
          <option value="print">Print</option>
        </FilterSelect>

        <FilterSelect
          name="status"
          label="Availability"
          value={current.status ?? ""}
          onChange={(v) => updateFilter("status", v)}
        >
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="archived">Archive only</option>
        </FilterSelect>

        <FilterSelect
          name="year"
          label="Year"
          value={current.year ?? ""}
          onChange={(v) => updateFilter("year", v)}
        >
          <option value="">All years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          name="series"
          label="Series"
          value={current.series ?? ""}
          onChange={(v) => updateFilter("series", v)}
        >
          <option value="">All series</option>
          {series.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </FilterSelect>
      </div>

      {hasFilters && (
        <div className="mt-3 border-t border-line pt-3">
          <button
            type="button"
            onClick={clearAll}
            className="focus-ring text-xs uppercase tracking-[0.1em] text-graphite underline-offset-4 hover:text-ink hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  name,
  value,
  onChange,
  children
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-graphite">
      {label}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring min-h-11 border border-line bg-paper px-3 text-sm font-normal normal-case tracking-normal text-ink"
      >
        {children}
      </select>
    </label>
  );
}
