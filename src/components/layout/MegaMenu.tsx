"use client";

import Link from "next/link";

import { megaMenus, type MegaMenuKey } from "@/constants/navigation";
import { useI18n } from "@/context/I18nContext";

interface MegaMenuProps {
  menuKey: MegaMenuKey;
  id: string;
  isOpen: boolean;
  onLinkClick?: () => void;
}

export function MegaMenu({ menuKey, id, isOpen, onLinkClick }: MegaMenuProps) {
  const { t } = useI18n();
  const menu = megaMenus[menuKey];
  const isProductsMenu = menuKey === "products";
  const sectionGridClassName =
    menu.sections.length === 4
      ? "grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
      : "grid gap-7 sm:grid-cols-2 xl:grid-cols-5";

  return (
    <div
      id={id}
      aria-hidden={!isOpen}
      className={[
        "absolute left-0 right-0 top-full overflow-hidden transition-all duration-200 ease-out",
        isProductsMenu
          ? "border border-slate-200 bg-white/95 shadow-2xl shadow-slate-200/70 backdrop-blur-md"
          : "border-t border-slate-200 bg-white shadow-2xl shadow-slate-900/15",
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-2 opacity-0",
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
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 py-9 sm:px-8 lg:grid-cols-[0.8fr_2fr] lg:px-12">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-teal-700 uppercase">
            {translateWithFallback(t, `megaMenu.${menuKey}.label`, menu.label)}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
            {translateWithFallback(t, `megaMenu.${menuKey}.description`, menu.description)}
          </p>
        </div>

        <div className={sectionGridClassName}>
          {menu.sections.map((section) => {
            const sectionId = `${id}-${slugify(section.heading)}`;
            const isFeaturedProductSection =
              menuKey === "products" && section.translationKey === "customSolutions";
            const sectionKey = `megaMenu.${menuKey}.sections.${section.translationKey}`;
            const translatedHeading = translateWithFallback(
              t,
              `${sectionKey}.heading`,
              section.heading,
            );
            const translatedSummary = section.summary
              ? translateWithFallback(t, `${sectionKey}.summary`, section.summary)
              : undefined;

            return (
              <section
                key={section.translationKey}
                aria-labelledby={sectionId}
                className={[
                  isFeaturedProductSection
                    ? "-mx-4 -my-3 rounded-2xl bg-[linear-gradient(135deg,rgba(239,246,255,0.84),rgba(248,250,252,0.76))] px-4 py-3 backdrop-blur-sm"
                    : "",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    id={sectionId}
                    className={[
                      "text-sm tracking-[0.14em] uppercase",
                      isFeaturedProductSection
                        ? "font-semibold text-blue-700"
                        : "font-semibold text-slate-950",
                    ].join(" ")}
                  >
                    {translatedHeading}
                  </h3>
                  {isFeaturedProductSection ? (
                    <span className="ml-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-blue-800 uppercase">
                      {translateWithFallback(t, `megaMenu.${menuKey}.featuredBadge`, "Featured")}
                    </span>
                  ) : null}
                </div>
                {translatedSummary ? (
                  <p
                    className={[
                      "mt-3 text-sm leading-6",
                      isFeaturedProductSection ? "text-slate-600" : "text-slate-500",
                    ].join(" ")}
                  >
                    {translatedSummary}
                  </p>
                ) : null}
                {section.links.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {section.links.map((link) => {
                      const translatedLinkTitle = translateWithFallback(
                        t,
                        `megaMenu.${menuKey}.links.${link.translationKey}`,
                        link.title,
                      );

                      return (
                        <li key={link.translationKey}>
                          <Link
                            href={link.href}
                            onClick={onLinkClick}
                            className={[
                              "group block rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-2",
                              isFeaturedProductSection
                                ? "hover:text-blue-800 focus-visible:ring-blue-600"
                                : "hover:text-teal-700 focus-visible:ring-teal-600",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "block text-sm font-semibold transition duration-200",
                                isFeaturedProductSection
                                  ? "text-slate-950 group-hover:translate-x-1 group-hover:text-blue-700"
                                  : "text-slate-900 group-hover:text-teal-700",
                              ].join(" ")}
                            >
                              {translatedLinkTitle}
                            </span>
                            {link.description ? (
                              <span
                                className={[
                                  "mt-1 block text-sm leading-5",
                                  isFeaturedProductSection ? "text-slate-600" : "text-slate-500",
                                ].join(" ")}
                              >
                                {link.description}
                              </span>
                            ) : null}
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

      {menuKey === "products" ? (
        <div className="relative z-10 border-t border-slate-100 bg-slate-50/90">
          <div className="mx-auto flex w-full max-w-7xl justify-end px-6 py-4 sm:px-8 lg:px-12">
            <Link
              href="/products"
              onClick={onLinkClick}
              className="group inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-blue-600 underline-offset-4 outline-none transition-colors hover:text-blue-800 hover:underline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              {translateWithFallback(t, `megaMenu.${menuKey}.viewAll`, "View All Products")}
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
  const { t } = useI18n();
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
        <span>{translateWithFallback(t, `megaMenu.${menuKey}.label`, menu.label)}</span>
        <span aria-hidden="true" className="text-xs">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-5">
          <p className="text-sm leading-6 text-slate-600">
            {translateWithFallback(t, `megaMenu.${menuKey}.description`, menu.description)}
          </p>
          <div className="mt-5 space-y-6">
            {menu.sections.map((section) => {
              const sectionKey = `megaMenu.${menuKey}.sections.${section.translationKey}`;
              const translatedHeading = translateWithFallback(
                t,
                `${sectionKey}.heading`,
                section.heading,
              );
              const translatedSummary = section.summary
                ? translateWithFallback(t, `${sectionKey}.summary`, section.summary)
                : undefined;

              return (
                <section
                  key={section.translationKey}
                  aria-labelledby={`${panelId}-${slugify(section.heading)}`}
                >
                  <h3
                    id={`${panelId}-${slugify(section.heading)}`}
                    className="text-xs font-semibold tracking-[0.16em] text-teal-700 uppercase"
                  >
                    {translatedHeading}
                  </h3>
                  {translatedSummary ? (
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {translatedSummary}
                    </p>
                  ) : null}
                  {section.links.length > 0 ? (
                    <ul className="mt-3 space-y-3">
                      {section.links.map((link) => {
                        const translatedLinkTitle = translateWithFallback(
                          t,
                          `megaMenu.${menuKey}.links.${link.translationKey}`,
                          link.title,
                        );

                        return (
                          <li key={link.translationKey}>
                            <Link
                              href={link.href}
                              onClick={onLinkClick}
                              className="block rounded-md text-sm font-medium text-slate-800 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                            >
                              {translatedLinkTitle}
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

function translateWithFallback(
  t: (key: string) => string,
  key: string,
  fallback: string,
) {
  const translatedValue = t(key);

  return translatedValue === key ? fallback : translatedValue;
}
