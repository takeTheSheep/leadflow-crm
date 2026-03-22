import { RedesignLeads } from "@/components/dashboard/redesign-leads";
import { getLeadFormData, getLeadListData } from "@/server/queries/lead-queries";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const leadParams = {
    ...params,
    page: typeof params.page === "string" ? params.page : "1",
    pageSize: typeof params.pageSize === "string" ? params.pageSize : "100",
  };

  const [leadData, formData] = await Promise.all([getLeadListData(leadParams), getLeadFormData()]);

  return (
    <RedesignLeads
      leads={leadData.leads}
      totalCount={leadData.totalCount}
      context={{
        members: formData.members,
        sources: formData.sources,
      }}
    />
  );
}
