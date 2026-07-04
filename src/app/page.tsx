import { Advantages } from "@/components/landing/Advantages";
import { ContactCTA } from "@/components/landing/ContactCTA";
import { DeepCustomization } from "@/components/landing/DeepCustomization";
import { Hero } from "@/components/landing/Hero";
import { IndustriesShowcase } from "@/components/landing/IndustriesShowcase";
import { KnowledgeHub } from "@/components/landing/KnowledgeHub";
import { LogoTicker } from "@/components/landing/LogoTicker";
import { LeftSideNav } from "@/components/layout/LeftSideNav";

export default function Home() {
  return (
    <>
      <LeftSideNav />
      <Hero />
      <main id="main-content">
        <Advantages />
        <IndustriesShowcase />
        <KnowledgeHub />
        <DeepCustomization />
        <LogoTicker />
        <ContactCTA />
      </main>
    </>
  );
}
