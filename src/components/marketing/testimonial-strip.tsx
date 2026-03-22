const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP Sales, Meridian Tech",
    quote: "LeadFlow cut our deal cycle by 40%. The pipeline view alone is worth the switch from our old CRM.",
    initials: "SC",
  },
  {
    name: "Marco Rossi",
    role: "Founder, NovaBridge",
    quote: "Finally a CRM that does not feel like spreadsheets. My team actually enjoys using it.",
    initials: "MR",
  },
  {
    name: "Aisha Patel",
    role: "Head of Revenue, Clarkson & Co",
    quote: "The analytics dashboard gave us insights we were missing for months. We closed 28% more deals in Q1.",
    initials: "AP",
  },
];

export function TestimonialStrip() {
  return (
    <section id="testimonials" className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-heading md:text-4xl">Trusted by high-performing teams</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {testimonials.map((testimonial) => (
            <blockquote key={testimonial.name} className="surface-card flex h-full flex-col p-6 md:p-8">
              <p className="mb-6 flex-1 text-sm leading-relaxed text-body">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--blue)]/10 text-sm font-semibold text-[var(--blue)]">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-heading">{testimonial.name}</div>
                  <div className="text-xs text-muted">{testimonial.role}</div>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
