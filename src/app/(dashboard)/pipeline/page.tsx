import { PageHeader } from "@/components/common/page-header";
import { PipelineBoard } from "@/components/dashboard/pipeline-board";
import { getLeadListData } from "@/server/queries/lead-queries";

export default async function PipelinePage() {
  const data = await getLeadListData({ page: "1", pageSize: "100" });

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description="Visualize deal movement by stage with value totals and quick stage transitions."
      />
      <PipelineBoard leads={data.leads} />
    </div>
  );
}

