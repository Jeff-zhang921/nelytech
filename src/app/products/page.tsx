import type { Metadata } from "next";

import { ProductCataloguePage } from "@/components/products/ProductCataloguePage";
import { allProductsPageConfig } from "@/data/productCatalogue";

export const metadata: Metadata = {
  title: "Products | NELYTECH",
  description:
    "Explore NELYTECH LCD panels, LCD modules, assembly technologies, and custom display solutions.",
};

export default function ProductsPage() {
  return <ProductCataloguePage config={allProductsPageConfig} />;
}
