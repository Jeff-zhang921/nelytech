# NELYTECH Corporate Website

This repository contains the NELYTECH corporate website, built with the Next.js App Router. NELYTECH is a B2B manufacturing brand focused on LCD, LCM, PCBA, and custom display solutions. The current project is a static frontend site focused on brand presentation, product navigation, engineering capability storytelling, and contact inquiry conversion.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript 6
- Tailwind CSS 4
- ESLint

The project currently has no backend service, database, or i18n routing. It is primarily a static frontend website with client-side UI interactions.

## Pages

- `/`: Landing page with Hero, Advantages, Target Industries, Knowledge Hub, Deep Customization, trust logos, and bottom CTA sections.
- `/about`: Premium open-air About Us page with company introduction, engineering capability, quality control, lead times, and global footprint.
- `/products`: Product overview page for LCD panels, LCD modules, assembly technologies, and custom solutions.
- `/contact`: Contact page with direct office information and a large open-air inquiry form.

## Key Features

- Sticky top navigation
- Products Mega Menu with engineering line-art background
- Highlighted custom solutions column inside the Products dropdown
- Left-side Scroll Spy navigation on the landing page
- About page with fade-in background image and light readability overlay
- Contact form with:
  - Large open-air input fields
  - Searchable Country / Region dropdown
  - Searchable Product Interest dropdown
  - `/contact?product=...` product-interest prefill
  - `mailto:contact@nelytech.com` submission behavior
- Infinite logo marquee for trusted companies
- Global footer

## Project Structure

```text
src/
  app/
    about/page.tsx
    contact/page.tsx
    products/page.tsx
    page.tsx
    layout.tsx
    globals.css
  components/
    about/
      AboutUs.tsx
    contact/
      ContactForm.tsx
    landing/
      Advantages.tsx
      ContactCTA.tsx
      DeepCustomization.tsx
      Hero.tsx
      IndustriesShowcase.tsx
      KnowledgeHub.tsx
      LogoTicker.tsx
    layout/
      Footer.tsx
      LanguageSwitcher.tsx
      LeftSideNav.tsx
      MegaMenu.tsx
      Navbar.tsx
  constants/
    logos.tsx
    navigation.ts
```

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

Run lint checks:

```bash
npm run lint
```

## Development Notes

- Landing page sections used by the Scroll Spy need stable `id` values on their outer `<section>` wrappers. Keep `src/components/layout/LeftSideNav.tsx` in sync when adding or reordering sections.
- Mega Menu product data lives in `src/constants/navigation.ts`.
- Logo marquee data lives in `src/constants/logos.tsx`.
- Contact form dropdown and URL-prefill logic lives in `src/components/contact/ContactForm.tsx`.
- The About page background and content layers should stay separated so `backdrop-blur` never affects readable text.

## Current Scope

This project is the frontend prototype and static presentation layer for the NELYTECH website. Good next steps include:

- Product detail pages
- Solutions / case study pages
- Multilingual support
- CMS or backend data integration
- Form API and email service integration
