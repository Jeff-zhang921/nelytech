import type { Metadata } from "next";
import type { ReactNode } from "react";

import { I18nProvider } from "@/context/I18nContext";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

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
  return (
    <html lang="en">
      <body>
        <I18nProvider>
          <Navbar />
          {children}
          <div className="relative z-20">
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}
