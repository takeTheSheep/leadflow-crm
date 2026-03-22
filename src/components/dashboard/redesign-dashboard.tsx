"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, DollarSign, Target, TrendingDown, TrendingUp, Users } from "lucide-react";
import { MeasuredChart } from "@/components/charts/measured-chart";
import { ScrollReveal } from "@/components/common/scroll-reveal";

type DashboardKpi = {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: "users" | "dollar" | "target" | "clock";
};

type DashboardTrendPoint = {
  month: string;
  leads: number;
  closed: number;
};

type DashboardSourcePoint = {
  name: string;
  value: number;
};

type DashboardActivity = {
  id: string;
  user: string;
  name: string;
  action: string;
  time: string;
};

type RedesignDashboardProps = {
  userFirstName: string;
  kpis: DashboardKpi[];
  chartData: DashboardTrendPoint[];
  sourceData: DashboardSourcePoint[];
  activities: DashboardActivity[];
};

const iconMap = {
  users: Users,
  dollar: DollarSign,
  target: Target,
  clock: Clock,
} as const;

const tooltipBoxStyle = {
  border: "1px solid rgba(226, 232, 240, 0.96)",
  borderRadius: "14px",
  boxShadow: "0 18px 40px -28px rgba(15, 23, 42, 0.35)",
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  padding: "10px 12px",
};

function DashboardTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div style={tooltipBoxStyle}>
      <p className="text-xs font-semibold text-heading">{label}</p>
      <div className="mt-1 space-y-1">
        {payload.map((entry) => (
          <div key={`${entry.name}-${entry.value}`} className="flex items-center gap-2 text-xs text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color ?? "currentColor" }} />
            <span>{entry.name}: {entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RedesignDashboard({
  userFirstName,
  kpis,
  chartData,
  sourceData,
  activities,
}: RedesignDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-heading">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Welcome back, {userFirstName}. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = iconMap[kpi.icon];

          return (
            <ScrollReveal key={kpi.label} delay={index * 60}>
              <article className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)] md:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Icon className="h-[18px] w-[18px] text-muted" aria-hidden />
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${kpi.up ? "text-emerald-600" : "text-rose-500"}`}>
                    {kpi.up ? <TrendingUp className="h-3 w-3" aria-hidden /> : <TrendingDown className="h-3 w-3" aria-hidden />}
                    {kpi.change}
                  </span>
                </div>
                <div className="text-xl font-bold tracking-tight text-heading md:text-2xl">{kpi.value}</div>
                <div className="mt-1 text-xs text-muted">{kpi.label}</div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <ScrollReveal className="lg:col-span-3">
          <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
            <h3 className="mb-4 font-semibold text-heading">Lead Volume & Conversions</h3>
            <MeasuredChart className="h-64 min-w-0">
              {({ width, height }) => (
                <AreaChart width={width} height={height} data={chartData}>
                  <defs>
                    <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(172 50% 36%)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(172 50% 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.72)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#667085" }} stroke="#94A3B8" />
                  <YAxis tick={{ fontSize: 12, fill: "#667085" }} stroke="#94A3B8" />
                  <Tooltip content={<DashboardTooltip />} />
                  <Area type="monotone" dataKey="leads" stroke="hsl(172 50% 36%)" fill="url(#leadGrad)" strokeWidth={2} />
                  <Area
                    type="monotone"
                    dataKey="closed"
                    stroke="hsl(210 80% 52%)"
                    fill="transparent"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              )}
            </MeasuredChart>
          </section>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-2" delay={100}>
          <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
            <h3 className="mb-4 font-semibold text-heading">Lead Sources</h3>
            <MeasuredChart className="h-64 min-w-0">
              {({ width, height }) => (
                <BarChart width={width} height={height} data={sourceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.72)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "#667085" }} stroke="#94A3B8" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#667085" }} stroke="#94A3B8" width={78} />
                  <Tooltip content={<DashboardTooltip />} />
                  <Bar dataKey="value" fill="hsl(172 50% 36%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              )}
            </MeasuredChart>
          </section>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={150}>
        <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
          <h3 className="mb-4 font-semibold text-heading">Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--blue-soft)] text-xs font-semibold text-[var(--blue)]">
                  {activity.user}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-body">
                    <span className="font-medium text-heading">{activity.name}</span>{" "}
                    <span className="text-muted">{activity.action}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
