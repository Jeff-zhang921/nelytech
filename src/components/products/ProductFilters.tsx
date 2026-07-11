"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

import type {
  ProductFilterKey,
  ProductFilterSectionWithOptions,
} from "./productFiltering";

interface ProductFiltersProps {
  sections: readonly ProductFilterSectionWithOptions[];
  activeFilterCount: number;
  heading: string;
  onToggleFilter: (key: ProductFilterKey, value: string) => void;
  onClearAll: () => void;
}

export function ProductFilters({
  sections,
  activeFilterCount,
  heading,
  onToggleFilter,
  onClearAll,
}: ProductFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasMobileOpenRef = useRef(false);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen && wasMobileOpenRef.current) {
      triggerRef.current?.focus();
    }

    wasMobileOpenRef.current = isMobileOpen;
  }, [isMobileOpen]);

  function closeMobileFilters() {
    setIsMobileOpen(false);
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMobileFilters();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements || focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <>
      <div className="lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-expanded={isMobileOpen}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-slate-200/70 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
        >
          <SlidersHorizontal className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
          Filters
          {activeFilterCount > 0 ? (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>
      </div>

      <aside className="hidden lg:block" aria-label="Product filters">
        <div className="sticky top-24 rounded-2xl border border-slate-200/60 bg-white p-5">
          <FilterPanelContent
            idPrefix="desktop"
            sections={sections}
            activeFilterCount={activeFilterCount}
            heading={heading}
            onToggleFilter={onToggleFilter}
            onClearAll={onClearAll}
          />
        </div>
      </aside>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm"
            onClick={closeMobileFilters}
            aria-hidden="true"
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-product-filters-title"
            onKeyDown={handleDialogKeyDown}
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4">
              <h2
                id="mobile-product-filters-title"
                className="text-sm font-medium tracking-wide text-slate-950 uppercase"
              >
                Filters
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={closeMobileFilters}
                aria-label="Close filters"
                className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
              >
                <X className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
              <FilterPanelContent
                idPrefix="mobile"
                sections={sections}
                activeFilterCount={activeFilterCount}
                heading={heading}
                onToggleFilter={onToggleFilter}
                onClearAll={onClearAll}
              />
            </div>
            <div className="border-t border-slate-200/70 px-5 py-4">
              <button
                type="button"
                onClick={closeMobileFilters}
                className="h-11 w-full rounded-full bg-slate-950 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

interface FilterPanelContentProps extends ProductFiltersProps {
  idPrefix: string;
}

function FilterPanelContent({
  idPrefix,
  sections,
  activeFilterCount,
  heading,
  onToggleFilter,
  onClearAll,
}: FilterPanelContentProps) {
  return (
    <form className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
            Filters
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {heading}
          </p>
          {activeFilterCount > 0 ? (
            <p className="mt-1 text-xs font-medium text-slate-400">
              {activeFilterCount} active
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onClearAll}
          disabled={activeFilterCount === 0}
          className="rounded-sm text-xs font-medium text-slate-500 underline-offset-4 transition-colors hover:text-slate-950 hover:underline disabled:cursor-not-allowed disabled:text-slate-300 disabled:no-underline focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        {sections.length > 0 ? (
          sections.map((section) => (
            <FilterSection
              key={section.key}
              idPrefix={idPrefix}
              section={section}
              onToggleFilter={onToggleFilter}
            />
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-4 text-sm leading-6 text-slate-500">
            No filters available for this category.
          </p>
        )}
      </div>
    </form>
  );
}

export function FilterSection({
  idPrefix,
  section,
  onToggleFilter,
}: {
  idPrefix: string;
  section: ProductFilterSectionWithOptions;
  onToggleFilter: (key: ProductFilterKey, value: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const selectedCount = section.options.filter((option) => option.selected).length;
  const sectionId = `${idPrefix}-filter-section-${section.key}`;
  const buttonId = `${sectionId}-button`;

  return (
    <section>
      <button
        id={buttonId}
        type="button"
        aria-expanded={isExpanded}
        aria-controls={sectionId}
        onClick={() => setIsExpanded((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-lg py-1 text-left text-sm font-medium text-slate-950 transition-colors hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
      >
        <span className="min-w-0">{section.label}</span>
        <span className="inline-flex items-center gap-2">
          {selectedCount > 0 ? (
            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
              {selectedCount} selected
            </span>
          ) : null}
          <ChevronDown
            className={[
              "h-4 w-4 text-slate-400 transition-transform",
              isExpanded ? "rotate-180" : "",
            ].join(" ")}
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </span>
      </button>

      {isExpanded ? (
        <fieldset id={sectionId} aria-labelledby={buttonId} className="mt-3 space-y-2">
        {section.options.map((option) => {
          const inputId = `${idPrefix}-filter-${section.key}-${slugify(option.value)}`;

          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={[
                "flex min-h-9 items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors",
                option.disabled
                  ? "cursor-not-allowed text-slate-300"
                  : "cursor-pointer text-slate-600 hover:bg-slate-50 hover:text-slate-950",
              ].join(" ")}
            >
              <input
                id={inputId}
                type="checkbox"
                checked={option.selected}
                disabled={option.disabled}
                onChange={() => onToggleFilter(section.key, option.value)}
                className="h-4 w-4 rounded border-slate-300 text-slate-950 accent-slate-950 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
              />
              <span className="min-w-0 flex-1">{option.value}</span>
              <span
                className={[
                  "text-xs",
                  option.disabled ? "text-slate-300" : "text-slate-400",
                ].join(" ")}
                aria-label={`${option.count} matching products`}
              >
                {option.count}
              </span>
            </label>
          );
        })}
        </fieldset>
      ) : null}
    </section>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
