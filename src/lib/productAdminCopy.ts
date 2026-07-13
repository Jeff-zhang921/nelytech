export const productAdminCopy = {
  shared: {
    livePreview: "Live Preview",
    unsavedChanges: "Unsaved changes",
    submitChanges: "Submit Changes",
    saving: "Submitting Changes...",
    discardDraft: "Discard Draft",
    resetPublished: "Reset to Published Data",
    reset: "Reset",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    done: "Done",
    edit: "Edit",
    delete: "Delete",
    loading: "Loading...",
    publishingEnabled: "Secure Git-based publishing enabled",
    englishHint:
      "Enter this content in English. It will appear directly on the public Product Catalogue.",
    optional: "optional",
  },
  status: {
    loadingDraft: "Loading Product Catalogue draft...",
    restored: "Local draft restored",
    publishedLoaded: "Published Product Catalogue loaded",
    unpublished: "The preview contains unsubmitted changes",
    saving: "Submitting changes to GitHub...",
    saved: "Changes committed to GitHub",
    detailSaved: "Product Detail changes committed to GitHub",
    saveFailed:
      "Changes could not be submitted. Your draft has been preserved. Please try again.",
    discarded: "Unsubmitted changes discarded",
    reset: "Published data restored",
  },
  navigation: {
    title: "You have unsaved changes",
    message:
      "Your latest Product Catalogue changes have not been submitted. Leaving the Product Panel Extension now will discard these changes.",
    stay: "Stay in the editor",
    leave: "Leave without saving",
    saveContinue: "Submit and leave",
    savingContinue: "Submitting changes...",
    choose: "Choose how to continue",
    detail:
      "Stay in the editor to keep the current draft, or leave without saving to restore the most recently submitted local draft.",
  },
  submission: {
    localDraftTitle: "Draft saved successfully",
    localDraftMessage:
      "Your draft has been saved locally. After the publishing integration is connected, public website updates may take approximately 2 minutes.",
    localDraftSupport:
      "You can continue editing while the future publishing workflow is being prepared.",
    publishingTitle: "Changes submitted successfully",
    publishingMessage:
      "Your Product Catalogue changes have been committed. The public website may take approximately 2 minutes to update completely.",
    publishingSupport: "You may continue editing while the new deployment is being processed.",
    continueEditing: "Continue Editing",
  },
  catalogue: {
    editor: "Product Catalogue Editor",
    description: "Manage product categories and preview unsubmitted catalogue changes.",
    editCatalogue: "Edit Catalogue",
    hierarchy: "Product Hierarchy",
    parentCategories: "parent categories",
    products: "products",
    product: "product",
    draft: "Draft",
    emptyCategory: "No subcategories have been added to this category.",
  },
  subcategory: {
    add: "Add Subcategory",
    edit: "Edit Subcategory",
    delete: "Delete Subcategory",
    manage: "Manage Subcategories",
    modalDescription: "Add or remove subcategories in the unpublished draft.",
    parent: "Parent category",
    name: "Subcategory name",
    slug: "Page slug",
    current: "Current subcategories",
    englishNameHint:
      "Enter the subcategory name in English. It will appear directly in the Product Catalogue.",
    slugHint: "The page slug is generated from the English name for use in catalogue URLs.",
    slugConflict: "This page slug is already used by another category.",
    deleteTitle: "Delete subcategory?",
    deleteConfirm: "Confirm subcategory deletion",
    deleteAcknowledge:
      "I understand that every product in this subcategory will also be removed from the current draft.",
  },
  product: {
    editProducts: "Edit Products",
    add: "Add Product",
    edit: "Edit Product",
    delete: "Delete Product",
    manage: "Manage Products",
    name: "Product name",
    shortDescription: "Short description",
    cover: "Product cover image",
    imageAlt: "Image alt text",
    replaceImage: "Replace image",
    removeImage: "Remove image",
    uploadImage: "Upload image",
    selectImage: "Select cover image",
    filterOptions: "Filter Options",
    filterDescription:
      "Select the options that describe this product. These selections control how customers can find it in the public Product Catalogue.",
    requiredFilters: "Select at least one option for this required filter group.",
    cardDescriptionHint: "Write one concise English sentence describing the product's main use.",
    manageDescription:
      "Edit product-card content or remove products from the unpublished draft. Select a card in Live Preview to edit its full Product Details.",
    addDescription:
      "Create a product card and select filter attributes used by the public Product Catalogue.",
    editDescription:
      "Update the product card without changing its separate Product Detail draft.",
    noProducts: "No products in this draft",
    noProductsDescription: "Add the first product card and select its catalogue filters.",
    results: "Product Results",
    available: "Available Products",
    backCatalogue: "Back to Product Catalogue Editor",
    loading: "Loading product draft...",
    notFound: "Subcategory not found",
    notFoundDescription: "This draft subcategory may have been removed.",
    deleteTitle: "Delete product?",
    deleteAction: "Delete Product",
  },
  filters: {
    title: "Filters",
    application: "Application",
    interface: "Interface or Connection",
    format: "Display Format",
    reset: "Reset",
    done: "Done",
    close: "Close filters",
    active: " active",
    selected: " selected",
    none: "No filters are available for this category.",
    search: "Search products",
    clearSearch: "Clear product search",
    clearAll: "Clear all",
    noMatches: "No matching products",
    noMatchesDescription:
      "Try another product name or use case, or remove some filter selections.",
    resetFilters: "Reset filters",
  },
  detail: {
    editor: "Product Detail Editor",
    allOptional: "All Product Detail fields are optional",
    loading: "Loading Product Detail draft...",
    notFound: "Product draft not found",
    backSubcategory: "Back to Subcategory",
    saveSection: "Save Section",
    summary: "Edit Product Summary",
    gallery: "Edit Gallery",
    information: "Edit Product Information",
    description: "Edit Description",
    applications: "Edit Applications",
    options: "Edit Available Options",
    downloads: "Edit Downloads",
    modalDescription:
      "These changes update only the local unpublished Product Detail draft. Every Product Detail field may be left blank.",
    productType: "Product type or series label",
    introduction: "Main introduction",
    suitable: "Suitable-for summary",
    quickRows: "Summary information rows",
    quickRowsHint: "Optional content displayed below the suitable-for section.",
    addInformation: "Add Information Row",
    informationLabel: "Information label",
    informationValue: "Information value",
    additionalExplanation: "Additional explanation",
    informationEmpty: "Add product information",
    informationEmptyHelp:
      "Add the technical or commercial information customers need when evaluating this product.",
    informationLabelHelp:
      "Enter the product characteristic shown on the left side of the row. Use English for the product content.",
    informationValueHelp:
      "Enter the product-specific value shown on the right side of the row. Use English.",
    additionalHelp:
      "Add a short clarification only when the value needs extra context, such as model variation, availability on request, or customisation. Use English.",
    addImages: "Add Images",
    galleryImages: "Gallery images",
    galleryHint: "All detail images are optional. Maximum file size: 1.5 MB each.",
    noImages: "No Product Detail images have been added.",
    primaryImage: "Set as primary image",
    replace: "Replace",
    imageLabel: "Thumbnail label",
    imageAlt: "Image alt text",
    addParagraph: "Add Paragraph",
    addApplication: "Add Application",
    addOptionGroup: "Add Option Group",
    addOptionValue: "Add Option Value",
    addDownload: "Add Download",
  },
  placeholders: {
    productType: "Add a concise product type or series label in English.",
    title: "Enter the complete product name in English.",
    introduction: "Add a concise English introduction explaining the product and its main use.",
    suitable: "Describe suitable applications or use cases in English.",
    mainImage: "Add the main product image.",
    gallery: "Add other views, details, drawings, or application images.",
    description: "Describe the product's function, features, benefits, and typical uses in English.",
    information: "Add technical or commercial information customers need for evaluation.",
    application: "Add an application in English.",
    options: "Add options such as colour, size, interface, brightness, or mounting method.",
    downloads: "Add datasheets, drawings, specifications, or other downloadable resources.",
  },
  validation: {
    englishOnly:
      "Product content supports English only. Please replace the non-English text before saving.",
    requiredCard: "Complete every required product-card field.",
    duplicateSlug: "This product page slug already exists.",
    imageType: "Select a JPG, PNG, or WebP image.",
    imageSize: "Select an image smaller than 1.5 MB.",
    imageRead: "The selected image could not be read.",
  },
} as const;

export type SubmissionMode = "local-draft" | "publishing";

export const productAdminSubmissionMode: SubmissionMode = "publishing";

export function getSubmissionSuccessCopy(mode: SubmissionMode) {
  return mode === "publishing"
    ? {
        title: productAdminCopy.submission.publishingTitle,
        message: productAdminCopy.submission.publishingMessage,
        support: productAdminCopy.submission.publishingSupport,
      }
    : {
        title: productAdminCopy.submission.localDraftTitle,
        message: productAdminCopy.submission.localDraftMessage,
        support: productAdminCopy.submission.localDraftSupport,
      };
}

const chineseCharacterPattern = /\p{Script=Han}/gu;

export function containsSubstantialChinese(value?: string) {
  if (!value) return false;
  return (value.match(chineseCharacterPattern)?.length ?? 0) >= 2;
}

export function englishContentError(value?: string) {
  return containsSubstantialChinese(value)
    ? productAdminCopy.validation.englishOnly
    : undefined;
}

export const englishContentHint = productAdminCopy.shared.englishHint;

export const adminFilterLabels = {
  application: productAdminCopy.filters.application,
  interface: productAdminCopy.filters.interface,
  format: productAdminCopy.filters.format,
} as const;

export function getAdminFilterOptionLabel(value: string) {
  return value;
}
