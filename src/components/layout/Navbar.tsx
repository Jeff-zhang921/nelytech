"use client";

import Link from "next/link";
import { useState } from "react";

import { megaMenus, type MegaMenuKey } from "@/constants/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MegaMenu, MobileMegaMenu } from "@/components/layout/MegaMenu";

interface NavLink {
  label: string;
  href: string;
}

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const satisfies readonly NavLink[];

const desktopMegaMenuKeys = ["products"] as const satisfies readonly MegaMenuKey[];

export function Navbar() {
  const [activeMenu, setActiveMenu] = useState<MegaMenuKey | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<MegaMenuKey | null>(null);

  function closeMenus() {
    setActiveMenu(null);
    setIsMobileOpen(false);
    setOpenMobileMenu(null);
  }

  function closeActiveMenu() {
    setActiveMenu(null);
  }

  return (
    <header
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur"
      onMouseLeave={() => setActiveMenu(null)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setActiveMenu(null);
          setOpenMobileMenu(null);
        }
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-8 px-6 py-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          onMouseEnter={closeActiveMenu}
          onFocus={closeActiveMenu}
          onClick={closeMenus}
          className="rounded-sm text-xl font-semibold tracking-[0.28em] text-slate-950 uppercase outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
        >
          NELYTECH
        </Link>

        <nav aria-label="Main navigation" className="hidden md:block">
          <ul className="flex items-center justify-end gap-x-8 text-base font-semibold lg:gap-x-10 lg:text-lg">
            <li>
              <Link
                href="/"
                onMouseEnter={closeActiveMenu}
                onFocus={closeActiveMenu}
                onClick={closeActiveMenu}
                className="rounded-sm text-slate-700 underline-offset-4 outline-none transition-colors hover:text-teal-700 hover:underline focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onMouseEnter={closeActiveMenu}
                onFocus={closeActiveMenu}
                onClick={closeActiveMenu}
                className="rounded-sm text-slate-700 underline-offset-4 outline-none transition-colors hover:text-teal-700 hover:underline focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                About Us
              </Link>
            </li>
            {desktopMegaMenuKeys.map((menuKey) => {
              const menu = megaMenus[menuKey];
              const panelId = `${menuKey}-mega-menu`;
              const isOpen = activeMenu === menuKey;

              return (
                <li key={menuKey}>
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onMouseEnter={() => setActiveMenu(menuKey)}
                    onFocus={() => setActiveMenu(menuKey)}
                    onClick={() => setActiveMenu(isOpen ? null : menuKey)}
                    className="rounded-sm text-slate-700 underline-offset-4 outline-none transition-colors hover:text-teal-700 hover:underline focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                  >
                    {menu.label}
                    <span aria-hidden="true" className="ml-1 text-xs">
                      v
                    </span>
                  </button>
                  <MegaMenu
                    id={panelId}
                    menuKey={menuKey}
                    isOpen={isOpen}
                    onLinkClick={() => setActiveMenu(null)}
                  />
                </li>
              );
            })}
            <li>
              <Link
                href="/contact"
                onMouseEnter={closeActiveMenu}
                onFocus={closeActiveMenu}
                onClick={closeActiveMenu}
                className="rounded-sm text-slate-700 underline-offset-4 outline-none transition-colors hover:text-teal-700 hover:underline focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                Contact
              </Link>
            </li>
            <li onMouseEnter={closeActiveMenu} onFocus={closeActiveMenu}>
              <LanguageSwitcher />
            </li>
          </ul>
        </nav>

        <button
          type="button"
          aria-expanded={isMobileOpen}
          aria-controls="mobile-navigation"
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => {
            setIsMobileOpen((current) => !current);
            setActiveMenu(null);
          }}
          className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-300 text-slate-950 outline-none transition-colors hover:border-teal-600 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 md:hidden"
        >
          <span aria-hidden="true" className="space-y-1.5">
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
            <span className="block h-0.5 w-4 bg-current" />
          </span>
        </button>
      </div>

      {isMobileOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-slate-200 bg-white px-6 pb-6 shadow-xl shadow-slate-900/10 md:hidden"
        >
          <ul className="mx-auto max-w-7xl">
            {navLinks.slice(0, 2).map((link) => (
              <li key={link.label} className="border-t border-slate-200 first:border-t-0">
                <Link
                  href={link.href}
                  onClick={closeMenus}
                  className="block py-4 text-base font-semibold text-slate-950 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {desktopMegaMenuKeys.map((menuKey) => (
              <li key={menuKey}>
                <MobileMegaMenu
                  menuKey={menuKey}
                  isOpen={openMobileMenu === menuKey}
                  buttonId={`mobile-${menuKey}-button`}
                  panelId={`mobile-${menuKey}-panel`}
                  onToggle={() =>
                    setOpenMobileMenu((current) => (current === menuKey ? null : menuKey))
                  }
                  onLinkClick={closeMenus}
                />
              </li>
            ))}
            {navLinks.slice(2).map((link) => (
              <li key={link.label} className="border-t border-slate-200">
                <Link
                  href={link.href}
                  onClick={closeMenus}
                  className="block py-4 text-base font-semibold text-slate-950 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-slate-200 py-4">
              <LanguageSwitcher />
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
