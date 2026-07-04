import type { Metadata } from "next";

import { megaMenus, type MegaMenuSection } from "@/constants/navigation";

export const metadata: Metadata = {
  title: "Products | NELYTECH",
  description:
    "Explore NELYTECH LCD panels, LCD modules, assembly technologies, and custom display solutions.",
};

const sectionAnchors = {
  "LCD Panels (Monochrome)": "products-lcd-panels",
  "LCD Modules (LCM)": "products-lcd-modules",
  "Assembly Technologies": "products-assembly",
  "Advanced & Custom Solutions": "products-custom-solutions",
} as const satisfies Record<MegaMenuSection["heading"], string>;

export default function ProductsPage() {
  const productsMenu = megaMenus.products;

  return (
    <main id="products" className="bg-white">
      <section className="border-b border-slate-200 bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold tracking-[0.2em] text-teal-200 uppercase">
            Products
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-normal sm:text-5xl">
            LCD, LCM, and custom display solutions for industrial applications.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Browse NELYTECH&apos;s core product categories, from monochrome LCD panels to
            controller, PCBA, and touch-panel integration.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-4">
          {productsMenu.sections.map((section) => (
            <ProductSection key={section.heading} section={section} />
          ))}
        </div>
      </section>
    </main>
  );
}

interface ProductSectionProps {
  section: MegaMenuSection;
}

function ProductSection({ section }: ProductSectionProps) {
  const sectionAnchor = getSectionAnchor(section.heading);

  return (
    <section
      id={sectionAnchor}
      aria-labelledby={`${sectionAnchor}-title`}
      className="scroll-mt-32 rounded-md border border-slate-200 bg-slate-50 p-6"
    >
      <h2
        id={`${sectionAnchor}-title`}
        className="text-sm font-semibold tracking-[0.14em] text-slate-950 uppercase"
      >
        {section.heading}
      </h2>
      {section.summary ? (
        <p className="mt-3 text-sm leading-6 text-slate-600">{section.summary}</p>
      ) : null}

      <div className="mt-6 space-y-3">
        {section.links.map((link) => (
          <article
            key={link.title}
            id={getAnchorId(link.href)}
            className="scroll-mt-32 rounded-md border border-slate-200 bg-white p-4"
          >
            <h3 className="text-sm font-semibold leading-6 text-slate-950">{link.title}</h3>
            {link.description ? (
              <p className="mt-2 text-sm leading-6 text-slate-600">{link.description}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function getAnchorId(href: string) {
  return href.split("#")[1] ?? href.replace(/^\//, "");
}

function getSectionAnchor(heading: string) {
  return sectionAnchors[heading as keyof typeof sectionAnchors] ?? slugify(heading);
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
