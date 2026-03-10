import { CheckCircle2, KeyRound, ShieldCheck, SquareUserRound } from "lucide-react";

const items = [
  {
    icon: ShieldCheck,
    title: "Encrypted sessions",
    description: "Secure auth sessions and credential handling",
  },
  {
    icon: SquareUserRound,
    title: "Role permissions",
    description: "Admin, manager, and rep boundaries enforced server-side",
  },
  {
    icon: CheckCircle2,
    title: "Audit visibility",
    description: "Lead mutations and ownership changes are logged",
  },
  {
    icon: KeyRound,
    title: "Safe data handling",
    description: "Workspace isolation, validation, and response shaping",
  },
];

export function SecurityStrip() {
  return (
    <section className="surface-card p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--teal)]">Reliability and Security</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.title} className="surface-muted p-4">
            <item.icon className="h-5 w-5 text-[var(--teal)]" aria-hidden />
            <h3 className="mt-2 text-sm font-semibold text-heading">{item.title}</h3>
            <p className="mt-1 text-xs text-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

