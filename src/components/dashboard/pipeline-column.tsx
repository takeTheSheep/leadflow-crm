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

  return (
    <section className="surface-card min-h-[320px] p-4">
      <header className="mb-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-heading">{stageLabels[stage]}</h3>
          <span className="rounded-full bg-[var(--background-soft)] px-2 py-1 text-xs text-muted">{leads.length}</span>
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

