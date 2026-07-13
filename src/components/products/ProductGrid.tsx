"use client";

import { motion, type Variants } from "framer-motion";

import { createProductDetailHref } from "@/data/productCatalogue";

import { ProductListingCard } from "./ProductListingCard";

interface ProductGridItem {
  id: string;
  slug?: string;
  partNumber: string;
  name: string;
  description: string;
  image: string;
  previewImage?: string;
  imageAlt?: string;
  href?: string;
}

interface ProductGridProps {
  products: readonly ProductGridItem[];
  returnQuery?: string;
  disableLinks?: boolean;
  getProductHref?: (product: ProductGridItem) => string;
  getProductAriaLabel?: (product: ProductGridItem) => string;
}

const gridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function ProductGrid({
  products,
  returnQuery,
  disableLinks = false,
  getProductHref,
  getProductAriaLabel,
}: ProductGridProps) {
  return (
    <motion.section
      id="products"
      aria-label="Product results"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 lg:gap-6"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product) => (
        <motion.article key={product.id} variants={cardVariants}>
          <ProductListingCard
            href={
              disableLinks
                ? undefined
                : getProductHref?.(product) ?? createProductDetailHref(product, returnQuery)
            }
            image={product.previewImage ?? product.image}
            imageAlt={product.imageAlt ?? `${product.name} product image`}
            ariaLabel={getProductAriaLabel?.(product)}
            name={product.name}
            description={product.description}
          />
        </motion.article>
      ))}
    </motion.section>
  );
}
