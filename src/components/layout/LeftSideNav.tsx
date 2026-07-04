"use client";

import { useEffect, useState } from "react";

const SCROLL_SPY_ROOT_MARGIN = "-25% 0px -55% 0px";
const SCROLL_SPY_THRESHOLD = 0.15;
const FOCAL_ZONE_TOP_RATIO = 0.25;
const FOCAL_ZONE_BOTTOM_RATIO = 0.45;
const FOCAL_LINE_RATIO = 0.35;

const leftSideNavItems = [
  { id: "about-us", label: "Intro" },
  { id: "advantages", label: "Advantages" },
  { id: "industries", label: "Industries" },
  { id: "knowledge-hub", label: "Guide" },
  { id: "deep-customization", label: "Custom" },
  { id: "trusted", label: "Trusted" },
  { id: "contact", label: "Contact" },
] as const;

type LeftSideNavItem = (typeof leftSideNavItems)[number];
type SectionId = LeftSideNavItem["id"];

export function LeftSideNav() {
  const [activeSectionId, setActiveSectionId] = useScrollSpy();

  return (
    <nav
      aria-label="Landing page sections"
      className="fixed left-4 top-1/2 z-50 hidden -translate-y-1/2 lg:flex"
    >
      <ul className="flex flex-col items-start gap-4">
        {leftSideNavItems.map((item) => (
          <li key={item.id}>
            <SectionLink
              item={item}
              isActive={item.id === activeSectionId}
              onActivate={() => setActiveSectionId(item.id)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function useScrollSpy() {
  const [activeSectionId, setActiveSectionId] = useState<SectionId>(leftSideNavItems[0].id);

  useEffect(() => {
    const sectionElements = leftSideNavItems
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (sectionElements.length === 0) {
      return;
    }

    let animationFrameId: number | null = null;

    function updateActiveSection() {
      animationFrameId = null;
      const nextSectionId = getActiveSectionId(sectionElements);

      setActiveSectionId((currentSectionId) =>
        currentSectionId === nextSectionId ? currentSectionId : nextSectionId,
      );
    }

    function scheduleActiveSectionUpdate() {
      if (animationFrameId !== null) {
        return;
      }

      animationFrameId = window.requestAnimationFrame(updateActiveSection);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length > 0) {
          scheduleActiveSectionUpdate();
        }
      },
      {
        root: null,
        rootMargin: SCROLL_SPY_ROOT_MARGIN,
        threshold: SCROLL_SPY_THRESHOLD,
      },
    );

    sectionElements.forEach((element) => observer.observe(element));
    scheduleActiveSectionUpdate();

    window.addEventListener("scroll", scheduleActiveSectionUpdate, { passive: true });
    window.addEventListener("resize", scheduleActiveSectionUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleActiveSectionUpdate);
      window.removeEventListener("resize", scheduleActiveSectionUpdate);

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return [activeSectionId, setActiveSectionId] as const;
}

function getActiveSectionId(sectionElements: readonly HTMLElement[]): SectionId {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const focalZoneTop = viewportHeight * FOCAL_ZONE_TOP_RATIO;
  const focalZoneBottom = viewportHeight * FOCAL_ZONE_BOTTOM_RATIO;
  const focalLine = viewportHeight * FOCAL_LINE_RATIO;

  const measuredSections = sectionElements.map((element, index) => {
    const rect = element.getBoundingClientRect();

    return {
      id: element.id as SectionId,
      index,
      rect,
      intersectsFocalZone: rect.top <= focalZoneBottom && rect.bottom >= focalZoneTop,
      distanceFromFocalTop: Math.abs(rect.top - focalZoneTop),
      distanceFromFocalLine:
        rect.top <= focalLine && rect.bottom >= focalLine
          ? 0
          : Math.min(Math.abs(rect.top - focalLine), Math.abs(rect.bottom - focalLine)),
    };
  });

  const focalZoneCandidates = measuredSections.filter((section) => section.intersectsFocalZone);

  if (focalZoneCandidates.length > 0) {
    return focalZoneCandidates.reduce((bestSection, section) => {
      if (section.distanceFromFocalTop < bestSection.distanceFromFocalTop) {
        return section;
      }

      if (
        section.distanceFromFocalTop === bestSection.distanceFromFocalTop &&
        section.index > bestSection.index
      ) {
        return section;
      }

      return bestSection;
    }).id;
  }

  const visiblePassedSections = measuredSections.filter(
    (section) => section.rect.top <= focalLine && section.rect.bottom > 0,
  );

  if (visiblePassedSections.length > 0) {
    return visiblePassedSections[visiblePassedSections.length - 1].id;
  }

  return measuredSections.reduce((bestSection, section) =>
    section.distanceFromFocalLine < bestSection.distanceFromFocalLine ? section : bestSection,
  ).id;
}

interface SectionLinkProps {
  item: LeftSideNavItem;
  isActive: boolean;
  onActivate: () => void;
}

function SectionLink({ item, isActive, onActivate }: SectionLinkProps) {
  return (
    <a
      href={`#${item.id}`}
      aria-label={`Scroll to ${item.label}`}
      aria-current={isActive ? "location" : undefined}
      onClick={onActivate}
      className="group flex h-7 items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
    >
      <span
        aria-hidden="true"
        className={[
          "block rounded-full transition-all duration-200",
          isActive
            ? "h-3 w-3 bg-teal-500 opacity-100 shadow-lg shadow-teal-500/30"
            : "h-1.5 w-1.5 bg-slate-400 opacity-40 group-hover:h-2 group-hover:w-2 group-hover:bg-teal-500 group-hover:opacity-100",
        ].join(" ")}
      />
      <span
        className={[
          "pointer-events-none whitespace-nowrap rounded-sm border border-slate-200 bg-white/95 px-2 py-1 text-xs font-semibold text-slate-800 shadow-lg shadow-slate-900/10 transition-all duration-200",
          isActive
            ? "translate-x-0 opacity-100"
            : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
        ].join(" ")}
      >
        {item.label}
      </span>
    </a>
  );
}
