import type { Metadata } from "next";

import { AdminProductDetailEditor } from "@/components/admin/catalogue/AdminProductDetailEditor";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Product Detail Editor | NELYTECH Admin",
  description: "Preview and manage unpublished Product Detail content.",
};

interface AdminProductDetailPageProps {
  params: Promise<{ subcategorySlug: string; productSlug: string }>;
}

export default async function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
  const { subcategorySlug, productSlug } = await params;
  return (
    <AdminProductDetailEditor
      subcategorySlug={subcategorySlug}
      productSlug={productSlug}
    />
  );
}
