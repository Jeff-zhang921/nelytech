"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type {
  ProductCategoryNavigationState,
  ProductCategoryPageConfig,
} from "@/data/productCatalogue";

import { ProductCategoryMenu } from "./ProductCategoryNavigation";

type CatalogueAssistanceAction =
  | {
      type: "category-menu";
      label: string;
      ariaLabel: string;
    }
  | {
      type: "link";
      label: string;
      href: string;
    };

type CatalogueAssistanceConfig = {
  title: string;
  description: string;
  primaryAction?: CatalogueAssistanceAction;
  secondaryAction: {
    label: string;
    href: string;
  };
};

interface CatalogueAssistancePanelProps {
  config: ProductCategoryPageConfig;
  navigation: ProductCategoryNavigationState;
}

export function CatalogueAssistancePanel({
  config,
  navigation,
}: CatalogueAssistancePanelProps) {
  const assistance = createCatalogueAssistanceConfig(config, navigation);

  return (
    <aside
      aria-labelledby="catalogue-assistance-heading"
      data-testid="catalogue-assistance-panel"
      className="w-full rounded-2xl border border-slate-200/60 bg-white/80 p-6 backdrop-blur-xl lg:max-w-sm"
    >
      <p
        id="catalogue-assistance-heading"
        className="text-sm font-medium text-slate-950"
      >
        {assistance.title}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">
        {assistance.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {assistance.primaryAction ? (
          assistance.primaryAction.type === "category-menu" ? (
            <ProductCategoryMenu
              label={assistance.primaryAction.label}
              ariaLabel={assistance.primaryAction.ariaLabel}
              items={navigation.menuItems}
              variant="primary"
            />
          ) : (
            <CatalogueActionLink
              href={assistance.primaryAction.href}
              label={assistance.primaryAction.label}
              variant="primary"
            />
          )
        ) : null}

        <CatalogueActionLink
          href={assistance.secondaryAction.href}
          label={assistance.secondaryAction.label}
          variant="secondary"
        />
      </div>
    </aside>
  );
}

function CatalogueActionLink({
  href,
  label,
  variant,
}: {
  href: string;
  label: string;
  variant: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={[
        "group inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition duration-200 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none",
        variant === "primary"
          ? "bg-slate-950 text-white hover:bg-slate-800"
          : "border border-slate-200/70 bg-white/70 text-slate-600 hover:border-slate-300 hover:text-slate-950",
      ].join(" ")}
    >
      <span>{label}</span>
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

function createCatalogueAssistanceConfig(
  config: ProductCategoryPageConfig,
  navigation: ProductCategoryNavigationState,
): CatalogueAssistanceConfig {
  const hasCategoryMenu = navigation.menuItems.length > 0;
  const categoryName = config.shortName ?? config.name;

  if (config.slug === "all") {
    return {
      title: "Find the right display",
      description:
        "Browse the full product range by category, application, and interface, or ask our team for guidance.",
      primaryAction: hasCategoryMenu
        ? {
            type: "category-menu",
            label: "Browse categories",
            ariaLabel: "Browse product categories",
          }
        : undefined,
      secondaryAction: {
        label: "Contact our team",
        href: "/contact",
      },
    };
  }

  if (hasCategoryMenu) {
    return {
      title: "Find the right display",
      description:
        config.slug === "lcd-panels"
          ? "Compare LCD panel technologies by contrast, viewing needs, and application requirements."
          : `Explore ${categoryName} options by category, application, and interface requirements.`,
      primaryAction: {
        type: "category-menu",
        label: "Browse subcategories",
        ariaLabel: `Browse ${categoryName} subcategories`,
      },
      secondaryAction: {
        label: "Contact our team",
        href: "/contact",
      },
    };
  }

  if (config.slug === "tn") {
    return {
      title: "Need help choosing a TN display?",
      description:
        "Share your target display content, viewing direction, and interface needs so we can suggest the right TN format.",
      primaryAction: navigation.backItem
        ? {
            type: "link",
            label: `Browse ${navigation.backItem.shortName ?? navigation.backItem.name}`,
            href: navigation.backItem.route,
          }
        : undefined,
      secondaryAction: {
        label: "Contact our team",
        href: "/contact",
      },
    };
  }

  return {
    title: `Need help with ${categoryName}?`,
    description:
      "Review related catalogue categories or contact our team for help matching this display option to your application.",
    primaryAction: navigation.backItem
      ? {
          type: "link",
          label: `Browse ${navigation.backItem.shortName ?? navigation.backItem.name}`,
          href: navigation.backItem.route,
        }
      : {
          type: "link",
          label: "View all products",
          href: "/products",
        },
    secondaryAction: {
      label: "Contact our team",
      href: "/contact",
    },
  };
}
