"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

const tabs = [
  {
    id: "dashboard",
    label: "Dashboard",
    preview: ["KPI metrics + trend deltas", "Lead volume chart", "Follow-up due list"],
  },
  {
    id: "leads",
    label: "Leads",
    preview: ["Searchable table", "Status badges + score", "Bulk assignment + archive"],
  },
  {
    id: "analytics",
    label: "Analytics",
    preview: ["Conversion funnel", "Source performance", "Forecast snapshot"],
  },
  {
    id: "activity",
    label: "Activity",
    preview: ["Chronological feed", "Action-type filtering", "Actor-level traceability"],
  },
];

export function InteractivePreview() {
  const [active, setActive] = useState(tabs[0].id);

  const selected = tabs.find((tab) => tab.id === active) ?? tabs[0];

  return (
    <section className="surface-card p-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              "ring-focus rounded-xl px-3 py-2 text-sm font-medium transition",
              tab.id === selected.id
                ? "bg-gradient-to-r from-[var(--blue-soft)] to-[var(--violet-soft)] text-[var(--blue-deep)]"
                : "text-muted hover:bg-[var(--background-soft)] hover:text-heading",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-muted)] p-5">
        <h3 className="text-xl font-semibold text-heading">{selected.label} Preview</h3>
        <ul className="mt-3 grid gap-2 md:grid-cols-3">
          {selected.preview.map((item) => (
            <li key={item} className="rounded-xl bg-white p-3 text-sm text-body shadow-[0_10px_20px_-20px_rgba(24,35,68,0.65)]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

