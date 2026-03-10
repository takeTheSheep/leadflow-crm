"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, DollarSign, Target, TrendingUp, UserCheck } from "lucide-react";
import { TrendBadge } from "@/components/dashboard/trend-badge";

type KPIStatCardProps = {
  label: string;
  value: string;
  rawValue: number;
  note: string;
  trend: number;
  accent: "blue" | "teal" | "violet" | "amber" | "rose";
};

const accentClasses: Record<KPIStatCardProps["accent"], string> = {
  blue: "from-[var(--blue-soft)]/90 to-white text-[var(--blue-deep)]",
  teal: "from-[var(--teal-soft)]/90 to-white text-[var(--teal)]",
  violet: "from-[var(--violet-soft)]/90 to-white text-[var(--violet)]",
  amber: "from-[var(--amber-soft)]/90 to-white text-[var(--amber)]",
  rose: "from-[var(--rose-soft)]/90 to-white text-[var(--rose)]",
};

const accentIcons: Record<KPIStatCardProps["accent"], LucideIcon> = {
  blue: TrendingUp,
  teal: UserCheck,
  violet: Target,
  amber: DollarSign,
  rose: Activity,
};

function formatDisplay(rawValue: number, fallback: string) {
  if (fallback.includes("%")) {
    return `${rawValue.toFixed(1)}%`;
  }

  if (fallback.startsWith("$")) {
    return `$${Math.round(rawValue).toLocaleString()}`;
  }

  return Math.round(rawValue).toLocaleString();
}

export function KPIStatCard({
  label,
  rawValue,
  value,
  note,
  trend,
  accent,
}: KPIStatCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const Icon = accentIcons[accent];

  useEffect(() => {
    const start = performance.now();
    const duration = 900;

    const frame = (timestamp: number) => {
      const progress = Math.min(1, (timestamp - start) / duration);
      setAnimatedValue(rawValue * progress);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }, [rawValue]);

  const display = useMemo(() => formatDisplay(animatedValue, value), [animatedValue, value]);

  return (
    <article className="surface-card group p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-heading">{display}</p>
        </div>
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${accentClasses[accent]}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <TrendBadge value={trend} />
        <p className="text-xs text-muted">{note}</p>
      </div>
    </article>
  );
}

