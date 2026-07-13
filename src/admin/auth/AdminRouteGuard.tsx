"use client";

import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAdminAuth } from "./AdminAuthProvider";

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAdminAuth();

  useEffect(() => {
    if (status !== "unauthenticated") return;

    const returnTo = `${window.location.pathname}${window.location.search}`;
    router.replace(`/admin/login?returnTo=${encodeURIComponent(returnTo)}`);
  }, [router, status]);

  if (status !== "authenticated") {
    return (
      <main
        lang="en"
        className="flex min-h-[60vh] items-center justify-center px-6 py-24 text-slate-600"
      >
        <div className="flex items-center gap-3" role="status" aria-live="polite">
          <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
          <span className="text-sm font-medium">Checking Admin access...</span>
        </div>
      </main>
    );
  }

  return children;
}

