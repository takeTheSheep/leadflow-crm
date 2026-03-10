import Link from "next/link";
import { OwnerAvatar } from "@/components/common/owner-avatar";
import { StatusPill } from "@/components/common/status-pill";
import { stageLabels } from "@/constants/navigation";
import type { LeadRow } from "@/types/crm";

type LeadKanbanCardProps = {
  lead: LeadRow;
};

export function LeadKanbanCard({ lead }: LeadKanbanCardProps) {
  const urgent = lead.priority === "URGENT" || lead.priority === "HIGH";

  return (
    <article className="rounded-xl border border-[var(--border)] bg-white p-3 shadow-[0_10px_20px_-18px_rgba(24,40,80,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_32px_-20px_rgba(50,70,120,0.4)]">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-heading">{lead.fullName}</p>
          <p className="text-xs text-muted">{lead.company}</p>
        </div>
        <StatusPill priority={lead.priority} />
      </div>

      <div className="mb-2 flex flex-wrap gap-1">
        <span className="inline-flex rounded-full bg-[var(--blue-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--blue-deep)]">
          Score {lead.leadScore}
        </span>
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${urgent ? "bg-[var(--rose-soft)] text-[var(--rose)]" : "bg-[var(--teal-soft)] text-[var(--teal)]"}`}>
          {urgent ? "High urgency" : "Stable"}
        </span>
      </div>

      <p className="text-xs text-muted">Deal value</p>
      <p className="text-sm font-semibold text-heading">${Math.round(lead.estimatedValue).toLocaleString()}</p>
      <p className="mt-1 text-xs text-muted">
        Next follow-up: {lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleDateString() : "Not scheduled"}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <OwnerAvatar name={lead.ownerName} image={lead.ownerImage} className="h-8 w-8" />
          <span className="text-xs text-muted">{lead.ownerName}</span>
        </div>
        <Link href={`/leads/${lead.id}`} className="text-xs font-medium text-[var(--blue-deep)] hover:underline">
          Open {stageLabels[lead.stage]}
        </Link>
      </div>
    </article>
  );
}

