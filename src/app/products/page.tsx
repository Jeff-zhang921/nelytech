import type { Metadata } from "next";

import { ProductsPageContent } from "@/components/products/ProductsPageContent";

export const metadata: Metadata = {
  title: "Products | NELYTECH",
  description:
    "Explore NELYTECH LCD panels, LCD modules, assembly technologies, and custom display solutions.",
};

export default function ProductsPage() {
  return <ProductsPageContent />;
}
