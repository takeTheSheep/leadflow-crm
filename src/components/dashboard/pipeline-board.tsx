"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LeadStage } from "@prisma/client";
import { OwnerAvatar } from "@/components/common/owner-avatar";
import { StatusPill } from "@/components/common/status-pill";
import { PipelineColumn } from "@/components/dashboard/pipeline-column";
import { stageLabels } from "@/constants/navigation";
import { cn } from "@/lib/utils/cn";
import type { LeadRow } from "@/types/crm";

type PipelineBoardProps = {
  leads: LeadRow[];
};

export function PipelineBoard({ leads }: PipelineBoardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const byStage = Object.values(LeadStage).reduce<Record<LeadStage, LeadRow[]>>((acc, stage) => {
    acc[stage] = leads.filter((lead) => lead.stage === stage);
    return acc;
  }, {} as Record<LeadStage, LeadRow[]>);

  const moveLead = async (leadId: string, nextStage: LeadStage) => {
    await fetch(`/api/leads/${leadId}/stage`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stage: nextStage }),
    });

    startTransition(() => {
      router.refresh();
    });
  };

  const totalValue = Math.round(leads.reduce((sum, lead) => sum + lead.estimatedValue, 0));
  const urgentLeads = leads.filter((lead) => lead.priority === "HIGH" || lead.priority === "URGENT").length;
  const stages = Object.values(LeadStage).map((stage) => ({
    stage,
    leads: byStage[stage],
  }));

  const stageAccentClass: Record<LeadStage, string> = {
    [LeadStage.NEW]: "bg-slate-400",
    [LeadStage.CONTACTED]: "bg-[var(--blue)]",
    [LeadStage.QUALIFIED]: "bg-[var(--teal)]",
    [LeadStage.PROPOSAL_SENT]: "bg-[var(--violet)]",
    [LeadStage.NEGOTIATION]: "bg-[var(--amber)]",
    [LeadStage.WON]: "bg-emerald-500",
    [LeadStage.LOST]: "bg-[var(--rose)]",
  };

  return (
    <div className="space-y-4">
      <section className="surface-muted grid gap-3 p-4 md:grid-cols-3">
        <div>
          <p className="field-label">Active opportunities</p>
          <p className="mt-1 text-lg font-semibold text-heading">{leads.length}</p>
        </div>
        <div>
          <p className="field-label">Pipeline value</p>
          <p className="mt-1 text-lg font-semibold text-heading">${totalValue.toLocaleString()}</p>
        </div>
        <div>
          <p className="field-label">Priority watchlist</p>
          <p className="mt-1 text-lg font-semibold text-heading">{urgentLeads} urgent/high leads</p>
        </div>
      </section>
      {isPending ? (
        <p className="rounded-xl bg-[var(--blue-soft)]/55 px-3 py-2 text-sm font-medium text-[var(--blue-deep)]">
          Updating stage and recalculating pipeline health...
        </p>
      ) : null}

      <div className="hidden overflow-x-auto pb-4 premium-scrollbar md:block">
        <div className="flex min-w-max gap-4">
          {stages.map(({ stage, leads: stageLeads }) => (
            <div key={stage} className="w-72 shrink-0">
              <PipelineColumn stage={stage} leads={stageLeads} onMove={moveLead} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {stages.map(({ stage, leads: stageLeads }) => {
          const stageValue = Math.round(stageLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0));
          const stageAverageScore =
            stageLeads.length > 0 ? Math.round(stageLeads.reduce((sum, lead) => sum + lead.leadScore, 0) / stageLeads.length) : 0;

          return (
            <section
              key={stage}
              className="overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[0_16px_32px_-28px_rgba(24,40,80,0.45)]"
            >
              <header className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--background-soft)]/75 px-4 py-3">
                <span className={cn("h-2.5 w-2.5 rounded-full", stageAccentClass[stage])} aria-hidden />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-heading">{stageLabels[stage]}</h3>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-muted">
                      {stageLeads.length}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted">
                    ${stageValue.toLocaleString()} total value | Avg score {stageAverageScore}
                  </p>
                </div>
              </header>

              {stageLeads.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-muted">No leads in this stage.</div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {stageLeads.map((lead) => (
                    <article key={lead.id} className="space-y-3 px-4 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-heading">{lead.fullName}</p>
                          <p className="truncate text-xs text-muted">{lead.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-heading">
                            ${Math.round(lead.estimatedValue).toLocaleString()}
                          </p>
                          <p className="text-[11px] text-muted">Score {lead.leadScore}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <StatusPill priority={lead.priority} />
                        {lead.source ? (
                          <span className="inline-flex rounded-full bg-[var(--background-soft)] px-2.5 py-1 text-[11px] font-medium text-muted">
                            {lead.source}
                          </span>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <OwnerAvatar name={lead.ownerName} image={lead.ownerImage} className="h-8 w-8" />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-heading">{lead.ownerName}</p>
                            <p className="truncate text-[11px] text-muted">
                              {lead.nextFollowUpAt
                                ? `Follow-up ${new Date(lead.nextFollowUpAt).toLocaleDateString()}`
                                : "No follow-up scheduled"}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/leads/${lead.id}`}
                          className="ring-focus inline-flex shrink-0 rounded-lg border border-[var(--border)] px-2.5 py-1.5 text-xs font-medium text-heading transition hover:border-[var(--blue)]/25 hover:bg-[var(--blue-soft)] hover:text-[var(--blue-deep)]"
                        >
                          Open lead
                        </Link>
                      </div>

                      <select
                        defaultValue={lead.stage}
                        disabled={isPending}
                        onChange={async (event) => {
                          const nextStage = event.target.value as LeadStage;
                          if (nextStage === lead.stage) {
                            return;
                          }

                          await moveLead(lead.id, nextStage);
                        }}
                        className="field-select h-10 w-full px-3 text-sm"
                      >
                        {Object.values(LeadStage).map((stageValue) => (
                          <option key={stageValue} value={stageValue}>
                            Move to {stageLabels[stageValue]}
                          </option>
                        ))}
                      </select>
                    </article>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

