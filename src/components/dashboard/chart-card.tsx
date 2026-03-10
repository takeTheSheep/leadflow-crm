type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function ChartCard({ title, subtitle, children, action }: ChartCardProps) {
  return (
    <section className="surface-card group p-5 transition hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-36px_rgba(36,58,110,0.42)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-heading">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-muted">{subtitle}</p> : null}
        </div>
        {action ? <div className="opacity-90 transition group-hover:opacity-100">{action}</div> : null}
      </div>
      <div className="h-72 w-full">{children}</div>
    </section>
  );
}

