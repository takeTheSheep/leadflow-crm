"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeadPriority, LeadStage } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createLeadAction } from "@/server/actions/lead-actions";
import { Button } from "@/components/common/button";
import { SlideOverPanel } from "@/components/modals/slide-over-panel";

const formSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  company: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  ownerId: z.string().min(1),
  sourceId: z.string().optional(),
  priority: z.nativeEnum(LeadPriority),
  stage: z.nativeEnum(LeadStage),
  estimatedValue: z.coerce.number().min(0).optional(),
  probabilityToClose: z.coerce.number().min(0).max(100),
  nextFollowUpAt: z.string().optional(),
});

type LeadFormInput = z.input<typeof formSchema>;

type LeadFormModalProps = {
  open: boolean;
  onClose: () => void;
  context: {
    members: Array<{ id: string; name: string }>;
    sources: Array<{ id: string; name: string }>;
  };
};

export function LeadFormModal({ open, onClose, context }: LeadFormModalProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LeadFormInput>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      phone: "",
      ownerId: context.members[0]?.id ?? "",
      sourceId: context.sources[0]?.id,
      priority: LeadPriority.MEDIUM,
      stage: LeadStage.NEW,
      estimatedValue: undefined,
      probabilityToClose: 15,
      nextFollowUpAt: "",
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await createLeadAction({
        ...values,
        nextFollowUpAt: values.nextFollowUpAt ? new Date(values.nextFollowUpAt) : undefined,
      });

      if (result.success) {
        form.reset();
        onClose();
      } else {
        form.setError("root", {
          message: result.message,
        });
      }
    });
  });

  return (
    <SlideOverPanel open={open} onClose={onClose} title="Create Lead">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted">First name</span>
            <input {...form.register("firstName")} className="field-base" />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted">Last name</span>
            <input {...form.register("lastName")} className="field-base" />
          </label>
        </div>

        <label className="space-y-1 text-sm">
          <span className="text-muted">Company</span>
          <input {...form.register("company")} className="field-base" />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted">Email</span>
          <input type="email" {...form.register("email")} className="field-base" />
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted">Owner</span>
            <select {...form.register("ownerId")} className="field-select">
              {context.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted">Source</span>
            <select {...form.register("sourceId")} className="field-select">
              {context.sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted">Priority</span>
            <select {...form.register("priority")} className="field-select">
              {Object.values(LeadPriority).map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted">Stage</span>
            <select {...form.register("stage")} className="field-select">
              {Object.values(LeadStage).map((stage) => (
                <option key={stage} value={stage}>
                  {stage.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="text-muted">Estimated value</span>
            <input
              type="number"
              step="100"
              {...form.register("estimatedValue")}
              className="field-base"
            />
          </label>

          <label className="space-y-1 text-sm">
            <span className="text-muted">Follow-up date</span>
            <input type="date" {...form.register("nextFollowUpAt")} className="field-base" />
          </label>
        </div>

        {form.formState.errors.root?.message ? <p className="text-sm text-rose-600">{form.formState.errors.root.message}</p> : null}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Create Lead"}
          </Button>
        </div>
      </form>
    </SlideOverPanel>
  );
}

