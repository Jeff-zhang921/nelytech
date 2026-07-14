import type { Metadata } from "next";
import type { ReactNode } from "react";

import { I18nProvider } from "@/context/I18nContext";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { getPublishedProductMegaMenu } from "@/data/productNavigation";

import "./globals.css";

export const metadata: Metadata = {
  title: "NELYTECH | LCD & LCM Solutions",
  description:
    "NELYTECH provides LCD and LCM solutions with strong R&D ability, flexible PCBA, fast tooling, and responsive service.",
  icons: {
    icon: "/icon.svg",
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const productMenu = getPublishedProductMegaMenu();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <I18nProvider>
          <Navbar productMenu={productMenu} />
          {children}
          <div className="relative z-20">
            <Footer />
          </div>
          <BackToTop />
        </I18nProvider>
      </body>
    </html>
  );
}
