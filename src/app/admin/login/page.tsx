import type { Metadata } from "next";

import { AdminLoginForm } from "@/components/admin/auth/AdminLoginForm";

export const runtime = "edge";

export const metadata: Metadata = {
  title: "Admin Sign In | NELYTECH",
  description: "Secure access to the NELYTECH Product Catalogue Editor.",
};

interface AdminLoginPageProps {
  searchParams: Promise<{ returnTo?: string | string[] }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const parameters = await searchParams;
  const returnTo = sanitizeReturnTo(
    typeof parameters.returnTo === "string" ? parameters.returnTo : undefined,
  );

  return (
    <main
      lang="en"
      className="relative isolate flex min-h-[calc(100svh-97px)] items-center justify-center overflow-hidden px-5 py-16 sm:px-8"
    >
      <div className="admin-access-background absolute inset-0 -z-20" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 bg-white/20 backdrop-blur-[2px]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,transparent,black_24%,black_76%,transparent)]"
        aria-hidden="true"
      />
      <AdminLoginForm returnTo={returnTo} />
    </main>
  );
}

function sanitizeReturnTo(value: string | undefined) {
  if (!value || !value.startsWith("/admin/catalogue") || value.startsWith("//")) {
    return "/admin/catalogue";
  }

  try {
    const url = new URL(value, "https://nelytech.invalid");
    return url.origin === "https://nelytech.invalid" &&
      (url.pathname === "/admin/catalogue" || url.pathname.startsWith("/admin/catalogue/"))
      ? `${url.pathname}${url.search}${url.hash}`
      : "/admin/catalogue";
  } catch {
    return "/admin/catalogue";
  }
}
