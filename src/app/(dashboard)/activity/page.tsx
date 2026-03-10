import Link from "next/link";
import { ActivityType } from "@prisma/client";
import { Clock3 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { OwnerAvatar } from "@/components/common/owner-avatar";
import { requireAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { getActivityFeed } from "@/server/queries/activity-queries";

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const session = await requireAuthSession();

  const actorId = typeof params.actorId === "string" ? params.actorId : undefined;
  const action = typeof params.action === "string" ? (params.action as ActivityType) : undefined;

  const [activities, members] = await Promise.all([
    getActivityFeed({
      actorId,
      action,
      from: typeof params.from === "string" ? new Date(params.from) : undefined,
      to: typeof params.to === "string" ? new Date(params.to) : undefined,
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
          },
        },
      },
    }),
  ]);

  const grouped = activities.reduce<Record<string, typeof activities>>((acc, item) => {
    const dateKey = new Date(item.createdAt).toDateString();
    acc[dateKey] = acc[dateKey] ? [...acc[dateKey], item] : [item];
    return acc;
  }, {});

  const groupedEntries = Object.entries(grouped).sort(
    (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
  );

  return (
    <div>
      <PageHeader
        title="Activity Feed"
        description="Chronological audit trail of lead events, assignments, follow-ups, and workflow actions."
      />

      <form className="surface-card mb-4 grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-5">
        <select name="actorId" defaultValue={actorId ?? ""} className="field-select">
          <option value="">All users</option>
          {members.map((member) => (
            <option key={member.user.id} value={member.user.id}>
              {member.user.name}
            </option>
          ))}
        </select>

        <select name="action" defaultValue={action ?? ""} className="field-select">
          <option value="">All actions</option>
          {Object.values(ActivityType).map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        <input type="date" name="from" defaultValue={typeof params.from === "string" ? params.from : ""} className="field-base" />
        <input type="date" name="to" defaultValue={typeof params.to === "string" ? params.to : ""} className="field-base" />

        <div className="flex items-center gap-2 md:col-span-2 xl:col-span-1">
          <button type="submit" className="ring-focus h-10 flex-1 rounded-xl bg-[var(--blue)] px-3 text-sm font-medium text-white">
            Apply Filters
          </button>
          <Link href="/activity" className="ring-focus inline-flex h-10 items-center justify-center rounded-xl border border-[var(--border)] px-3 text-sm text-heading hover:bg-[var(--background-soft)]">
            Clear
          </Link>
        </div>
      </form>

      <section className="surface-card p-5">
        {groupedEntries.length === 0 ? (
          <EmptyState
            title="No activities yet"
            description="Operational events, lead updates, and assignment logs will appear once your team starts working leads."
            icon={Clock3}
          />
        ) : (
          <div className="space-y-6">
            {groupedEntries.map(([day, items]) => (
              <section key={day}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-px flex-1 bg-[var(--border)]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{new Date(day).toDateString()}</p>
                  <span className="h-px flex-1 bg-[var(--border)]" />
                </div>

                <ul className="space-y-3">
                  {items.map((activity) => (
                    <li key={activity.id} className="rounded-xl border border-[var(--border)] bg-white/85 p-4 transition hover:border-[var(--blue)]/25 hover:shadow-[0_18px_26px_-22px_rgba(50,70,120,0.45)]">
                      <div className="flex items-start gap-3">
                        <OwnerAvatar name={activity.actor.name} className="h-9 w-9" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-[var(--blue-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--blue-deep)]">
                              {activity.activityType.replaceAll("_", " ")}
                            </span>
                            <span className="text-xs text-muted">{new Date(activity.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="mt-1 text-sm text-body">
                            <span className="font-medium text-heading">{activity.actor.name}</span> {activity.message}
                          </p>
                          <p className="mt-1 text-xs text-muted">Object: {activity.lead.firstName} {activity.lead.lastName} at {activity.lead.company}</p>
                          <div className="mt-2">
                            <Link href={`/leads/${activity.lead.id}`} className="text-xs font-medium text-[var(--blue-deep)] hover:underline">
                              Open lead record
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

