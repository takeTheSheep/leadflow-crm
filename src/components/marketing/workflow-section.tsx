const workflow = [
  {
    title: "Capture",
    description: "Bring every inbound lead into one structured record immediately.",
  },
  {
    title: "Qualify",
    description: "Score fit, source, urgency, and next action without switching tools.",
  },
  {
    title: "Assign",
    description: "Route ownership fast so no high-intent lead waits in limbo.",
  },
  {
    title: "Nurture",
    description: "Track every follow-up, reminder, and status change with context.",
  },
  {
    title: "Convert",
    description: "Move from demo to proposal with visibility on revenue and risk.",
  },
];

export function WorkflowSection() {
  return (
    <>
      <section className="rounded-[28px] border border-white/10 bg-[#0c1526] p-4 shadow-[0_26px_60px_-40px_rgba(0,0,0,0.82)] md:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">Workflow</p>
        <h2 className="mt-2 text-2xl font-semibold !text-white">A phone-friendly path from first touch to closed deal.</h2>

        <ol className="mt-5 grid gap-4">
          {workflow.map((step, index) => (
            <li key={step.title} className="relative pl-14">
              {index < workflow.length - 1 ? (
                <span className="absolute left-[1.1rem] top-11 h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-[var(--blue)]/70 to-transparent" aria-hidden />
              ) : null}
              <span className="absolute left-0 top-0 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--blue)] to-[var(--violet)] text-sm font-semibold text-white shadow-[0_16px_28px_-18px_rgba(79,124,255,0.9)]">
                {index + 1}
              </span>
              <div className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">Step {index + 1}</p>
                <h3 className="mt-1 text-base font-semibold !text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="hidden surface-card p-6 md:block">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--teal)]">Workflow</p>
        <h2 className="mt-2 text-3xl font-semibold text-heading">One continuous flow from first touch to closed deal</h2>

        <ol className="mt-6 grid gap-3 md:grid-cols-5">
          {workflow.map((step, index) => (
            <li key={step.title} className="surface-muted p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Step {index + 1}</p>
              <p className="mt-1 text-base font-semibold text-heading">{step.title}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

