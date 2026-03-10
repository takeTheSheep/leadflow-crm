"use client";

import { X } from "lucide-react";

type SlideOverPanelProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function SlideOverPanel({ open, title, onClose, children }: SlideOverPanelProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/25" role="dialog" aria-modal>
      <button type="button" className="h-full flex-1" aria-label="Close panel" onClick={onClose} />
      <section className="premium-scrollbar h-full w-full max-w-xl overflow-y-auto border-l border-[var(--border)] bg-white p-6 shadow-2xl">
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-heading">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="ring-focus inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

