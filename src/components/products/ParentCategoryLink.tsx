"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ParentCategoryLinkProps {
  href: string;
  label: string;
  ariaLabel?: string;
}

export function ParentCategoryLink({
  href,
  label,
  ariaLabel,
}: ParentCategoryLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      data-testid="product-parent-link"
      className="group inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-slate-200/70 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <ArrowLeft
        className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
        aria-hidden="true"
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}
