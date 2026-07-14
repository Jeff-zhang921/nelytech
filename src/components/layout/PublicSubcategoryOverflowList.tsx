"use client";

import Link from "next/link";
import { ArrowRight, Cpu, Layers, Settings, type LucideIcon } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import type { MegaMenuLink, ProductMenuLinkKey } from "@/constants/navigation";
import { splitSubcategories } from "@/lib/subcategoryOverflow";

const featuredProductLinkIcons: Partial<Record<ProductMenuLinkKey, LucideIcon>> = {
  tftModules: Layers,
  customPcbaMcu: Cpu,
  touchPanels: Settings,
};

const CLOSE_DELAY_MS = 160;

type PublicSubcategoryOverflowListProps = {
  categoryName: string;
  isFeatured?: boolean;
  isParentOpen: boolean;
  links: readonly MegaMenuLink[];
  onLinkClick?: () => void;
  translateLink: (link: MegaMenuLink) => string;
  variant: "desktop" | "mobile";
};

export function PublicSubcategoryOverflowList({
  categoryName,
  isFeatured = false,
  isParentOpen,
  links,
  onLinkClick,
  translateLink,
  variant,
}: PublicSubcategoryOverflowListProps) {
  const { visible, overflow } = splitSubcategories(links);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const overflowRootRef = useRef<HTMLLIElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverOpenedAtRef = useRef(0);
  const panelId = `public-subcategory-overflow-${useId().replaceAll(":", "")}`;
  const isDesktop = variant === "desktop";

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

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !overflowRootRef.current?.contains(event.target)
      ) {
        closePanel();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      event.preventDefault();
      event.stopPropagation();
      closePanel();
      triggerRef.current?.focus({ preventScroll: true });
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [closePanel, isOpen]);

  useEffect(() => {
    if (!isParentOpen || overflow.length === 0) {
      closePanel();
    }
  }, [closePanel, isParentOpen, overflow.length]);

  useEffect(() => clearCloseTimer, [clearCloseTimer]);

  const listClassName = isDesktop ? "mt-2 space-y-1" : "mt-2 space-y-2";

  return (
    <ul className={listClassName} data-subcategory-list={categoryName}>
      {visible.map((link) => (
        <li key={link.href}>
          <PublicSubcategoryLink
            link={link}
            title={translateLink(link)}
            isFeatured={isFeatured}
            variant={variant}
            onClick={onLinkClick}
            placement="direct"
          />
        </li>
      ))}

      {overflow.length > 0 ? (
        <li
          ref={overflowRootRef}
          className={isDesktop ? "relative" : "min-w-0"}
          onMouseEnter={
            isDesktop
              ? () => {
                  clearCloseTimer();
                  if (!isOpen) hoverOpenedAtRef.current = Date.now();
                  setIsOpen(true);
                }
              : undefined
          }
          onMouseLeave={isDesktop ? scheduleClose : undefined}
        >
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={isOpen}
            aria-controls={isOpen ? panelId : undefined}
            aria-label={`View ${overflow.length} more ${categoryName} subcategories`}
            onClick={() => {
              clearCloseTimer();

              if (isDesktop && Date.now() - hoverOpenedAtRef.current < 300) {
                hoverOpenedAtRef.current = 0;
                setIsOpen(true);
                return;
              }

              setIsOpen((current) => !current);
            }}
            className={[
              "group flex w-full items-center justify-between gap-3 rounded-md border border-transparent text-left font-semibold outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2",
              isDesktop ? "min-h-8 px-2 py-1.5 text-sm" : "min-h-11 px-3 py-2.5 text-sm",
              isFeatured
                ? "text-blue-600 hover:border-blue-200 hover:bg-blue-50/80 focus-visible:ring-blue-600"
                : "text-slate-700 hover:border-teal-200 hover:bg-teal-50/80 hover:text-teal-700 focus-visible:ring-teal-600",
            ].join(" ")}
          >
            <span aria-hidden="true" className="text-base leading-none tracking-normal">
              ...
            </span>
            <span className="text-xs font-medium text-slate-400">
              {overflow.length} more
            </span>
          </button>

          {isOpen ? (
            <div
              id={panelId}
              role="region"
              aria-label={`More subcategories in ${categoryName}`}
              className={
                isDesktop
                  ? "absolute top-[calc(100%+4px)] right-0 z-[70] w-72 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-200/80 bg-white/95 p-2 shadow-[0_14px_36px_rgba(15,23,42,0.14)] backdrop-blur-xl"
                  : "mt-1 min-w-0 border-l border-slate-200 pl-2"
              }
            >
              <ul className={isDesktop ? "space-y-1" : "space-y-1.5"}>
                {overflow.map((link) => (
                  <li key={link.href}>
                    <PublicSubcategoryLink
                      link={link}
                      title={translateLink(link)}
                      isFeatured={isFeatured}
                      variant={variant}
                      placement="overflow"
                      onClick={() => {
                        closePanel();
                        onLinkClick?.();
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      ) : null}
    </ul>
  );
}

function PublicSubcategoryLink({
  link,
  title,
  isFeatured,
  variant,
  placement,
  onClick,
}: {
  link: MegaMenuLink;
  title: string;
  isFeatured: boolean;
  variant: "desktop" | "mobile";
  placement: "direct" | "overflow";
  onClick?: () => void;
}) {
  const FeaturedIcon = isFeatured
    ? featuredProductLinkIcons[link.translationKey as ProductMenuLinkKey]
    : undefined;

  if (variant === "mobile") {
    return (
      <Link
        href={link.href}
        onClick={onClick}
        data-subcategory-placement={placement}
        className="group flex min-h-11 min-w-0 items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all duration-200 ease-out hover:border-teal-200 hover:bg-teal-50/80 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
      >
        <span className="min-w-0 break-words">{title}</span>
        <ArrowRight
          className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <Link
      href={link.href}
      onClick={onClick}
      data-subcategory-placement={placement}
      className={[
        "group flex min-h-8 min-w-0 items-start gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2",
        isFeatured
          ? "hover:border-blue-200 hover:bg-blue-50/80 focus-visible:ring-blue-600"
          : "justify-between hover:border-teal-200 hover:bg-teal-50/80 focus-visible:ring-teal-600",
      ].join(" ")}
    >
      {FeaturedIcon ? (
        <FeaturedIcon
          className="mt-0.5 h-4 w-4 shrink-0 text-blue-300 transition-colors duration-200 group-hover:text-blue-600"
          strokeWidth={1.4}
          aria-hidden="true"
        />
      ) : null}
      <span className="min-w-0">
        <span
          className={[
            "block break-words leading-5 font-semibold transition-colors duration-200",
            isFeatured ? "text-slate-700 group-hover:text-blue-700" : "text-slate-900 group-hover:text-teal-700",
          ].join(" ")}
        >
          {title}
        </span>
        {link.description ? (
          <span className="mt-1 block text-sm leading-5 text-slate-500">
            {link.description}
          </span>
        ) : null}
      </span>
      <ArrowRight
        className={[
          "mt-0.5 ml-auto h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
          isFeatured ? "text-blue-600" : "text-teal-700",
        ].join(" ")}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Link>
  );
}
