import type { Metadata } from "next";

import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact | NELYTECH",
  description:
    "Contact NELYTECH for custom LCD, LCM, PCBA, and display module engineering support.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
