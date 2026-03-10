"use client";

type DateRangePickerPlaceholderProps = {
  label?: string;
};

export function DateRangePickerPlaceholder({ label = "Date range" }: DateRangePickerPlaceholderProps) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <input type="date" className="ring-focus h-9 rounded-lg border border-[var(--border)] bg-white px-2 text-sm" />
      <span className="text-muted">to</span>
      <input type="date" className="ring-focus h-9 rounded-lg border border-[var(--border)] bg-white px-2 text-sm" />
    </label>
  );
}

