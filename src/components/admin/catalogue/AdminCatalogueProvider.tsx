"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AdminApiError,
  getLatestPublishedCatalogue,
  publishCatalogue,
  type RepositoryVersion,
} from "@/admin/api/adminApi";
import {
  rebaseCatalogueDraft,
  type CatalogueMergeConflict,
} from "@/admin/publishing/catalogueMerge";
import { productAdminCopy } from "@/lib/productAdminCopy";

import {
  cloneCatalogueDraft,
  createPublishedCatalogueDraft,
  localCataloguePublishMetadata,
  localCatalogueDraftRepository,
  localPublishedCatalogueRepository,
  normalizeCatalogueDraft,
  validateCatalogueDraft,
  type CatalogueDraft,
} from "@/lib/adminCatalogueDraft";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export type RepositoryConflictState = {
  isOpen: boolean;
  phase: "detected" | "loading" | "merge-conflicts";
  message: string;
  latestVersion?: RepositoryVersion;
  refreshError?: string;
  mergeConflicts: CatalogueMergeConflict[];
};

export type PendingNavigation = { href: string; replace?: boolean };

interface AdminCatalogueContextValue {
  draft: CatalogueDraft;
  isReady: boolean;
  isDirty: boolean;
  saveStatus: SaveStatus;
  statusMessage: string;
  validationErrors: string[];
  hasClientValidationErrors: boolean;
  pendingNavigation: PendingNavigation | null;
  repositoryConflict: RepositoryConflictState | null;
  isAuthenticationExpired: boolean;
  updateDraft: (updater: (current: CatalogueDraft) => CatalogueDraft) => void;
  submitDraft: () => Promise<boolean>;
  closeRepositoryConflict: () => void;
  loadLatestAndKeepDraft: () => Promise<void>;
  acceptDraftConflictValues: () => void;
  dismissAuthenticationExpired: () => void;
  continueToLogin: () => void;
  discardUnsavedChanges: () => void;
  resetToPublishedData: () => void;
  cancelPendingNavigation: () => void;
  leaveWithoutSaving: () => void;
  submitAndContinue: () => Promise<void>;
}

const AdminCatalogueContext = createContext<AdminCatalogueContextValue | null>(null);

export function AdminCatalogueProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isProductDetailEditor = /^\/admin\/catalogue\/[^/]+\/[^/]+\/?$/.test(pathname);
  const publishedDraft = useMemo(createPublishedCatalogueDraft, []);
  const [draft, setDraft] = useState<CatalogueDraft>(publishedDraft);
  const [isReady, setIsReady] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>(
    productAdminCopy.status.loadingDraft,
  );
  const [pendingNavigation, setPendingNavigation] =
    useState<PendingNavigation | null>(null);
  const savedDraftRef = useRef(cloneCatalogueDraft(publishedDraft));
  const bypassNavigationRef = useRef(false);
  const submitInFlightRef = useRef(false);
  const refreshInFlightRef = useRef(false);
  const publishedVersionRef = useRef<
    { commitSha: string; contentSha?: string } | undefined
  >(undefined);
  const [submissionErrors, setSubmissionErrors] = useState<string[]>([]);
  const [repositoryConflict, setRepositoryConflict] =
    useState<RepositoryConflictState | null>(null);
  const [isAuthenticationExpired, setIsAuthenticationExpired] = useState(false);
  const clientValidationErrors = useMemo(() => validateCatalogueDraft(draft), [draft]);
  const hasClientValidationErrors = clientValidationErrors.length > 0;
  const validationErrors = useMemo(
    () => [...clientValidationErrors, ...submissionErrors],
    [clientValidationErrors, submissionErrors],
  );

  useEffect(() => {
    const locallyPublishedDraft = localPublishedCatalogueRepository.loadDraft();
    const baseDraft = locallyPublishedDraft ?? publishedDraft;
    const workingDraft = localCatalogueDraftRepository.loadDraft() ?? baseDraft;
    const hasUnsavedLocalChanges = !catalogueDraftsEqual(workingDraft, baseDraft);

    savedDraftRef.current = cloneCatalogueDraft(baseDraft);
    publishedVersionRef.current = localCataloguePublishMetadata.loadVersion();
    setDraft(cloneCatalogueDraft(workingDraft));
    setIsDirty(hasUnsavedLocalChanges);

    if (hasUnsavedLocalChanges) {
      setStatusMessage(productAdminCopy.status.restored);
    } else {
      setStatusMessage(productAdminCopy.status.publishedLoaded);
    }
    setIsReady(true);
  }, [publishedDraft]);

  useEffect(() => {
    if (!isDirty) return;

    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (bypassNavigationRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    }

    function guardGlobalSiteExit(event: MouseEvent) {
      if (
        bypassNavigationRef.current ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor =
        target instanceof Element
          ? target.closest<HTMLAnchorElement>("a[href]")
          : null;

      if (
        !anchor ||
        !anchor.closest("header, footer") ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);
      const staysInProductAdmin =
        destination.origin === current.origin &&
        (destination.pathname === "/admin/catalogue" ||
          destination.pathname.startsWith("/admin/catalogue/"));
      const remainsOnCurrentPage =
        destination.origin === current.origin &&
        destination.pathname === current.pathname &&
        destination.search === current.search;

      if (staysInProductAdmin || remainsOnCurrentPage) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      setPendingNavigation({ href: destination.href });
    }

    window.addEventListener("beforeunload", warnBeforeUnload);
    document.addEventListener("click", guardGlobalSiteExit, true);

    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
      document.removeEventListener("click", guardGlobalSiteExit, true);
    };
  }, [isDirty]);

  const updateDraft = useCallback(
    (updater: (current: CatalogueDraft) => CatalogueDraft) => {
      setDraft((current) => {
        const nextDraft = updater(cloneCatalogueDraft(current));
        void localCatalogueDraftRepository.saveDraft(nextDraft);
        return nextDraft;
      });
      setIsDirty(true);
      setSaveStatus("idle");
      setSubmissionErrors([]);
      setStatusMessage(productAdminCopy.status.unpublished);
    },
    [],
  );

  const submitDraft = useCallback(async () => {
    if (submitInFlightRef.current) {
      return false;
    }

    logPublishEvent("submission started");

    if (repositoryConflict?.phase === "merge-conflicts") {
      setRepositoryConflict((current) => (current ? { ...current, isOpen: true } : current));
      setSaveStatus("error");
      setStatusMessage(
        "Review the overlapping GitHub changes before submitting this draft.",
      );
      return false;
    }

    const normalizedDraft = normalizeCatalogueDraft(cloneCatalogueDraft(draft));
    const errors = validateCatalogueDraft(normalizedDraft);

    if (errors.length > 0) {
      setSaveStatus("error");
      setSubmissionErrors(errors);
      setStatusMessage(errors[0]);
      return false;
    }

    setSaveStatus("saving");
    setStatusMessage(productAdminCopy.status.saving);
    submitInFlightRef.current = true;

    try {
      await localCatalogueDraftRepository.saveDraft(normalizedDraft);
      const publishResult = await publishCatalogue(
        normalizedDraft,
        publishedVersionRef.current?.commitSha,
        { baseContentSha: publishedVersionRef.current?.contentSha },
      );
      const submittedDraft = {
        ...publishResult.draft,
        updatedAt: publishResult.publishedAt,
      };
      await Promise.all([
        localCatalogueDraftRepository.saveDraft(submittedDraft),
        localPublishedCatalogueRepository.saveDraft(submittedDraft),
      ]);
      localCataloguePublishMetadata.saveVersion({
        commitSha: publishResult.commitSha,
        contentSha: publishResult.contentSha,
      });
      publishedVersionRef.current = {
        commitSha: publishResult.commitSha,
        contentSha: publishResult.contentSha,
      };
      savedDraftRef.current = cloneCatalogueDraft(submittedDraft);
      setDraft(submittedDraft);
      setIsDirty(false);
      setSaveStatus("saved");
      setSubmissionErrors([]);
      setRepositoryConflict(null);
      setStatusMessage(
        isProductDetailEditor
          ? productAdminCopy.status.detailSaved
          : productAdminCopy.status.saved,
      );
      return true;
    } catch (error) {
      setSaveStatus("error");
      if (error instanceof AdminApiError) {
        logPublishEvent("normalized publish error", {
          status: error.status,
          code: error.code,
        });
        const fieldMessages = error.fields.map(
          (field) => `${field.message} (${field.path})`,
        );
        setSubmissionErrors(fieldMessages);
        setStatusMessage(error.message);

        if (error.status === 401) {
          setIsAuthenticationExpired(true);
        } else if (error.status === 409 || error.code === "REPOSITORY_CONFLICT") {
          setRepositoryConflict({
            isOpen: true,
            phase: "detected",
            message: error.message,
            latestVersion: error.latestVersion,
            mergeConflicts: [],
          });
        }
      } else {
        logPublishEvent("unexpected publish error");
        setStatusMessage(productAdminCopy.status.saveFailed);
      }
      return false;
    } finally {
      submitInFlightRef.current = false;
      setSaveStatus((current) => (current === "saving" ? "idle" : current));
      logPublishEvent("submission state cleared");
    }
  }, [draft, isProductDetailEditor, repositoryConflict]);

  const closeRepositoryConflict = useCallback(() => {
    setRepositoryConflict((current) => (current ? { ...current, isOpen: false } : current));
  }, []);

  const refreshFromGitHub = useCallback(
    async () => {
      if (refreshInFlightRef.current) return;

      refreshInFlightRef.current = true;
      setRepositoryConflict((current) =>
        current
          ? { ...current, isOpen: true, phase: "loading", refreshError: undefined }
          : current,
      );
      setStatusMessage("Loading the latest published catalogue from GitHub...");

      try {
        const latest = await getLatestPublishedCatalogue();
        const latestDraft = normalizeCatalogueDraft(cloneCatalogueDraft(latest.draft));

        const rebased = rebaseCatalogueDraft(savedDraftRef.current, draft, latestDraft);
        const rebasedDraft = normalizeCatalogueDraft(rebased.draft);
        await Promise.all([
          localCatalogueDraftRepository.saveDraft(rebasedDraft),
          localPublishedCatalogueRepository.saveDraft(latestDraft),
        ]);
        localCataloguePublishMetadata.saveVersion(latest.version);
        publishedVersionRef.current = latest.version;
        savedDraftRef.current = cloneCatalogueDraft(latestDraft);
        setDraft(rebasedDraft);
        setIsDirty(!catalogueDraftsEqual(rebasedDraft, latestDraft));
        setSaveStatus("idle");
        setSubmissionErrors([]);

        if (rebased.conflicts.length > 0) {
          setRepositoryConflict({
            isOpen: true,
            phase: "merge-conflicts",
            message:
              "The latest catalogue was loaded, but some fields changed in both versions.",
            latestVersion: latest.version,
            mergeConflicts: rebased.conflicts,
          });
          setStatusMessage(
            "The latest catalogue was loaded. Review the overlapping changes before submitting.",
          );
        } else {
          setRepositoryConflict(null);
          setStatusMessage(
            "The latest GitHub catalogue was loaded and your draft changes were preserved.",
          );
        }
      } catch (error) {
        const message =
          error instanceof AdminApiError
            ? error.message
            : "The latest published catalogue could not be loaded. Your draft is still available.";
        setSaveStatus("error");
        setStatusMessage(message);
        setRepositoryConflict((current) => ({
          isOpen: true,
          phase: "detected",
          message: current?.message ?? "The catalogue changed in GitHub.",
          latestVersion: current?.latestVersion,
          refreshError: message,
          mergeConflicts: current?.mergeConflicts ?? [],
        }));

        if (error instanceof AdminApiError && error.status === 401) {
          setIsAuthenticationExpired(true);
        }
      } finally {
        refreshInFlightRef.current = false;
      }
    },
    [draft],
  );

  const loadLatestAndKeepDraft = useCallback(
    () => refreshFromGitHub(),
    [refreshFromGitHub],
  );

  const acceptDraftConflictValues = useCallback(() => {
    setRepositoryConflict(null);
    setSaveStatus("idle");
    setIsDirty(true);
    setStatusMessage(
      "Your draft values were kept for overlapping fields. Submit again when ready.",
    );
  }, []);

  const dismissAuthenticationExpired = useCallback(() => {
    setIsAuthenticationExpired(false);
  }, []);

  const continueToLogin = useCallback(() => {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    router.push(`/admin/login?returnTo=${encodeURIComponent(returnTo)}`);
  }, [router]);

  const discardUnsavedChanges = useCallback(() => {
    setDraft(cloneCatalogueDraft(savedDraftRef.current));
    void localCatalogueDraftRepository.saveDraft(savedDraftRef.current);
    setIsDirty(false);
    setSaveStatus("idle");
    setSubmissionErrors([]);
    setRepositoryConflict(null);
    setStatusMessage(productAdminCopy.status.discarded);
  }, []);

  const resetToPublishedData = useCallback(() => {
    const nextDraft = cloneCatalogueDraft(publishedDraft);
    localCatalogueDraftRepository.clearDraft();
    localPublishedCatalogueRepository.clearDraft();
    localCataloguePublishMetadata.clear();
    publishedVersionRef.current = undefined;
    savedDraftRef.current = cloneCatalogueDraft(nextDraft);
    setDraft(nextDraft);
    setIsDirty(false);
    setSaveStatus("idle");
    setSubmissionErrors([]);
    setRepositoryConflict(null);
    setStatusMessage(productAdminCopy.status.reset);
  }, [publishedDraft]);

  const performNavigation = useCallback(
    (target: PendingNavigation) => {
      setPendingNavigation(null);
      bypassNavigationRef.current = true;

      const destination = new URL(target.href, window.location.href);
      if (destination.origin === window.location.origin) {
        const nextHref = `${destination.pathname}${destination.search}${destination.hash}`;
        if (target.replace) router.replace(nextHref);
        else router.push(nextHref);
      } else {
        window.location.assign(destination.href);
      }

      window.setTimeout(() => {
        bypassNavigationRef.current = false;
      }, 0);
    },
    [router],
  );

  const cancelPendingNavigation = useCallback(() => {
    setPendingNavigation(null);
  }, []);

  const leaveWithoutSaving = useCallback(() => {
    if (!pendingNavigation) return;
    const target = pendingNavigation;
    setDraft(cloneCatalogueDraft(savedDraftRef.current));
    void localCatalogueDraftRepository.saveDraft(savedDraftRef.current);
    setIsDirty(false);
    setSaveStatus("idle");
    setSubmissionErrors([]);
    setStatusMessage(productAdminCopy.status.discarded);
    performNavigation(target);
  }, [pendingNavigation, performNavigation]);

  const submitAndContinue = useCallback(async () => {
    if (!pendingNavigation) return;
    const target = pendingNavigation;
    bypassNavigationRef.current = true;
    const saved = await submitDraft();
    if (saved) {
      performNavigation(target);
      return;
    }

    bypassNavigationRef.current = false;
  }, [pendingNavigation, performNavigation, submitDraft]);

  const value = useMemo<AdminCatalogueContextValue>(
    () => ({
      draft,
      isReady,
      isDirty,
      saveStatus,
      statusMessage,
      validationErrors,
      hasClientValidationErrors,
      pendingNavigation,
      repositoryConflict,
      isAuthenticationExpired,
      updateDraft,
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
    }),
    [
      discardUnsavedChanges,
      draft,
      isReady,
      isDirty,
      isAuthenticationExpired,
      pendingNavigation,
      repositoryConflict,
      resetToPublishedData,
      cancelPendingNavigation,
      leaveWithoutSaving,
      submitAndContinue,
      saveStatus,
      statusMessage,
      submitDraft,
      closeRepositoryConflict,
      loadLatestAndKeepDraft,
      acceptDraftConflictValues,
      dismissAuthenticationExpired,
      continueToLogin,
      updateDraft,
      validationErrors,
      hasClientValidationErrors,
    ],
  );

  return (
    <AdminCatalogueContext.Provider value={value}>
      {children}
    </AdminCatalogueContext.Provider>
  );
}

export function useAdminCatalogue() {
  const context = useContext(AdminCatalogueContext);

  if (!context) {
    throw new Error("useAdminCatalogue must be used inside AdminCatalogueProvider.");
  }

  return context;
}

function catalogueDraftsEqual(left: CatalogueDraft, right: CatalogueDraft) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function logPublishEvent(event: string, details?: { status: number; code: string }) {
  if (process.env.NODE_ENV !== "development") return;
  console.info(`[product-admin] ${event}`, details ?? "");
}
