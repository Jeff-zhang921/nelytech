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
  const isProductsMenu = menuKey === "products";
  const sectionGridClassName =
    menu.sections.length === 4
      ? "grid gap-7 sm:grid-cols-2 lg:grid-cols-4"
      : "grid gap-7 sm:grid-cols-2 xl:grid-cols-5";
  const engineeringLineArtPattern =
    "url(\"data:image/svg+xml,%3Csvg width='300' height='210' viewBox='0 0 300 210' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M0 52H300M0 104H300M0 156H300M60 0V210M120 0V210M180 0V210M240 0V210' stroke='%2394a3b8' stroke-opacity='0.11' stroke-width='1.4'/%3E%3Cpath d='M24 158H84V122H132V86H190V50H270' stroke='%232563eb' stroke-opacity='0.18' stroke-width='3.2'/%3E%3Cpath d='M32 36H86L116 66H170L200 96H260' stroke='%230f766e' stroke-opacity='0.13' stroke-width='3'/%3E%3Cpath d='M44 184C80 138 114 138 148 184S216 224 276 146' stroke='%231e293b' stroke-opacity='0.1' stroke-width='2.8'/%3E%3Cpath d='M216 22l28 28-28 28-28-28 28-28Z' stroke='%232563eb' stroke-opacity='0.12' stroke-width='3'/%3E%3Cpath d='M52 72l20-20 20 20-20 20-20-20Z' stroke='%230f766e' stroke-opacity='0.1' stroke-width='2.6'/%3E%3Ccircle cx='84' cy='158' r='6' stroke='%232563eb' stroke-opacity='0.2' stroke-width='2.4'/%3E%3Ccircle cx='132' cy='122' r='6' stroke='%232563eb' stroke-opacity='0.2' stroke-width='2.4'/%3E%3Ccircle cx='190' cy='86' r='6' stroke='%232563eb' stroke-opacity='0.2' stroke-width='2.4'/%3E%3Ccircle cx='200' cy='96' r='5' stroke='%230f766e' stroke-opacity='0.16' stroke-width='2.2'/%3E%3C/g%3E%3C/svg%3E\")";

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
            className="pointer-events-none absolute inset-0 z-0 bg-slate-50/70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-repeat opacity-40"
            style={{ backgroundImage: engineeringLineArtPattern, backgroundSize: "300px 210px" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_18%_10%,rgba(59,130,246,0.08),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(248,250,252,0.92))]"
          />
        </>
      ) : null}
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
          {menu.sections.map((section) => {
            const sectionId = `${id}-${slugify(section.heading)}`;
            const isFeaturedProductSection =
              menuKey === "products" && section.heading === "Advanced & Custom Solutions";

            return (
              <section
                key={section.heading}
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
                    {section.heading}
                  </h3>
                  {isFeaturedProductSection ? (
                    <span className="ml-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-blue-800 uppercase">
                      Featured
                    </span>
                  ) : null}
                </div>
                {section.summary ? (
                  <p
                    className={[
                      "mt-3 text-sm leading-6",
                      isFeaturedProductSection ? "text-slate-600" : "text-slate-500",
                    ].join(" ")}
                  >
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
                            {link.title}
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
                    ))}
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
