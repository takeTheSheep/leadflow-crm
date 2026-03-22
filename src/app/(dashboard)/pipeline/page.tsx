import { PipelineBoard } from "@/components/dashboard/pipeline-board";
import { getLeadListData } from "@/server/queries/lead-queries";

export default async function PipelinePage() {
  const data = await getLeadListData({ page: "1", pageSize: "100" });

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-heading">Pipeline</h1>
        <p className="mt-0.5 text-sm text-muted">Drag deals through your sales stages</p>
      </div>
      <PipelineBoard leads={data.leads} />
    </div>
  );
}

