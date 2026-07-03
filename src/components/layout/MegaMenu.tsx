import Link from "next/link";

import { megaMenus, type MegaMenuKey } from "@/constants/navigation";

interface MegaMenuProps {
  menuKey: MegaMenuKey;
  id: string;
  isOpen: boolean;
  onLinkClick?: () => void;
}

export function MegaMenu({ menuKey, id, isOpen, onLinkClick }: MegaMenuProps) {
  const menu = megaMenus[menuKey];
  const sectionGridClassName =
    menu.sections.length === 4
      ? "grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
      : "grid gap-7 sm:grid-cols-2 xl:grid-cols-5";
  const techPattern =
    "url(\"data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%230f766e' stroke-width='1'%3E%3Cpath d='M0 16h32M16 0v32'/%3E%3Cpath d='M8 8h4v4H8zM20 20h4v4h-4z'/%3E%3C/g%3E%3Ccircle cx='16' cy='16' r='1.5' fill='%230f766e'/%3E%3C/svg%3E\")";

  return (
    <div
      id={id}
      aria-hidden={!isOpen}
      className={[
        "absolute left-0 right-0 top-full overflow-hidden border-t border-slate-200 bg-white shadow-2xl shadow-slate-900/15 transition-all duration-200 ease-out",
        isOpen
          ? "visible translate-y-0 opacity-100"
          : "invisible -translate-y-2 opacity-0",
      ].join(" ")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-repeat opacity-[0.035]"
        style={{ backgroundImage: techPattern }}
      />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-6 py-9 sm:px-8 lg:grid-cols-[0.8fr_2fr] lg:px-12">
        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-teal-700 uppercase">
            {menu.label}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
            {menu.description}
          </p>
        </div>

        <div className={sectionGridClassName}>
          {menu.sections.map((section) => (
            <section key={section.heading} aria-labelledby={`${id}-${slugify(section.heading)}`}>
              <h3
                id={`${id}-${slugify(section.heading)}`}
                className="text-sm font-semibold tracking-[0.14em] text-slate-950 uppercase"
              >
                {section.heading}
              </h3>
              {section.summary ? (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {section.summary}
                </p>
              ) : null}
              {section.links.length > 0 ? (
                <ul className="mt-5 space-y-3">
                  {section.links.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        onClick={onLinkClick}
                        className="group block rounded-md outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                      >
                        <span className="block text-sm font-semibold text-slate-900 group-hover:text-teal-700">
                          {link.title}
                        </span>
                        {link.description ? (
                          <span className="mt-1 block text-sm leading-5 text-slate-500">
                            {link.description}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
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
              View All Products
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
        <span>{menu.label}</span>
        <span aria-hidden="true" className="text-xs">
          {isOpen ? "-" : "+"}
        </span>
      </button>

      {isOpen ? (
        <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-5">
          <p className="text-sm leading-6 text-slate-600">{menu.description}</p>
          <div className="mt-5 space-y-6">
            {menu.sections.map((section) => (
              <section
                key={section.heading}
                aria-labelledby={`${panelId}-${slugify(section.heading)}`}
              >
                <h3
                  id={`${panelId}-${slugify(section.heading)}`}
                  className="text-xs font-semibold tracking-[0.16em] text-teal-700 uppercase"
                >
                  {section.heading}
                </h3>
                {section.summary ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {section.summary}
                  </p>
                ) : null}
                {section.links.length > 0 ? (
                  <ul className="mt-3 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.title}>
                        <Link
                          href={link.href}
                          onClick={onLinkClick}
                          className="block rounded-md text-sm font-medium text-slate-800 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
