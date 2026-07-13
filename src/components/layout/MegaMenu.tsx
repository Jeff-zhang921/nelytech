"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Cpu,
  Layers,
  Settings,
  type LucideIcon,
} from "lucide-react";

import {
  megaMenus,
  productSectionRoutes,
  type MegaMenuKey,
  type ProductMenuLinkKey,
} from "@/constants/navigation";
import { useI18n } from "@/context/I18nContext";

const featuredProductLinkIcons: Partial<Record<ProductMenuLinkKey, LucideIcon>> = {
  tftModules: Layers,
  customPcbaMcu: Cpu,
  touchPanels: Settings,
};

interface MegaMenuProps {
  menuKey: MegaMenuKey;
  id: string;
  isOpen: boolean;
  onLinkClick?: () => void;
  onMouseLeave?: () => void;
}

export function MegaMenu({
  menuKey,
  id,
  isOpen,
  onLinkClick,
  onMouseLeave,
}: MegaMenuProps) {
  const text = useMenuText(menuKey === "products");
  const hasPointerEnteredPanel = useRef(false);
  const menu = megaMenus[menuKey];
  const isProductsMenu = menuKey === "products";
  const sectionGridClassName =
    menu.sections.length === 4
      ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      : "grid gap-4 sm:grid-cols-2 xl:grid-cols-5";

  useEffect(() => {
    if (!isOpen) {
      hasPointerEnteredPanel.current = false;
    }
  }, [isOpen]);

  return (
    <div
      id={id}
      aria-hidden={!isOpen}
      onMouseEnter={() => {
        hasPointerEnteredPanel.current = true;
      }}
      onMouseLeave={() => {
        if (hasPointerEnteredPanel.current) {
          hasPointerEnteredPanel.current = false;
          onMouseLeave?.();
        }
      }}
      className={[
        "absolute top-full right-0 left-0 overflow-hidden transition-all duration-200 ease-out",
        isProductsMenu
          ? "border border-slate-200 bg-white/95 shadow-xl shadow-slate-200/70 backdrop-blur-md"
          : "border border-slate-200 bg-white shadow-xl shadow-slate-900/15",
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-1 opacity-0",
      ].join(" ")}
    >
      {isProductsMenu ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96)_52%,rgba(240,253,250,0.9))]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_96%_8%,rgba(20,184,166,0.1),transparent_26%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.46))]"
          />
        </>
      ) : null}
      <div className="relative z-10 mx-auto grid w-full gap-6 px-5 py-5 lg:grid-cols-[0.72fr_2fr] lg:px-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-teal-700 uppercase">
            {translateWithFallback(text, `megaMenu.${menuKey}.label`, menu.label)}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
            {translateWithFallback(text, `megaMenu.${menuKey}.description`, menu.description)}
          </p>
        </div>

        <div className={sectionGridClassName}>
          {menu.sections.map((section) => {
            const sectionId = `${id}-${slugify(section.heading)}`;
            const isFeaturedProductSection =
              menuKey === "products" && section.translationKey === "customSolutions";
            const sectionKey = `megaMenu.${menuKey}.sections.${section.translationKey}`;
            const sectionHref = isProductsMenu
              ? productSectionRoutes[section.translationKey]
              : undefined;
            const translatedHeading = translateWithFallback(
              text,
              `${sectionKey}.heading`,
              section.heading,
            );
            const translatedSummary = section.summary
              ? translateWithFallback(text, `${sectionKey}.summary`, section.summary)
              : undefined;

            return (
              <section
                key={section.translationKey}
                aria-labelledby={sectionId}
                className={[
                  "min-w-0",
                  isFeaturedProductSection
                    ? "border-l border-blue-100 bg-gradient-to-b from-blue-50/50 via-indigo-50/20 to-transparent pl-5"
                    : "",
                ].join(" ")}
              >
                <div className="mb-1 h-3.5">
                  {isFeaturedProductSection ? (
                    <span className="block font-mono text-[10px] leading-3.5 font-medium tracking-[0.2em] text-blue-500/80 uppercase">
                      {translateWithFallback(
                        text,
                        `megaMenu.${menuKey}.coreExpertise`,
                        "Core Expertise",
                      )}
                    </span>
                  ) : (
                    <span aria-hidden="true" className="block h-full" />
                  )}
                </div>
                {sectionHref ? (
                  <Link
                    href={sectionHref}
                    onClick={onLinkClick}
                    className={[
                      "group/category -mx-2 block rounded-md border border-transparent px-2 py-1.5 outline-none transition-all duration-200 ease-out",
                      "hover:-translate-y-0.5 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2",
                      isFeaturedProductSection
                        ? "hover:border-blue-200 hover:bg-blue-50/80 focus-visible:ring-blue-600"
                        : "hover:border-teal-200 hover:bg-teal-50/80 focus-visible:ring-teal-600",
                    ].join(" ")}
                  >
                    <h3 id={sectionId} className="flex min-h-6 items-start justify-between gap-3">
                      <span
                        className={[
                          "text-sm leading-5 font-semibold tracking-[0.14em] uppercase transition-colors duration-200",
                          isFeaturedProductSection
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-medium text-transparent"
                            : "text-slate-950 group-hover/category:text-teal-700",
                        ].join(" ")}
                      >
                        {translatedHeading}
                      </span>
                      <ArrowRight
                        className={[
                          "mt-0.5 h-4 w-4 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover/category:translate-x-0 group-hover/category:opacity-100 group-focus-visible/category:translate-x-0 group-focus-visible/category:opacity-100",
                          isFeaturedProductSection ? "text-blue-600" : "text-teal-700",
                        ].join(" ")}
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </h3>
                    {translatedSummary ? (
                      <span className="mt-1.5 block text-xs leading-5 text-slate-500">
                        {translatedSummary}
                      </span>
                    ) : null}
                  </Link>
                ) : (
                  <>
                    <h3
                      id={sectionId}
                      className={[
                        "min-h-10 text-sm leading-5 font-semibold tracking-[0.14em] uppercase",
                        isFeaturedProductSection
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-medium text-transparent"
                          : "text-slate-950",
                      ].join(" ")}
                    >
                      {translatedHeading}
                    </h3>
                    {translatedSummary ? (
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {translatedSummary}
                      </p>
                    ) : null}
                  </>
                )}
                {section.links.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {section.links.map((link) => {
                      const translatedLinkTitle = translateWithFallback(
                        text,
                        `megaMenu.${menuKey}.links.${link.translationKey}`,
                        link.title,
                      );
                      const FeaturedIcon = isFeaturedProductSection
                        ? featuredProductLinkIcons[link.translationKey]
                        : undefined;

                      return (
                        <li key={link.translationKey}>
                          {isFeaturedProductSection ? (
                            <Link
                              href={link.href}
                              onClick={onLinkClick}
                              className="group flex min-h-8 items-start gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50/80 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                            >
                              {FeaturedIcon ? (
                                <FeaturedIcon
                                  className="mt-0.5 h-4 w-4 shrink-0 text-blue-300 transition-colors duration-200 ease-out group-hover:text-blue-600"
                                  strokeWidth={1.4}
                                  aria-hidden="true"
                                />
                              ) : null}
                              <span className="leading-5 font-semibold text-slate-700 transition-colors duration-200 ease-out group-hover:text-blue-700">
                                {translatedLinkTitle}
                              </span>
                              <ArrowRight
                                className="mt-0.5 ml-auto h-3.5 w-3.5 shrink-0 -translate-x-1 text-blue-600 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                                strokeWidth={1.5}
                                aria-hidden="true"
                              />
                            </Link>
                          ) : (
                            <Link
                              href={link.href}
                              onClick={onLinkClick}
                              className="group flex items-start justify-between gap-2 rounded-md border border-transparent px-2 py-1.5 outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50/80 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                            >
                              <span>
                                <span className="block text-sm font-semibold text-slate-900 transition duration-200 group-hover:text-teal-700">
                                  {translatedLinkTitle}
                                </span>
                                {link.description ? (
                                  <span className="mt-1 block text-sm leading-5 text-slate-500">
                                    {link.description}
                                  </span>
                                ) : null}
                              </span>
                              <ArrowRight
                                className="mt-0.5 h-3.5 w-3.5 shrink-0 -translate-x-1 text-teal-700 opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                                strokeWidth={1.5}
                                aria-hidden="true"
                              />
                            </Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </div>
      </div>

      {menuKey === "products" ? (
        <div className="relative z-10 border-t border-slate-100 bg-slate-50/90">
          <div className="mx-auto flex w-full justify-end px-5 py-3 lg:px-6">
            <Link
              href="/products"
              onClick={onLinkClick}
              className="group inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-blue-600 underline-offset-4 outline-none transition-colors hover:text-blue-800 hover:underline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              {translateWithFallback(text, `megaMenu.${menuKey}.viewAll`, "View All Products")}
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 12h13m-5-5 5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface MobileMegaMenuProps {
  menuKey: MegaMenuKey;
  isOpen: boolean;
  buttonId: string;
  panelId: string;
  onToggle: () => void;
  onLinkClick: () => void;
}

export function MobileMegaMenu({
  menuKey,
  isOpen,
  buttonId,
  panelId,
  onToggle,
  onLinkClick,
}: MobileMegaMenuProps) {
  const text = useMenuText();
  const panelText = useMenuText(menuKey === "products");
  const menu = megaMenus[menuKey];

  return (
    <div className="border-t border-slate-200">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left text-base font-semibold text-slate-950 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
      >
        <span>{translateWithFallback(text, `megaMenu.${menuKey}.label`, menu.label)}</span>
        <span aria-hidden="true" className="text-xs">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-5">
          <p className="text-sm leading-6 text-slate-600">
            {translateWithFallback(panelText, `megaMenu.${menuKey}.description`, menu.description)}
          </p>
          <div className="mt-5 space-y-6">
            {menu.sections.map((section) => {
              const sectionKey = `megaMenu.${menuKey}.sections.${section.translationKey}`;
              const sectionId = `${panelId}-${slugify(section.heading)}`;
              const sectionHref = productSectionRoutes[section.translationKey];
              const translatedHeading = translateWithFallback(
                panelText,
                `${sectionKey}.heading`,
                section.heading,
              );
              const translatedSummary = section.summary
                ? translateWithFallback(panelText, `${sectionKey}.summary`, section.summary)
                : undefined;

              return (
                <section
                  key={section.translationKey}
                  aria-labelledby={sectionId}
                >
                  <Link
                    href={sectionHref}
                    onClick={onLinkClick}
                    className="group -mx-3 block rounded-lg border border-transparent px-3 py-2 outline-none transition-all duration-200 ease-out hover:border-teal-200 hover:bg-teal-50/80 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                  >
                    <h3
                      id={sectionId}
                      className="flex items-start justify-between gap-3 text-xs font-semibold tracking-[0.16em] text-teal-700 uppercase"
                    >
                      <span>{translatedHeading}</span>
                      <ArrowRight
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </h3>
                    {translatedSummary ? (
                      <span className="mt-2 block text-sm leading-6 text-slate-600">
                        {translatedSummary}
                      </span>
                    ) : null}
                  </Link>
                  {section.links.length > 0 ? (
                    <ul className="mt-2 space-y-2">
                      {section.links.map((link) => {
                        const translatedLinkTitle = translateWithFallback(
                          panelText,
                          `megaMenu.${menuKey}.links.${link.translationKey}`,
                          link.title,
                        );

                        return (
                          <li key={link.translationKey}>
                            <Link
                              href={link.href}
                              onClick={onLinkClick}
                              className="group flex items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition-all duration-200 ease-out hover:border-teal-200 hover:bg-teal-50/80 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                            >
                              <span>{translatedLinkTitle}</span>
                              <ArrowRight
                                className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                                strokeWidth={1.5}
                                aria-hidden="true"
                              />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </section>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function useMenuText(forceEnglish = false) {
  const { t } = useI18n();
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  return (key: string) => t(key, forceEnglish || isAdminRoute ? "en" : undefined);
}

function translateWithFallback(
  t: (key: string) => string,
  key: string,
  fallback: string,
) {
  const translatedValue = t(key);

  return translatedValue === key ? fallback : translatedValue;
}
