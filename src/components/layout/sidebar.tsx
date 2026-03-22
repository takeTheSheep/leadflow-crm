"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { appNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils/cn";

type SidebarProps = {
  userName: string;
  workspaceName: string;
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ userName, workspaceName, open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open ? <button type="button" className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={onClose} aria-label="Close sidebar overlay" /> : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-white/8 bg-[#111827] text-slate-100 transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <Link href="/" className="inline-flex items-center gap-3" onClick={onClose}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg hero-gradient text-xs font-bold text-white">
              LF
            </span>
            <p className="text-lg font-bold text-white">LeadFlow</p>
          </Link>

          <button
            type="button"
            className="ring-focus inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/8 hover:text-white lg:hidden"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-5">
          {appNavigation.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "ring-focus flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/6 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/8 p-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--blue)]/15 text-xs font-semibold text-[var(--blue-soft)]">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{userName}</p>
              <p className="truncate text-xs text-slate-400">{workspaceName}</p>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/8 hover:text-white"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

