"use client";

import { useMemo, useState } from "react";
import { LeadStage } from "@prisma/client";
import { format } from "date-fns";
import { Mail, MoreHorizontal, Phone, Plus, Search } from "lucide-react";
import { Button } from "@/components/common/button";
import { LeadFormModal } from "@/components/forms/lead-form-modal";
import type { LeadRow } from "@/types/crm";

type RedesignLeadsProps = {
  leads: LeadRow[];
  totalCount: number;
  context: {
    members: Array<{ id: string; name: string }>;
    sources: Array<{ id: string; name: string }>;
  };
};

const stageColor: Record<LeadStage, string> = {
  [LeadStage.NEW]: "bg-slate-100 text-slate-700",
  [LeadStage.CONTACTED]: "bg-[var(--blue-soft)] text-[var(--blue-deep)]",
  [LeadStage.QUALIFIED]: "bg-[var(--teal-soft)] text-[var(--teal)]",
  [LeadStage.PROPOSAL_SENT]: "bg-[var(--amber-soft)] text-[var(--amber)]",
  [LeadStage.NEGOTIATION]: "bg-[var(--amber-soft)] text-[var(--amber)]",
  [LeadStage.WON]: "bg-emerald-100 text-emerald-700",
  [LeadStage.LOST]: "bg-rose-100 text-rose-700",
};

function ownerInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatStage(stage: LeadStage) {
  return stage
    .toLowerCase()
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function RedesignLeads({ leads, totalCount, context }: RedesignLeadsProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return leads;
    }

    return leads.filter((lead) => {
      return [lead.fullName, lead.company, lead.email].some((value) => value.toLowerCase().includes(query));
    });
  }, [leads, search]);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-heading">Leads</h1>
            <p className="mt-0.5 text-sm text-muted">{totalCount} total leads</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" aria-hidden />
            Add Lead
          </Button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search leads..."
            className="field-base pl-9"
          />
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-[var(--border)] bg-white shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)] md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--background-soft)]/72">
                <th className="px-4 py-3 text-left font-medium text-muted">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Stage</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Value</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Source</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Owner</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Created</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-b border-[var(--border)]/70 transition-colors hover:bg-[var(--background-soft)]/42">
                  <td className="px-4 py-3">
                    <div className="font-medium text-heading">{lead.fullName}</div>
                    <div className="text-xs text-muted">{lead.company}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${stageColor[lead.stage]}`}>
                      {formatStage(lead.stage)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums text-heading">
                    ${Math.round(lead.estimatedValue).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-muted">{lead.source ?? "Unknown"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--blue-soft)] text-[10px] font-semibold text-[var(--blue)]">
                        {ownerInitials(lead.ownerName)}
                      </div>
                      <span className="text-heading">{lead.ownerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{format(lead.createdAt, "MMM d")}</td>
                  <td className="px-4 py-3">
                    <button className="rounded p-1 text-muted transition-colors hover:text-heading" aria-label={`Open menu for ${lead.fullName}`}>
                      <MoreHorizontal className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 md:hidden">
          {filtered.map((lead) => (
            <article key={lead.id} className="rounded-xl border border-[var(--border)] bg-white p-4 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-heading">{lead.fullName}</div>
                  <div className="text-xs text-muted">{lead.company}</div>
                </div>
                <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${stageColor[lead.stage]}`}>
                  {formatStage(lead.stage)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-medium tabular-nums text-heading">${Math.round(lead.estimatedValue).toLocaleString()}</span>
                <span className="text-xs text-muted">{lead.source ?? "Unknown"}</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[var(--border)]/70 pt-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--blue-soft)] text-[10px] font-semibold text-[var(--blue)]">
                    {ownerInitials(lead.ownerName)}
                  </div>
                  <span className="text-xs text-muted">{lead.ownerName}</span>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-[var(--background-soft)] p-1.5 text-muted transition-colors hover:text-heading" aria-label={`Email ${lead.fullName}`}>
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button className="rounded-lg bg-[var(--background-soft)] p-1.5 text-muted transition-colors hover:text-heading" aria-label={`Call ${lead.fullName}`}>
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <LeadFormModal open={open} onClose={() => setOpen(false)} context={context} />
    </>
  );
}
