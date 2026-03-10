"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

type AnalyticsFilterBarProps = {
  rangeDays: number;
  ownerId?: string;
  sourceId?: string;
  ownerOptions: Array<{ id: string; name: string }>;
  sourceOptions: Array<{ id: string; name: string }>;
};

export function AnalyticsFilterBar({
  rangeDays,
  ownerId,
  sourceId,
  ownerOptions,
  sourceOptions,
}: AnalyticsFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const compactSelectClassName =
    "ring-focus h-10 min-w-32 appearance-none rounded-xl border border-[var(--border)] bg-white px-3 pr-8 text-sm text-heading shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:border-[var(--border-strong)]";

  const setParam = (key: "rangeDays" | "ownerId" | "sourceId", value?: string) => {
    const next = new URLSearchParams(searchParams.toString());

    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    const target = next.toString() ? `/analytics?${next.toString()}` : "/analytics";

    startTransition(() => {
      router.push(target);
    });
  };

  return (
    <section className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative">
        <select
          value={String(rangeDays)}
          onChange={(event) => setParam("rangeDays", event.target.value)}
          className={compactSelectClassName}
        >
          <option value="90">Last 90 days</option>
          <option value="30">Last 30 days</option>
          <option value="7">Last 7 days</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      </div>

      <div className="relative">
        <select
          value={ownerId ?? ""}
          onChange={(event) => setParam("ownerId", event.target.value || undefined)}
          className={compactSelectClassName}
        >
          <option value="">All owners</option>
          {ownerOptions.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      </div>

      <div className="relative">
        <select
          value={sourceId ?? ""}
          onChange={(event) => setParam("sourceId", event.target.value || undefined)}
          className={compactSelectClassName}
        >
          <option value="">All sources</option>
          {sourceOptions.map((source) => (
            <option key={source.id} value={source.id}>
              {source.name}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      </div>

      <p className="ml-auto text-xs text-muted">{isPending ? "Refreshing analytics..." : "Filters update live"}</p>
    </section>
  );
}
