import { Button } from "@/components/common/button";
import { requireAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";

function splitName(name: string | null | undefined) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export default async function SettingsPage() {
  const session = await requireAuthSession();

  const workspace = await prisma.workspace.findUnique({
    where: {
      id: session.user.workspaceId,
    },
    select: {
      name: true,
    },
  });

  const name = splitName(session.user.name);

  const notificationItems = [
    {
      label: "Email notifications",
      description: "Receive email for new leads and updates",
      defaultChecked: true,
    },
    {
      label: "Push notifications",
      description: "Browser push alerts for urgent items",
      defaultChecked: true,
    },
    {
      label: "Weekly digest",
      description: "Summary of pipeline activity every Monday",
      defaultChecked: false,
    },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-heading">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your workspace and preferences</p>
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
        <h3 className="font-semibold text-heading">Profile</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-heading">First Name</span>
            <input defaultValue={name.firstName} autoComplete="given-name" className="field-base" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-heading">Last Name</span>
            <input defaultValue={name.lastName} autoComplete="family-name" className="field-base" />
          </label>
        </div>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-heading">Email</span>
          <input defaultValue={session.user.email ?? ""} autoComplete="email" className="field-base" />
        </label>
        <Button className="mt-5">Save Changes</Button>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
        <h3 className="font-semibold text-heading">Notifications</h3>
        <div className="mt-5 space-y-4">
          {notificationItems.map((item) => (
            <label key={item.label} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-heading">{item.label}</div>
                <div className="text-xs text-muted">{item.description}</div>
              </div>
              <input type="checkbox" defaultChecked={item.defaultChecked} className="h-4 w-4 accent-[var(--blue)]" />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_10px_24px_-20px_rgba(16,24,40,0.18)]">
        <h3 className="font-semibold text-heading">Workspace</h3>
        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-heading">Workspace Name</span>
          <input defaultValue={workspace?.name ?? ""} autoComplete="organization" className="field-base" />
        </label>
        <Button variant="secondary" className="mt-5">
          Update Workspace
        </Button>
      </section>
    </div>
  );
}
