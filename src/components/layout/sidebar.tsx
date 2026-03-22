"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { appNavigation } from "@/constants/navigation";
import { Button } from "@/components/common/button";
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
          "fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col border-r border-white/8 bg-[#111827] px-4 py-5 text-slate-100 transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3" onClick={onClose}>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg hero-gradient text-sm font-bold text-white">
              LF
            </span>
            <div>
              <p className="text-sm font-semibold text-white">LeadFlow CRM</p>
              <p className="text-xs text-slate-400">{workspaceName}</p>
            </div>
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

        <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</p>
        <nav className="space-y-1">
          {appNavigation.map((item) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "ring-focus flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
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

        <div className="mt-auto rounded-xl border border-white/8 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--blue)]/15 text-sm font-semibold text-[var(--blue-soft)]">
              {userName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{userName}</p>
              <p className="truncate text-xs text-slate-400">{workspaceName}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            className="mt-4 w-full justify-start text-slate-200 hover:bg-white/8 hover:text-white"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 h-4 w-4" aria-hidden />
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}

