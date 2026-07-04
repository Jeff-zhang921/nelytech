import type { Metadata } from "next";

import { AboutUs } from "@/components/about/AboutUs";

export const metadata: Metadata = {
  title: "About Us | NELYTECH",
  description:
    "Learn about NELYTECH's LCD and LCM manufacturing capabilities, engineering quality control, lead times, and global footprint.",
};

export default function AboutPage() {
  return <AboutUs />;
}
