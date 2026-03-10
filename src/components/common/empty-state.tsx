import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: React.ReactNode;
  compact?: boolean;
};

export function EmptyState({ title, description, icon: Icon, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`surface-muted flex flex-col items-center justify-center gap-4 text-center ${compact ? "p-6" : "p-10"}`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-[radial-gradient(circle_at_30%_20%,rgba(79,124,255,0.24),rgba(79,124,255,0.08))] text-[var(--blue)]">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-heading">{title}</h3>
        <p className="max-w-md text-sm text-muted">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

