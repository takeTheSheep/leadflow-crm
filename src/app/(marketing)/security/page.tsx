import { ShieldCheck, ShieldEllipsis, ShieldPlus } from "lucide-react";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

const controls = [
  {
    icon: ShieldCheck,
    title: "Application safeguards",
    points: [
      "Server-side Zod validation for all mutations",
      "Role-based authorization on every critical action",
      "Workspace-scoped data queries",
      "Safe error shaping with no secret leakage",
    ],
  },
  {
    icon: ShieldEllipsis,
    title: "Operational controls",
    points: [
      "Login and mutation rate limiting architecture",
      "Audit-friendly activity logging",
      "Soft delete for key entities",
      "Pagination and query constraints",
    ],
  },
  {
    icon: ShieldPlus,
    title: "Future hardening roadmap",
    points: [
      "2FA and anomaly detection",
      "Email verification and bot mitigation",
      "Webhook signature verification",
      "Alerting and observability integration",
    ],
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        <header className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--teal)]">Security</p>
          <h1 className="mt-2 text-4xl font-semibold text-heading">Security-aware by architecture, not afterthought</h1>
          <p className="mt-4 text-base text-body">
            LeadFlow CRM is designed with production-minded security patterns for auth, validation, isolation, and abuse resistance.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {controls.map((control) => (
            <article key={control.title} className="surface-card p-5">
              <control.icon className="h-5 w-5 text-[var(--teal)]" aria-hidden />
              <h2 className="mt-3 text-lg font-semibold text-heading">{control.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-body">
                {control.points.map((point) => (
                  <li key={point}>- {point}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

