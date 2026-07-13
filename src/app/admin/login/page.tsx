import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Access | NELYTECH",
  description: "Prototype access to the NELYTECH Product Panel Extension.",
};

export default function AdminLoginPage() {
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

      <section
        aria-labelledby="admin-access-title"
        className="w-full max-w-md rounded-lg border border-white/70 bg-white/72 p-7 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-9"
      >
        <div className="flex items-center justify-between border-b border-slate-200/70 pb-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
              NELYTECH
            </p>
            <p className="mt-1 text-sm text-slate-600">Admin access</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-teal-700">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <div className="pt-8">
          <h1
            id="admin-access-title"
            className="text-3xl font-light text-slate-950 sm:text-4xl"
          >
            Product Panel Extension
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This frontend prototype opens directly into the Product Catalogue workspace.
          </p>

          <Link
            href="/admin/catalogue"
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          >
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>

          <p className="mt-6 text-center text-xs leading-5 text-slate-500">
            Authentication is not enabled in this prototype and must be added before production use.
          </p>
        </div>
      </section>
    </main>
  );
}
