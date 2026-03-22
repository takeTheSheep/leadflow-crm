import { format, formatDistanceToNow } from "date-fns";
import { requireAuthSession } from "@/lib/auth";
import { RedesignDashboard } from "@/components/dashboard/redesign-dashboard";
import { getDashboardData } from "@/server/queries/dashboard-queries";

function parseRangeDays(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return 7;
  }

  const parsed = Number(value);
  if (parsed === 7 || parsed === 30 || parsed === 90) {
    return parsed;
  }

  return 7;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rangeDays = parseRangeDays(params.rangeDays);
  const [session, data] = await Promise.all([requireAuthSession(), getDashboardData({ rangeDays })]);

  const totalLeadsMetric = data.metrics.find((metric) => metric.label === "Total Leads");
  const revenueMetric = data.metrics.find((metric) => metric.label === "Revenue Potential");
  const conversionMetric = data.metrics.find((metric) => metric.label === "Conversion Rate");
  const averageCloseDays = data.stageVelocity.length
    ? Number((data.stageVelocity.reduce((sum, item) => sum + item.days, 0) / data.stageVelocity.length).toFixed(1))
    : 0;

  const kpis = [
    {
      label: "Total Leads",
      value: totalLeadsMetric?.value ?? "0",
      change: `${(totalLeadsMetric?.trend ?? 0) >= 0 ? "+" : ""}${totalLeadsMetric?.trend ?? 0}%`,
      up: (totalLeadsMetric?.trend ?? 0) >= 0,
      icon: "users" as const,
    },
    {
      label: "Revenue",
      value: revenueMetric?.value ?? `$${data.forecast.committed.toLocaleString()}`,
      change: `${(revenueMetric?.trend ?? 0) >= 0 ? "+" : ""}${revenueMetric?.trend ?? 0}%`,
      up: (revenueMetric?.trend ?? 0) >= 0,
      icon: "dollar" as const,
    },
    {
      label: "Conversion Rate",
      value: `${conversionMetric?.rawValue?.toFixed(1) ?? "0.0"}%`,
      change: `${(conversionMetric?.rawValue ?? 0) >= 25 ? "+" : "-"}${Math.abs((conversionMetric?.rawValue ?? 0) - 25).toFixed(1)}%`,
      up: (conversionMetric?.rawValue ?? 0) >= 25,
      icon: "target" as const,
    },
    {
      label: "Avg. Close Time",
      value: `${averageCloseDays.toFixed(1)} days`,
      change: `${averageCloseDays <= 18 ? "-" : "+"}${Math.abs(averageCloseDays - 18).toFixed(1)} days`,
      up: averageCloseDays <= 18,
      icon: "clock" as const,
    },
  ];

  const conversionRate = Math.max(0, conversionMetric?.rawValue ?? 0) / 100;
  const leadVolumeTail = data.leadVolume.slice(-6);
  const chartData = leadVolumeTail.map((point, index) => ({
    month: format(new Date(point.date), rangeDays <= 14 ? "MMM d" : "MMM"),
    leads: point.leads,
    closed: Math.max(0, Math.round(point.leads * (conversionRate * (0.88 + index * 0.04)))),
  }));

  const sourceData = [...data.conversionBySource]
    .sort((left, right) => right.total - left.total)
    .slice(0, 5)
    .map((source) => ({
      name: source.source,
      value: source.total,
    }));

  const activities = data.recentActivities.slice(0, 5).map((activity) => ({
    id: activity.id,
    user: activity.actor.name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join(""),
    name: activity.actor.name,
    action: activity.message,
    time: formatDistanceToNow(activity.createdAt, { addSuffix: true }),
  }));

  return (
    <RedesignDashboard
      userFirstName={(session.user.name ?? "Jane").split(/\s+/)[0]}
      kpis={kpis}
      chartData={chartData}
      sourceData={sourceData}
      activities={activities}
    />
  );
}
