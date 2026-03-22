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
    <>
      <section className="rounded-[28px] border border-white/10 bg-[#0c1526] p-4 shadow-[0_26px_60px_-42px_rgba(0,0,0,0.82)] md:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300/80">Security and Trust</p>
        <h2 className="mt-2 text-2xl font-semibold !text-white">Credibility without a heavy enterprise wall of text.</h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-[22px] border border-white/10 bg-white/[0.06] p-4">
              <item.icon className="h-5 w-5 text-emerald-300" aria-hidden />
              <h3 className="mt-3 text-sm font-semibold !text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hidden surface-card p-6 md:block">
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
    </>
  );
}

