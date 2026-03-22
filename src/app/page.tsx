import { FeatureGrid } from "@/components/marketing/feature-grid";
import { FinalCta } from "@/components/marketing/final-cta";
import { HeroSection } from "@/components/marketing/hero-section";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PricingSection } from "@/components/marketing/pricing-section";
import { TestimonialStrip } from "@/components/marketing/testimonial-strip";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <MarketingHeader />
      <main>
        <HeroSection />
        <FeatureGrid />
        <TestimonialStrip />
        <PricingSection />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}

