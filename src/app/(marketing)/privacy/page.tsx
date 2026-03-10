import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
        <article className="surface-card space-y-4 p-6 text-sm text-body">
          <h1 className="text-3xl font-semibold text-heading">Privacy</h1>
          <p>LeadFlow CRM processes workspace data for lead management workflows and product analytics.</p>
          <p>Data is scoped by workspace and access is constrained by authenticated role permissions.</p>
          <p>This demo project does not ship third-party tracking by default and avoids exposing secrets client-side.</p>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}

