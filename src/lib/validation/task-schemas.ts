import { LeadPriority, TaskStatus } from "@prisma/client";
import { z } from "zod";
import { sanitizeOptionalText, sanitizeTextInput } from "@/lib/security/sanitize";

export const createTaskSchema = z.object({
  leadId: z.string().cuid(),
  title: z.string().min(2).max(120).transform((value) => sanitizeTextInput(value)),
  description: z
    .string()
    .max(1000)
    .optional()
    .transform((value) => sanitizeOptionalText(value)),
  assignedToId: z.string().cuid(),
  dueDate: z.coerce.date(),
  priority: z.nativeEnum(LeadPriority).default(LeadPriority.MEDIUM),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.string().cuid(),
  status: z.nativeEnum(TaskStatus),
});

