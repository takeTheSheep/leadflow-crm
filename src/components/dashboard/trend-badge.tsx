import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type TrendBadgeProps = {
  value: number;
  className?: string;
};

export function TrendBadge({ value, className }: TrendBadgeProps) {
  const positive = value >= 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
        positive ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700",
        className,
      )}
    >
      {positive ? <TrendingUp className="h-3.5 w-3.5" aria-hidden /> : <TrendingDown className="h-3.5 w-3.5" aria-hidden />}
      {positive ? "+" : ""}
      {value}%
    </span>
  );
}

