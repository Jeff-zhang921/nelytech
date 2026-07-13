import type { Metadata } from "next";

import { CatalogueHierarchyEditor } from "@/components/admin/catalogue/CatalogueHierarchyEditor";

export const metadata: Metadata = {
  title: "Product Catalogue Editor | NELYTECH Admin",
  description: "Preview and manage unpublished Product Catalogue changes.",
};

export default function AdminCataloguePage() {
  return <CatalogueHierarchyEditor />;
}
