"use client";

import { X } from "lucide-react";

import type { ProductFilterKey, ProductFilterSection } from "./productFiltering";

interface ActiveFiltersProps {
  query: string;
  selected: Record<ProductFilterKey, string[]>;
  sections: readonly ProductFilterSection[];
  onClearQuery: () => void;
  onRemoveFilter: (key: ProductFilterKey, value: string) => void;
  onClearAll: () => void;
  copy?: {
    searchPrefix: string;
    clearAll: string;
  };
  valueLabel?: (groupId: string, value: string) => string;
}

export function ActiveFilters({
  query,
  selected,
  sections,
  onClearQuery,
  onRemoveFilter,
  onClearAll,
  copy = { searchPrefix: "Search", clearAll: "Clear all" },
  valueLabel = (_groupId, value) => value,
}: ActiveFiltersProps) {
  const trimmedQuery = query.trim();
  const activeFilters = sections.flatMap((section) =>
    selected[section.key].map((value) => ({
      key: section.key,
      label: section.label,
      value,
    })),
  );

  if (!trimmedQuery && activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {trimmedQuery ? (
        <ActiveFilterButton label={`${copy.searchPrefix}: ${trimmedQuery}`} onRemove={onClearQuery} />
      ) : null}
      {activeFilters.map((filter) => (
        <ActiveFilterButton
          key={`${filter.key}-${filter.value}`}
          label={`${filter.label}: ${valueLabel(filter.key, filter.value)}`}
          onRemove={() => onRemoveFilter(filter.key, filter.value)}
        />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="ml-1 rounded-sm text-xs font-medium text-slate-500 underline-offset-4 transition-colors hover:text-slate-900 hover:underline focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
      >
        {copy.clearAll}
      </button>
    </div>
  );
}

function ActiveFilterButton({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
    >
      <span>{label}</span>
      <X className="h-3 w-3" strokeWidth={1.7} aria-hidden="true" />
    </button>
  );
}
