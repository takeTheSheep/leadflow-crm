import { PageHeader } from "@/components/common/page-header";
import { LeadsWorkspace } from "@/components/dashboard/leads-workspace";
import { requireAuthSession } from "@/lib/auth";
import { getLeadFormData, getLeadListData } from "@/server/queries/lead-queries";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const session = await requireAuthSession();

  const [leadData, formData] = await Promise.all([getLeadListData(params), getLeadFormData()]);

  return (
    <div>
      <PageHeader
        title="Leads"
        description="Search, filter, and manage every opportunity with bulk actions, scoring, and ownership controls."
      />

      <LeadsWorkspace
        role={session.user.role}
        currentUserId={session.user.id}
        leads={leadData.leads}
        currentPage={leadData.page}
        totalPages={Math.max(leadData.totalPages, 1)}
        totalCount={leadData.totalCount}
        context={{
          members: formData.members,
          sources: formData.sources,
        }}
      />
    </div>
  );
}

