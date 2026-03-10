import Link from "next/link";
import { ArrowRight, BarChart3, CalendarClock, Network, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/common/button";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

const features = [
  {
    icon: Network,
    title: "Lead command center",
    description: "Searchable records, source visibility, scoring, and role-aware ownership controls.",
  },
  {
    icon: CalendarClock,
    title: "Follow-up discipline",
    description: "Task scheduling, due tracking, and team-level response accountability.",
  },
  {
    icon: BarChart3,
    title: "Conversion analytics",
    description: "Source analysis, stage velocity, funnel outcomes, and forecast monitoring.",
  },
  {
    icon: Users,
    title: "Team operations",
    description: "Role management, team performance cards, and collaboration history.",
  },
  {
    icon: ShieldCheck,
    title: "Security by default",
    description: "Server-side validation, access controls, activity logs, and workspace isolation.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <MarketingHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6">
        <header className="mb-8 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--blue-deep)]">Features</p>
          <h1 className="mt-2 text-4xl font-semibold text-heading">Everything your team needs to run modern lead operations</h1>
          <p className="mt-4 text-base text-body">
            LeadFlow CRM combines operational control with conversion insight in one premium workspace.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="surface-card p-5">
              <feature.icon className="h-5 w-5 text-[var(--blue-deep)]" aria-hidden />
              <h2 className="mt-3 text-lg font-semibold text-heading">{feature.title}</h2>
              <p className="mt-2 text-sm text-body">{feature.description}</p>
            </article>
          ))}
        </section>

        <section className="surface-card mt-8 flex flex-wrap items-center justify-between gap-3 p-6">
          <div>
            <p className="text-sm font-semibold text-heading">See LeadFlow CRM in action with seeded business data.</p>
            <p className="text-sm text-muted">Explore dashboard, leads, pipeline, analytics, and team workflows immediately.</p>
          </div>
          <Link href="/register">
            <Button>
              Launch Demo
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Button>
          </Link>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}

