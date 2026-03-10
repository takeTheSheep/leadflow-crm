import { CalendarClock, ChartNoAxesCombined, History, Network, ShieldCheck, Users2 } from "lucide-react";

const items = [
  {
    icon: Network,
    title: "Lead Tracking",
    description: "Capture, enrich, and prioritize every inbound opportunity in one structured workspace.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Pipeline Management",
    description: "Move deals through clear stages with value visibility, ownership, and risk indicators.",
  },
  {
    icon: History,
    title: "Activity History",
    description: "Every assignment, stage change, and note is recorded for complete operational context.",
  },
  {
    icon: CalendarClock,
    title: "Follow-up Scheduling",
    description: "Protect conversion momentum with due-task tracking and reminder-driven execution.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Analytics Visibility",
    description: "Get conversion funnel, source performance, and forecast clarity without spreadsheet churn.",
  },
  {
    icon: Users2,
    title: "Team Collaboration",
    description: "Role-aware permissions keep reps focused while managers and admins retain operational control.",
  },
];

export function FeatureGrid() {
  return (
    <section>
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--blue-deep)]">Product Highlights</p>
        <h2 className="mt-2 text-3xl font-semibold text-heading">Built for real sales workflows, not template dashboards</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className="surface-card p-5 transition hover:-translate-y-1">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--blue-soft)] text-[var(--blue-deep)]">
              <item.icon className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="text-lg font-semibold text-heading">{item.title}</h3>
            <p className="mt-2 text-sm text-body">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-4 surface-muted flex items-center gap-3 p-4 text-sm text-body">
        <ShieldCheck className="h-4 w-4 text-[var(--teal)]" aria-hidden />
        Encrypted sessions, role-based permissions, and auditable mutation logs are part of the baseline architecture.
      </div>
    </section>
  );
}

