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
import { AdminApiError, publishCatalogue } from "@/admin/api/adminApi";
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

export type PendingNavigation = { href: string; replace?: boolean };

interface AdminCatalogueContextValue {
  draft: CatalogueDraft;
  isReady: boolean;
  isDirty: boolean;
  saveStatus: SaveStatus;
  statusMessage: string;
  validationErrors: string[];
  pendingNavigation: PendingNavigation | null;
  updateDraft: (updater: (current: CatalogueDraft) => CatalogueDraft) => void;
  submitDraft: () => Promise<boolean>;
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
  const publishedCommitShaRef = useRef<string | undefined>(undefined);
  const [submissionErrors, setSubmissionErrors] = useState<string[]>([]);
  const clientValidationErrors = useMemo(() => validateCatalogueDraft(draft), [draft]);
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
    publishedCommitShaRef.current = localCataloguePublishMetadata.loadCommitSha();
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
        publishedCommitShaRef.current,
      );
      const submittedDraft = {
        ...publishResult.draft,
        updatedAt: publishResult.publishedAt,
      };
      await Promise.all([
        localCatalogueDraftRepository.saveDraft(submittedDraft),
        localPublishedCatalogueRepository.saveDraft(submittedDraft),
      ]);
      localCataloguePublishMetadata.saveCommitSha(publishResult.commitSha);
      publishedCommitShaRef.current = publishResult.commitSha;
      savedDraftRef.current = cloneCatalogueDraft(submittedDraft);
      setDraft(submittedDraft);
      setIsDirty(false);
      setSaveStatus("saved");
      setSubmissionErrors([]);
      setStatusMessage(
        isProductDetailEditor
          ? productAdminCopy.status.detailSaved
          : productAdminCopy.status.saved,
      );
      return true;
    } catch (error) {
      setSaveStatus("error");
      if (error instanceof AdminApiError) {
        const fieldMessages = error.fields.map(
          (field) => `${field.message} (${field.path})`,
        );
        setSubmissionErrors(fieldMessages);
        setStatusMessage(error.message);

        if (error.status === 401) {
          router.replace(
            `/admin/login?returnTo=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`,
          );
        }
      } else {
        setStatusMessage(productAdminCopy.status.saveFailed);
      }
      return false;
    } finally {
      submitInFlightRef.current = false;
    }
  }, [draft, isProductDetailEditor, router]);

  const discardUnsavedChanges = useCallback(() => {
    setDraft(cloneCatalogueDraft(savedDraftRef.current));
    void localCatalogueDraftRepository.saveDraft(savedDraftRef.current);
    setIsDirty(false);
    setSaveStatus("idle");
    setSubmissionErrors([]);
    setStatusMessage(productAdminCopy.status.discarded);
  }, []);

  const resetToPublishedData = useCallback(() => {
    const nextDraft = cloneCatalogueDraft(publishedDraft);
    localCatalogueDraftRepository.clearDraft();
    localPublishedCatalogueRepository.clearDraft();
    localCataloguePublishMetadata.clear();
    publishedCommitShaRef.current = undefined;
    savedDraftRef.current = cloneCatalogueDraft(nextDraft);
    setDraft(nextDraft);
    setIsDirty(false);
    setSaveStatus("idle");
    setSubmissionErrors([]);
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
      pendingNavigation,
      updateDraft,
      submitDraft,
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
      pendingNavigation,
      resetToPublishedData,
      cancelPendingNavigation,
      leaveWithoutSaving,
      submitAndContinue,
      saveStatus,
      statusMessage,
      submitDraft,
      updateDraft,
      validationErrors,
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
