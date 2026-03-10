"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { LeadPriority, LeadStage } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { Archive, CheckSquare, FileText, Mail, MoveRight, NotebookPen, PencilLine, Plus, UserRoundCog } from "lucide-react";
import { Button } from "@/components/common/button";
import { OwnerAvatar } from "@/components/common/owner-avatar";
import { StatusPill } from "@/components/common/status-pill";
import { EmptyState } from "@/components/common/empty-state";
import { stageLabels } from "@/constants/navigation";
import {
  addLeadNoteAction,
  archiveLeadAction,
  assignLeadOwnerAction,
  changeLeadStageAction,
  createLeadTaskAction,
  updateLeadNoteAction,
} from "@/server/actions/lead-actions";
import { cn } from "@/lib/utils/cn";

type LeadDetailPanelProps = {
  lead: {
    id: string;
    fullName: string;
    company: string;
    email: string;
    phone: string | null;
    stage: LeadStage;
    priority: LeadPriority;
    leadScore: number;
    estimatedValue: number;
    probabilityToClose: number;
    nextFollowUpAt: Date | null;
    ownerId: string;
    owner: {
      id: string;
      name: string;
      email: string;
      image: string | null;
    };
    source: {
      id: string;
      name: string;
      color: string | null;
    } | null;
    tags: Array<{ tag: { id: string; name: string; color: string | null } }>;
    notes: Array<{ id: string; body: string; createdAt: Date; author: { name: string } }>;
    activities: Array<{ id: string; message: string; createdAt: Date; actor: { name: string } }>;
    tasks: Array<{
      id: string;
      title: string;
      dueDate: Date;
      status: string;
      priority: LeadPriority;
      assignedTo: { name: string };
    }>;
  };
  members: Array<{ id: string; name: string }>;
};

const tabs = [
  { id: "overview", label: "Overview", icon: UserRoundCog },
  { id: "notes", label: "Notes", icon: NotebookPen },
  { id: "activity", label: "Activity", icon: MoveRight },
  { id: "emails", label: "Emails", icon: Mail },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "files", label: "Files", icon: FileText },
] as const;

export function LeadDetailPanel({ lead, members }: LeadDetailPanelProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("overview");
  const [note, setNote] = useState("");
  const [ownerId, setOwnerId] = useState(lead.ownerId);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskAssigneeId, setTaskAssigneeId] = useState(members[0]?.id ?? "");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteBody, setEditingNoteBody] = useState("");
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const now = new Date();

  const expectedCloseDate = useMemo(() => {
    const days = Math.max(7, Math.round((100 - lead.probabilityToClose) * 0.8));
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }, [lead.probabilityToClose]);

  const timeline = useMemo(() => {
    const activityEvents = lead.activities.map((activity) => ({
      id: `activity-${activity.id}`,
      at: new Date(activity.createdAt),
      title: activity.message,
      detail: activity.actor.name,
      kind: "activity" as const,
    }));

    const noteEvents = lead.notes.map((item) => ({
      id: `note-${item.id}`,
      at: new Date(item.createdAt),
      title: "Note added",
      detail: item.author.name,
      kind: "note" as const,
    }));

    const taskEvents = lead.tasks.map((item) => ({
      id: `task-${item.id}`,
      at: new Date(item.dueDate),
      title: item.status === "COMPLETED" ? "Task completed" : "Follow-up scheduled",
      detail: item.title,
      kind: "task" as const,
    }));

    return [...activityEvents, ...noteEvents, ...taskEvents]
      .sort((a, b) => b.at.getTime() - a.at.getTime())
      .slice(0, 10);
  }, [lead.activities, lead.notes, lead.tasks]);

  return (
    <div className="space-y-4">
      <section className="surface-card p-5">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Lead Profile</p>
            <h1 className="mt-2 text-3xl font-semibold text-heading">{lead.fullName}</h1>
            <p className="mt-1 text-sm text-body">{lead.company}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <StatusPill stage={lead.stage} />
              <StatusPill priority={lead.priority} />
              <span className="inline-flex rounded-full bg-[var(--blue-soft)] px-2 py-1 text-xs font-medium text-[var(--blue-deep)]">
                Score {lead.leadScore}
              </span>
              {lead.source ? (
                <span className="inline-flex rounded-full bg-[var(--teal-soft)] px-2 py-1 text-xs font-medium text-[var(--teal)]">
                  {lead.source.name}
                </span>
              ) : null}
              {lead.tags.map((tag) => (
                <span key={tag.tag.id} className="inline-flex rounded-full bg-[var(--violet-soft)] px-2 py-1 text-xs font-medium text-[var(--violet)]">
                  {tag.tag.name}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Estimated deal value</p>
                <p className="text-lg font-semibold text-heading">${Math.round(lead.estimatedValue).toLocaleString()}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Probability to close</p>
                <p className="text-lg font-semibold text-heading">{lead.probabilityToClose}%</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Expected close date</p>
                <p className="text-lg font-semibold text-heading">{expectedCloseDate.toLocaleDateString()}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Lead score</p>
                <p className="text-lg font-semibold text-heading">{lead.leadScore}</p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Next follow-up</p>
                <p className="text-lg font-semibold text-heading">
                  {lead.nextFollowUpAt ? formatDistanceToNow(new Date(lead.nextFollowUpAt), { addSuffix: true }) : "Not scheduled"}
                </p>
              </div>
              <div className="surface-muted p-3">
                <p className="text-xs text-muted">Stage confidence</p>
                <p className="text-lg font-semibold text-heading">{Math.max(5, Math.round(lead.probabilityToClose * 0.85))}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="surface-muted p-3">
              <p className="text-xs text-muted">Owner</p>
              <div className="mt-2 flex items-center gap-2">
                <OwnerAvatar name={lead.owner.name} image={lead.owner.image} className="h-9 w-9" />
                <div>
                  <p className="text-sm font-medium text-heading">{lead.owner.name}</p>
                  <p className="text-xs text-muted">{lead.owner.email}</p>
                </div>
              </div>
            </div>

            <div className="surface-muted space-y-1 p-3 text-sm">
              <p className="text-muted">Contact</p>
              <p className="text-heading">{lead.email}</p>
              <p className="text-heading">{lead.phone || "No phone"}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                defaultValue={lead.stage}
                onChange={(event) => {
                  startTransition(async () => {
                    const result = await changeLeadStageAction({ leadId: lead.id, stage: event.target.value as LeadStage });
                    setFeedback(result.success ? "Stage updated" : result.message ?? "Failed to update stage");
                    if (result.success) {
                      router.refresh();
                    }
                  });
                }}
                className="ring-focus h-10 rounded-xl border border-[var(--border)] bg-white px-2 text-sm"
              >
                {Object.values(LeadStage).map((stage) => (
                  <option key={stage} value={stage}>
                    {stageLabels[stage]}
                  </option>
                ))}
              </select>
              <select
                value={ownerId}
                onChange={(event) => setOwnerId(event.target.value)}
                className="ring-focus h-10 rounded-xl border border-[var(--border)] bg-white px-2 text-sm"
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                disabled={ownerId === lead.ownerId || isPending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await assignLeadOwnerAction({ leadId: lead.id, ownerId });
                    setFeedback(result.success ? "Owner updated" : result.message ?? "Failed to assign owner");
                    if (result.success) {
                      router.refresh();
                    }
                  });
                }}
              >
                Assign owner
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  startTransition(async () => {
                    const result = await archiveLeadAction(lead.id);
                    setFeedback(result.success ? "Lead archived" : result.message ?? "Archive failed");
                    if (result.success) {
                      router.refresh();
                    }
                  });
                }}
              >
                <Archive className="mr-1.5 h-4 w-4" aria-hidden />
                Archive
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  startTransition(async () => {
                    const result = await changeLeadStageAction({ leadId: lead.id, stage: LeadStage.CONTACTED });
                    setFeedback(result.success ? "Marked as contacted" : result.message ?? "Failed to update stage");
                    if (result.success) {
                      router.refresh();
                    }
                  });
                }}
              >
                Mark contacted
              </Button>
            </div>
          </div>
        </div>

        {feedback ? <p className="mt-3 text-sm text-[var(--blue-deep)]">{feedback}</p> : null}
      </section>

      <section className="surface-card p-5">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-[var(--border)] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "ring-focus inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium transition",
                activeTab === tab.id
                  ? "bg-[var(--blue-soft)] text-[var(--blue-deep)]"
                  : "text-muted hover:bg-[var(--background-soft)] hover:text-heading",
              )}
            >
              <tab.icon className="h-4 w-4" aria-hidden />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" ? (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Deal summary</p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-white/80 p-2">
                    <dt className="text-xs text-muted">Deal value</dt>
                    <dd className="font-semibold text-heading">${Math.round(lead.estimatedValue).toLocaleString()}</dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-2">
                    <dt className="text-xs text-muted">Lead score</dt>
                    <dd className="font-semibold text-heading">{lead.leadScore}</dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-2">
                    <dt className="text-xs text-muted">Close probability</dt>
                    <dd className="font-semibold text-heading">{lead.probabilityToClose}%</dd>
                  </div>
                  <div className="rounded-xl bg-white/80 p-2">
                    <dt className="text-xs text-muted">Expected close</dt>
                    <dd className="font-semibold text-heading">{expectedCloseDate.toLocaleDateString()}</dd>
                  </div>
                </dl>
              </div>

              <div className="surface-muted space-y-2 p-4 text-sm text-body">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Quick Actions</p>
                <Link href="/pipeline" className="block text-[var(--blue-deep)] hover:underline">Move stage in pipeline board</Link>
                <button type="button" className="text-left text-[var(--blue-deep)] hover:underline" onClick={() => setActiveTab("notes")}>Add context note</button>
                <button type="button" className="text-left text-[var(--blue-deep)] hover:underline" onClick={() => setActiveTab("tasks")}>Schedule follow-up task</button>
                <button
                  type="button"
                  className="text-left text-[var(--blue-deep)] hover:underline"
                  onClick={() => {
                    startTransition(async () => {
                      const result = await changeLeadStageAction({ leadId: lead.id, stage: LeadStage.CONTACTED });
                      setFeedback(result.success ? "Marked as contacted" : result.message ?? "Failed to update stage");
                    });
                  }}
                >
                  Mark contacted
                </button>
              </div>
            </div>

            <div className="surface-muted p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted">Lead Timeline</p>
              <ol className="space-y-3">
                {timeline.length === 0 ? (
                  <li className="text-sm text-muted">No lead timeline events yet.</li>
                ) : (
                  timeline.map((item) => (
                    <li key={item.id} className="relative pl-6">
                      <span
                        className={cn(
                          "absolute left-0 top-1 h-3 w-3 rounded-full",
                          item.kind === "task"
                            ? "bg-[var(--amber)]"
                            : item.kind === "note"
                              ? "bg-[var(--violet)]"
                              : "bg-[var(--blue)]",
                        )}
                        aria-hidden
                      />
                      <p className="text-sm font-medium text-heading">{item.title}</p>
                      <p className="text-xs text-muted">{item.detail} | {formatDistanceToNow(item.at, { addSuffix: true })}</p>
                    </li>
                  ))
                )}
              </ol>
            </div>
          </div>
        ) : null}

        {activeTab === "notes" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-white p-4">
              <label className="text-sm text-muted">Add note</label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={4}
                className="ring-focus mt-2 w-full rounded-xl border border-[var(--border)] p-3 text-sm"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  onClick={() => {
                    startTransition(async () => {
                      const result = await addLeadNoteAction({ leadId: lead.id, note });
                      setFeedback(result.success ? "Note added" : result.message ?? "Failed to add note");
                      if (result.success) {
                        setNote("");
                        router.refresh();
                      }
                    });
                  }}
                  disabled={!note.trim() || isPending}
                >
                  <Plus className="mr-1.5 h-4 w-4" aria-hidden />
                  Save Note
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {lead.notes.length === 0 ? (
                <EmptyState
                  compact
                  title="No notes yet"
                  description="Capture meeting context, objections, and handoff details here."
                  icon={NotebookPen}
                />
              ) : (
                lead.notes.map((item) => (
                  <article key={item.id} className="surface-muted p-4">
                    {editingNoteId === item.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingNoteBody}
                          onChange={(event) => setEditingNoteBody(event.target.value)}
                          rows={3}
                          className="ring-focus w-full rounded-xl border border-[var(--border)] p-3 text-sm"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingNoteId(null);
                              setEditingNoteBody("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            disabled={!editingNoteBody.trim() || isPending}
                            onClick={() => {
                              startTransition(async () => {
                                const result = await updateLeadNoteAction({
                                  noteId: item.id,
                                  leadId: lead.id,
                                  note: editingNoteBody,
                                });
                                setFeedback(result.success ? "Note updated" : result.message ?? "Failed to update note");
                                if (result.success) {
                                  setEditingNoteId(null);
                                  setEditingNoteBody("");
                                  router.refresh();
                                }
                              });
                            }}
                          >
                            Save changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-body">{item.body}</p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <p className="text-xs text-muted">
                            {item.author.name} | {new Date(item.createdAt).toLocaleString()}
                          </p>
                          <button
                            type="button"
                            className="ring-focus inline-flex items-center gap-1 text-xs font-medium text-[var(--blue-deep)] hover:underline"
                            onClick={() => {
                              setEditingNoteId(item.id);
                              setEditingNoteBody(item.body);
                            }}
                          >
                            <PencilLine className="h-3.5 w-3.5" aria-hidden />
                            Edit
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "activity" ? (
          <div className="space-y-3">
            {lead.activities.map((activity) => (
              <article key={activity.id} className="surface-muted p-4">
                <p className="text-sm text-body">
                  <span className="font-medium text-heading">{activity.actor.name}</span> {activity.message}
                </p>
                <p className="mt-1 text-xs text-muted">{new Date(activity.createdAt).toLocaleString()}</p>
              </article>
            ))}
          </div>
        ) : null}

        {activeTab === "emails" ? (
          <EmptyState
            title="Email timeline coming soon"
            description="The architecture is ready for outbound and inbound email syncing in a future iteration."
            icon={Mail}
          />
        ) : null}

        {activeTab === "tasks" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-[var(--border)] bg-white p-4">
              <p className="text-sm text-muted">Schedule task</p>
              <div className="mt-2 grid gap-3 md:grid-cols-3">
                <input
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  placeholder="Task title"
                  className="ring-focus h-10 rounded-xl border border-[var(--border)] px-3 text-sm"
                />
                <input
                  value={taskDueDate}
                  onChange={(event) => setTaskDueDate(event.target.value)}
                  type="date"
                  className="ring-focus h-10 rounded-xl border border-[var(--border)] px-3 text-sm"
                />
                <select
                  value={taskAssigneeId}
                  onChange={(event) => setTaskAssigneeId(event.target.value)}
                  className="ring-focus h-10 rounded-xl border border-[var(--border)] px-3 text-sm"
                >
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                    onClick={() => {
                      startTransition(async () => {
                        const result = await createLeadTaskAction({
                          leadId: lead.id,
                          title: taskTitle,
                        dueDate: taskDueDate,
                        assignedToId: taskAssigneeId,
                        priority: "MEDIUM",
                      });

                      setFeedback(result.success ? "Task created" : result.message ?? "Failed to create task");

                        if (result.success) {
                          setTaskTitle("");
                          setTaskDueDate("");
                          router.refresh();
                        }
                      });
                    }}
                  disabled={!taskTitle.trim() || !taskDueDate || isPending}
                >
                  Add Task
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {lead.tasks.length === 0 ? (
                <EmptyState
                  compact
                  title="No tasks scheduled"
                  description="Assign follow-ups to keep this opportunity moving."
                  icon={CheckSquare}
                />
              ) : (
                lead.tasks.map((task) => (
                  <article
                    key={task.id}
                    className={cn(
                      "surface-muted p-4 transition",
                      new Date(task.dueDate) < now && task.status !== "COMPLETED"
                        ? "border-[var(--rose)]/35 bg-[var(--rose-soft)]/55"
                        : "",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-heading">{task.title}</p>
                      <StatusPill priority={task.priority} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-white/75 px-2 py-0.5 text-muted">{task.status}</span>
                      <span className={new Date(task.dueDate) < now && task.status !== "COMPLETED" ? "text-[var(--rose)]" : "text-muted"}>
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span className="text-muted">Assigned to {task.assignedTo.name}</span>
                      <span className={new Date(task.dueDate) < now && task.status !== "COMPLETED" ? "font-semibold text-[var(--rose)]" : "font-medium text-[var(--teal)]"}>
                        {new Date(task.dueDate) < now && task.status !== "COMPLETED" ? "Overdue" : "On track"}
                      </span>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "files" ? (
          <EmptyState
            title="File uploads placeholder"
            description="File storage hooks are reserved for a secure upload provider integration in a future release."
            icon={FileText}
          />
        ) : null}
      </section>
    </div>
  );
}

