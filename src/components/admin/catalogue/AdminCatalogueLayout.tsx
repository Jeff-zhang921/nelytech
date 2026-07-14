"use client";

import {
  AlertTriangle,
  CheckCircle2,
  LoaderCircle,
  LogOut,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldCheck,
  Undo2,
} from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { useAdminAuth } from "@/admin/auth/AdminAuthProvider";
import {
  getSubmissionSuccessCopy,
  productAdminCopy as copy,
  productAdminSubmissionMode,
} from "@/lib/productAdminCopy";

import { useAdminCatalogue } from "./AdminCatalogueProvider";
import { AdminModal } from "./AdminModal";

export function AdminCatalogueLayout({ children }: { children: ReactNode }) {
  const { logout } = useAdminAuth();
  const {
    isDirty,
    saveStatus,
    statusMessage,
    validationErrors,
    hasClientValidationErrors,
    pendingNavigation,
    repositoryConflict,
    isAuthenticationExpired,
    submitDraft,
    closeRepositoryConflict,
    loadLatestAndKeepDraft,
    acceptDraftConflictValues,
    dismissAuthenticationExpired,
    continueToLogin,
    discardUnsavedChanges,
    resetToPublishedData,
    cancelPendingNavigation,
    leaveWithoutSaving,
    submitAndContinue,
  } = useAdminCatalogue();
  const [confirmationAction, setConfirmationAction] = useState<
    "discard" | "reset" | null
  >(null);
  const [isSubmitSuccessOpen, setIsSubmitSuccessOpen] = useState(false);
  const stayButtonRef = useRef<HTMLButtonElement>(null);
  const cancelConfirmationRef = useRef<HTMLButtonElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const continueEditingRef = useRef<HTMLButtonElement>(null);
  const conflictStayRef = useRef<HTMLButtonElement>(null);
  const conflictPrimaryRef = useRef<HTMLButtonElement>(null);
  const authStayRef = useRef<HTMLButtonElement>(null);
  const submissionSuccess = getSubmissionSuccessCopy(productAdminSubmissionMode);
  const cannotSubmit = hasClientValidationErrors || saveStatus === "saving" || !isDirty;

  async function handleSubmit() {
    if (cannotSubmit) return;

    const saved = await submitDraft();

    if (saved) {
      setIsSubmitSuccessOpen(true);
    }
  }

  return (
    <div
      lang="en"
      data-interface-context="product-admin"
      className="relative isolate min-h-screen bg-transparent pb-32"
    >
      <AdminCatalogueBackground />

      <div className="sticky top-[93px] z-40 border-y border-slate-200/70 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1.5 text-[11px] font-semibold tracking-[0.14em] text-white uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              {copy.shared.livePreview}
            </span>
            <span
              className={[
                "inline-flex items-center gap-2 text-xs font-medium",
                isDirty ? "text-amber-700" : "text-slate-500",
              ].join(" ")}
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {isDirty ? copy.shared.unsavedChanges : statusMessage}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isDirty ? (
              <button
                type="button"
                onClick={() => setConfirmationAction("discard")}
                className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
              >
                <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
                {copy.shared.discardDraft}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => setConfirmationAction("reset")}
              className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{copy.shared.resetPublished}</span>
              <span className="sm:hidden">{copy.shared.reset}</span>
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10">{children}</div>

      <div className="fixed right-4 bottom-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-[0_18px_55px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:right-6 sm:bottom-6 sm:w-auto sm:min-w-80">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-950" role="status" aria-live="polite">
              {statusMessage}
            </p>
            {validationErrors.length > 0 ? (
              <p className="mt-1 truncate text-xs text-rose-600" title={validationErrors[0]}>
                {validationErrors[0]}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-400">{copy.shared.publishingEnabled}</p>
            )}
          </div>
          <button
            ref={submitButtonRef}
            type="button"
            onClick={handleSubmit}
            disabled={saveStatus === "saving"}
            aria-disabled={cannotSubmit}
            aria-busy={saveStatus === "saving"}
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-300 aria-disabled:cursor-not-allowed aria-disabled:bg-slate-300 aria-disabled:hover:bg-slate-300 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {saveStatus === "saving" ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="h-4 w-4" aria-hidden="true" />
            )}
            {saveStatus === "saving" ? copy.shared.saving : copy.shared.submitChanges}
          </button>
        </div>
      </div>

      <AdminModal
        isOpen={Boolean(repositoryConflict?.isOpen && !isAuthenticationExpired)}
        title="The catalogue changed in GitHub"
        description="Another update was published after you started editing. Your current draft is still preserved. Load the latest published catalogue before submitting again."
        onClose={closeRepositoryConflict}
        initialFocusRef={conflictPrimaryRef}
        returnFocusRef={submitButtonRef}
        footer={
          repositoryConflict?.phase === "merge-conflicts" ? (
            <>
              <button
                ref={conflictStayRef}
                type="button"
                onClick={closeRepositoryConflict}
                className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
              >
                Stay in the Editor
              </button>
              <button
                ref={conflictPrimaryRef}
                type="button"
                onClick={acceptDraftConflictValues}
                className="h-10 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Keep My Draft Values
              </button>
            </>
          ) : (
            <>
              <button
                ref={conflictStayRef}
                type="button"
                onClick={closeRepositoryConflict}
                disabled={repositoryConflict?.phase === "loading"}
                className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-wait disabled:text-slate-400 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
              >
                Stay in the Editor
              </button>
              <button
                ref={conflictPrimaryRef}
                type="button"
                onClick={() => void loadLatestAndKeepDraft()}
                disabled={repositoryConflict?.phase === "loading"}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-400 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <RefreshCw
                  className={[
                    "h-4 w-4",
                    repositoryConflict?.phase === "loading" ? "animate-spin" : "",
                  ].join(" ")}
                  aria-hidden="true"
                />
                {repositoryConflict?.phase === "loading"
                  ? "Loading Latest..."
                  : "Load Latest and Keep My Draft"}
              </button>
            </>
          )
        }
      >
        <div className="space-y-4">
          <div className="flex gap-4 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-medium text-slate-950">
                Your unpublished work has not been removed.
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {repositoryConflict?.message}
              </p>
              {repositoryConflict?.latestVersion ? (
                <p className="mt-2 font-mono text-xs text-slate-500">
                  Latest commit: {repositoryConflict.latestVersion.commitSha.slice(0, 12)}
                </p>
              ) : null}
            </div>
          </div>

          {repositoryConflict?.refreshError ? (
            <p
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
            >
              {repositoryConflict.refreshError}
            </p>
          ) : null}

          {repositoryConflict?.phase === "merge-conflicts" ? (
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-950">
                Overlapping changes need your decision
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                The rebased draft currently keeps your values for these fields. Confirm that choice
                before submitting again.
              </p>
              <ul className="mt-3 max-h-40 space-y-2 overflow-y-auto text-xs text-slate-600">
                {repositoryConflict.mergeConflicts.slice(0, 20).map((conflict) => (
                  <li key={`${conflict.path}:${conflict.message}`}>
                    <code className="font-mono text-slate-800">{conflict.path}</code>
                    <span className="ml-2">{conflict.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </AdminModal>

      <AdminModal
        isOpen={isAuthenticationExpired}
        title="Admin session expired"
        description="Sign in again to publish. Your current catalogue draft is preserved on this device."
        onClose={dismissAuthenticationExpired}
        initialFocusRef={authStayRef}
        returnFocusRef={submitButtonRef}
        footer={
          <>
            <button
              ref={authStayRef}
              type="button"
              onClick={dismissAuthenticationExpired}
              className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              Stay in the Editor
            </button>
            <button
              type="button"
              onClick={continueToLogin}
              className="h-10 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Sign In Again
            </button>
          </>
        }
      >
        <p className="text-sm leading-6 text-slate-600">
          No edits have been discarded. After signing in, you will return to this editor and can
          submit the preserved draft again.
        </p>
      </AdminModal>

      <AdminModal
        isOpen={Boolean(
          pendingNavigation && !repositoryConflict?.isOpen && !isAuthenticationExpired,
        )}
        title={copy.navigation.title}
        description={copy.navigation.message}
        onClose={cancelPendingNavigation}
        initialFocusRef={stayButtonRef}
        footer={
          <>
            <button
              ref={stayButtonRef}
              type="button"
              onClick={cancelPendingNavigation}
              className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              {copy.navigation.stay}
            </button>
            <button
              type="button"
              onClick={leaveWithoutSaving}
              className="h-10 rounded-xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition-colors hover:border-rose-300 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
            >
              {copy.navigation.leave}
            </button>
            <button
              type="button"
              onClick={submitAndContinue}
              disabled={saveStatus === "saving"}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-wait disabled:bg-slate-400 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {saveStatus === "saving" ? (
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="h-4 w-4" aria-hidden="true" />
              )}
              {saveStatus === "saving" ? copy.navigation.savingContinue : copy.navigation.saveContinue}
            </button>
          </>
        }
      >
        <div className="flex gap-4 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-slate-950">{copy.navigation.choose}</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {copy.navigation.detail}
            </p>
            {saveStatus === "error" ? (
              <p role="alert" className="mt-3 text-sm font-medium text-rose-700">
                {statusMessage}
              </p>
            ) : null}
          </div>
        </div>
      </AdminModal>

      <AdminModal
        isOpen={isSubmitSuccessOpen}
        title={submissionSuccess.title}
        description={submissionSuccess.message}
        onClose={() => setIsSubmitSuccessOpen(false)}
        initialFocusRef={continueEditingRef}
        returnFocusRef={submitButtonRef}
        footer={
          <button
            ref={continueEditingRef}
            type="button"
            onClick={() => setIsSubmitSuccessOpen(false)}
            className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {copy.submission.continueEditing}
          </button>
        }
      >
        <div className="flex gap-4 rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-4">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-medium text-slate-950">
              Product Catalogue commit accepted
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {submissionSuccess.support}
            </p>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        isOpen={Boolean(confirmationAction)}
        title={confirmationAction === "reset" ? "Reset to published data?" : "Discard unsaved changes?"}
        description={
          confirmationAction === "reset"
            ? "This removes the local draft and reloads the currently published Product Catalogue data."
            : "This restores the most recently submitted local draft."
        }
        onClose={() => setConfirmationAction(null)}
        initialFocusRef={cancelConfirmationRef}
        footer={
          <>
            <button
              ref={cancelConfirmationRef}
              type="button"
              onClick={() => setConfirmationAction(null)}
              className="h-10 rounded-xl px-4 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              {copy.shared.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirmationAction === "reset") resetToPublishedData();
                else discardUnsavedChanges();
                setConfirmationAction(null);
              }}
              className="h-10 rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {confirmationAction === "reset" ? "Reset Data" : "Discard Changes"}
            </button>
          </>
        }
      >
        <p className="text-sm leading-6 text-slate-600">
          This restores the Product Catalogue data from the current published build and clears
          the local working copy on this device.
        </p>
      </AdminModal>
    </div>
  );
}

export function AdminCatalogueBackground() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-20 left-1/2 -z-10 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-blue-100/45 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-1/3 right-[-10rem] -z-10 h-[480px] w-[480px] rounded-full bg-teal-100/30 blur-[120px]"
        aria-hidden="true"
      />
    </>
  );
}
