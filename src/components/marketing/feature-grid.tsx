import { BarChart3, Bell, Filter, Kanban, Shield, Users } from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Visual Pipeline",
    description: "Drag-and-drop kanban boards to track every deal stage at a glance.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Conversion funnels, source performance, and forecast metrics live.",
  },
  {
    icon: Filter,
    title: "Smart Filtering",
    description: "Search, sort, and filter leads by any field with saved views.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign ownership, track activity, and manage roles with precision.",
  },
  {
    icon: Bell,
    title: "Activity Audit Trail",
    description: "Every action logged for full accountability across your team.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based access, rate limiting, and encrypted credentials.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-heading md:text-4xl">Everything your sales team needs</h2>
          <p className="mt-4 text-base text-muted md:text-lg">
            From lead capture to closed deal, a complete toolbox built for speed and clarity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="surface-card h-full p-6 md:p-8">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--blue)]/10 text-[var(--blue)]">
                <feature.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-heading">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
