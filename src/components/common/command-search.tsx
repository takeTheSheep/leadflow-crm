"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { appNavigation } from "@/constants/navigation";

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [open]);

  const items = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return [];
    }

    return appNavigation.filter((item) => item.label.toLowerCase().includes(term) || item.href.toLowerCase().includes(term));
  }, [query]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ring-focus inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-3 text-sm text-muted transition hover:border-[var(--blue)]/40"
      >
        <Search className="h-4 w-4" aria-hidden />
        <span>Quick Search</span>
        <kbd className="rounded border border-[var(--border)] px-1.5 text-xs text-muted">Ctrl K</kbd>
      </button>

      {open ? (
        <section
          className="surface-card absolute right-0 z-40 mt-2 w-[min(26rem,calc(100vw-2rem))] overflow-hidden"
          role="dialog"
          aria-modal
        >
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-2">
            <Search className="h-4 w-4 text-muted" aria-hidden />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Type to search pages..."
              className="h-9 w-full border-none bg-transparent text-sm text-heading outline-none"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ring-focus inline-flex h-7 w-7 items-center justify-center rounded-md text-muted transition hover:bg-[var(--background-soft)] hover:text-heading"
              aria-label="Close search"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="max-h-72 overflow-y-auto p-2 premium-scrollbar">
            {query.trim() === "" ? (
              <p className="p-3 text-sm text-muted">Start typing to search dashboard pages.</p>
            ) : items.length === 0 ? (
              <p className="p-3 text-sm text-muted">No pages match that search.</p>
            ) : (
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setOpen(false);
                        setQuery("");
                      }}
                      className="ring-focus flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-heading hover:bg-[var(--blue-soft)]"
                    >
                      <item.icon className="h-4 w-4 text-[var(--blue)]" aria-hidden />
                      <span className="flex-1">{item.label}</span>
                      <span className="text-xs text-muted">{item.href}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

