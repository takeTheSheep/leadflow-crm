import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { CircleDot } from "lucide-react";
import { EmptyState } from "@/components/common/empty-state";

type ActivityFeedItem = {
  id: string;
  message: string;
  createdAt: Date;
  actor: {
    name: string;
  };
  lead: {
    id: string;
    firstName: string;
    lastName: string;
    company: string;
  };
};

type ActivityFeedProps = {
  items: ActivityFeedItem[];
};

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className="surface-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-heading">Recent Activity</h3>
        <Link href="/activity" className="text-sm font-medium text-[var(--blue-deep)] hover:underline">
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          compact
          title="No recent events"
          description="Lead lifecycle activity will appear here as your team starts working opportunities."
          icon={CircleDot}
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-xl border border-[var(--border)] bg-white/75 p-3 transition hover:border-[var(--blue)]/30 hover:bg-white">
              <div className="flex items-start gap-2">
                <CircleDot className="mt-0.5 h-4 w-4 text-[var(--blue)]" aria-hidden />
                <div className="space-y-1">
                  <p className="text-sm text-body">
                    <span className="font-medium text-heading">{item.actor.name}</span> {item.message}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted">
                    <Link href={`/leads/${item.lead.id}`} className="font-medium text-[var(--blue-deep)] hover:underline">
                      {item.lead.company}
                    </Link>
                    <span>|</span>
                    <span>{formatDistanceToNow(item.createdAt, { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

