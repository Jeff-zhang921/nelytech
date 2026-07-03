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
      "LCD panels, LCM modules, assembly technologies, and custom electronic display solutions.",
    sections: [
      {
        heading: "LCD Panels (Monochrome)",
        summary: "Core monochrome LCD panel technologies.",
        links: [
          { title: "TN (Twisted Nematic)", href: "#products-tn" },
          { title: "HTN (High Twisted Nematic)", href: "#products-htn" },
          { title: "STN (Super Twisted Nematic)", href: "#products-stn" },
          { title: "FSTN (Film Compensated STN)", href: "#products-fstn" },
          { title: "VA (Vertical Alignment)", href: "#products-va" },
        ],
      },
      {
        heading: "LCD Modules (LCM)",
        summary: "Standard and custom LCD module formats.",
        links: [
          { title: "Character LCD Modules", href: "#products-character-lcd-modules" },
          { title: "Graphic LCD Modules", href: "#products-graphic-lcd-modules" },
          { title: "Custom Segment LCDs", href: "#products-custom-segment-lcds" },
        ],
      },
      {
        heading: "Assembly Technologies",
        summary: "Packaging and bonding methods for LCD and LCM production.",
        links: [
          { title: "COB (Chip On Board)", href: "#products-cob" },
          { title: "COG (Chip On Glass)", href: "#products-cog" },
          { title: "TAB (Tape Automated Bonding)", href: "#products-tab" },
          { title: "COF (Chip On Film)", href: "#products-cof" },
        ],
      },
      {
        heading: "Advanced & Custom Solutions",
        summary: "Engineering support for advanced display assemblies.",
        links: [
          { title: "TFT LCD Modules", href: "#products-tft-lcd-modules" },
          {
            title: "Custom PCBA & MCU Development",
            href: "#products-custom-pcba-mcu-development",
          },
          { title: "Touch Panels (CTP/RTP)", href: "#products-touch-panels" },
        ],
      },
    ],
  },
};
