import { LeadStage } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Target } from "lucide-react";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { ChartCard } from "@/components/dashboard/chart-card";
import { KPIStatCard } from "@/components/dashboard/kpi-stat-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { TaskCard } from "@/components/dashboard/task-card";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { LeadVolumeChart } from "@/components/charts/lead-volume-chart";
import { PipelineDistributionChart } from "@/components/charts/pipeline-distribution-chart";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { SourceConversionChart } from "@/components/charts/source-conversion-chart";
import { getDashboardData } from "@/server/queries/dashboard-queries";
import { Button } from "@/components/common/button";
import { stageLabels } from "@/constants/navigation";

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

const stageOrder: LeadStage[] = [
  LeadStage.NEW,
  LeadStage.CONTACTED,
  LeadStage.QUALIFIED,
  LeadStage.PROPOSAL_SENT,
  LeadStage.NEGOTIATION,
  LeadStage.WON,
  LeadStage.LOST,
];

const winProbabilityByStage: Record<LeadStage, number> = {
  [LeadStage.NEW]: 10,
  [LeadStage.CONTACTED]: 20,
  [LeadStage.QUALIFIED]: 40,
  [LeadStage.PROPOSAL_SENT]: 55,
  [LeadStage.NEGOTIATION]: 70,
  [LeadStage.WON]: 100,
  [LeadStage.LOST]: 0,
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const rangeDays = parseRangeDays(params.rangeDays);
  const data = await getDashboardData({ rangeDays });
  const now = new Date();
  const lastUpdatedLabel = formatDistanceToNow(now, { addSuffix: true });
  const overdueTasks = data.upcomingTasks.filter((task) => new Date(task.dueDate) < now).length;
  const dueTodayTasks = data.upcomingTasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return dueDate.toDateString() === now.toDateString();
  }).length;

  const pipelineHealth = stageOrder.map((stage, index) => {
    const row = data.pipelineDistribution.find((item) => item.stage === stage);
    const previousRow = index > 0 ? data.pipelineDistribution.find((item) => item.stage === stageOrder[index - 1]) : null;
    const count = row?.count ?? 0;
    const value = row?.value ?? 0;
    const conversionFromPrevious =
      index === 0 ? null : (previousRow?.count ?? 0) > 0 ? Number(((count / (previousRow?.count ?? 1)) * 100).toFixed(1)) : 0;

    return {
      stage,
      count,
      value,
      conversionFromPrevious,
    };
  });

  const forecastSeries = pipelineHealth
    .filter((item) => item.value > 0 || item.count > 0)
    .map((item) => ({
      stage: stageLabels[item.stage],
      weighted: Math.round(item.value * (winProbabilityByStage[item.stage] / 100)),
      open: Math.round(item.value),
    }));

  return (
    <div>
      <PageHeader
        title="Operations Dashboard"
        description="Monitor lead flow, conversion momentum, and team execution from one command center."
        actions={
          <form className="flex gap-2">
            <Button type="submit" name="rangeDays" value="7" variant={rangeDays === 7 ? "secondary" : "ghost"} size="sm">
              Last 7d
            </Button>
            <Button type="submit" name="rangeDays" value="30" variant={rangeDays === 30 ? "secondary" : "ghost"} size="sm">
              Last 30d
            </Button>
            <Button type="submit" name="rangeDays" value="90" variant={rangeDays === 90 ? "secondary" : "ghost"} size="sm">
              Last 90d
            </Button>
          </form>
        }
      />

      <section className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="surface-muted p-4">
          <p className="field-label">Data freshness</p>
          <p className="mt-2 text-lg font-semibold text-heading">Updated {lastUpdatedLabel}</p>
          <p className="text-xs text-muted">Auto-refreshed with each interaction.</p>
        </div>
        <div className="surface-muted p-4">
          <p className="field-label">Follow-up pressure</p>
          <p className="mt-2 text-lg font-semibold text-heading">{dueTodayTasks} due today</p>
          <p className="text-xs text-muted">{overdueTasks} overdue tasks need attention.</p>
        </div>
        <div className="surface-muted p-4">
          <p className="field-label">Forecast confidence</p>
          <p className="mt-2 text-lg font-semibold text-heading">${Math.round(data.forecast.weighted).toLocaleString()}</p>
          <p className="text-xs text-muted">Weighted based on stage close probability.</p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.metrics.map((metric) => (
          <KPIStatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            rawValue={metric.rawValue}
            trend={metric.trend}
            note={metric.note}
            accent={metric.accent}
          />
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ChartCard
          title="Revenue Forecast"
          subtitle={`Projected value from current pipeline across the last ${rangeDays} days`}
          action={<span className="text-xs font-medium text-[var(--blue-deep)]">Committed ${data.forecast.committed.toLocaleString()}</span>}
        >
          <SimpleBarChart
            data={forecastSeries}
            xKey="stage"
            bars={[
              { key: "open", color: "#DCE8FF" },
              { key: "weighted", color: "#4F7CFF" },
            ]}
          />
        </ChartCard>

        <section className="surface-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-heading">Pipeline Health</h3>
            <span className="text-xs text-muted">Conversion by stage</span>
          </div>

          <div className="space-y-2">
            {pipelineHealth.map((stage) => (
              <article key={stage.stage} className="surface-muted p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-heading">{stageLabels[stage.stage]}</p>
                  <span className="text-xs text-muted">{stage.count} deals</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-muted">${Math.round(stage.value).toLocaleString()}</span>
                  <span className={stage.conversionFromPrevious !== null && stage.conversionFromPrevious < 15 ? "text-[var(--rose)]" : "text-[var(--teal)]"}>
                    {stage.conversionFromPrevious === null ? "Entry stage" : `${stage.conversionFromPrevious}% from prior`}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {data.conversionBySource.slice(0, 5).map((source) => (
          <article key={source.source} className="surface-muted p-4">
            <p className="field-label">{source.source}</p>
            <p className="mt-2 text-xl font-semibold text-heading">{source.total}</p>
            <p className="text-xs text-muted">{source.conversionRate}% conversion ({source.won} won)</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        <ChartCard title="Lead volume over time" subtitle="Created leads in recent activity window">
          <div className="dashboard-grid-bg h-full rounded-2xl p-2">
            <LeadVolumeChart data={data.leadVolume} />
          </div>
        </ChartCard>

        <ChartCard title="Conversion by source" subtitle="Won vs total leads per acquisition source">
          <div className="dashboard-grid-bg h-full rounded-2xl p-2">
            <SourceConversionChart data={data.conversionBySource} />
          </div>
        </ChartCard>

        <ChartCard title="Pipeline stage distribution" subtitle="Current active pipeline composition">
          <div className="dashboard-grid-bg h-full rounded-2xl p-2">
            <PipelineDistributionChart data={data.pipelineDistribution} />
          </div>
        </ChartCard>

        <section className="surface-card p-5">
          <h3 className="text-base font-semibold text-heading">Follow-up completion</h3>
          <p className="text-xs text-muted">Task execution health across open and completed reminders</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MetricCard label="Completed" value={String(data.followUp.completed)} />
            <MetricCard label="Pending" value={String(data.followUp.pending)} />
            <MetricCard label="Rate" value={`${data.followUp.completionRate}%`} />
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--background-soft)]">
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--teal)] to-[var(--blue)]" style={{ width: `${data.followUp.completionRate}%` }} />
          </div>
        </section>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ActivityFeed items={data.recentActivities} />

        <section className="surface-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-heading">Upcoming follow-ups</h3>
            <span className="rounded-full bg-[var(--amber-soft)] px-2 py-1 text-xs font-semibold text-[var(--amber)]">
              {data.upcomingTasks.length} due
            </span>
          </div>

          {data.upcomingTasks.length === 0 ? (
            <EmptyState title="No pending tasks" description="Your follow-up queue is clear." icon={Target} />
          ) : (
            <div className="space-y-3">
              {data.upcomingTasks.slice(0, 8).map((task) => (
                <TaskCard key={task.id} {...task} />
              ))}
            </div>
          )}
        </section>
      </section>

      <section className="mt-6 surface-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-heading">Team performance snapshot</h3>
          <span className="text-xs text-muted">Active leads, conversion rate, average response</span>
        </div>
        <div className="overflow-x-auto premium-scrollbar">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.1em] text-muted">
                <th className="px-2 py-2">Rep</th>
                <th className="px-2 py-2">Active Leads</th>
                <th className="px-2 py-2">Conversion</th>
                <th className="px-2 py-2">Response</th>
              </tr>
            </thead>
            <tbody>
              {data.teamPerformance.slice(0, 6).map((member) => (
                <tr key={member.userId} className="border-t border-[var(--border)] text-sm">
                  <td className="px-2 py-2 font-medium text-heading">{member.name}</td>
                  <td className="px-2 py-2 text-body">{member.activeLeads}</td>
                  <td className="px-2 py-2">
                    <span className="inline-flex rounded-full bg-[var(--teal-soft)] px-2 py-1 text-xs font-semibold text-[var(--teal)]">
                      {member.conversionRate}%
                    </span>
                  </td>
                  <td className="px-2 py-2 text-body">{member.responseTime}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

