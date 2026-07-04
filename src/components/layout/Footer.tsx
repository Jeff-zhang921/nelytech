import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

const companyLinks = [
  { label: "Browse Products", href: "/products" },
  { label: "Knowledge Center", href: "#knowledge-center" },
  { label: "About Us", href: "/#about-us" },
  { label: "Contact Us", href: "/contact" },
] as const satisfies readonly FooterLink[];

const productLinks = [
  { label: "LCD Panels", href: "/products#products-lcd-panels" },
  { label: "LCD Modules", href: "/products#products-lcd-modules" },
  { label: "Assembly Technologies", href: "/products#products-assembly" },
  { label: "Custom PCBA & MCU", href: "/products#products-custom-pcba-mcu-development" },
  { label: "Touch Panels", href: "/products#products-touch-panels" },
] as const satisfies readonly FooterLink[];

const phoneNumbers = ["86-755-29640281", "86-755-29640221", "86-755-29640231"] as const;

const qrCells =
  "1110111100100101011011101000111000101110101111000100101001111101011".split("");

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-6 py-14 text-slate-800 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <section aria-label="NELYTECH brand">
            <Link
              href="/"
              className="inline-flex rounded-sm text-xl font-semibold tracking-[0.28em] text-slate-950 uppercase outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
            >
              NELYTECH
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-slate-600">
              LCD and LCM solutions built around responsive engineering, flexible PCBA, and
              reliable display manufacturing support.
            </p>
          </section>

          <section aria-labelledby="footer-china-office">
            <h2
              id="footer-china-office"
              className="text-sm font-semibold tracking-[0.16em] text-slate-950 uppercase"
            >
              CHINA OFFICE
            </h2>
            <div className="mt-5 space-y-5 text-sm leading-6 text-slate-600">
              <div className="flex gap-3">
                <MapPinIcon className="mt-1 h-5 w-5 shrink-0 text-teal-700" />
                <address className="not-italic">
                  Room 303, Building D, New Retail Digital Industrial Park, Nanchang, Xixiang,
                  Bao&apos;an, Shenzhen, China
                </address>
              </div>
              <div className="flex gap-3">
                <PhoneIcon className="mt-1 h-5 w-5 shrink-0 text-teal-700" />
                <div>
                  <p className="font-semibold text-slate-950">Telephone</p>
                  <ul className="mt-2 space-y-1">
                    {phoneNumbers.map((phoneNumber) => (
                      <li key={phoneNumber}>
                        <a
                          href={`tel:+${phoneNumber.replaceAll("-", "")}`}
                          className="rounded-sm outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                        >
                          {phoneNumber}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="footer-company">
            <h2
              id="footer-company"
              className="text-sm font-semibold tracking-[0.16em] text-slate-950 uppercase"
            >
              COMPANY
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="rounded-sm outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <p className="text-sm font-semibold text-slate-950">Sales &amp; Inquiries:</p>
              <a
                href="mailto:contact@nelytech.com"
                className="mt-2 inline-flex items-center gap-2 rounded-sm text-sm font-semibold text-teal-700 underline underline-offset-4 outline-none transition-colors hover:text-teal-800 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
              >
                <MailIcon className="h-4 w-4" />
                contact@nelytech.com
              </a>
            </div>

            <div className="mt-7">
              <p className="text-sm font-semibold text-slate-950">Product Catalogue:</p>
              <QrPlaceholder />
            </div>
          </section>

          <section aria-labelledby="footer-products">
            <h2
              id="footer-products"
              className="text-sm font-semibold tracking-[0.16em] text-slate-950 uppercase"
            >
              PRODUCTS
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-600">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="rounded-sm outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>Copyright &copy; {new Date().getFullYear()} NELYTECH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function QrPlaceholder() {
  return (
    <div
      role="img"
      aria-label="Product catalogue QR code placeholder"
      className="mt-3 grid h-24 w-24 grid-cols-7 gap-1 rounded-md border border-slate-200 bg-white p-2 shadow-sm"
    >
      {qrCells.map((cell, index) => (
        <span
          key={`${cell}-${index}`}
          className={cell === "1" ? "rounded-[1px] bg-slate-950" : "rounded-[1px] bg-transparent"}
        />
      ))}
    </div>
  );
}

interface IconProps {
  className?: string;
}

function MapPinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M7.2 4.5 9.4 9l-2 1.4c1.2 2.5 3.1 4.4 5.6 5.6l1.5-2 4.5 2.2v3.2c0 1-0.8 1.8-1.8 1.8C9.2 21.2 2.8 14.8 2.8 6.8c0-1 0.8-1.8 1.8-1.8h2.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4.5 6.5h15v11h-15v-11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m5 7 7 5 7-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
