import type { Metadata } from "next";

import { FullAdvantagesPageContent } from "@/components/advantages/FullAdvantagesPageContent";

export const metadata: Metadata = {
  title: "Advantages | NELYTECH",
  description:
    "Explore NELYTECH's core manufacturing advantages across LCD controller development, low tooling costs, multi-color TN/STN, low-power displays, and flexible PCBA.",
};

export default function AdvantagesPage() {
  return <FullAdvantagesPageContent />;
}
