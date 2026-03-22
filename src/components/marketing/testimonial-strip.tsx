const quotes = [
  {
    quote: "LeadFlow gave us operational visibility in week one. We cut response lag and cleaned up ownership immediately.",
    role: "Revenue Operations Manager",
  },
  {
    quote: "The activity timeline and follow-up controls are exactly what our service sales team needed.",
    role: "Sales Team Lead",
  },
  {
    quote: "Feels like a serious product, not a dashboard toy. The analytics are clear and actionable.",
    role: "Agency Founder",
  },
];

export function TestimonialStrip() {
  return (
    <>
      <section className="md:hidden">
        <div className="mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Customer Signal</p>
          <h2 className="mt-2 text-2xl font-semibold !text-white">Operational value that shows up quickly.</h2>
        </div>

        <div className="grid gap-3">
          {quotes.map((item, index) => (
            <blockquote
              key={item.role}
              className="rounded-[28px] border border-white/10 bg-[#0d1728] p-5 shadow-[0_24px_54px_-40px_rgba(0,0,0,0.82)]"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-3 text-base leading-7 text-slate-100">&quot;{item.quote}&quot;</p>
              <footer className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{item.role}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="hidden gap-4 md:grid md:grid-cols-3">
        {quotes.map((item) => (
          <blockquote key={item.role} className="surface-card p-5">
            <p className="text-sm leading-6 text-body">&quot;{item.quote}&quot;</p>
            <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{item.role}</footer>
          </blockquote>
        ))}
      </section>
    </>
  );
}

