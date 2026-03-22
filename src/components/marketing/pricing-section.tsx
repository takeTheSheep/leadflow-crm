"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/common/button";
import { ScrollReveal } from "@/components/common/scroll-reveal";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    description: "For small teams getting started with CRM.",
    features: ["Up to 500 leads", "3 team members", "Basic analytics", "Pipeline board", "Email support"],
  },
  {
    name: "Professional",
    price: "$79",
    period: "/mo",
    description: "For growing teams that need more visibility and control.",
    features: ["Unlimited leads", "15 team members", "Advanced analytics", "Custom pipelines", "Activity audit trail", "API access"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For organizations with advanced security and integration needs.",
    features: ["Unlimited members", "Dedicated onboarding", "Custom integrations", "SSO and SAML", "SLA support"],
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-[var(--background-soft)] py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-heading md:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-base text-muted md:text-lg">
            No hidden fees. Cancel anytime. Every plan includes a 14-day free trial.
          </p>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {plans.map((plan, index) => (
            <ScrollReveal key={plan.name} delay={index * 100}>
              <article
                className={`relative flex h-full flex-col rounded-xl border bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.06),0_1px_2px_rgba(16,24,40,0.04)] md:p-8 ${
                  plan.highlighted ? "border-[var(--blue)] shadow-[0_16px_36px_-24px_rgba(42,141,124,0.38)]" : "border-[var(--border)]"
                }`}
              >
                {plan.highlighted ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--blue)] px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                ) : null}

                <h3 className="text-lg font-semibold text-heading">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted">{plan.description}</p>

                <div className="mb-6 mt-5">
                  <span className="text-4xl font-bold tracking-tight text-heading">{plan.price}</span>
                  <span className="text-sm text-muted">{plan.period}</span>
                </div>

                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-body">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--blue)]" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <Button variant={plan.highlighted ? "primary" : "secondary"} className="w-full">
                    {plan.highlighted ? "Start Free Trial" : "Choose Plan"}
                  </Button>
                </Link>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
