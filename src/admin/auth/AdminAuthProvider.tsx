"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { getAdminSession, signOutAdmin } from "@/admin/api/adminApi";

type AdminAuthStatus = "checking" | "authenticated" | "unauthenticated";

type AdminAuthContextValue = {
  status: AdminAuthStatus;
  expiresAt?: number;
  logout: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<AdminAuthStatus>("checking");
  const [expiresAt, setExpiresAt] = useState<number>();

  useEffect(() => {
    let cancelled = false;

    getAdminSession()
      .then((session) => {
        if (cancelled) return;
        if (session.authenticated) {
          setExpiresAt(session.expiresAt);
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("unauthenticated");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOutAdmin();
    } finally {
      setExpiresAt(undefined);
      router.replace("/admin/login");
    }
  }, [router]);

  const value = useMemo(
    () => ({ status, expiresAt, logout }),
    [expiresAt, logout, status],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  return context;
}
