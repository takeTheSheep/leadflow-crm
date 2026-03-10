import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
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
  return (
    <div className="flex min-h-screen overflow-x-hidden bg-transparent">
      <Sidebar userName={user.name} workspaceName={user.workspaceName} />

      <main className="min-w-0 flex-1 overflow-x-hidden px-4 pb-8 pt-4 md:px-6 xl:px-8">
        <div className="mx-auto w-full min-w-0 max-w-[1400px]">
          <MobileNav />

          <Topbar userName={user.name} userImage={user.image} workspaceName={user.workspaceName} />
          {children}
        </div>
      </main>
    </div>
  );
}

