import { requireAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { roleLabel } from "@/constants/ui";
import { PageHeader } from "@/components/common/page-header";
import { SettingsTabs } from "@/components/dashboard/settings-tabs";

export default async function SettingsPage() {
  const session = await requireAuthSession();

  const [workspace, members, loginEvents] = await Promise.all([
    prisma.workspace.findUnique({
      where: {
        id: session.user.workspaceId,
      },
      select: {
        name: true,
        timezone: true,
        currency: true,
      },
    }),
    prisma.membership.findMany({
      where: {
        workspaceId: session.user.workspaceId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.loginEvent.findMany({
      where: {
        workspaceId: session.user.workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted">Manage identity details shown in shared records and audit history.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-muted">Name</span>
              <input defaultValue={session.user.name ?? ""} className="field-base" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted">Email</span>
              <input defaultValue={session.user.email ?? ""} className="field-base" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted">Password</span>
              <input type="password" placeholder="New password" className="field-base" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted">Avatar</span>
              <input disabled placeholder="Upload placeholder" className="field-base cursor-not-allowed bg-[var(--background-soft)] text-muted" />
            </label>
          </div>
        </div>
      ),
    },
    {
      id: "workspace",
      label: "Workspace",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted">Control workspace-level defaults for reporting, pipeline standards, and localization.</p>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-muted">Company name</span>
              <input defaultValue={workspace?.name ?? ""} className="field-base" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted">Timezone</span>
              <input defaultValue={workspace?.timezone ?? "UTC"} className="field-base" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted">Currency</span>
              <input defaultValue={workspace?.currency ?? "USD"} className="field-base" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted">Default stages</span>
              <input defaultValue="New, Contacted, Qualified, Proposal Sent, Negotiation, Won, Lost" className="field-base" />
            </label>
          </div>
        </div>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      content: (
        <div className="space-y-4 text-sm text-body">
          <p className="text-sm text-muted">Tune how your team receives follow-up reminders and workflow alerts.</p>
          <div className="space-y-3">
            <label className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white p-3">
              <span>Email updates for assigned leads</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--blue)]" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white p-3">
              <span>Daily digest summary</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--blue)]" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white p-3">
              <span>Overdue follow-up reminders</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-[var(--blue)]" />
            </label>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      label: "Security",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted">Monitor account access, session history, and suspicious login signals.</p>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="surface-muted p-3">
              <p className="field-label">Active sessions</p>
              <p className="mt-2 text-lg font-semibold text-heading">
                {loginEvents.filter((event) => event.success).slice(0, 3).length}
              </p>
            </div>
            <div className="surface-muted p-3">
              <p className="field-label">Last login</p>
              <p className="mt-2 text-sm font-semibold text-heading">
                {loginEvents.find((event) => event.success)?.createdAt
                  ? new Date(loginEvents.find((event) => event.success)!.createdAt).toLocaleString()
                  : "No login events"}
              </p>
            </div>
            <div className="surface-muted p-3">
              <p className="field-label">Last login location</p>
              <p className="mt-2 text-sm font-semibold text-heading">
                {loginEvents.find((event) => event.success)?.ipAddress ?? "Location placeholder"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-white p-4">
            <p className="text-sm font-semibold text-heading">Session visibility</p>
            <p className="mt-1 text-xs text-muted">Review recent sign-in and sign-out events.</p>
            <ul className="mt-3 space-y-2 text-xs text-body">
              {loginEvents.map((event) => (
                <li key={event.id} className="rounded-lg bg-[var(--background-soft)] p-2">
                  {event.success ? "Successful" : "Failed"} | {event.email} | {new Date(event.createdAt).toLocaleString()} | {event.ipAddress ?? "Unknown IP"}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--amber-soft)] p-4 text-sm text-body">
            2FA and anomaly detection are planned as the next security hardening milestone.
          </div>
        </div>
      ),
    },
    {
      id: "permissions",
      label: "Team Permissions",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted">Assign role scopes carefully to protect data access and workflow controls.</p>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.user.id} className="rounded-xl border border-[var(--border)] bg-white p-3 text-sm">
                <p className="font-medium text-heading">{member.user.name}</p>
                <p className="text-xs text-muted">{member.user.email}</p>
                <span className="mt-2 inline-flex rounded-full bg-[var(--blue-soft)] px-2 py-1 text-xs font-medium text-[var(--blue-deep)]">
                  {roleLabel[member.role]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "integrations",
      label: "Integrations",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-muted">Connect outreach channels, marketing systems, and internal automations.</p>
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--background-soft)] p-5 text-sm text-body">
            Integration architecture placeholders are ready for CRM sync, outbound webhooks, and secure API token management.
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your profile, workspace preferences, notifications, security posture, and team permissions."
      />

      <SettingsTabs tabs={tabs} />
    </div>
  );
}

