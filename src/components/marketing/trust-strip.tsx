const stats = [
  { label: "Teams onboarded", value: "240+" },
  { label: "Faster lead response", value: "32%" },
  { label: "Higher conversion", value: "18%" },
  { label: "Pipeline visibility", value: "99.2%" },
];

export function TrustStrip() {
  return (
    <>
      <section className="rounded-[28px] border border-white/10 bg-[#0c1526] p-4 shadow-[0_26px_64px_-42px_rgba(0,0,0,0.85)] md:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Proof for fast-moving teams</p>
        <h2 className="mt-2 text-2xl font-semibold !text-white">Numbers that answer &quot;why switch?&quot; fast.</h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-3">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hidden surface-card p-5 md:block md:p-6">
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
    </>
  );
}

