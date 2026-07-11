"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import type { ProductCategoryNavigationState } from "@/data/productCatalogue";

interface ProductCategoryNavigationProps {
  navigation: ProductCategoryNavigationState;
}

interface ProductCategoryMenuProps {
  label: string;
  ariaLabel?: string;
  items: ProductCategoryNavigationState["menuItems"];
  variant?: "text" | "primary";
}

export function ProductCategoryNavigation({
  navigation,
}: ProductCategoryNavigationProps) {
  const hasMenu = navigation.menuItems.length > 0;

  if (!hasMenu) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
      <ProductCategoryMenu
        label={navigation.menuLabel ?? "View subcategories"}
        ariaLabel={navigation.menuAriaLabel ?? navigation.menuLabel}
        items={navigation.menuItems}
      />
    </div>
  );
}

export function ProductCategoryMenu({
  label,
  ariaLabel,
  items,
  variant = "text",
}: ProductCategoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimeout() {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }

  function openMenu() {
    clearCloseTimeout();
    setIsOpen(true);
  }

  function closeMenu({ returnFocus = false } = {}) {
    clearCloseTimeout();
    setIsOpen(false);

    if (returnFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }

  function scheduleClose() {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 140);
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
      return;
    }

    openMenu();
  }

  function handlePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") {
      openMenu();
    }
  }

  function handlePointerLeave(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") {
      scheduleClose();
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeMenu({ returnFocus: true });
      return;
    }

    if (event.key === "ArrowDown" && document.activeElement === triggerRef.current) {
      event.preventDefault();
      openMenu();
      window.requestAnimationFrame(() => {
        wrapperRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
      });
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: globalThis.PointerEvent) {
      if (
        wrapperRef.current &&
        event.target instanceof Node &&
        !wrapperRef.current.contains(event.target)
      ) {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
          closeTimeoutRef.current = null;
        }

        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    return () => clearCloseTimeout();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative inline-flex"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          closeMenu();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={ariaLabel}
        onClick={toggleMenu}
        className={[
          "inline-flex items-center justify-center gap-2 transition duration-200 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none",
          variant === "primary"
            ? "min-h-10 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            : "rounded-sm text-slate-500 hover:text-slate-950",
        ].join(" ")}
      >
        <span>{label}</span>
        <ChevronDown
          className={[
            "h-3.5 w-3.5 transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label={ariaLabel}
          className="absolute top-full left-0 z-40 mt-2 w-72 max-w-[calc(100vw-3rem)] overflow-hidden rounded-2xl border border-slate-200/70 bg-white py-2 shadow-lg shadow-slate-900/10"
        >
          {items.map((item) => (
            <Link
              key={item.slug}
              href={item.route}
              role="menuitem"
              className="block px-4 py-3 text-sm text-slate-600 outline-none transition-colors hover:bg-slate-50 hover:text-slate-950 focus-visible:bg-slate-50 focus-visible:text-slate-950"
            >
              {item.name}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
