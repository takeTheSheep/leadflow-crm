import { CalendarClock, ChartNoAxesCombined, History, Network, ShieldCheck, Users2 } from "lucide-react";

const items = [
  {
    icon: Network,
    title: "Lead Tracking",
    description: "Capture, enrich, and prioritize every inbound opportunity in one structured workspace.",
    mobileDescription: "Centralize every inbound opportunity before it slips through the cracks.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Pipeline Management",
    description: "Move deals through clear stages with value visibility, ownership, and risk indicators.",
    mobileDescription: "See deal stages, ownership, value, and risk in one clean pipeline view.",
  },
  {
    icon: History,
    title: "Activity History",
    description: "Every assignment, stage change, and note is recorded for complete operational context.",
    mobileDescription: "Keep every handoff, note, and stage change visible to the whole team.",
  },
  {
    icon: CalendarClock,
    title: "Follow-up Scheduling",
    description: "Protect conversion momentum with due-task tracking and reminder-driven execution.",
    mobileDescription: "Protect momentum with due-task reminders and follow-up discipline.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Analytics Visibility",
    description: "Get conversion funnel, source performance, and forecast clarity without spreadsheet churn.",
    mobileDescription: "Read conversion, source quality, and forecast trends without spreadsheet churn.",
  },
  {
    icon: Users2,
    title: "Team Collaboration",
    description: "Role-aware permissions keep reps focused while managers and admins retain operational control.",
    mobileDescription: "Keep reps focused while managers retain visibility, controls, and accountability.",
  },
];

export function FeatureGrid() {
  return (
    <>
      <section className="md:hidden">
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Core Benefits</p>
          <h2 className="mt-2 text-2xl font-semibold !text-white">Everything reps need to stay on the next best action.</h2>
          <p className="mt-2 max-w-[32ch] text-sm leading-6 text-slate-300">Each section answers one mobile question fast: what to track, what to do next, and how to keep the team aligned.</p>
        </div>

        <div className="grid gap-3">
          {items.map((item, index) => (
            <article key={item.title} className="rounded-[24px] border border-white/10 bg-[#0d1728] p-4 shadow-[0_22px_48px_-36px_rgba(0,0,0,0.8)]">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(79,124,255,0.24),rgba(79,124,255,0.12))] text-[var(--blue-soft)]">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                    <h3 className="text-base font-semibold !text-white">{item.title}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{item.mobileDescription}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-[24px] border border-emerald-500/18 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" aria-hidden />
          Encrypted sessions, role permissions, and auditable mutation logs are built into the baseline architecture.
        </div>
      </section>

      <section className="hidden md:block">
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
    </>
  );
}

