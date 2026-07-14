export type MegaMenuKey = "products";
export type ProductMenuSectionKey =
  | "lcdPanels"
  | "lcdModules"
  | "assemblyTechnologies"
  | "customSolutions";
export type ProductMenuLinkKey =
  | "tn"
  | "htn"
  | "stn"
  | "fstn"
  | "va"
  | "characterModules"
  | "graphicModules"
  | "customSegment"
  | "cob"
  | "cog"
  | "tab"
  | "cof"
  | "tftModules"
  | "customPcbaMcu"
  | "touchPanels";

export interface MegaMenuLink {
  translationKey: string;
  title: string;
  description?: string;
  href: string;
}

export interface MegaMenuSection {
  translationKey: ProductMenuSectionKey;
  heading: string;
  summary?: string;
  links: readonly MegaMenuLink[];
}

export interface MegaMenuContent {
  label: string;
  description: string;
  sections: readonly MegaMenuSection[];
}

export const productSectionAnchors = {
  lcdPanels: "products-lcd-panels",
  lcdModules: "products-lcd-modules",
  assemblyTechnologies: "products-assembly",
  customSolutions: "products-custom-solutions",
} as const satisfies Record<ProductMenuSectionKey, string>;

export const productSectionRoutes = {
  lcdPanels: "/products/lcd-panels",
  lcdModules: "/products/lcd-modules",
  assemblyTechnologies: "/products/assembly-technologies",
  customSolutions: "/products/custom-solutions",
} as const satisfies Record<ProductMenuSectionKey, string>;

export const megaMenus: Record<MegaMenuKey, MegaMenuContent> = {
  products: {
    label: "Products",
    description:
      "Click any product category to learn more about the technologies and solutions we offer.",
    sections: [
      {
        translationKey: "lcdPanels",
        heading: "LCD Panels (Monochrome)",
        summary: "Core monochrome LCD panel technologies.",
        links: [
          { translationKey: "tn", title: "TN (Twisted Nematic)", href: "/products/tn" },
          { translationKey: "htn", title: "HTN (High Twisted Nematic)", href: "/products/htn" },
          { translationKey: "stn", title: "STN (Super Twisted Nematic)", href: "/products/stn" },
          {
            translationKey: "fstn",
            title: "FSTN (Film Compensated STN)",
            href: "/products/fstn",
          },
          { translationKey: "va", title: "VA (Vertical Alignment)", href: "/products/va" },
        ],
      },
      {
        translationKey: "lcdModules",
        heading: "LCD Modules (LCM)",
        summary: "Standard and custom LCD module formats.",
        links: [
          {
            translationKey: "characterModules",
            title: "Character LCD Modules",
            href: "/products/character-modules",
          },
          {
            translationKey: "graphicModules",
            title: "Graphic LCD Modules",
            href: "/products/graphic-modules",
          },
          {
            translationKey: "customSegment",
            title: "Custom Segment LCDs",
            href: "/products/custom-segment",
          },
        ],
      },
      {
        translationKey: "assemblyTechnologies",
        heading: "Assembly Technologies",
        summary: "Packaging and bonding methods for LCD and LCM production.",
        links: [
          { translationKey: "cob", title: "COB (Chip On Board)", href: "/products/cob" },
          { translationKey: "cog", title: "COG (Chip On Glass)", href: "/products/cog" },
          { translationKey: "tab", title: "TAB (Tape Automated Bonding)", href: "/products/tab" },
          { translationKey: "cof", title: "COF (Chip On Film)", href: "/products/cof" },
        ],
      },
      {
        translationKey: "customSolutions",
        heading: "Advanced & Custom Solutions",
        summary: "Engineering support for advanced display assemblies.",
        links: [
          { translationKey: "tftModules", title: "TFT LCD Modules", href: "/products/tft-modules" },
          {
            translationKey: "customPcbaMcu",
            title: "Custom PCBA & MCU Development",
            href: "/products/custom-pcba-mcu",
          },
          { translationKey: "touchPanels", title: "Touch Panels (CTP/RTP)", href: "/products/touch-panels" },
        ],
      },
    ],
  },
};
