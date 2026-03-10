import { LeadStage } from "@prisma/client";
import { StatusPill } from "@/components/common/status-pill";

type LeadStageBadgeProps = {
  stage: LeadStage;
};

export function LeadStageBadge({ stage }: LeadStageBadgeProps) {
  return <StatusPill stage={stage} />;
}

