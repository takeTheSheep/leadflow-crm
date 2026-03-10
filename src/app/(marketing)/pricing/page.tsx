import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/common/button";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

const tiers = [
  {
    name: "Starter",
    price: "$39",
    description: "For early-stage teams centralizing lead operations.",
    features: ["Up to 3 seats", "Lead and pipeline workspace", "Basic analytics", "Activity feed"],
  },
  {
    name: "Growth",
    price: "$89",
    description: "For scaling sales teams and agencies.",
    features: ["Up to 12 seats", "Advanced analytics", "Role permissions", "Bulk actions + exports"],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    description: "For multi-team operations and larger pipelines.",
    features: ["Unlimited seats", "Security controls", "Audit exports", "Integration support"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--violet)]">Pricing</p>
          <h1 className="mt-2 text-4xl font-semibold text-heading">Simple plans for modern lead teams</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-body">Transparent packaging with room to scale your workflow and security requirements.</p>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.name} className={`surface-card p-6 ${tier.highlighted ? "ring-2 ring-[var(--blue)]/30" : ""}`}>
              <h2 className="text-2xl font-semibold text-heading">{tier.name}</h2>
              <p className="mt-1 text-sm text-muted">{tier.description}</p>
              <p className="mt-4 text-3xl font-semibold text-heading">{tier.price}<span className="text-sm text-muted">/mo</span></p>

              <ul className="mt-5 space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-body">
                    <Check className="h-4 w-4 text-[var(--teal)]" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="/register" className="mt-6 block">
                <Button className="w-full" variant={tier.highlighted ? "primary" : "secondary"}>
                  Start Demo
                </Button>
              </Link>
            </article>
          ))}
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

