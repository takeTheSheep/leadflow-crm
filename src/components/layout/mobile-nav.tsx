"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils/cn";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="mb-4 flex gap-2 overflow-x-auto py-1 premium-scrollbar xl:hidden">
      {appNavigation.map((item) => {
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
              active
                ? "border-[var(--blue)]/30 bg-[var(--blue-soft)] text-[var(--blue-deep)]"
                : "border-[var(--border)] bg-white text-muted hover:border-[var(--border-strong)] hover:text-heading",
            )}
          >
            <item.icon className="h-4 w-4" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
