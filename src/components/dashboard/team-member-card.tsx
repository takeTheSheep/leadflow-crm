import { roleLabel } from "@/constants/ui";
import { OwnerAvatar } from "@/components/common/owner-avatar";

type TeamMemberCardProps = {
  name: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "SALES_REP";
  image?: string | null;
  activeLeads: number;
  conversionRate: number;
  responseSpeedHours: number;
  recentActivity: string;
  lastLoginAt?: Date | null;
};

export function TeamMemberCard({
  name,
  email,
  role,
  image,
  activeLeads,
  conversionRate,
  responseSpeedHours,
  recentActivity,
  lastLoginAt,
}: TeamMemberCardProps) {
  const sparkline = [
    Math.max(5, conversionRate * 0.5),
    Math.max(8, activeLeads * 1.8),
    Math.max(6, conversionRate * 0.8 + 4),
    Math.max(7, 24 - responseSpeedHours * 1.4),
    Math.max(10, conversionRate),
  ];
  const maxPoint = Math.max(...sparkline, 1);

  return (
    <article className="surface-card p-5 transition hover:-translate-y-0.5 hover:shadow-[0_20px_34px_-24px_rgba(34,56,100,0.45)]">
      <div className="flex items-start gap-3">
        <OwnerAvatar name={name} image={image} className="h-11 w-11" />
        <div className="flex-1">
          <p className="font-semibold text-heading">{name}</p>
          <p className="text-xs text-muted">{email}</p>
          <span className="mt-2 inline-flex rounded-full bg-[var(--blue-soft)] px-2 py-1 text-xs font-medium text-[var(--blue-deep)]">
            {roleLabel[role]}
          </span>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-[var(--background-soft)] px-2 py-2">
          <dt className="text-[11px] text-muted">Active</dt>
          <dd className="text-sm font-semibold text-heading">{activeLeads}</dd>
        </div>
        <div className="rounded-xl bg-[var(--background-soft)] px-2 py-2">
          <dt className="text-[11px] text-muted">Conversion</dt>
          <dd className="text-sm font-semibold text-heading">{conversionRate}%</dd>
        </div>
        <div className="rounded-xl bg-[var(--background-soft)] px-2 py-2">
          <dt className="text-[11px] text-muted">Response</dt>
          <dd className="text-sm font-semibold text-heading">{responseSpeedHours}h</dd>
        </div>
      </dl>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-white p-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">Performance Trend</p>
          <span className="text-[11px] text-muted">30d</span>
        </div>
        <svg viewBox="0 0 120 36" className="h-10 w-full" role="img" aria-label={`${name} performance sparkline`}>
          <polyline
            fill="none"
            stroke="#4F7CFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={sparkline
              .map((point, index) => {
                const x = (index / (sparkline.length - 1)) * 116 + 2;
                const y = 32 - (point / maxPoint) * 26;
                return `${x},${y}`;
              })
              .join(" ")}
          />
        </svg>
      </div>

      <p className="mt-3 text-xs text-muted">{recentActivity}</p>
      <p className="mt-1 text-[11px] text-muted">Last login: {lastLoginAt ? new Date(lastLoginAt).toLocaleString() : "No session yet"}</p>
    </article>
  );
}

