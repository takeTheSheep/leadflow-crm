const workflow = ["Capture", "Qualify", "Assign", "Nurture", "Convert"];

export function WorkflowSection() {
  return (
    <section className="surface-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--teal)]">Workflow</p>
      <h2 className="mt-2 text-3xl font-semibold text-heading">One continuous flow from first touch to closed deal</h2>

      <ol className="mt-6 grid gap-3 md:grid-cols-5">
        {workflow.map((step, index) => (
          <li key={step} className="surface-muted p-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Step {index + 1}</p>
            <p className="mt-1 text-base font-semibold text-heading">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

