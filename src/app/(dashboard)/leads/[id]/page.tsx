import { notFound } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { LeadDetailPanel } from "@/components/dashboard/lead-detail-panel";
import { toSafeError } from "@/lib/security/safe-error";
import { getLeadDetailData, getLeadFormData } from "@/server/queries/lead-queries";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const payload = await Promise.all([getLeadDetailData(id), getLeadFormData()]).catch((error) => {
    const safe = toSafeError(error, "Lead not found");

    if (safe.statusCode === 404) {
      notFound();
    }

    throw error;
  });

  const [lead, context] = payload;

  return (
    <div>
      <PageHeader
        title="Lead Detail"
        description="Track conversation history, schedule next steps, and manage pipeline progression from one place."
      />

      <LeadDetailPanel
        lead={lead}
        members={context.members.map((member) => ({
          id: member.id,
          name: member.name,
        }))}
      />
    </div>
  );
  }
