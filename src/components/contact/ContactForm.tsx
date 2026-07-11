"use client";

import type { ChangeEvent, FormEvent, KeyboardEvent, ReactNode } from "react";
import { Suspense, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Toaster, toast } from "sonner";

import { sendContactEmail } from "@/actions/sendEmail";
import { useI18n } from "@/context/I18nContext";
import { getProductDetailBySlug } from "@/data/productDetails";

const countryOptionKeys = [
  "unitedStates",
  "canada",
  "mexico",
  "brazil",
  "argentina",
  "chile",
  "colombia",
  "germany",
  "unitedKingdom",
  "france",
  "italy",
  "spain",
  "netherlands",
  "belgium",
  "switzerland",
  "austria",
  "sweden",
  "norway",
  "denmark",
  "finland",
  "poland",
  "czechRepublic",
  "hungary",
  "romania",
  "turkey",
  "unitedArabEmirates",
  "saudiArabia",
  "southAfrica",
  "china",
  "hongKong",
  "taiwan",
  "japan",
  "southKorea",
  "india",
  "singapore",
  "malaysia",
  "thailand",
  "vietnam",
  "indonesia",
  "philippines",
  "australia",
  "newZealand",
  "israel",
  "ireland",
  "portugal",
  "greece",
  "russia",
  "ukraine",
  "egypt",
  "morocco",
  "other",
] as const;

const productOptionKeys = [
  "generalInquiry",
  "customTnStnDisplay",
  "tftColorModule",
  "bespokePcbaSolution",
  "touchPanelIntegration",
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
    <Suspense fallback={<ContactFormContent variant={variant} productInterestFromUrl="" />}>
      <ContactFormWithSearchParams variant={variant} />
    </Suspense>
  );
}

function ContactFormWithSearchParams({ variant = "section" }: ContactFormProps) {
  const searchParams = useSearchParams();
  const productSlugFromUrl = searchParams.get("product")?.trim() ?? "";
  const productInterestFromUrl = productSlugFromUrl
    ? getProductDetailBySlug(productSlugFromUrl)?.name ?? productSlugFromUrl
    : "";

  return (
    <ContactFormContent
      key={productInterestFromUrl}
      variant={variant}
      productInterestFromUrl={productInterestFromUrl}
    />
  );
}

interface ContactFormContentProps extends ContactFormProps {
  productInterestFromUrl: string;
}

function ContactFormContent({
  variant = "section",
  productInterestFromUrl,
}: ContactFormContentProps) {
  const { t } = useI18n();
  const [isPending, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactFormState>(() => ({
    ...initialFormState,
    productInterest: productInterestFromUrl,
  }));
  const isEmbedded = variant === "embedded";
  const isProductInterestLocked = productInterestFromUrl.length > 0;
  const isSubmitDisabled = isPending || isSubmitting;
  const countryOptions = useMemo(
    () => countryOptionKeys.map((key) => t(`contactForm.countries.${key}`)),
    [t],
  );
  const productOptions = useMemo(
    () => productOptionKeys.map((key) => t(`contactForm.productOptions.${key}`)),
    [t],
  );

  function updateField<Field extends keyof ContactFormState>(
    field: Field,
    value: ContactFormState[Field],
  ) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submissionData = new FormData(event.currentTarget);

    setIsSubmitting(true);

    startTransition(() => {
      void (async () => {
        try {
          const result = await sendContactEmail(submissionData);

          if ("error" in result) {
            toast.error(result.error);
            return;
          }

          toast.success("Inquiry sent successfully. Our engineering team will follow up shortly.");
          setFormData({
            ...initialFormState,
            productInterest: productInterestFromUrl,
          });
        } finally {
          setIsSubmitting(false);
        }
      })();
    });
  }

  const content = (
    <div className={isEmbedded ? "" : "mx-auto max-w-5xl"}>
      <Toaster position="top-center" />
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-[0.16em] text-blue-700 uppercase">
          {t("contactForm.eyebrow")}
        </p>
        <h2
          id="contact-form-title"
          className="mt-3 text-3xl font-semibold tracking-normal text-slate-950"
        >
          {t("contactForm.title")}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          {t("contactForm.subtitle")}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2"
      >
        <FormField label={t("contactForm.fields.name.label")} htmlFor="contact-name" required>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={inputClassName}
            placeholder={t("contactForm.fields.name.placeholder")}
          />
        </FormField>

        <FormField
          label={t("contactForm.fields.workEmail.label")}
          htmlFor="contact-work-email"
          required
        >
          <input
            id="contact-work-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.workEmail}
            onChange={(event) => updateField("workEmail", event.target.value)}
            className={inputClassName}
            placeholder={t("contactForm.fields.workEmail.placeholder")}
          />
        </FormField>

        <FormField label={t("contactForm.fields.company.label")} htmlFor="contact-company">
          <input
            id="contact-company"
            name="company"
            type="text"
            autoComplete="organization"
            value={formData.company}
            onChange={(event) => updateField("company", event.target.value)}
            className={inputClassName}
            placeholder={t("contactForm.fields.company.placeholder")}
          />
        </FormField>

        <SearchableDropdown
          id="contact-country-region"
          name="country"
          label={t("contactForm.fields.countryRegion.label")}
          value={formData.countryRegion}
          options={countryOptions}
          placeholder={t("contactForm.fields.countryRegion.placeholder")}
          noMatchesLabel={t("contactForm.noMatches")}
          openOptionsLabel={t("contactForm.openOptions")}
          onChange={(value) => updateField("countryRegion", value)}
        />

        {isProductInterestLocked ? (
          <FormField
            label={t("contactForm.fields.productInterest.label")}
            htmlFor="contact-product-interest"
            className="md:col-span-2"
          >
            <div className="relative">
              <input
                id="contact-product-interest"
                name="interest"
                type="text"
                readOnly
                value={productInterestFromUrl}
                className={`${lockedInputClassName} pr-12`}
                aria-describedby="contact-product-interest-note"
              />
              <span className="absolute inset-y-0 right-4 flex items-center text-blue-700">
                <LockIcon />
              </span>
            </div>
            <p id="contact-product-interest-note" className="mt-2 text-xs text-slate-500">
              {t("contactForm.lockedNote")}
            </p>
          </FormField>
        ) : (
          <SearchableDropdown
            id="contact-product-interest"
            name="interest"
            label={t("contactForm.fields.productInterest.label")}
            value={formData.productInterest}
            options={productOptions}
            placeholder={t("contactForm.fields.productInterest.placeholder")}
            noMatchesLabel={t("contactForm.noMatches")}
            openOptionsLabel={t("contactForm.openOptions")}
            onChange={(value) => updateField("productInterest", value)}
            className="md:col-span-2"
          />
        )}

        <FormField
          label={t("contactForm.fields.message.label")}
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
            placeholder={t("contactForm.fields.message.placeholder")}
          />
        </FormField>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={[
              "inline-flex h-14 w-full items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-semibold text-white transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:w-auto",
              isSubmitDisabled
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20",
            ].join(" ")}
          >
            {isSubmitDisabled ? "Sending..." : t("contactForm.submit")}
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
  noMatchesLabel: string;
  openOptionsLabel: string;
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
  noMatchesLabel,
  openOptionsLabel,
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
          aria-label={openOptionsLabel}
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
              <div className="px-4 py-3 text-sm text-slate-500">{noMatchesLabel}</div>
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
