"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LeadStage } from "@prisma/client";
import { PipelineColumn } from "@/components/dashboard/pipeline-column";
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
      <div className="grid gap-4 xl:grid-cols-4">
        {Object.values(LeadStage).map((stage) => (
          <PipelineColumn key={stage} stage={stage} leads={byStage[stage]} onMove={moveLead} />
        ))}
      </div>
    </div>
  );
}

