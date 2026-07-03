import { Advantages } from "@/components/landing/Advantages";
import { ContactCTA } from "@/components/landing/ContactCTA";
import { Hero } from "@/components/landing/Hero";
import { IndustriesShowcase } from "@/components/landing/IndustriesShowcase";
import { LogoTicker } from "@/components/landing/LogoTicker";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main-content">
        <Advantages />
        <IndustriesShowcase />
        <LogoTicker />
        <ContactCTA />
      </main>
    </>
  );
}
