import type { ReactNode } from "react";

import { AdminAuthProvider } from "@/admin/auth/AdminAuthProvider";
import { AdminRouteGuard } from "@/admin/auth/AdminRouteGuard";
import { AdminCatalogueLayout } from "@/components/admin/catalogue/AdminCatalogueLayout";
import { AdminCatalogueProvider } from "@/components/admin/catalogue/AdminCatalogueProvider";

export default function CatalogueAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminRouteGuard>
        <AdminCatalogueProvider>
          <AdminCatalogueLayout>{children}</AdminCatalogueLayout>
        </AdminCatalogueProvider>
      </AdminRouteGuard>
    </AdminAuthProvider>
  );
}
