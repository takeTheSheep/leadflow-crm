import { FeatureGrid } from "@/components/marketing/feature-grid";
import { FinalCta } from "@/components/marketing/final-cta";
import { HeroSection } from "@/components/marketing/hero-section";
import { InteractivePreview } from "@/components/marketing/interactive-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SecurityStrip } from "@/components/marketing/security-strip";
import { TestimonialStrip } from "@/components/marketing/testimonial-strip";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { WorkflowSection } from "@/components/marketing/workflow-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10">
        <HeroSection />
        <TrustStrip />
        <FeatureGrid />
        <InteractivePreview />
        <WorkflowSection />
        <SecurityStrip />
        <TestimonialStrip />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}

