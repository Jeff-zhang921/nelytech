"use client";

import Link from "next/link";

interface EmptyResultsProps {
  categoryName?: string;
  isEmptyCategory?: boolean;
  onReset: () => void;
}

export function EmptyResults({
  categoryName,
  isEmptyCategory = false,
  onReset,
}: EmptyResultsProps) {
  if (isEmptyCategory) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white px-6 py-12 text-center">
        <h2 className="text-lg font-light text-slate-950">No products available</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
          There are currently no products listed under {categoryName ?? "this category"}.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
        >
          View all products
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-light text-slate-950">No matching products</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
        Try a different product name, use case, or remove one of the active filters.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
      >
        Reset filters
      </button>
    </div>
  );
}
