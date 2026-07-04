import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | NELYTECH",
  description:
    "Contact NELYTECH for custom LCD, LCM, PCBA, and display module engineering support.",
};

const phoneNumbers = ["86-755-29640281", "86-755-29640221", "86-755-29640231"] as const;

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-slate-50 px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
            Contact NELYTECH
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Whether you need a custom display solution or have a question about our products, our
            engineering team is ready to assist you.
          </p>
        </div>
      </section>

      <section className="px-6 py-12 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="rounded-2xl bg-slate-50 p-7 ring-1 ring-slate-200/70 lg:col-span-4">
            <p className="text-sm font-semibold tracking-[0.16em] text-blue-700 uppercase">
              Direct Contact
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
              Talk with our display engineering team.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Send requirements, drawings, target dimensions, interface details, or application
              notes. We will route your inquiry to the right engineering contact.
            </p>

            <div className="mt-8 space-y-7">
              <ContactInfoItem icon={<MailIcon />} title="Email">
                <a
                  href="mailto:contact@nelytech.com"
                  className="font-semibold text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-800"
                >
                  contact@nelytech.com
                </a>
              </ContactInfoItem>

              <ContactInfoItem icon={<MapPinIcon />} title="Shenzhen Office">
                <address className="not-italic">
                  Room 303, Building D, New Retail Digital Industrial Park, Nanchang, Xixiang,
                  Bao&apos;an, Shenzhen, China
                </address>
              </ContactInfoItem>

              <ContactInfoItem icon={<PhoneIcon />} title="Phones">
                <ul className="space-y-1">
                  {phoneNumbers.map((phoneNumber) => (
                    <li key={phoneNumber}>
                      <a
                        href={`tel:+${phoneNumber.replaceAll("-", "")}`}
                        className="transition-colors hover:text-blue-700"
                      >
                        {phoneNumber}
                      </a>
                    </li>
                  ))}
                </ul>
              </ContactInfoItem>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ContactForm variant="embedded" />
          </div>
        </div>
      </section>
    </main>
  );
}

interface ContactInfoItemProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

function ContactInfoItem({ icon, title, children }: ContactInfoItemProps) {
  return (
    <div className="flex gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-semibold tracking-[0.14em] text-slate-950 uppercase">
          {title}
        </h3>
        <div className="mt-2 text-sm leading-6 text-slate-600">{children}</div>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
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

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
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
