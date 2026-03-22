"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  children: React.ReactNode;
  user: {
    name: string;
    image?: string | null;
    workspaceName: string;
  };
};

export function AppShell({ children, user }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar
        userName={user.name}
        workspaceName={user.workspaceName}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          userName={user.name}
          userImage={user.image}
          workspaceName={user.workspaceName}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 lg:p-6">
          <div className="w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

