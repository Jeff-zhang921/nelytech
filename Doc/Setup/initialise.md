# NELYTECH Frontend Initialisation Guide

This guide explains how to start from a new empty folder and build this project until it has the same structure and behaviour as the current NELYTECH landing page.


## 1. Create A New Next.js Project

From the parent folder where you want the project:

```bash
npx create-next-app@latest nelytech --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd nelytech
npm run dev
```

Explanation:

- `--typescript` creates a TypeScript project.
- `--tailwind` Tailwind CSS is in HTML file css, no css file need, different grammar
- `--eslint` adds linting.
- `--app` uses the modern Next.js App Router.
- `--src-dir` puts app code under `src/`.
- `--import-alias "@/*"` lets us import files like `@/components/layout/Navbar`.

### difference between npx create-next-app@latest... and npm ci, npm install
`npx create-next-app`:Node Package Execute. purpose when starting a new project
`npm ci`: use for when having package lock file. based on the setting. download node_modules, strictly constrained by packagelock
`npm install`: It can update versions and rewrite the lockfile.



## 2. Understand The Project Structure

The current project is organised like this:

```text
nelytech/
  public/
    images/
      lcd-lcm-hero.png
  src/
    app/
      globals.css
      icon.svg
      layout.tsx
      page.tsx
    components/
      landing/
        Advantages.tsx
        ContactCTA.tsx
        Hero.tsx
        IndustriesShowcase.tsx
        LogoTicker.tsx
      layout/
        Footer.tsx
        LanguageSwitcher.tsx
        MegaMenu.tsx
        Navbar.tsx
    constants/
      logos.tsx
      navigation.ts
  next.config.ts
  package.json
  tsconfig.json
```


## 3. Configure Global CSS

In `src/app/globals.css`, keep Tailwind and global defaults:

Explanation:

- Tailwind v4 is imported directly with `@import "tailwindcss"`.
- The marquee animation is declared in `@theme`, then used by `LogoTicker`.
- The body background and typography are set once globally.

## 4. Build The Root Layout

Edit `src/app/layout.tsx` so every route gets the same navbar and footer:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

Explanation:

- `Navbar` and `Footer` are shared across the whole website.
- `children` is where each route page renders.
- Metadata controls the browser title and SEO description.

## 5. Build The Homepage Composition

Edit `src/app/page.tsx`:

```tsx
import { Advantages } from "@/components/landing/Advantages";
import { ContactCTA } from "@/components/landing/ContactCTA";
import { Hero } from "@/components/landing/Hero";
import { IndustriesShowcase } from "@/components/landing/IndustriesShowcase";
import { LogoTicker } from "@/components/landing/LogoTicker";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main-content">
        <Advantages />
        <IndustriesShowcase />
        <LogoTicker />
        <ContactCTA />
      </main>
    </>
  );
}
```

Explanation:

- `page.tsx` should stay simple.
- The page is built by composing section components.
- Each section can be maintained independently.
- `main id="main-content"` gives the page a semantic main content region.

## 6. Add Navigation Data

Create `src/constants/navigation.ts`.

Purpose:

- Store the Products mega-menu data in one place.
- Make it easy to add, remove, or rename menu sections later.

Current data model:

```ts
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
```

Current Products sections:

- LCD Panels (Monochrome)
- LCD Modules (LCM)
- Assembly Technologies
- Advanced & Custom Solutions

Explanation:

- The navbar does not hardcode all product links.
- `MegaMenu.tsx` reads from this data file and renders the menu.
- Adding a product category should usually happen here, not inside JSX.

## 7. Build The Navbar

Create `src/components/layout/Navbar.tsx`.

Responsibilities:

- Render the NELYTECH brand.
- Render top navigation links: Home, About Us, Products, Contact.
- Open the Products mega-menu on hover/focus/click.
- Render a mobile drawer menu.
- Render the language switcher.

Important state:

```tsx
const [activeMenu, setActiveMenu] = useState<MegaMenuKey | null>(null);
const [isMobileOpen, setIsMobileOpen] = useState(false);
const [openMobileMenu, setOpenMobileMenu] = useState<MegaMenuKey | null>(null);
```

Explanation:

- `activeMenu` is better than separate booleans like `isProductsOpen`.
- It prevents stuck dropdown bugs.
- If a top-level link has no menu, call `setActiveMenu(null)`.
- The navbar is a client component because it uses React state.

## 8. Build The Mega Menu

Create `src/components/layout/MegaMenu.tsx`.

Responsibilities:

- Render the desktop Products dropdown.
- Render the mobile accordion version.
- Add a subtle tech-pattern background.
- Add a bottom CTA row: `View All Products -> /products`.

Important details:

- The texture is an inline SVG data URI.
- It is layered with very low opacity.
- Text content uses `relative z-10` so it remains readable.
- The bottom CTA row is separated with `border-t` and `bg-slate-50/90`.

Explanation:

- This keeps the dropdown feeling premium without using image files.
- The CTA row gives users a clear path to a future `/products` page.
- The `/products` route is linked but not implemented yet.

## 9. Build The Language Switcher

Create `src/components/layout/LanguageSwitcher.tsx`.

Responsibilities:

- Show a globe icon.
- Show active language code, currently `EN`.
- Show a chevron.
- Open a dropdown on hover or click.
- Show language options: English and Chinese.

Explanation:

- This is only UI preparation.
- It does not implement i18n routing yet.
- Real routing can be added later with paths like `/en` and `/zh`.

## 10. Build The Hero Section

Create `src/components/landing/Hero.tsx`.

Purpose:

- Make the first screen feel like a real industrial display company.
- Use a full-bleed image background.
- Show the main NELYTECH introduction copy.

Current local image:

```text
public/images/lcd-lcm-hero.png
```

Important Next.js detail:

```tsx
<Image
  src="/images/lcd-lcm-hero.png"
  alt="LCD and LCM display modules on an electronics engineering bench"
  fill
  priority
  sizes="100vw"
  className="absolute inset-0 -z-20 object-cover"
/>
```

Explanation:

- `priority` is used because the hero image is above the fold.
- `fill` makes the image cover the section.
- The dark overlay keeps text readable.

## 11. Build The Advantages Section

Create `src/components/landing/Advantages.tsx`.

Purpose:

- Show five NELYTECH advantages in compact cards.
- Use a one-row desktop grid.
- Use photorealistic manufacturing/electronics images.

Current grid:

```tsx
<ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
```

Explanation:

- `grid-cols-1` keeps mobile readable.
- `sm:grid-cols-2` uses two columns on tablets.
- `lg:grid-cols-5` creates one horizontal row on desktop.
- Remote Unsplash images use `unoptimized` because the Next image optimizer timed out against Unsplash in local dev.

## 12. Build The Industries Showcase

Create `src/components/landing/IndustriesShowcase.tsx`.

This is a client component:

```tsx
"use client";
```

Why:

- It uses `useState`.
- Users can click tabs and arrows to change the active industry.

State:

```tsx
const [activeIndex, setActiveIndex] = useState(0);
const activeIndustry = industries[activeIndex];
```

Industries:

- Industrial & Instruments
- Automotive Electronics
- Medical Devices
- Smart Home & Appliances
- Consumer Electronics

Explanation:

- The data array drives the tabs and content.
- The active index controls image, title, description, and counter.
- This keeps all industry UI consistent.

## 13. Build The Logo Marquee

Create:

```text
src/components/landing/LogoTicker.tsx
src/constants/logos.tsx
```

Purpose:

- Show a `Trusted by Industry Leaders` section.
- Render a lightweight infinite scrolling logo ticker.
- Avoid heavy animation libraries.

How it works:

- `LogoTicker.tsx` renders two repeated logo rows.
- `globals.css` defines `logo-marquee`.
- The track moves left by `-50%`.
- Hover pauses the animation.

Explanation:

- Duplicating the row makes the marquee seamless.
- Logos are data-driven in `constants/logos.tsx`.
- SVGs use `currentColor`, so Tailwind can control their color.

## 14. Build The Contact CTA

Create `src/components/landing/ContactCTA.tsx`.

Purpose:

- Give visitors a strong conversion action before the footer.
- Link directly to sales email.

Key content:

- Heading: `Ready to Start Your Custom Display Project?`
- Subheading: quote within 24 hours, R&D team support
- Button: `Contact Our Engineers Today`
- Link: `mailto:contact@nelytech.com`

Explanation:

- This section has `id="contact"`.
- The navbar Contact link points to this section.
- The dark background creates contrast before the white footer.

## 15. Build The Footer

Create `src/components/layout/Footer.tsx`.

Footer columns:

1. Brand summary
2. China office address and phone numbers
3. Company links, email, catalogue QR placeholder
4. Product links

Grid:

```tsx
<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
```

Explanation:

- One column on mobile.
- Two columns on tablets.
- Four columns on desktop.
- Address, phone, and email icons are inline SVGs, so no icon dependency is needed.

## 16. Configure Remote Images

The current project uses remote images from Unsplash in Advantages and Industries.

In `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
```

Explanation:

- Next.js blocks unknown remote image hosts by default.
- This allowlist permits `images.unsplash.com`.
- The components still use `unoptimized` for those placeholders to avoid local optimizer timeouts.

## 17. Server And Client Components

Use server components by default.

Server components in this project:

- `Hero`
- `Advantages`
- `LogoTicker`
- `ContactCTA`
- `Footer`
- `MegaMenu`

Client components:

- `Navbar`
- `LanguageSwitcher`
- `IndustriesShowcase`

Explanation:

- Add `"use client"` only when a component needs state, events, or browser APIs.
- This keeps the app simpler and more performant.

## 18. Development Commands

Run the local server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Start a production build locally:

```bash
npm run build
npm run start
```

If port `3000` is busy:

```bash
npm run dev -- --port 3002
```

## 19. Recommended Build Order From Empty Folder

Follow this order:

1. Create the Next.js app.
2. Clean starter `page.tsx`.
3. Create folders: `components/layout`, `components/landing`, `constants`.
4. Set up `globals.css`.
5. Build `layout.tsx` with placeholder Navbar/Footer.
6. Build `page.tsx` section composition.
7. Build `Hero`.
8. Build `navigation.ts`.
9. Build `Navbar`.
10. Build `MegaMenu`.
11. Build `LanguageSwitcher`.
12. Build `Advantages`.
13. Build `IndustriesShowcase`.
14. Build `logos.tsx`.
15. Build `LogoTicker`.
16. Build `ContactCTA`.
17. Build `Footer`.
18. Configure remote image hosts in `next.config.ts`.
19. Run lint and build.
20. Open the browser and visually inspect desktop and mobile.

## 20. Mental Model

Think of the app like this:

```text
layout.tsx
  Navbar
  page.tsx
    Hero
    Advantages
    IndustriesShowcase
    LogoTicker
    ContactCTA
  Footer
```

Data flows like this:

```text
constants/navigation.ts -> Navbar -> MegaMenu
constants/logos.tsx -> LogoTicker
component-local arrays -> Advantages and IndustriesShowcase
```

Styling flows like this:

```text
globals.css -> global theme, base styles, marquee animation
Tailwind classes -> component-level layout and visual design
```

## 21. Quality Checklist

Before calling a page finished, check:

- `npm run lint` passes.
- `npm run build` passes.
- Desktop navigation works.
- Mobile drawer works.
- Products mega-menu opens and closes.
- Language switcher opens.
- CTA link uses the correct email.
- No horizontal overflow on mobile.
- Images load.
- Text remains readable over images.
- Footer collapses correctly on mobile.

## 22. Current Known Future Work

The current landing page is static and intentionally limited.

Future improvements can include:

- Real `/products` page.
- Real `/about-us` page.
- Real product detail routes.
- Real i18n routing.
- CMS or product database.
- Contact form backend.
- Proper client logo permissions and final brand assets.

Keep those out of the first static landing-page iteration unless the scope changes.
