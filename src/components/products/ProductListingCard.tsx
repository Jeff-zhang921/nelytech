"use client";

import Image from "next/image";
import Link from "next/link";

export interface ProductListingCardProps {
  href: string;
  image: string;
  imageAlt: string;
  name: string;
  description: string;
}

export function ProductListingCard({
  href,
  image,
  imageAlt,
  name,
  description,
}: ProductListingCardProps) {
  return (
    <Link
      href={href}
      data-testid="product-card"
      className="group block h-full overflow-hidden rounded-2xl border border-white/50 bg-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-2xl outline-none transition-all duration-500 ease-out hover:border-white/80 hover:bg-white/80 hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] focus-visible:border-white/80 focus-visible:bg-white/80 focus-visible:ring-2 focus-visible:ring-slate-300/70 focus-visible:ring-offset-2"
    >
      <ProductCardImage image={image} imageAlt={imageAlt} />

      <div className="p-5 sm:p-6">
        <h2 className="text-base font-light leading-6 text-slate-950">{name}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </Link>
  );
}

function ProductCardImage({
  image,
  imageAlt,
}: {
  image: string;
  imageAlt: string;
}) {
  return (
    <div className="aspect-[4/3] w-full overflow-hidden border-b border-white/50 bg-white/35 p-4">
      <div className="relative h-full w-full overflow-hidden rounded-xl">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
    </div>
  );
}
