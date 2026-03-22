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
    <>
      <section className="rounded-[28px] border border-white/10 bg-[#0c1526] p-4 shadow-[0_28px_60px_-40px_rgba(0,0,0,0.82)] md:hidden">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Dashboard Proof</p>
            <h2 className="mt-2 text-2xl font-semibold !text-white">Looks like a real CRM because it is one.</h2>
          </div>
          <span className="rounded-full border border-sky-400/18 bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200">Live preview</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "ring-focus h-12 rounded-2xl px-4 text-sm font-medium transition",
                tab.id === selected.id
                  ? "bg-gradient-to-r from-[var(--blue)]/28 to-[var(--violet)]/22 text-white"
                  : "border border-white/10 bg-white/[0.06] text-slate-300 hover:bg-white/10",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,#111d31_0%,#09111e_100%)] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{selected.label} view</p>
              <h3 className="mt-1 text-base font-semibold !text-white">Pipeline health at a glance</h3>
            </div>
            <span className="rounded-full bg-emerald-500/12 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">+12%</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.06] p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Open</p>
              <p className="mt-1 text-lg font-semibold text-white">148</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.06] p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Due today</p>
              <p className="mt-1 text-lg font-semibold text-white">19</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.06] p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Win rate</p>
              <p className="mt-1 text-lg font-semibold text-white">18%</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.06] p-3">
            <div className="flex h-24 items-end gap-2">
              {[42, 64, 58, 86, 74].map((height, index) => (
                <div
                  key={`${selected.id}-${height}`}
                  className={cn(
                    "flex-1 rounded-t-2xl",
                    index === 3 ? "bg-gradient-to-t from-[var(--blue)] to-[var(--violet)]" : "bg-white/[0.18]",
                  )}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.16em] text-slate-500">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
            </div>
          </div>

          <ul className="mt-4 grid gap-2">
            {selected.preview.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.06] px-3 py-3 text-sm text-slate-200">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--blue)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="hidden surface-card p-6 md:block">
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
    </>
  );
}

