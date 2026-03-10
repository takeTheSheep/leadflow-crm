"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNowStrict } from "date-fns";
import { Archive, ArrowDown, ArrowUp, ArrowUpDown, Download, Eye, RefreshCw, Rows2, Trash2, X } from "lucide-react";
import { Button } from "@/components/common/button";
import { OwnerAvatar } from "@/components/common/owner-avatar";
import { StatusPill } from "@/components/common/status-pill";
import { ConfirmDialog } from "@/components/modals/confirm-dialog";
import type { LeadRow } from "@/types/crm";

type DataTableProps = {
  rows: LeadRow[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  role: "ADMIN" | "MANAGER" | "SALES_REP";
};

const columnHelper = createColumnHelper<LeadRow>();
const integerFormatter = new Intl.NumberFormat("en-US");

function formatInteger(value: number) {
  return integerFormatter.format(Math.round(value));
}

export function DataTable({ rows, currentPage, totalPages, totalCount, role }: DataTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();
  const [bulkAction, setBulkAction] = useState<"archive" | "delete" | "">("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dense, setDense] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: () => (
          <input
            type="checkbox"
            aria-label="Select all rows"
            checked={Object.keys(rowSelection).length > 0 && Object.keys(rowSelection).length === rows.length}
            onChange={(event) => {
              if (event.target.checked) {
                const next: Record<string, boolean> = {};
                rows.forEach((row) => {
                  next[row.id] = true;
                });
                setRowSelection(next);
              } else {
                setRowSelection({});
              }
            }}
            className="h-4 w-4 rounded border-[var(--border)]"
          />
        ),
        cell: (info) => (
          <input
            type="checkbox"
            checked={!!rowSelection[info.row.original.id]}
            onChange={(event) => {
              const next = { ...rowSelection };
              if (event.target.checked) {
                next[info.row.original.id] = true;
              } else {
                delete next[info.row.original.id];
              }
              setRowSelection(next);
            }}
            className="h-4 w-4 rounded border-[var(--border)]"
          />
        ),
      }),
      columnHelper.accessor("fullName", {
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-left"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Lead
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-3.5 w-3.5 text-muted" aria-hidden />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-3.5 w-3.5 text-muted" aria-hidden />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-muted" aria-hidden />
            )}
          </button>
        ),
        cell: (info) => (
          <div>
            <p className="font-medium text-heading">{info.getValue()}</p>
            <p className="text-xs text-muted">{info.row.original.email}</p>
          </div>
        ),
      }),
      columnHelper.accessor("company", {
        header: "Company",
        cell: (info) => <span className="text-sm text-heading">{info.getValue()}</span>,
      }),
      columnHelper.accessor("source", {
        header: "Source",
        cell: (info) => (
          <span className="inline-flex rounded-full bg-[var(--background-soft)] px-2 py-1 text-xs font-medium text-muted">
            {info.getValue() ?? "-"}
          </span>
        ),
      }),
      columnHelper.accessor("stage", {
        header: "Stage",
        cell: (info) => <StatusPill stage={info.getValue()} />,
      }),
      columnHelper.accessor("priority", {
        header: "Priority",
        cell: (info) => <StatusPill priority={info.getValue()} />,
      }),
      columnHelper.accessor("leadScore", {
        header: "Score",
        cell: (info) => <span className="text-sm font-semibold text-heading">{info.getValue()}</span>,
      }),
      columnHelper.accessor("estimatedValue", {
        header: "Est. Value",
        cell: (info) => <span className="text-sm text-heading">${formatInteger(info.getValue())}</span>,
      }),
      columnHelper.display({
        id: "owner",
        header: "Owner",
        cell: (info) => (
          <div className="flex items-center gap-2">
            <OwnerAvatar name={info.row.original.ownerName} image={info.row.original.ownerImage} className="h-8 w-8" />
            <span className="text-sm text-heading">{info.row.original.ownerName}</span>
          </div>
        ),
      }),
      columnHelper.display({
        id: "tags",
        header: "Tags",
        cell: (info) => (
          <div className="flex flex-wrap gap-1">
            {info.row.original.tags.slice(0, 2).map((tag) => (
              <span key={tag.id} className="rounded-full bg-[var(--violet-soft)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--violet)]">
                {tag.name}
              </span>
            ))}
            {info.row.original.tags.length > 2 ? (
              <span className="rounded-full bg-[var(--background-soft)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">
                +{info.row.original.tags.length - 2}
              </span>
            ) : null}
          </div>
        ),
      }),
      columnHelper.display({
        id: "followUp",
        header: "Follow-up",
        cell: (info) => (
          <span className="text-xs text-muted">
            {info.row.original.nextFollowUpAt
              ? `${formatDistanceToNowStrict(new Date(info.row.original.nextFollowUpAt), { addSuffix: true })}`
              : "Not scheduled"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: (info) => (
          <div className="flex justify-end opacity-70 transition group-hover:opacity-100">
            <Link
              href={`/leads/${info.row.original.id}`}
              className="ring-focus inline-flex items-center gap-1 rounded-lg border border-transparent px-2 py-1 text-xs text-muted hover:border-[var(--blue)]/20 hover:bg-[var(--blue-soft)] hover:text-[var(--blue-deep)]"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              View
            </Link>
          </div>
        ),
      }),
    ],
    [rowSelection, rows],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedIds = Object.keys(rowSelection);

  const runBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) {
      return;
    }

    const response = await fetch("/api/leads/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-idempotency-key": `bulk-${Date.now()}-${selectedIds.length}`,
      },
      body: JSON.stringify({
        leadIds: selectedIds,
        action: bulkAction,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ message: "Bulk action failed." }));
      setBulkMessage(body.message ?? "Bulk action failed.");
      return;
    }

    setRowSelection({});
    setBulkAction("");
    setConfirmOpen(false);
    setBulkMessage(`Bulk action applied to ${selectedIds.length} lead${selectedIds.length === 1 ? "" : "s"}.`);

    router.refresh();
  };

  const exportCsv = async () => {
    setIsExporting(true);
    setBulkMessage(null);

    try {
      const baseParams = new URLSearchParams(searchParams.toString());
      baseParams.delete("page");
      baseParams.delete("pageSize");

      const exportRows: LeadRow[] = [];
      let page = 1;
      let totalPagesToFetch = 1;
      const pageSize = 100;

      while (page <= totalPagesToFetch && page <= 30) {
        const params = new URLSearchParams(baseParams.toString());
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));

        const response = await fetch(`/api/leads?${params.toString()}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to export leads.");
        }

        const body = (await response.json()) as { leads: LeadRow[]; totalPages: number };
        exportRows.push(...body.leads);
        totalPagesToFetch = Math.max(1, body.totalPages ?? 1);
        page += 1;
      }

      if (exportRows.length === 0) {
        setBulkMessage("No leads match the current filters.");
        return;
      }

      const headers = [
        "Lead Name",
        "Company",
        "Email",
        "Phone",
        "Stage",
        "Priority",
        "Lead Score",
        "Estimated Value",
        "Source",
        "Owner",
        "Next Follow-up",
      ];

      const escapeCsv = (value: string | number | null | undefined) => {
        const text = value == null ? "" : String(value);
        if (/[",\n]/.test(text)) {
          return `"${text.replaceAll("\"", "\"\"")}"`;
        }
        return text;
      };

      const lines = exportRows.map((lead) =>
        [
          lead.fullName,
          lead.company,
          lead.email,
          lead.phone ?? "",
          lead.stage,
          lead.priority,
          lead.leadScore,
          Math.round(lead.estimatedValue),
          lead.source ?? "",
          lead.ownerName,
          lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toISOString() : "",
        ]
          .map(escapeCsv)
          .join(","),
      );

      const csv = [headers.join(","), ...lines].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `leadflow-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setBulkMessage(`Exported ${formatInteger(exportRows.length)} leads as CSV.`);
    } catch (error) {
      setBulkMessage(error instanceof Error ? error.message : "Failed to export CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));

    startTransition(() => {
      router.push(`/leads?${next.toString()}`);
    });
  };

  const setPageSize = (size: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("pageSize", String(size));
    next.set("page", "1");
    startTransition(() => {
      router.push(`/leads?${next.toString()}`);
    });
  };

  const selectedCount = selectedIds.length;
  const currentPageSize = Number(searchParams.get("pageSize") ?? 20);

  return (
    <section className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,251,255,0.9))] p-4">
        <div>
          <p className="text-sm font-medium text-heading">Leads Table</p>
          <p className="text-xs text-muted">{formatInteger(totalCount)} total leads across current workspace scope.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedCount > 0 ? (
            <>
              <span className="rounded-full bg-[var(--blue-soft)] px-2 py-1 text-xs font-semibold text-[var(--blue-deep)]">
                {selectedCount} selected
              </span>
              <select
                value={bulkAction}
                onChange={(event) => setBulkAction(event.target.value as "archive" | "delete" | "")}
                className="field-select h-9 min-w-28 px-2 text-sm"
              >
                <option value="">Bulk action</option>
                <option value="archive">Archive</option>
                {role === "ADMIN" ? <option value="delete">Delete</option> : null}
              </select>
              <Button
                variant="secondary"
                size="sm"
                disabled={!bulkAction || selectedCount === 0}
                onClick={() => setConfirmOpen(true)}
              >
                {bulkAction === "delete" ? <Trash2 className="mr-1.5 h-4 w-4" aria-hidden /> : <Archive className="mr-1.5 h-4 w-4" aria-hidden />}
                Run
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRowSelection({})}
              >
                <X className="mr-1 h-3.5 w-3.5" aria-hidden />
                Clear selection
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => setDense((current) => !current)}>
                <Rows2 className="mr-1 h-3.5 w-3.5" aria-hidden />
                {dense ? "Comfortable" : "Compact"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => router.refresh()}>
                <RefreshCw className="mr-1 h-3.5 w-3.5" aria-hidden />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" disabled={isExporting} onClick={exportCsv}>
                <Download className="mr-1 h-3.5 w-3.5" aria-hidden />
                {isExporting ? "Exporting..." : "Export CSV"}
              </Button>
            </>
          )}
        </div>
      </div>

      {bulkMessage ? (
        <div className="border-b border-[var(--border)] bg-[var(--background-soft)]/70 px-4 py-2 text-xs font-medium text-[var(--blue-deep)]">
          {bulkMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto premium-scrollbar">
        <table className="min-w-full divide-y divide-[var(--border)]">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="sticky top-0 z-10 bg-[linear-gradient(180deg,#f9fbff,#f2f6ff)] text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <p className="text-sm font-medium text-heading">No leads match the current filters</p>
                  <p className="mt-1 text-xs text-muted">Try clearing filters or adjusting your search criteria.</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="group transition hover:bg-[var(--background-soft)]/72 focus-within:bg-[var(--background-soft)]/72">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={`px-4 align-middle ${dense ? "py-2" : "py-3"}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border)] p-4 text-sm">
        <p className="text-muted">Page {currentPage} of {totalPages}</p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs text-muted">
            Page size
            <select
              value={String(currentPageSize)}
              onChange={(event) => setPageSize(Number(event.target.value))}
              className="field-select h-8 w-24 px-2 text-xs"
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
          <Button variant="ghost" className="h-8 px-3" disabled={currentPage <= 1 || isPending} onClick={() => setPage(currentPage - 1)}>
            Previous
          </Button>
          <Button
            variant="ghost"
            className="h-8 px-3"
            disabled={currentPage >= totalPages || isPending}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Run bulk action"
        description="This action will update all selected leads. Continue?"
        confirmLabel="Apply"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={runBulkAction}
      />
    </section>
  );
}

