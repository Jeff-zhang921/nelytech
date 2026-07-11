import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface ProductContactContext {
  slug: string;
  name: string;
  category?: string;
}

interface ProductContactCTAProps {
  product: ProductContactContext;
}

const supportText =
  "Need pricing, technical details, or a customised display solution? Our team is ready to help.";

export function ProductContactCTA({ product }: ProductContactCTAProps) {
  const contactHref = `/contact?product=${encodeURIComponent(product.slug)}`;
  const linkLabel = `Contact Us about ${product.name}`;

  return (
    <div className="mt-7 rounded-2xl border border-blue-100/80 bg-blue-50/70 p-5">
      <p className="text-sm leading-6 text-slate-600">{supportText}</p>
      <Link
        href={contactHref}
        aria-label={linkLabel}
        className="group mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 sm:w-auto"
      >
        Contact us about this product
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}
