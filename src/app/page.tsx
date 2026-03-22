import { FeatureGrid } from "@/components/marketing/feature-grid";
import { FinalCta } from "@/components/marketing/final-cta";
import { HeroSection } from "@/components/marketing/hero-section";
import { InteractivePreview } from "@/components/marketing/interactive-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MobileStickyCta } from "@/components/marketing/mobile-sticky-cta";
import { SecurityStrip } from "@/components/marketing/security-strip";
import { TestimonialStrip } from "@/components/marketing/testimonial-strip";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { WorkflowSection } from "@/components/marketing/workflow-section";

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[radial-gradient(circle_at_top,rgba(79,124,255,0.18),transparent_24%),linear-gradient(180deg,#08111f_0%,#050b14_100%)] text-slate-200 md:bg-none md:text-inherit">
      <MarketingHeader mobileTheme="dark" />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 overflow-x-clip px-4 pb-28 pt-6 md:gap-8 md:px-6 md:py-10">
        <HeroSection />
        <TrustStrip />
        <FeatureGrid />
        <InteractivePreview />
        <WorkflowSection />
        <SecurityStrip />
        <TestimonialStrip />
        <FinalCta />
      </main>
      <MarketingFooter mobileTheme="dark" />
      <MobileStickyCta />
    </div>
  );
}

