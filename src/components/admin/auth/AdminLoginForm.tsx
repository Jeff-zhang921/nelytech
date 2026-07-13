"use client";

import { ArrowRight, Eye, EyeOff, LoaderCircle, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { AdminApiError, getAdminSession, signInAdmin } from "@/admin/api/adminApi";

export function AdminLoginForm({ returnTo }: { returnTo: string }) {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    getAdminSession()
      .then((session) => {
        if (!cancelled && session.authenticated) router.replace(returnTo);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [returnTo, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!key || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await signInAdmin(key);
      setKey("");
      router.replace(returnTo);
    } catch (error) {
      setKey("");
      setErrorMessage(
        error instanceof AdminApiError && error.status !== 401
          ? "Admin sign in is temporarily unavailable. Please try again."
          : "The access key is incorrect.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="admin-sign-in-title"
      className="w-full max-w-md rounded-lg border border-white/70 bg-white/75 p-7 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-9"
    >
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
            NELYTECH
          </p>
          <p className="mt-1 text-sm text-slate-600">Product Catalogue Editor</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 bg-white/70 text-teal-700">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <form className="pt-8" onSubmit={handleSubmit}>
        <h1 id="admin-sign-in-title" className="text-3xl font-light text-slate-950 sm:text-4xl">
          Admin Sign In
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Enter the administrator access key to manage the Product Catalogue.
        </p>

        <div className="mt-7">
          <label htmlFor="administrator-access-key" className="text-sm font-medium text-slate-800">
            Administrator access key
          </label>
          <div className="relative mt-2">
            <input
              id="administrator-access-key"
              name="administrator-access-key"
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(event) => setKey(event.target.value)}
              autoComplete="current-password"
              autoFocus
              maxLength={256}
              disabled={isSubmitting}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? "admin-login-error" : undefined}
              className="h-12 w-full rounded-md border border-slate-300 bg-white/90 px-3 pr-12 text-sm text-slate-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-600/20 disabled:cursor-wait disabled:bg-slate-100"
            />
            <button
              type="button"
              onClick={() => setShowKey((current) => !current)}
              aria-label={showKey ? "Hide administrator access key" : "Show administrator access key"}
              className="absolute top-1/2 right-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 outline-none hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
          {errorMessage ? (
            <p id="admin-login-error" role="alert" className="mt-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={!key || isSubmitting}
          className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white outline-none transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          )}
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </section>
  );
}
