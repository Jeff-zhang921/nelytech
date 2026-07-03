"use client";

import { useState } from "react";

const languages = [
  { code: "EN", label: "English" },
  { code: "ZH", label: "中文 (Chinese)" },
] as const;

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const activeLanguage = languages[0];

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Select language"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition-colors hover:border-teal-600 hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 lg:text-base"
      >
        <GlobeIcon className="h-4 w-4" />
        <span>{activeLanguage.code}</span>
        <ChevronDownIcon className="h-3.5 w-3.5" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label="Language options"
          className="absolute right-0 top-full z-50 mt-3 w-44 rounded-md border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/10"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm font-medium text-slate-700 outline-none transition-colors hover:bg-slate-100 hover:text-slate-950 focus-visible:bg-slate-100 focus-visible:text-slate-950"
            >
              <span>{language.label}</span>
              {language.code === activeLanguage.code ? (
                <span className="text-xs font-semibold text-teal-700">{language.code}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface IconProps {
  className?: string;
}

function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.6 9h16.8M3.6 15h16.8M12 3c2.2 2.2 3.3 5.2 3.3 9S14.2 18.8 12 21M12 3C9.8 5.2 8.7 8.2 8.7 12s1.1 6.8 3.3 9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
