const stats = [
  { label: "Teams onboarded", value: "240+" },
  { label: "Faster lead response", value: "32%" },
  { label: "Higher conversion", value: "18%" },
  { label: "Pipeline visibility", value: "99.2%" },
];

export function TrustStrip() {
  return (
    <section className="surface-card p-5 md:p-6">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted">Trusted by growth teams and service operators</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="surface-muted p-3 text-center">
            <p className="text-xl font-semibold text-heading">{stat.value}</p>
            <p className="mt-1 text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

