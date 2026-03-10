import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6">
        <article className="surface-card space-y-4 p-6 text-sm text-body">
          <h1 className="text-3xl font-semibold text-heading">Terms</h1>
          <p>This repository is a portfolio-grade SaaS demo intended for educational and demonstration use.</p>
          <p>Production use requires infrastructure hardening, legal review, and compliance implementation.</p>
          <p>All sample data and company names are fictional and should not be treated as real customer data.</p>
        </article>
      </main>
      <MarketingFooter />
    </div>
  );
}

