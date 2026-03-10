import { LeadPriority, LeadStage } from "@prisma/client";
import { leadPriorityLabel, priorityColorClass, stageColorClass } from "@/constants/ui";
import { stageLabels } from "@/constants/navigation";
import { cn } from "@/lib/utils/cn";

type StatusPillProps = {
  stage?: LeadStage;
  priority?: LeadPriority;
  className?: string;
};

export function StatusPill({ stage, priority, className }: StatusPillProps) {
  if (stage) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide",
          stageColorClass[stage],
          className,
        )}
      >
        {stageLabels[stage]}
      </span>
    );
  }

  if (priority) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide",
          priorityColorClass[priority],
          className,
        )}
      >
        {leadPriorityLabel[priority]}
      </span>
    );
  }

  return null;
}

