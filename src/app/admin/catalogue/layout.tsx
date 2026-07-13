import type { ReactNode } from "react";

import { AdminCatalogueLayout } from "@/components/admin/catalogue/AdminCatalogueLayout";
import { AdminCatalogueProvider } from "@/components/admin/catalogue/AdminCatalogueProvider";

export default function CatalogueAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminCatalogueProvider>
      <AdminCatalogueLayout>{children}</AdminCatalogueLayout>
    </AdminCatalogueProvider>
  );
}
