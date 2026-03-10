type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <div className="surface-muted p-4 transition hover:-translate-y-0.5 hover:shadow-[0_20px_34px_-28px_rgba(34,56,100,0.5)]">
      <p className="field-label">{label}</p>
      <p className="mt-2 text-xl font-semibold text-heading">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

