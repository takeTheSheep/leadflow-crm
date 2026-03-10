import { LeadStage } from "@prisma/client";
import { PageHeader } from "@/components/common/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AnalyticsFilterBar } from "@/components/dashboard/analytics-filter-bar";
import { LeadVolumeChart } from "@/components/charts/lead-volume-chart";
import { PipelineDistributionChart } from "@/components/charts/pipeline-distribution-chart";
import { SimpleBarChart } from "@/components/charts/simple-bar-chart";
import { SourceConversionChart } from "@/components/charts/source-conversion-chart";
import { getAnalyticsData } from "@/server/queries/analytics-queries";
import { stageLabels } from "@/constants/navigation";

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const data = await getAnalyticsData(params);

  const funnelData = data.pipelineDistribution.map((item) => ({
    stage: item.stage.replaceAll("_", " "),
    leads: item.count,
  }));

  const stageVelocityData = data.stageVelocity.map((item) => ({
    stage: item.stage.replaceAll("_", " "),
    days: item.days,
  }));

  const funnelOrder: LeadStage[] = [
    LeadStage.NEW,
    LeadStage.CONTACTED,
    LeadStage.QUALIFIED,
    LeadStage.PROPOSAL_SENT,
    LeadStage.WON,
  ];

  const funnel = funnelOrder.map((stage, index) => {
    const count = data.pipelineDistribution.find((item) => item.stage === stage)?.count ?? 0;
    const previousCount = index > 0 ? data.pipelineDistribution.find((item) => item.stage === funnelOrder[index - 1])?.count ?? 0 : null;
    return {
      stage,
      count,
      conversion: previousCount === null ? null : previousCount > 0 ? Number(((count / previousCount) * 100).toFixed(1)) : 0,
    };
  });

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Track acquisition performance, conversion funnel health, stage velocity, and forecast confidence."
      />

      <AnalyticsFilterBar
        rangeDays={data.filters.rangeDays}
        ownerId={data.filters.ownerId}
        sourceId={data.filters.sourceId}
        ownerOptions={data.ownerOptions}
        sourceOptions={data.sourceOptions}
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Leads created over time" subtitle="Inbound velocity and campaign trendline">
          <LeadVolumeChart data={data.leadVolume} />
        </ChartCard>

        <ChartCard title="Source performance" subtitle="Total and won leads by acquisition channel">
          <SourceConversionChart data={data.conversionBySource} />
        </ChartCard>

        <ChartCard title="Conversion funnel" subtitle="Stage-by-stage lead distribution">
          <SimpleBarChart data={funnelData} xKey="stage" bars={[{ key: "leads", color: "#8B7CFF" }]} />
        </ChartCard>

        <ChartCard title="Stage distribution" subtitle="Donut view of current pipeline balance">
          <PipelineDistributionChart data={data.pipelineDistribution} />
        </ChartCard>

        <ChartCard title="Stage velocity" subtitle="Average days spent by stage">
          <SimpleBarChart data={stageVelocityData} xKey="stage" bars={[{ key: "days", color: "#FFB547" }]} />
        </ChartCard>

        <section className="surface-card p-5">
          <h3 className="text-base font-semibold text-heading">Follow-up completion</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <MetricCard label="Completed" value={String(data.followUpCompletion.completed)} />
            <MetricCard label="Pending" value={String(data.followUpCompletion.pending)} />
            <MetricCard label="Rate" value={`${data.followUpCompletion.completionRate}%`} />
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--background-soft)]">
            <div className="h-full rounded-full bg-gradient-to-r from-[var(--teal)] to-[var(--blue)]" style={{ width: `${data.followUpCompletion.completionRate}%` }} />
          </div>
        </section>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Weighted forecast" value={`$${data.forecast.weighted.toLocaleString()}`} />
        <MetricCard label="Committed forecast" value={`$${data.forecast.committed.toLocaleString()}`} />
        <MetricCard label="Lost reason: Budget" value={String(data.lostReasons[0]?.value ?? 0)} />
        <MetricCard label="Lost reason: Timing" value={String(data.lostReasons[1]?.value ?? 0)} />
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="surface-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-heading">Funnel conversion map</h3>
            <span className="text-xs text-muted">New Leads to Contacted to Qualified to Proposal to Won</span>
          </div>
          <div className="grid gap-2 md:grid-cols-5">
            {funnel.map((item) => (
              <article key={item.stage} className="surface-muted p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{stageLabels[item.stage]}</p>
                <p className="mt-2 text-xl font-semibold text-heading">{item.count}</p>
                <p className={`text-xs ${item.conversion !== null && item.conversion < 20 ? "text-[var(--rose)]" : "text-[var(--teal)]"}`}>
                  {item.conversion === null ? "Entry stage" : `${item.conversion}% stage conversion`}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <h3 className="text-base font-semibold text-heading">Lead Source Performance</h3>
          <p className="text-xs text-muted">Volume and conversion by acquisition source</p>
          <div className="mt-3 overflow-x-auto premium-scrollbar">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.1em] text-muted">
                  <th className="px-2 py-2">Source</th>
                  <th className="px-2 py-2">Leads</th>
                  <th className="px-2 py-2">Won</th>
                  <th className="px-2 py-2">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {data.conversionBySource.map((source) => (
                  <tr key={source.source} className="border-t border-[var(--border)]">
                    <td className="px-2 py-2 font-medium text-heading">{source.source}</td>
                    <td className="px-2 py-2 text-body">{source.total}</td>
                    <td className="px-2 py-2 text-body">{source.won}</td>
                    <td className="px-2 py-2">
                      <span className="inline-flex rounded-full bg-[var(--teal-soft)] px-2 py-0.5 text-xs font-semibold text-[var(--teal)]">
                        {source.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}

