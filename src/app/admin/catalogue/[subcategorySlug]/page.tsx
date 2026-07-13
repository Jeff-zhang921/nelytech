import type { Metadata } from "next";

import { SubcategoryProductEditor } from "@/components/admin/catalogue/SubcategoryProductEditor";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Subcategory Product Editor | NELYTECH Admin",
  description: "Preview and manage unpublished product-card and filter changes.",
};

interface AdminSubcategoryPageProps {
  params: Promise<{ subcategorySlug: string }>;
}

export default async function AdminSubcategoryPage({ params }: AdminSubcategoryPageProps) {
  const { subcategorySlug } = await params;
  return <SubcategoryProductEditor subcategorySlug={subcategorySlug} />;
}
