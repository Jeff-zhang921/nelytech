import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailPage } from "@/components/products/detail/ProductDetailPage";
import { getProductCategoryConfig } from "@/data/productCatalogue";
import { getProductDetailBySlug } from "@/data/productDetails";

export const runtime = "edge";

interface NestedProductDetailPageProps {
  params: Promise<{
    category: string;
    productId: string;
  }>;
}

export async function generateMetadata({
  params,
}: NestedProductDetailPageProps): Promise<Metadata> {
  const { category, productId } = await params;
  const product = getProductDetailBySlug(productId);

  if (!product || product.parentCategory.slug !== category) {
    return {
      title: "Product | Nelytech",
    };
  }

  return {
    title: `${product.name} | Nelytech`,
    description: product.shortDescription,
  };
}

export default async function NestedProductDetailPage({
  params,
}: NestedProductDetailPageProps) {
  const { category, productId } = await params;
  const categoryConfig = getProductCategoryConfig(category);
  const product = getProductDetailBySlug(productId);

  if (!categoryConfig || !product || product.parentCategory.slug !== category) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}
