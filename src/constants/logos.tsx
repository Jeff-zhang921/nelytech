import type * as React from "react";

export type CompanyLogo = {
  id: string;
  name: string;
  svgString: React.ReactNode;
};

const logoClassName = "h-8 w-auto max-w-[160px]";

export const companyLogos = [
  {
    id: "siemens",
    name: "Siemens",
    svgString: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 190 36"
        className={logoClassName}
        fill="currentColor"
      >
        <text
          x="0"
          y="27"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="29"
          fontWeight="800"
          letterSpacing="1.4"
        >
          SIEMENS
        </text>
      </svg>
    ),
  },
  {
    id: "honeywell",
    name: "Honeywell",
    svgString: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 225 36"
        className={logoClassName}
        fill="currentColor"
      >
        <text
          x="0"
          y="27"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="28"
          fontWeight="800"
          letterSpacing="-0.6"
        >
          Honeywell
        </text>
      </svg>
    ),
  },
  {
    id: "abb",
    name: "ABB",
    svgString: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 124 36"
        className={logoClassName}
        fill="currentColor"
      >
        <text
          x="0"
          y="29"
          fontFamily="Arial Black, Arial, Helvetica, sans-serif"
          fontSize="34"
          fontWeight="900"
          letterSpacing="1.8"
        >
          ABB
        </text>
      </svg>
    ),
  },
  {
    id: "bosch",
    name: "Bosch",
    svgString: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 160 36"
        className={logoClassName}
        fill="currentColor"
      >
        <text
          x="0"
          y="27"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="29"
          fontWeight="800"
          letterSpacing="1.1"
        >
          BOSCH
        </text>
      </svg>
    ),
  },
  {
    id: "panasonic",
    name: "Panasonic",
    svgString: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 220 36"
        className={logoClassName}
        fill="currentColor"
      >
        <text
          x="0"
          y="27"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="30"
          fontWeight="800"
          letterSpacing="-0.8"
        >
          Panasonic
        </text>
      </svg>
    ),
  },
  {
    id: "continental",
    name: "Continental",
    svgString: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 230 36"
        className={logoClassName}
        fill="currentColor"
      >
        <text
          x="0"
          y="27"
          fontFamily="Georgia, Times New Roman, serif"
          fontSize="28"
          fontWeight="700"
          letterSpacing="-0.4"
        >
          Continental
        </text>
      </svg>
    ),
  },
  {
    id: "philips",
    name: "Philips",
    svgString: (
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 155 36"
        className={logoClassName}
        fill="currentColor"
      >
        <text
          x="0"
          y="27"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="30"
          fontWeight="800"
          letterSpacing="1.4"
        >
          PHILIPS
        </text>
      </svg>
    ),
  },
] as const satisfies readonly CompanyLogo[];
