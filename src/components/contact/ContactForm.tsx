"use client";

import type { ChangeEvent, FormEvent, KeyboardEvent, ReactNode } from "react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

const countryOptions = [
  "United States",
  "Canada",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "Colombia",
  "Germany",
  "United Kingdom",
  "France",
  "Italy",
  "Spain",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Turkey",
  "United Arab Emirates",
  "Saudi Arabia",
  "South Africa",
  "China",
  "Hong Kong",
  "Taiwan",
  "Japan",
  "South Korea",
  "India",
  "Singapore",
  "Malaysia",
  "Thailand",
  "Vietnam",
  "Indonesia",
  "Philippines",
  "Australia",
  "New Zealand",
  "Israel",
  "Ireland",
  "Portugal",
  "Greece",
  "Russia",
  "Ukraine",
  "Egypt",
  "Morocco",
  "Other",
] as const;

const productOptions = [
  "General Inquiry",
  "Custom TN/STN Display",
  "TFT Color Module",
  "Bespoke PCBA Solution",
  "Touch Panel Integration",
] as const;

interface ContactFormState {
  name: string;
  workEmail: string;
  company: string;
  countryRegion: string;
  productInterest: string;
  message: string;
}

const initialFormState: ContactFormState = {
  name: "",
  workEmail: "",
  company: "",
  countryRegion: "",
  productInterest: "",
  message: "",
};

interface ContactFormProps {
  variant?: "section" | "embedded";
}

export function ContactForm({ variant = "section" }: ContactFormProps) {
  return (
    <Suspense fallback={<ContactFormContent variant={variant} productFromUrl="" />}>
      <ContactFormWithSearchParams variant={variant} />
    </Suspense>
  );
}

function ContactFormWithSearchParams({ variant = "section" }: ContactFormProps) {
  const searchParams = useSearchParams();
  const productFromUrl = searchParams.get("product")?.trim() ?? "";

  return <ContactFormContent variant={variant} productFromUrl={productFromUrl} />;
}

interface ContactFormContentProps extends ContactFormProps {
  productFromUrl: string;
}

function ContactFormContent({ variant = "section", productFromUrl }: ContactFormContentProps) {
  const [formData, setFormData] = useState<ContactFormState>(() => ({
    ...initialFormState,
    productInterest: productFromUrl,
  }));
  const isEmbedded = variant === "embedded";
  const isProductInterestLocked = productFromUrl.length > 0;
  const productInterestValue = isProductInterestLocked
    ? productFromUrl
    : formData.productInterest;

  function updateField<Field extends keyof ContactFormState>(
    field: Field,
    value: ContactFormState[Field],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const subject = `NELYTECH Inquiry - ${productInterestValue || "General Inquiry"}`;
    const bodyLines = [
      `Name: ${formData.name}`,
      `Work Email: ${formData.workEmail}`,
      formData.company ? `Company: ${formData.company}` : null,
      formData.countryRegion ? `Country / Region: ${formData.countryRegion}` : null,
      productInterestValue ? `Product Interest: ${productInterestValue}` : null,
      "",
      "Project Details:",
      formData.message,
    ].filter((line): line is string => line !== null);

    window.location.href = `mailto:contact@nelytech.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
  }

  const content = (
    <div className={isEmbedded ? "" : "mx-auto max-w-5xl"}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-[0.16em] text-blue-700 uppercase">Contact</p>
        <h2
          id="contact-form-title"
          className="mt-3 text-3xl font-semibold tracking-normal text-slate-950"
        >
          Tell us what you are building.
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Share the essentials and our engineering team will follow up through contact@nelytech.com.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2"
      >
        <FormField label="Name" htmlFor="contact-name" required>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={inputClassName}
            placeholder="Your name"
          />
        </FormField>

        <FormField label="Work Email" htmlFor="contact-work-email" required>
          <input
            id="contact-work-email"
            name="workEmail"
            type="email"
            autoComplete="email"
            required
            value={formData.workEmail}
            onChange={(event) => updateField("workEmail", event.target.value)}
            className={inputClassName}
            placeholder="name@company.com"
          />
        </FormField>

        <FormField label="Company" htmlFor="contact-company">
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            value={formData.company}
            onChange={(event) => updateField("company", event.target.value)}
            className={inputClassName}
            placeholder="Company name"
          />
        </FormField>

        <SearchableDropdown
          id="contact-country-region"
          name="countryRegion"
          label="Country / Region"
          value={formData.countryRegion}
          options={countryOptions}
          placeholder="Search country"
          onChange={(value) => updateField("countryRegion", value)}
        />

        {isProductInterestLocked ? (
          <FormField
            label="Product Interest"
            htmlFor="contact-product-interest"
            className="md:col-span-2"
          >
            <div className="relative">
              <input
                id="contact-product-interest"
                name="productInterest"
                type="text"
                readOnly
                value={productFromUrl}
                className={`${lockedInputClassName} pr-12`}
                aria-describedby="contact-product-interest-note"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-blue-700">
                <LockIcon />
              </span>
            </div>
            <p id="contact-product-interest-note" className="mt-2 text-xs text-slate-500">
              Captured from the product page.
            </p>
          </FormField>
        ) : (
          <SearchableDropdown
            id="contact-product-interest"
            name="productInterest"
            label="Product Interest"
            value={formData.productInterest}
            options={productOptions}
            placeholder="Search product interest"
            onChange={(value) => updateField("productInterest", value)}
            className="md:col-span-2"
          />
        )}

        <FormField
          label="Message"
          htmlFor="contact-message"
          className="md:col-span-2"
          required
        >
          <textarea
            id="contact-message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={(event) => updateField("message", event.target.value)}
            className={`${inputClassName} min-h-36 resize-y py-4`}
            placeholder="Display size, application, quantities, schedule, or technical requirements."
          />
        </FormField>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-semibold text-white transition duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:w-auto"
          >
            Send Inquiry
          </button>
        </div>
      </form>
    </div>
  );

  if (isEmbedded) {
    return <div aria-labelledby="contact-form-title">{content}</div>;
  }

  return (
    <section
      aria-labelledby="contact-form-title"
      className="bg-white px-6 py-12 sm:px-8 lg:px-12"
    >
      {content}
    </section>
  );
}

interface SearchableDropdownProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: readonly string[];
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}

function SearchableDropdown({
  id,
  name,
  label,
  value,
  options,
  placeholder,
  onChange,
  className = "",
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = useMemo(() => {
    const searchTerm = value.trim().toLowerCase();

    if (!searchTerm) {
      return options;
    }

    return options.filter((option) => option.toLowerCase().includes(searchTerm));
  }, [options, value]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
    setActiveIndex(0);
    setIsOpen(true);
  }

  function handleOptionSelect(option: string) {
    onChange(option);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      if (filteredOptions.length > 0) {
        setActiveIndex((current) => Math.min(current + 1, filteredOptions.length - 1));
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (filteredOptions.length > 0) {
        setActiveIndex((current) => Math.max(current - 1, 0));
      }
      return;
    }

    if (event.key === "Enter" && isOpen && filteredOptions[activeIndex]) {
      event.preventDefault();
      handleOptionSelect(filteredOptions[activeIndex]);
    }
  }

  const listboxId = `${id}-listbox`;

  return (
    <FormField label={label} htmlFor={id} className={className}>
      <div ref={wrapperRef} className="relative">
        <input
          id={id}
          name={name}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && filteredOptions[activeIndex] ? `${id}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          value={value}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`${inputClassName} pr-12`}
          placeholder={placeholder}
        />
        <button
          type="button"
          aria-label={`Open ${label} options`}
          onClick={() => setIsOpen((current) => !current)}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-slate-700 focus:outline-none"
        >
          <ChevronIcon />
        </button>

        {isOpen ? (
          <div
            id={listboxId}
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 max-h-60 overflow-y-auto rounded-2xl bg-white py-2 shadow-xl ring-1 ring-slate-200"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  id={`${id}-option-${index}`}
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={value === option}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleOptionSelect(option)}
                  className={[
                    "block w-full px-4 py-3 text-left text-sm transition",
                    index === activeIndex || value === option
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-700 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500">No matches found</div>
            )}
          </div>
        ) : null}
      </div>
    </FormField>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

function FormField({ label, htmlFor, children, className = "", required = false }: FormFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required ? <span className="ml-1 text-blue-700">*</span> : null}
      </label>
      {children}
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="m5 7.5 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M6.5 8V6.4a3.5 3.5 0 0 1 7 0V8M5.5 8h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const inputClassName =
  "h-14 w-full rounded-xl border border-transparent bg-slate-100 px-4 text-base text-slate-950 transition-all placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600";

const lockedInputClassName =
  "h-14 w-full cursor-default rounded-xl border border-blue-100 bg-blue-50 px-4 text-base font-medium text-slate-950 outline-none ring-1 ring-blue-100";
