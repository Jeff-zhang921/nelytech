import {
  PRODUCT_CATALOGUE_RETURN_QUERY_PARAM,
  createProductSlug,
  getCatalogueProductEntryBySlug,
  getProductCategoryConfig,
  type CatalogueProduct,
} from "@/data/productCatalogue";

export interface ProductDetailImage {
  src: string;
  alt: string;
  label: string;
}

export interface ProductDetailSpecification {
  label: string;
  value: string;
}

export interface ProductDetailBreadcrumb {
  label: string;
  href?: string;
}

export interface ProductCategoryReference {
  name: string;
  shortName?: string;
  slug: string;
  route: string;
}

export interface ProductDetail {
  slug: string;
  name: string;
  categoryLabel: string;
  parentCategory: ProductCategoryReference;
  shortDescription: string;
  useCase: string;
  specificationNote: string;
  breadcrumbs: ProductDetailBreadcrumb[];
  images: ProductDetailImage[];
  summary: ProductDetailSpecification[];
  specifications: ProductDetailSpecification[];
  description: string[];
  applications: string[];
  options: string[];
  downloads: string[];
}

export const fourDigitSevenSegmentDisplay: ProductDetail = {
  slug: "4-digit-7-segment-display",
  name: "4-Digit 7-Segment Display",
  categoryLabel: "TN numeric display",
  parentCategory: {
    name: "TN (Twisted Nematic)",
    shortName: "TN",
    slug: "tn",
    route: "/products/tn",
  },
  shortDescription:
    "A compact four-digit seven-segment LED display designed for clear numeric output in clocks, timers, counters, measurement devices, and embedded electronic systems.",
  useCase:
    "Suitable for digital clocks, industrial counters, measuring instruments, control panels, and microcontroller-based projects.",
  specificationNote:
    "Example product data for layout and content structure. Final specifications depend on the selected model and project requirements.",
  breadcrumbs: [
    { label: "Products", href: "/products" },
    { label: "LCD Panels", href: "/products/lcd-panels" },
    { label: "TN (Twisted Nematic)", href: "/products/tn" },
    { label: "4-Digit 7-Segment Display" },
  ],
  images: [
    {
      src: "/images/products/4-digit-7-segment-display/front.svg",
      alt: "Front view of the 4-Digit 7-Segment Display",
      label: "Front",
    },
    {
      src: "/images/products/4-digit-7-segment-display/angled.svg",
      alt: "Angled view of the 4-Digit 7-Segment Display",
      label: "Angled",
    },
    {
      src: "/images/products/4-digit-7-segment-display/rear-pin-layout.svg",
      alt: "Rear pin layout view of the 4-Digit 7-Segment Display",
      label: "Pin layout",
    },
    {
      src: "/images/products/4-digit-7-segment-display/pcb-installed.svg",
      alt: "4-Digit 7-Segment Display installed on a printed circuit board",
      label: "PCB",
    },
    {
      src: "/images/products/4-digit-7-segment-display/example-device.svg",
      alt: "4-Digit 7-Segment Display used in an example control device",
      label: "Device",
    },
  ],
  summary: [
    { label: "Part number", value: "NLY-TN-7SEG-04" },
    { label: "Product type", value: "Seven-segment numeric display" },
    { label: "Digits", value: "4" },
    { label: "Display content", value: "Numeric characters" },
  ],
  specifications: [
    { label: "Product name", value: "4-Digit 7-Segment Display" },
    { label: "Part number", value: "NLY-TN-7SEG-04" },
    { label: "Display type", value: "Seven-segment LED display" },
    { label: "Number of digits", value: "4" },
    { label: "Display content", value: "Numeric characters" },
    { label: "Available colours", value: "Red, green, blue, amber, or white" },
    { label: "Connection type", value: "Common anode or common cathode" },
    { label: "Operating voltage", value: "Based on the selected model" },
    { label: "Mounting type", value: "Through-hole or PCB mounting" },
    {
      label: "Typical applications",
      value: "Clocks, timers, counters, meters, and control panels",
    },
    {
      label: "Customisation",
      value: "Size, colour, brightness, pin layout, and electrical configuration",
    },
  ],
  description: [
    "The 4-Digit 7-Segment Display is designed to present numerical information in a compact and highly readable format. It contains four individual digit positions, with each digit formed by seven illuminated segments.",
    "Each digit can show numbers by turning selected segments on or off. This simple structure makes the display easy to read, efficient to drive, and practical for embedded products that need direct numeric output.",
    "It can be integrated into electronic products that need to display values such as time, temperature, quantity, speed, voltage, or measurement results.",
    "Different sizes, LED colours, brightness levels, common-anode or common-cathode configurations, and pin layouts may be available depending on the selected product model.",
  ],
  applications: [
    "Digital clocks and timers",
    "Industrial counters and meters",
    "Measurement instruments",
    "Control panels",
    "Microcontroller-based projects",
  ],
  options: [
    "LED colour selection",
    "Display size selection",
    "Common anode or common cathode",
    "Brightness and pin layout customisation",
  ],
  downloads: ["Datasheet coming soon", "Drawing coming soon"],
};

export const productDetails: ProductDetail[] = [fourDigitSevenSegmentDisplay];

const productDetailsBySlug = new Map<string, ProductDetail>(
  productDetails.map((product) => [product.slug, product]),
);

export function getProductDetailBySlug(slug: string): ProductDetail | undefined {
  return productDetailsBySlug.get(slug) ?? getGeneratedProductDetailBySlug(slug);
}

function getGeneratedProductDetailBySlug(slug: string): ProductDetail | undefined {
  const entry = getCatalogueProductEntryBySlug(slug);

  if (!entry) {
    return undefined;
  }

  return createCatalogueProductDetail(entry.product, entry.categorySlug);
}

function createCatalogueProductDetail(
  product: CatalogueProduct,
  categorySlug: string,
): ProductDetail {
  const categoryConfig = getProductCategoryConfig(categorySlug);
  const productSlug = createProductSlug(product.name);
  const categoryLabel = categoryConfig?.shortName ?? categoryConfig?.name ?? "Product";
  const parentCategory: ProductCategoryReference = {
    name: categoryConfig?.name ?? "Products",
    shortName: categoryConfig?.shortName,
    slug: categorySlug,
    route: `/products/${categorySlug}`,
  };
  const applications = product.filters.application ?? [];
  const interfaces = product.filters.interface ?? [];
  const formats = product.filters.format ?? [];

  return {
    slug: productSlug,
    name: product.name,
    categoryLabel,
    parentCategory,
    shortDescription: product.description,
    useCase: applications.length > 0
      ? `Suitable for ${formatList(applications).toLowerCase()}.`
      : "Suitable for display integration projects that require a customised LCD solution.",
    specificationNote:
      "Catalogue product information for initial evaluation. Final specifications depend on the selected model and project requirements.",
    breadcrumbs: [
      ...(categoryConfig
        ? categoryConfig.breadcrumbItems.map((item, index, items) =>
            index === items.length - 1
              ? { ...item, href: `/products/${categorySlug}` }
              : item,
          )
        : [{ label: "Products", href: "/products" }]),
      { label: product.name },
    ],
    images: [
      {
        src: product.image,
        alt: product.imageAlt ?? `${product.name} product image`,
        label: "Product",
      },
    ],
    summary: [
      { label: "Part number", value: product.partNumber },
      { label: "Category", value: categoryLabel },
      { label: "Format", value: formats.length > 0 ? formatList(formats) : "Custom" },
    ],
    specifications: [
      { label: "Product name", value: product.name },
      { label: "Part number", value: product.partNumber },
      { label: "Category", value: categoryLabel },
      ...product.specs.map(parseSpecification),
      {
        label: "Application",
        value: applications.length > 0 ? formatList(applications) : "Project specific",
      },
      {
        label: "Interface",
        value: interfaces.length > 0 ? formatList(interfaces) : "Project specific",
      },
      {
        label: "Format",
        value: formats.length > 0 ? formatList(formats) : "Project specific",
      },
    ],
    description: [
      `${product.name} is part of the NELYTECH product catalogue for display programs that need stable supply, configurable integration, and application-specific engineering support.`,
      product.description,
      "The configuration can be reviewed with the engineering team for dimensions, interface, optical mode, operating conditions, and production requirements.",
    ],
    applications:
      applications.length > 0
        ? applications
        : ["Embedded product interfaces", "Industrial display applications"],
    options: [
      ...(interfaces.length > 0 ? interfaces : ["Custom interface"]),
      ...(formats.length > 0 ? formats : ["Custom display format"]),
    ],
    downloads: ["Datasheet coming soon", "Drawing coming soon"],
  };
}

function parseSpecification(specification: string): ProductDetailSpecification {
  const separatorIndex = specification.indexOf(":");

  if (separatorIndex === -1) {
    return { label: "Specification", value: specification };
  }

  return {
    label: specification.slice(0, separatorIndex).trim(),
    value: specification.slice(separatorIndex + 1).trim(),
  };
}

function formatList(items: readonly string[]) {
  return items.join(", ");
}

export { PRODUCT_CATALOGUE_RETURN_QUERY_PARAM };
