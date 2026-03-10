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
    <section className="grid gap-4 md:grid-cols-3">
      {quotes.map((item) => (
        <blockquote key={item.role} className="surface-card p-5">
          <p className="text-sm leading-6 text-body">&quot;{item.quote}&quot;</p>
          <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{item.role}</footer>
        </blockquote>
      ))}
    </section>
  );
}

