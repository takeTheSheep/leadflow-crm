"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/common/button";
import { LeadFormModal } from "@/components/forms/lead-form-modal";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { DataTable } from "@/components/tables/data-table";
import { stageLabels } from "@/constants/navigation";
import type { LeadRow } from "@/types/crm";

type LeadsWorkspaceProps = {
  role: "ADMIN" | "MANAGER" | "SALES_REP";
  currentUserId: string;
  leads: LeadRow[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  context: {
    members: Array<{ id: string; name: string }>;
    sources: Array<{ id: string; name: string }>;
  };
};

export function LeadsWorkspace({ role, currentUserId, leads, currentPage, totalPages, totalCount, context }: LeadsWorkspaceProps) {
  const [open, setOpen] = useState(false);
  const hotLeads = leads.filter((lead) => lead.leadScore >= 75).length;
  const highPriorityLeads = leads.filter((lead) => lead.priority === "HIGH" || lead.priority === "URGENT").length;

  return (
    <div>
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="surface-muted p-4">
          <p className="field-label">Visible Leads</p>
          <p className="mt-2 text-xl font-semibold text-heading">{leads.length}</p>
          <p className="text-xs text-muted">of {totalCount.toLocaleString()} total records</p>
        </div>
        <div className="surface-muted p-4">
          <p className="field-label">High Intent</p>
          <p className="mt-2 text-xl font-semibold text-heading">{hotLeads}</p>
          <p className="text-xs text-muted">lead score at 75 or above</p>
        </div>
        <div className="surface-muted p-4">
          <p className="field-label">Priority Queue</p>
          <p className="mt-2 text-xl font-semibold text-heading">{highPriorityLeads}</p>
          <p className="text-xs text-muted">high and urgent lead priority</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted">
          Showing {leads.length.toLocaleString()} of {totalCount.toLocaleString()} leads in current scope.
        </p>
        <Button size="lg" onClick={() => setOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" aria-hidden />
          Quick Create Lead
        </Button>
      </div>

      <FilterBar
        currentUserId={currentUserId}
        stageOptions={Object.entries(stageLabels).map(([value, label]) => ({ value, label }))}
        ownerOptions={context.members.map((member) => ({ value: member.id, label: member.name }))}
        sourceOptions={context.sources.map((source) => ({ value: source.id, label: source.name }))}
      />

      <DataTable rows={leads} currentPage={currentPage} totalPages={totalPages} totalCount={totalCount} role={role} />

      <LeadFormModal open={open} onClose={() => setOpen(false)} context={context} />
    </div>
  );
}

