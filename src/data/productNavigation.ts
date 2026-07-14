import { megaMenus, productSectionRoutes, type MegaMenuContent } from "@/constants/navigation";
import { canonicalCatalogue } from "@/content/catalogue";

export function getPublishedProductMegaMenu(): MegaMenuContent {
  const menu = megaMenus.products;
  const existingLinksByHref = new Map(
    menu.sections.flatMap((section) => section.links).map((link) => [link.href, link]),
  );
  const categoriesBySlug = new Map(
    canonicalCatalogue.categories.map((category) => [category.slug, category]),
  );

  return {
    ...menu,
    sections: menu.sections.map((section) => {
      const categoryRoute = productSectionRoutes[section.translationKey];
      const categorySlug = categoryRoute.split("/").at(-1) ?? "";
      const category = categoriesBySlug.get(categorySlug);

      if (!category) {
        return section;
      }

      return {
        ...section,
        links: category.subcategories.map((subcategory) => {
          const href = `/products/${subcategory.slug}`;
          const existingLink = existingLinksByHref.get(href);

          return {
            translationKey: existingLink?.translationKey ?? subcategory.slug,
            title: subcategory.name,
            href,
          };
        }),
      };
    }),
  };
}
