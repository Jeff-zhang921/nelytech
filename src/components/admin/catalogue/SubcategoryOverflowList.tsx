"use client";

import Link from "next/link";
import { ChevronRight, Ellipsis, Trash2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import type { SubcategoryDraft } from "@/lib/adminCatalogueDraft";
import { productAdminCopy as copy } from "@/lib/productAdminCopy";
import { splitSubcategories } from "@/lib/subcategoryOverflow";

type SubcategoryOverflowListProps = {
  categoryName: string;
  subcategories: SubcategoryDraft[];
  onDelete?: (subcategory: SubcategoryDraft) => void;
};

type PanelPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

const CLOSE_DELAY_MS = 140;

export function SubcategoryOverflowList({
  categoryName,
  subcategories,
  onDelete,
}: SubcategoryOverflowListProps) {
  const { visible, overflow } = splitSubcategories(subcategories);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<PanelPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpenedAtRef = useRef(0);
  const panelId = `subcategory-overflow-${useId().replaceAll(":", "")}`;

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closePanel = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(closePanel, CLOSE_DELAY_MS);
  }, [clearCloseTimer, closePanel]);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 12;
    const panelGap = 6;
    const width = Math.min(320, window.innerWidth - viewportPadding * 2);
    const estimatedHeight = Math.min(overflow.length * 62 + 16, 320);
    const availableBelow = window.innerHeight - rect.bottom - panelGap - viewportPadding;
    const availableAbove = rect.top - panelGap - viewportPadding;
    const opensAbove = availableBelow < Math.min(estimatedHeight, 180) && availableAbove > availableBelow;
    const maxHeight = Math.max(120, opensAbove ? availableAbove : availableBelow);
    const height = Math.min(estimatedHeight, maxHeight);
    const left = Math.min(
      Math.max(viewportPadding, rect.right - width),
      window.innerWidth - width - viewportPadding,
    );
    const top = opensAbove
      ? Math.max(viewportPadding, rect.top - panelGap - height)
      : Math.min(rect.bottom + panelGap, window.innerHeight - height - viewportPadding);

    setPosition({ top, left, width, maxHeight });
  }, [overflow.length]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;

      if (
        target instanceof Node &&
        !triggerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        closePanel();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      closePanel();
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePanel, isOpen]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  useEffect(() => {
    if (overflow.length === 0) {
      closePanel();
    }
  }, [closePanel, overflow.length]);

  return (
    <>
      {visible.map((subcategory) => (
        <SubcategoryRow
          key={subcategory.id}
          subcategory={subcategory}
          onDelete={onDelete}
        />
      ))}

      {overflow.length > 0 ? (
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls={isOpen ? panelId : undefined}
          aria-label={`View ${overflow.length} more subcategories in ${categoryName}`}
          onClick={() => {
            clearCloseTimer();

            if (Date.now() - hoverOpenedAtRef.current < 300) {
              hoverOpenedAtRef.current = 0;
              setIsOpen(true);
              return;
            }

            setIsOpen((current) => !current);
          }}
          onMouseEnter={() => {
            clearCloseTimer();
            if (!isOpen) {
              hoverOpenedAtRef.current = Date.now();
            }
            setIsOpen(true);
          }}
          onMouseLeave={scheduleClose}
          className="group flex min-h-14 w-full items-center justify-between gap-4 px-1 py-3 text-left text-slate-500 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          <span className="inline-flex min-w-0 items-center gap-2 text-sm font-medium">
            <Ellipsis className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-xs text-slate-400 group-hover:text-teal-600">
            {overflow.length} more
          </span>
        </button>
      ) : null}

      {isOpen && position
        ? createPortal(
            <div
              ref={panelRef}
              id={panelId}
              role="region"
              aria-label={`More subcategories in ${categoryName}`}
              onMouseEnter={clearCloseTimer}
              onMouseLeave={scheduleClose}
              className="fixed z-[100] overflow-y-auto rounded-xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_14px_38px_rgba(15,23,42,0.12)] backdrop-blur-xl motion-safe:animate-[admin-subcategory-popover_140ms_ease-out]"
              style={{
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: position.maxHeight,
              }}
            >
              {overflow.map((subcategory) => (
                <SubcategoryRow
                  key={subcategory.id}
                  subcategory={subcategory}
                  onDelete={onDelete}
                  isOverflow
                  onNavigate={closePanel}
                />
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function SubcategoryRow({
  subcategory,
  onDelete,
  isOverflow = false,
  onNavigate,
}: {
  subcategory: SubcategoryDraft;
  onDelete?: (subcategory: SubcategoryDraft) => void;
  isOverflow?: boolean;
  onNavigate?: () => void;
}) {
  const content = (
    <>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-slate-800 group-hover:text-teal-700">
          {subcategory.name}
        </span>
        <span className="mt-0.5 block text-xs text-slate-400">
          {subcategory.products.length} {copy.catalogue.products}
          {subcategory.isDraft ? ` / ${copy.catalogue.draft}` : ""}
        </span>
      </span>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600"
        aria-hidden="true"
      />
    </>
  );

  const linkClasses = isOverflow
    ? "group flex min-h-12 min-w-0 flex-1 items-center justify-between gap-4 rounded-lg px-3 py-2 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-teal-600"
    : "group flex min-h-14 min-w-0 flex-1 items-center justify-between gap-4 py-3 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2";

  if (!onDelete) {
    return (
      <Link
        href={`/admin/catalogue/${subcategory.slug}`}
        onClick={onNavigate}
        className={linkClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={
        isOverflow
          ? "flex items-center gap-1 rounded-lg"
          : "flex min-h-14 items-center gap-2 px-1"
      }
    >
      <Link
        href={`/admin/catalogue/${subcategory.slug}`}
        onClick={onNavigate}
        className={linkClasses}
      >
        {content}
      </Link>
      <button
        type="button"
        onClick={() => onDelete(subcategory)}
        aria-label={`Remove ${subcategory.name} from the draft`}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
