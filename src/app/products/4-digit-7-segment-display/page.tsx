import type { Metadata } from "next";

import { ProductDetailPage } from "@/components/products/detail/ProductDetailPage";
import { fourDigitSevenSegmentDisplay } from "@/data/productDetails";

export const metadata: Metadata = {
  title: "4-Digit 7-Segment Display | Nelytech",
  description:
    "Example product detail page for a compact 4-digit seven-segment display for clocks, counters, meters, and embedded control panels.",
};

export default function FourDigitSevenSegmentDisplayPage() {
  return <ProductDetailPage product={fourDigitSevenSegmentDisplay} />;
}
