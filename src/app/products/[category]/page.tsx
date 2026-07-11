import { notFound } from "next/navigation";

import { ProductCataloguePage } from "@/components/products/ProductCataloguePage";
import { ProductDetailPage } from "@/components/products/detail/ProductDetailPage";
import { getProductCategoryConfig } from "@/data/productCatalogue";
import { getProductDetailBySlug } from "@/data/productDetails";

interface ProductCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function ProductCategoryPage({
  params,
}: ProductCategoryPageProps) {
  const { category } = await params;
  const config = getProductCategoryConfig(category);

  if (config) {
    return <ProductCataloguePage config={config} />;
  }

  const product = getProductDetailBySlug(category);

  if (product) {
    return <ProductDetailPage product={product} />;
  }

  notFound();
}
