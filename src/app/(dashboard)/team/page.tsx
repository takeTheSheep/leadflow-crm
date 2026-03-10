import { PageHeader } from "@/components/common/page-header";
import { TeamMemberCard } from "@/components/dashboard/team-member-card";
import { getTeamData } from "@/server/queries/team-queries";

export default async function TeamPage() {
  const team = await getTeamData();

  const leaderboard = [...team].sort((a, b) => b.conversionRate - a.conversionRate).slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Team"
        description="Monitor contribution, conversion performance, and response quality across your workspace members."
      />

      <section className="mb-4 surface-card p-5">
        <h2 className="text-base font-semibold text-heading">Top converters this month</h2>
        <p className="text-xs text-muted">Leaderboard based on conversion rate and active opportunity load.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {leaderboard.map((member, index) => (
            <div key={member.userId} className="surface-muted p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">#{index + 1}</p>
              <p className="mt-1 text-sm font-semibold text-heading">{member.name}</p>
              <p className="text-xs text-muted">{member.conversionRate}% conversion | {member.activeLeads} active leads | {member.responseSpeedHours}h response</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {team.map((member) => (
          <TeamMemberCard key={member.userId} {...member} />
        ))}
      </section>
    </div>
  );
}

