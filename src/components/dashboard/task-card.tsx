import { format } from "date-fns";
import { CalendarClock } from "lucide-react";
import { StatusPill } from "@/components/common/status-pill";

type TaskCardProps = {
  id: string;
  title: string;
  dueDate: Date;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  lead: {
    id: string;
    firstName: string;
    lastName: string;
  };
  assignedTo: {
    name: string;
  };
};

export function TaskCard({ title, dueDate, priority, lead, assignedTo }: TaskCardProps) {
  return (
    <article className="surface-muted p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-heading">{title}</p>
        <StatusPill priority={priority} />
      </div>
      <p className="text-xs text-muted">
        {lead.firstName} {lead.lastName} | {assignedTo.name}
      </p>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-2 py-1 text-xs text-muted">
        <CalendarClock className="h-3.5 w-3.5 text-[var(--blue)]" aria-hidden />
        Due {format(dueDate, "MMM d, yyyy")}
      </div>
    </article>
  );
}

