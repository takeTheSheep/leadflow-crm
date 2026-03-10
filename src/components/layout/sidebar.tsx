"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { appNavigation } from "@/constants/navigation";
import { Button } from "@/components/common/button";
import { cn } from "@/lib/utils/cn";

type SidebarProps = {
  userName: string;
  workspaceName: string;
};

export function Sidebar({ userName, workspaceName }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(248,251,255,0.8))] p-5 backdrop-blur xl:flex">
      <Link href="/" className="mb-8 inline-flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--blue)] to-[var(--violet)] text-sm font-bold text-white">
          LF
        </span>
        <div>
          <p className="text-sm font-semibold text-heading">LeadFlow CRM</p>
          <p className="text-xs text-muted">{workspaceName}</p>
        </div>
      </Link>

      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Workspace</p>
      <nav className="space-y-1.5">
        {appNavigation.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "ring-focus flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-[linear-gradient(90deg,rgba(220,232,255,0.95),rgba(238,233,255,0.85))] text-[var(--blue-deep)] shadow-[inset_0_0_0_1px_rgba(79,124,255,0.24)]"
                  : "text-muted hover:bg-[var(--background-soft)] hover:text-heading",
              )}
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto surface-muted p-4">
        <p className="text-sm font-medium text-heading">{userName}</p>
        <p className="mt-1 text-xs text-muted">Secure workspace session</p>

        <Button
          variant="ghost"
          className="mt-4 w-full justify-start"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" aria-hidden />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

