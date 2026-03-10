"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { BookmarkPlus, SlidersHorizontal, Trash2, X } from "lucide-react";
import { Button } from "@/components/common/button";

type FilterOption = {
  value: string;
  label: string;
};

type FilterBarProps = {
  stageOptions: FilterOption[];
  ownerOptions: FilterOption[];
  sourceOptions: FilterOption[];
  currentUserId: string;
};

type SavedFilter = {
  id: string;
  name: string;
  params: Record<string, string>;
};

const savedFilterStorageKey = "leadflow:saved-lead-filters";

export function FilterBar({ stageOptions, ownerOptions, sourceOptions, currentUserId }: FilterBarProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(savedFilterStorageKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as SavedFilter[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(savedFilterStorageKey, JSON.stringify(savedFilters));
  }, [savedFilters]);

  const setParam = (key: string, value?: string) => {
    const next = new URLSearchParams(searchParams);

    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    next.set("page", "1");

    startTransition(() => {
      router.push(`/leads?${next.toString()}`);
    });
  };

  const applyFilterSet = (params: Record<string, string>) => {
    const next = new URLSearchParams(searchParams.toString());
    ["query", "stage", "ownerId", "sourceId", "priority", "scoreMin", "scoreMax"].forEach((key) => next.delete(key));
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      }
    });
    next.set("page", "1");
    startTransition(() => {
      router.push(`/leads?${next.toString()}`);
    });
  };

  const saveCurrentFilters = () => {
    const name = window.prompt("Save this filter as");
    if (!name || !name.trim()) {
      return;
    }

    const params: Record<string, string> = {};
    ["query", "stage", "ownerId", "sourceId", "priority", "scoreMin", "scoreMax"].forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        params[key] = value;
      }
    });

    if (Object.keys(params).length === 0) {
      return;
    }

    setSavedFilters((current) => [
      {
        id: `saved-${Date.now()}`,
        name: name.trim(),
        params,
      },
      ...current,
    ]);
  };

  const quickPresets: Array<{ id: string; label: string; params: Record<string, string> }> = [
    { id: "my-leads", label: "My Leads", params: { ownerId: currentUserId } },
    { id: "high-value", label: "High Value Deals", params: { priority: "HIGH" } },
    { id: "follow-ups", label: "Follow-ups Due", params: { stage: "CONTACTED", priority: "HIGH" } },
    { id: "enterprise", label: "Enterprise Leads", params: { query: "enterprise" } },
  ];

  return (
    <div className="surface-card mb-4 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--blue)]" aria-hidden />
          Lead Filters
        </div>
        <p className="text-xs text-muted">{isPending ? "Applying filter updates..." : "Filters are server-scoped and RBAC-safe"}</p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        {quickPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => applyFilterSet(preset.params)}
            className="ring-focus inline-flex items-center gap-1 rounded-full bg-[var(--background-soft)] px-2.5 py-1 text-xs font-medium text-heading transition hover:bg-[var(--blue-soft)] hover:text-[var(--blue-deep)]"
          >
            {preset.label}
          </button>
        ))}
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={saveCurrentFilters}>
          <BookmarkPlus className="mr-1 h-3.5 w-3.5" aria-hidden />
          Save current
        </Button>
      </div>

      {savedFilters.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {savedFilters.map((filter) => (
            <span key={filter.id} className="inline-flex items-center gap-1 rounded-full bg-[var(--violet-soft)] px-2 py-1 text-xs text-[var(--violet)]">
              <button
                type="button"
                onClick={() => applyFilterSet(filter.params)}
                className="ring-focus rounded px-1 font-medium"
              >
                {filter.name}
              </button>
              <button
                type="button"
                onClick={() => setSavedFilters((current) => current.filter((item) => item.id !== filter.id))}
                className="ring-focus rounded p-0.5 text-[var(--violet)] hover:bg-white/60"
                aria-label={`Remove ${filter.name}`}
              >
                <Trash2 className="h-3 w-3" aria-hidden />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-6">
        <input
          defaultValue={searchParams.get("query") ?? ""}
          placeholder="Search lead, company, email..."
          className="field-base md:col-span-2"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              setParam("query", (event.target as HTMLInputElement).value || undefined);
            }
          }}
        />

        <select
          defaultValue={searchParams.get("stage") ?? ""}
          onChange={(event) => setParam("stage", event.target.value || undefined)}
          className="field-select"
        >
          <option value="">All stages</option>
          {stageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("ownerId") ?? ""}
          onChange={(event) => setParam("ownerId", event.target.value || undefined)}
          className="field-select"
        >
          <option value="">All owners</option>
          {ownerOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("sourceId") ?? ""}
          onChange={(event) => setParam("sourceId", event.target.value || undefined)}
          className="field-select"
        >
          <option value="">All sources</option>
          {sourceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          defaultValue={searchParams.get("priority") ?? ""}
          onChange={(event) => setParam("priority", event.target.value || undefined)}
          className="field-select"
        >
          <option value="">Any priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2 text-xs">
          {searchParams.get("stage") ? (
            <button
              type="button"
              onClick={() => setParam("stage")}
              className="ring-focus inline-flex items-center gap-1 rounded-full bg-[var(--blue-soft)] px-2 py-1 font-medium text-[var(--blue-deep)]"
            >
              Stage: {searchParams.get("stage")}
              <X className="h-3 w-3" aria-hidden />
            </button>
          ) : null}
          {searchParams.get("ownerId") ? (
            <button
              type="button"
              onClick={() => setParam("ownerId")}
              className="ring-focus inline-flex items-center gap-1 rounded-full bg-[var(--teal-soft)] px-2 py-1 font-medium text-[var(--teal)]"
            >
              Owner filter
              <X className="h-3 w-3" aria-hidden />
            </button>
          ) : null}
          {searchParams.get("sourceId") ? (
            <button
              type="button"
              onClick={() => setParam("sourceId")}
              className="ring-focus inline-flex items-center gap-1 rounded-full bg-[var(--violet-soft)] px-2 py-1 font-medium text-[var(--violet)]"
            >
              Source filter
              <X className="h-3 w-3" aria-hidden />
            </button>
          ) : null}
          {searchParams.get("priority") ? (
            <button
              type="button"
              onClick={() => setParam("priority")}
              className="ring-focus inline-flex items-center gap-1 rounded-full bg-[var(--amber-soft)] px-2 py-1 font-medium text-[var(--amber)]"
            >
              Priority: {searchParams.get("priority")}
              <X className="h-3 w-3" aria-hidden />
            </button>
          ) : null}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            startTransition(() => {
              router.push("/leads");
            });
          }}
        >
          <X className="mr-1 h-3.5 w-3.5" aria-hidden />
          Clear
        </Button>
      </div>
    </div>
  );
}

