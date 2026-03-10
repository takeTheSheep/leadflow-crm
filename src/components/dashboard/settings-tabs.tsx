"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type SettingsTab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type SettingsTabsProps = {
  tabs: SettingsTab[];
};

export function SettingsTabs({ tabs }: SettingsTabsProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  return (
    <div className="surface-card p-5">
      <div className="mb-6 overflow-x-auto border-b border-[var(--border)] pb-4 premium-scrollbar">
        <div className="inline-flex min-w-full gap-2 rounded-2xl bg-[var(--background-soft)]/65 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "ring-focus shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition",
                active === tab.id
                  ? "bg-white text-[var(--blue-deep)] shadow-[0_10px_24px_-20px_rgba(37,60,114,0.8)]"
                  : "text-muted hover:bg-white/70 hover:text-heading",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {tabs.map((tab) => (
        <div key={tab.id} hidden={active !== tab.id} className="animate-[fadeIn_180ms_ease-out]">
          {tab.content}
        </div>
      ))}
    </div>
  );
}

