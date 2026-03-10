import { AppShell } from "@/components/layout/app-shell";
import { requireAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuthSession();

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: session.user.workspaceId,
    },
    select: {
      name: true,
    },
  });

  return (
    <AppShell
      user={{
        name: session.user.name ?? "User",
        image: session.user.image,
        workspaceName: workspace?.name ?? "Workspace",
      }}
    >
      {children}
    </AppShell>
  );
}

