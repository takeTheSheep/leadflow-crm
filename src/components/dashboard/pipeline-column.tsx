"use client";

import { useState } from "react";
import { LeadStage } from "@prisma/client";
import { stageLabels } from "@/constants/navigation";
import type { LeadRow } from "@/types/crm";
import { LeadKanbanCard } from "@/components/dashboard/lead-kanban-card";
import { cn } from "@/lib/utils/cn";

type PipelineColumnProps = {
  stage: LeadStage;
  leads: LeadRow[];
  onMove: (leadId: string, nextStage: LeadStage) => Promise<void>;
};

export function PipelineColumn({ stage, leads, onMove }: PipelineColumnProps) {
  const [movingLeadId, setMovingLeadId] = useState<string | null>(null);

  const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const averageScore = leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.leadScore, 0) / leads.length) : 0;
  const accentClass: Record<LeadStage, string> = {
    [LeadStage.NEW]: "bg-slate-400",
    [LeadStage.CONTACTED]: "bg-[var(--blue)]",
    [LeadStage.QUALIFIED]: "bg-[var(--teal)]",
    [LeadStage.PROPOSAL_SENT]: "bg-[var(--violet)]",
    [LeadStage.NEGOTIATION]: "bg-[var(--amber)]",
    [LeadStage.WON]: "bg-emerald-500",
    [LeadStage.LOST]: "bg-[var(--rose)]",
  };

  return (
    <section className="h-full min-h-[360px] rounded-xl border border-[var(--border)] bg-[var(--background-soft)]/68 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
      <header className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn("h-2.5 w-2.5 rounded-full", accentClass[stage])} aria-hidden />
            <h3 className="text-sm font-semibold text-heading">{stageLabels[stage]}</h3>
          </div>
          <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-muted shadow-[0_8px_18px_-18px_rgba(24,40,80,0.55)]">
            {leads.length}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-muted">
          <span>${Math.round(totalValue).toLocaleString()} total value</span>
          <span>Avg score {averageScore}</span>
        </div>
      </header>

      <div className="space-y-3">
        {leads.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--background-soft)]/55 p-4 text-center text-xs text-muted">
            No leads in this stage.
          </div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead.id}
              className={cn(
                "space-y-2 transition",
                movingLeadId === lead.id ? "opacity-70" : "opacity-100",
              )}
            >
              <LeadKanbanCard lead={lead} />

              <select
                defaultValue={lead.stage}
                disabled={movingLeadId === lead.id}
                onChange={async (event) => {
                  const nextStage = event.target.value as LeadStage;
                  if (nextStage === lead.stage) {
                    return;
                  }

                  setMovingLeadId(lead.id);
                  await onMove(lead.id, nextStage);
                  setMovingLeadId(null);
                }}
                className="field-select h-8 w-full px-2 text-xs"
              >
                {Object.values(LeadStage).map((stageValue) => (
                  <option key={stageValue} value={stageValue}>
                    Move to {stageLabels[stageValue]}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

