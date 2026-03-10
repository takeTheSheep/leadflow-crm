import { LeadPriority, LeadStage } from "@prisma/client";
import { z } from "zod";
import { sanitizeOptionalText, sanitizeTextInput } from "@/lib/security/sanitize";

export const leadFilterSchema = z.object({
  query: z.string().max(120).optional(),
  stage: z.nativeEnum(LeadStage).optional(),
  ownerId: z.string().cuid().optional(),
  sourceId: z.string().cuid().optional(),
  priority: z.nativeEnum(LeadPriority).optional(),
  scoreMin: z.coerce.number().int().min(0).max(100).optional(),
  scoreMax: z.coerce.number().int().min(0).max(100).optional(),
  createdFrom: z.coerce.date().optional(),
  createdTo: z.coerce.date().optional(),
  tags: z.array(z.string().cuid()).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

const createLeadBaseSchema = z.object({
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  company: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().max(40).optional(),
  sourceId: z.string().cuid().optional(),
  ownerId: z.string().cuid(),
  stage: z.nativeEnum(LeadStage).default(LeadStage.NEW),
  priority: z.nativeEnum(LeadPriority).default(LeadPriority.MEDIUM),
  estimatedValue: z.coerce.number().positive().max(1_000_000).optional(),
  probabilityToClose: z.coerce.number().int().min(0).max(100).default(15),
  nextFollowUpAt: z.coerce.date().optional(),
  tagIds: z.array(z.string().cuid()).default([]),
});

export const createLeadSchema = createLeadBaseSchema.transform((data) => ({
  ...data,
  firstName: sanitizeTextInput(data.firstName),
  lastName: sanitizeTextInput(data.lastName),
  company: sanitizeTextInput(data.company),
  phone: sanitizeOptionalText(data.phone),
  email: data.email.toLowerCase().trim(),
}));

export const updateLeadSchema = createLeadBaseSchema
  .partial()
  .extend({
    leadId: z.string().cuid(),
  })
  .transform((data) => ({
    ...data,
    firstName: data.firstName ? sanitizeTextInput(data.firstName) : data.firstName,
    lastName: data.lastName ? sanitizeTextInput(data.lastName) : data.lastName,
    company: data.company ? sanitizeTextInput(data.company) : data.company,
    phone: sanitizeOptionalText(data.phone),
    email: data.email ? data.email.toLowerCase().trim() : data.email,
  }));

export const changeStageSchema = z.object({
  leadId: z.string().cuid(),
  stage: z.nativeEnum(LeadStage),
});

export const assignOwnerSchema = z.object({
  leadId: z.string().cuid(),
  ownerId: z.string().cuid(),
});

export const addNoteSchema = z.object({
  leadId: z.string().cuid(),
  note: z
    .string()
    .min(2)
    .max(2500)
    .transform((value) => sanitizeTextInput(value)),
});

export const updateNoteSchema = z.object({
  noteId: z.string().cuid(),
  leadId: z.string().cuid(),
  note: z
    .string()
    .min(2)
    .max(2500)
    .transform((value) => sanitizeTextInput(value)),
});

export const bulkLeadActionSchema = z.object({
  leadIds: z.array(z.string().cuid()).min(1).max(100),
  action: z.enum(["assign-owner", "change-stage", "add-tag", "archive", "delete"]),
  ownerId: z.string().cuid().optional(),
  stage: z.nativeEnum(LeadStage).optional(),
  tagId: z.string().cuid().optional(),
});

