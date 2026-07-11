import type { FilterableProduct } from "@/components/products/productFiltering";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type CatalogueProduct = FilterableProduct & {
  partNumber: string;
  href?: string;
  specs: string[];
};

export type ProductCategoryPageConfig = {
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  breadcrumbItems: BreadcrumbItem[];
  products: CatalogueProduct[];
};

export type ProductCategoryNavigationItem = {
  slug: string;
  name: string;
  shortName?: string;
  route: string;
};

export type ProductCategoryNavigationState = {
  backItem?: ProductCategoryNavigationItem;
  menuLabel?: string;
  menuAriaLabel?: string;
  menuItems: ProductCategoryNavigationItem[];
};

export type CatalogueProductEntry = {
  product: CatalogueProduct;
  categorySlug: string;
};

export const PRODUCT_CATALOGUE_RETURN_QUERY_PARAM = "returnQuery";

const tnProducts = [
  {
    id: "prod_tn_01",
    partNumber: "NLY-TN-7SEG-04",
    href: "/products/4-digit-7-segment-display",
    name: "4-Digit 7-Segment Display",
    description: "Fixed numeric display for meters, counters, and low-power controls.",
    image:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=800&auto=format&fit=crop",
    imageAlt: "LCD glass and circuit detail for a TN segment display",
    specs: [
      "Display Mode: Reflective, Positive",
      "Multiplex: 1/4 Duty, 1/3 Bias",
      "Op. Temp: -10\u00b0C to +60\u00b0C",
    ],
    filters: {
      application: ["Counters", "Low-power controls", "Meters"],
      interface: ["Glass only"],
      format: ["7-segment", "Numeric"],
    },
  },
  {
    id: "prod_tn_02",
    partNumber: "NLY-1602A-TN-YG",
    name: "16x2 Character LCD Module",
    description: "Character module for compact status text in embedded equipment.",
    image:
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Backlit electronics module representing a character LCD",
    specs: [
      "Resolution: 16 Characters x 2 Lines",
      "Backlight: Yellow-Green LED",
      "Interface: 6800 Parallel 8-bit",
    ],
    filters: {
      application: ["Embedded equipment", "Status text"],
      interface: ["6800 Parallel"],
      format: ["16x2", "Character module"],
    },
  },
  {
    id: "prod_tn_03",
    partNumber: "NLY-TN-CUST-HVAC",
    name: "Custom Thermostat Panel",
    description: "Custom segment panel for HVAC modes, icons, and temperature readouts.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Macro electronics detail representing a custom thermostat display",
    specs: [
      "Application: HVAC Control Interface",
      "Icons: Custom Segments",
      "Connector: Heat Seal / FPC",
    ],
    filters: {
      application: ["HVAC controls", "Thermostats"],
      interface: ["FPC", "Heat seal"],
      format: ["Custom segment"],
    },
  },
  {
    id: "prod_tn_04",
    partNumber: "NLY-TN-METER-88",
    name: "Industrial Meter LCD Glass",
    description: "Durable TN glass for industrial meters and fixed-segment readings.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Industrial display circuitry representing meter LCD glass",
    specs: [
      "Display Mode: Transflective, Positive",
      "Viewing Direction: 6 o'clock",
      "Op. Temp: -20\u00b0C to +70\u00b0C",
    ],
    filters: {
      application: ["Industrial meters"],
      interface: ["Glass only"],
      format: ["Custom segment", "Numeric"],
    },
  },
  {
    id: "prod_tn_05",
    partNumber: "NLY-TN-ICON-12",
    name: "Custom Icon Segment Panel",
    description: "Icon-based segment display for appliance and device status states.",
    image:
      "https://images.unsplash.com/photo-1562408590-e32931084e23?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Precision electronic component representing a custom icon panel",
    specs: [
      "Segment Type: Fixed Icons",
      "Glass Thickness: 1.1 mm",
      "Polarizer: Reflective",
    ],
    filters: {
      application: ["Appliances", "Device status"],
      interface: ["Glass only"],
      format: ["Icon segment"],
    },
  },
  {
    id: "prod_tn_06",
    partNumber: "NLY-TN-HH-096",
    name: "Handheld Instrument Display",
    description: "Low-power display for handheld instruments and portable controls.",
    image:
      "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Industrial electronics detail representing a handheld instrument display",
    specs: [
      "Display Area: 48.0 x 22.0 mm",
      "Drive Voltage: 3.0 V",
      "Connector: Elastomer / Pin",
    ],
    filters: {
      application: ["Handheld instruments", "Portable controls"],
      interface: ["Elastomer", "Pin"],
      format: ["Custom segment"],
    },
  },
] satisfies CatalogueProduct[];

const lcdPanelProducts = [
  {
    id: "prod_lcd_01",
    partNumber: "NLY-TN0420",
    name: "TN Segment LCD Panel",
    description: "Cost-efficient segment glass for numeric and icon-based displays.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Macro detail of electronic display circuitry",
    specs: [
      "Type: TN Segment",
      "Glass: 42.0 x 28.0 mm",
      "Temp: -20\u00b0C to +70\u00b0C",
    ],
    filters: {
      application: ["Icon displays", "Numeric displays"],
      interface: ["Glass only"],
      format: ["Segment"],
    },
  },
  {
    id: "prod_lcd_02",
    partNumber: "NLY-HTN5682",
    name: "HTN Instrument Panel",
    description: "Higher contrast monochrome panel for instrument interfaces.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Close-up of illuminated display components",
    specs: ["Type: HTN Panel", "Duty: 1/4", "View: 6 o'clock"],
    filters: {
      application: ["Instrument interfaces"],
      interface: ["Glass only"],
      format: ["Segment"],
    },
  },
  {
    id: "prod_lcd_03",
    partNumber: "NLY-STN24064",
    name: "STN Graphic LCD Panel",
    description: "Graphic monochrome panel for compact text and simple UI layouts.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Macro technology image with printed circuit details",
    specs: [
      "Resolution: 240x64",
      "Mode: Transflective",
      "Temp: -30\u00b0C to +80\u00b0C",
    ],
    filters: {
      application: ["Graphic interfaces", "Text displays"],
      interface: ["Controller-ready"],
      format: ["Graphic"],
    },
  },
  {
    id: "prod_lcd_04",
    partNumber: "NLY-FSTN12864",
    name: "FSTN Monochrome Panel",
    description: "Film-compensated display for improved readability and contrast.",
    image:
      "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Precision electronic component under inspection",
    specs: ["Resolution: 128x64", "Polarizer: FSTN", "Backlight: White LED"],
    filters: {
      application: ["High-readability displays"],
      interface: ["Controller-ready"],
      format: ["Graphic"],
    },
  },
  {
    id: "prod_lcd_05",
    partNumber: "NLY-VA1888",
    name: "VA High Contrast Panel",
    description: "High-contrast segment display for premium dark-face interfaces.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Technical workstation with electronic assemblies",
    specs: ["Type: VA Segment", "Contrast: High", "Interface: Pin / FPC"],
    filters: {
      application: ["Dark-face interfaces", "Premium controls"],
      interface: ["FPC", "Pin"],
      format: ["Segment"],
    },
  },
  {
    id: "prod_lcd_06",
    partNumber: "NLY-CUSTOM01",
    name: "Custom LCD Glass Program",
    description: "Application-specific LCD glass for custom icons and layouts.",
    image:
      "https://images.unsplash.com/photo-1581092921461-39b9d08a9b21?auto=format&fit=crop&w=1200&q=90",
    imageAlt: "Industrial electronics manufacturing detail",
    specs: ["Tooling: Custom", "LCD Mode: TN / STN / VA", "Lead Time: Fast sample"],
    filters: {
      application: ["Application-specific layouts", "Custom icons"],
      interface: ["Custom"],
      format: ["Graphic", "Segment"],
    },
  },
] satisfies CatalogueProduct[];

const catalogueProductEntries = [
  ...lcdPanelProducts.map((product) => ({ product, categorySlug: "lcd-panels" })),
  ...tnProducts.map((product) => ({ product, categorySlug: "tn" })),
] satisfies CatalogueProductEntry[];

export const allCatalogueProducts = uniqueProducts([...lcdPanelProducts, ...tnProducts]);

export const allProductsPageConfig: ProductCategoryPageConfig = {
  slug: "all",
  name: "All Products",
  shortName: "All Products",
  description:
    "Explore our complete range of display products and solutions, designed for commercial, industrial, embedded, and specialised applications.",
  breadcrumbItems: [{ label: "Products" }],
  products: allCatalogueProducts,
};

const emptyCategoryDescriptions = {
  htn: "Higher-twist monochrome LCD panel options for applications that need improved contrast over standard TN displays.",
  stn: "Super-twisted monochrome LCD panel options for graphic and text-oriented embedded interfaces.",
  fstn: "Film-compensated monochrome LCD panel options for improved readability and contrast.",
  va: "Vertical-alignment LCD options for high-contrast dark-face interfaces.",
  "lcd-modules": "Standard and custom LCD module formats for embedded product interfaces.",
  "character-modules": "Character LCD module formats for compact text and status interfaces.",
  "graphic-modules": "Graphic LCD module formats for simple visual layouts and embedded UI screens.",
  "custom-segment": "Custom segment LCD programmes for icon-driven and application-specific display layouts.",
  "assembly-technologies": "Packaging and bonding methods for LCD and LCM production.",
  cob: "Chip-on-board assembly options for display module integration.",
  cog: "Chip-on-glass assembly options for compact display module construction.",
  tab: "Tape automated bonding options for display interconnect assemblies.",
  cof: "Chip-on-film assembly options for compact display packaging.",
  "custom-solutions": "Engineering support for advanced display assemblies and custom product integration.",
  "tft-modules": "TFT LCD module options for colour display applications.",
  "custom-pcba-mcu": "Custom PCBA and MCU development support for integrated display products.",
  "touch-panels": "Capacitive and resistive touch-panel integration options.",
} as const;

export const productCategoryConfigs: Record<string, ProductCategoryPageConfig> = {
  "lcd-panels": {
    slug: "lcd-panels",
    name: "LCD Panels",
    shortName: "LCD Panels",
    description:
      "Monochrome LCD panel platforms engineered for stable contrast, long lifecycle supply, and application-specific optical performance across industrial, medical, and embedded interfaces.",
    breadcrumbItems: [
      { label: "Products", href: "/products" },
      { label: "LCD Panels" },
    ],
    products: lcdPanelProducts,
  },
  tn: {
    slug: "tn",
    name: "TN (Twisted Nematic)",
    shortName: "TN",
    description:
      "The most cost-effective and widely adopted liquid crystal technology. Ideal for basic numeric, character, and custom segment displays where extreme viewing angles are not the primary requirement.",
    breadcrumbItems: [
      { label: "Products", href: "/products" },
      { label: "LCD Panels", href: "/products/lcd-panels" },
      { label: "TN (Twisted Nematic)" },
    ],
    products: tnProducts,
  },
  htn: createEmptyCategory("htn", "HTN (High Twisted Nematic)", "HTN", [
    { label: "Products", href: "/products" },
    { label: "LCD Panels", href: "/products/lcd-panels" },
    { label: "HTN (High Twisted Nematic)" },
  ]),
  stn: createEmptyCategory("stn", "STN (Super Twisted Nematic)", "STN", [
    { label: "Products", href: "/products" },
    { label: "LCD Panels", href: "/products/lcd-panels" },
    { label: "STN (Super Twisted Nematic)" },
  ]),
  fstn: createEmptyCategory("fstn", "FSTN (Film Compensated STN)", "FSTN", [
    { label: "Products", href: "/products" },
    { label: "LCD Panels", href: "/products/lcd-panels" },
    { label: "FSTN (Film Compensated STN)" },
  ]),
  va: createEmptyCategory("va", "VA (Vertical Alignment)", "VA", [
    { label: "Products", href: "/products" },
    { label: "LCD Panels", href: "/products/lcd-panels" },
    { label: "VA (Vertical Alignment)" },
  ]),
  "lcd-modules": createEmptyCategory("lcd-modules", "LCD Modules", "LCD Modules", [
    { label: "Products", href: "/products" },
    { label: "LCD Modules" },
  ]),
  "character-modules": createEmptyCategory(
    "character-modules",
    "Character LCD Modules",
    "Character Modules",
    [
      { label: "Products", href: "/products" },
      { label: "LCD Modules", href: "/products/lcd-modules" },
      { label: "Character LCD Modules" },
    ],
  ),
  "graphic-modules": createEmptyCategory(
    "graphic-modules",
    "Graphic LCD Modules",
    "Graphic Modules",
    [
      { label: "Products", href: "/products" },
      { label: "LCD Modules", href: "/products/lcd-modules" },
      { label: "Graphic LCD Modules" },
    ],
  ),
  "custom-segment": createEmptyCategory(
    "custom-segment",
    "Custom Segment LCDs",
    "Custom Segment",
    [
      { label: "Products", href: "/products" },
      { label: "LCD Modules", href: "/products/lcd-modules" },
      { label: "Custom Segment LCDs" },
    ],
  ),
  "assembly-technologies": createEmptyCategory(
    "assembly-technologies",
    "Assembly Technologies",
    "Assembly Technologies",
    [
      { label: "Products", href: "/products" },
      { label: "Assembly Technologies" },
    ],
  ),
  cob: createEmptyCategory("cob", "COB (Chip On Board)", "COB", [
    { label: "Products", href: "/products" },
    { label: "Assembly Technologies", href: "/products/assembly-technologies" },
    { label: "COB (Chip On Board)" },
  ]),
  cog: createEmptyCategory("cog", "COG (Chip On Glass)", "COG", [
    { label: "Products", href: "/products" },
    { label: "Assembly Technologies", href: "/products/assembly-technologies" },
    { label: "COG (Chip On Glass)" },
  ]),
  tab: createEmptyCategory("tab", "TAB (Tape Automated Bonding)", "TAB", [
    { label: "Products", href: "/products" },
    { label: "Assembly Technologies", href: "/products/assembly-technologies" },
    { label: "TAB (Tape Automated Bonding)" },
  ]),
  cof: createEmptyCategory("cof", "COF (Chip On Film)", "COF", [
    { label: "Products", href: "/products" },
    { label: "Assembly Technologies", href: "/products/assembly-technologies" },
    { label: "COF (Chip On Film)" },
  ]),
  "custom-solutions": createEmptyCategory(
    "custom-solutions",
    "Advanced & Custom Solutions",
    "Custom Solutions",
    [
      { label: "Products", href: "/products" },
      { label: "Advanced & Custom Solutions" },
    ],
  ),
  "tft-modules": createEmptyCategory("tft-modules", "TFT LCD Modules", "TFT Modules", [
    { label: "Products", href: "/products" },
    { label: "Advanced & Custom Solutions", href: "/products/custom-solutions" },
    { label: "TFT LCD Modules" },
  ]),
  "custom-pcba-mcu": createEmptyCategory(
    "custom-pcba-mcu",
    "Custom PCBA & MCU Development",
    "Custom PCBA & MCU",
    [
      { label: "Products", href: "/products" },
      { label: "Advanced & Custom Solutions", href: "/products/custom-solutions" },
      { label: "Custom PCBA & MCU Development" },
    ],
  ),
  "touch-panels": createEmptyCategory("touch-panels", "Touch Panels (CTP/RTP)", "Touch Panels", [
    { label: "Products", href: "/products" },
    { label: "Advanced & Custom Solutions", href: "/products/custom-solutions" },
    { label: "Touch Panels (CTP/RTP)" },
  ]),
};

const productCategoryChildren = {
  "lcd-panels": ["tn", "htn", "stn", "fstn", "va"],
  "lcd-modules": ["character-modules", "graphic-modules", "custom-segment"],
  "assembly-technologies": ["cob", "cog", "tab", "cof"],
  "custom-solutions": ["tft-modules", "custom-pcba-mcu", "touch-panels"],
} as const satisfies Record<string, readonly string[]>;

const topLevelCategorySlugs = [
  "lcd-panels",
  "lcd-modules",
  "assembly-technologies",
  "custom-solutions",
] as const;

const parentSlugByCategory = Object.entries(productCategoryChildren).reduce<
  Record<string, string>
>((parents, [parentSlug, childSlugs]) => {
  childSlugs.forEach((childSlug) => {
    parents[childSlug] = parentSlug;
  });

  return parents;
}, {});

export function getProductCategoryConfig(slug: string) {
  return productCategoryConfigs[slug];
}

export function createProductSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCatalogueProductHref(product: Pick<CatalogueProduct, "href" | "name">) {
  return product.href ?? `/products/${createProductSlug(product.name)}`;
}

export function createProductDetailHref(
  product: Pick<CatalogueProduct, "href" | "name">,
  returnQuery?: string,
) {
  const href = getCatalogueProductHref(product);

  if (!returnQuery) {
    return href;
  }

  const searchParams = new URLSearchParams();
  searchParams.set(PRODUCT_CATALOGUE_RETURN_QUERY_PARAM, returnQuery);

  return `${href}?${searchParams.toString()}`;
}

export function getCatalogueProductEntryBySlug(slug: string) {
  return catalogueProductEntries.find(
    ({ product }) => getCatalogueProductHref(product).split("/").pop() === slug,
  );
}

export function getProductCategoryNavigationState(
  slug: string,
): ProductCategoryNavigationState {
  if (slug === "all") {
    return {
      menuLabel: "View categories",
      menuAriaLabel: "View product categories",
      menuItems: topLevelCategorySlugs.map(createCategoryNavigationItem),
    };
  }

  const config = getProductCategoryConfig(slug);

  if (!config) {
    return { menuItems: [] };
  }

  const parentSlug = parentSlugByCategory[slug];
  const parentItem = parentSlug
    ? createCategoryNavigationItem(parentSlug)
    : {
        slug: "all",
        name: "Products",
        shortName: "Products",
        route: "/products",
      };
  const childSlugs = productCategoryChildren[slug as keyof typeof productCategoryChildren] ?? [];

  return {
    backItem: parentItem,
    menuLabel: childSlugs.length > 0 ? "View subcategories" : undefined,
    menuAriaLabel:
      childSlugs.length > 0
        ? `View ${config.shortName ?? config.name} subcategories`
        : undefined,
    menuItems: childSlugs.map(createCategoryNavigationItem),
  };
}

export function isProductDetailPathname(pathname: string) {
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const productRouteMatch = normalizedPathname.match(/^\/products\/([^/]+)$/);

  if (!productRouteMatch) {
    return false;
  }

  return !getProductCategoryConfig(productRouteMatch[1]);
}

export function isProductCataloguePathname(pathname: string) {
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

  return normalizedPathname === "/products" || normalizedPathname.startsWith("/products/");
}

function createCategoryNavigationItem(slug: string): ProductCategoryNavigationItem {
  const config = productCategoryConfigs[slug];

  return {
    slug,
    name: config.name,
    shortName: config.shortName,
    route: `/products/${slug}`,
  };
}

function createEmptyCategory(
  slug: keyof typeof emptyCategoryDescriptions,
  name: string,
  shortName: string,
  breadcrumbItems: BreadcrumbItem[],
): ProductCategoryPageConfig {
  return {
    slug,
    name,
    shortName,
    description: emptyCategoryDescriptions[slug],
    breadcrumbItems,
    products: [],
  };
}

function uniqueProducts(products: CatalogueProduct[]) {
  const productsById = new Map<string, CatalogueProduct>();

  products.forEach((product) => {
    if (!productsById.has(product.id)) {
      productsById.set(product.id, product);
    }
  });

  return Array.from(productsById.values());
}
