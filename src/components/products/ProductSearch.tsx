"use client";

import { Search, X } from "lucide-react";

interface ProductSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  labels?: {
    label: string;
    placeholder: string;
    clear: string;
  };
}

export function ProductSearch({ value, onChange, onClear, labels }: ProductSearchProps) {
  const copy = labels ?? {
    label: "Search products",
    placeholder: "Search products",
    clear: "Clear product search",
  };
  return (
    <div className="relative">
      <label htmlFor="product-search" className="sr-only">
        {copy.label}
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400"
        strokeWidth={1.6}
        aria-hidden="true"
      />
      <input
        id="product-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={copy.placeholder}
        className="h-12 w-full rounded-xl border border-slate-200/70 bg-white pr-11 pl-11 text-sm text-slate-950 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
      />
      {value.length > 0 ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={copy.clear}
          className="absolute top-1/2 right-3 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
        >
          <X className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
