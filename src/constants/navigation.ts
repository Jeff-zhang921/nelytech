export type MegaMenuKey = "products";

export interface MegaMenuLink {
  title: string;
  description?: string;
  href: string;
}

export interface MegaMenuSection {
  heading: string;
  summary?: string;
  links: readonly MegaMenuLink[];
}

export interface MegaMenuContent {
  label: string;
  description: string;
  sections: readonly MegaMenuSection[];
}

export const megaMenus: Record<MegaMenuKey, MegaMenuContent> = {
  products: {
    label: "Products",
    description:
      "Click any product category to learn more about the technologies and solutions we offer.",
    sections: [
      {
        heading: "LCD Panels (Monochrome)",
        summary: "Core monochrome LCD panel technologies.",
        links: [
          { title: "TN (Twisted Nematic)", href: "/products#products-tn" },
          { title: "HTN (High Twisted Nematic)", href: "/products#products-htn" },
          { title: "STN (Super Twisted Nematic)", href: "/products#products-stn" },
          { title: "FSTN (Film Compensated STN)", href: "/products#products-fstn" },
          { title: "VA (Vertical Alignment)", href: "/products#products-va" },
        ],
      },
      {
        heading: "LCD Modules (LCM)",
        summary: "Standard and custom LCD module formats.",
        links: [
          { title: "Character LCD Modules", href: "/products#products-character-lcd-modules" },
          { title: "Graphic LCD Modules", href: "/products#products-graphic-lcd-modules" },
          { title: "Custom Segment LCDs", href: "/products#products-custom-segment-lcds" },
        ],
      },
      {
        heading: "Assembly Technologies",
        summary: "Packaging and bonding methods for LCD and LCM production.",
        links: [
          { title: "COB (Chip On Board)", href: "/products#products-cob" },
          { title: "COG (Chip On Glass)", href: "/products#products-cog" },
          { title: "TAB (Tape Automated Bonding)", href: "/products#products-tab" },
          { title: "COF (Chip On Film)", href: "/products#products-cof" },
        ],
      },
      {
        heading: "Advanced & Custom Solutions",
        summary: "Engineering support for advanced display assemblies.",
        links: [
          { title: "TFT LCD Modules", href: "/products#products-tft-lcd-modules" },
          {
            title: "Custom PCBA & MCU Development",
            href: "/products#products-custom-pcba-mcu-development",
          },
          { title: "Touch Panels (CTP/RTP)", href: "/products#products-touch-panels" },
        ],
      },
    ],
  },
};
