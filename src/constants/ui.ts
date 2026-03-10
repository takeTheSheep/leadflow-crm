import { LeadPriority, LeadStage, Role } from "@prisma/client";

export const roleLabel: Record<Role, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  SALES_REP: "Sales Rep",
};

export const leadPriorityLabel: Record<LeadPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export const stageColorClass: Record<LeadStage, string> = {
  NEW: "bg-slate-100 text-slate-700 border-slate-200",
  CONTACTED: "bg-blue-100 text-blue-700 border-blue-200",
  QUALIFIED: "bg-teal-100 text-teal-700 border-teal-200",
  PROPOSAL_SENT: "bg-violet-100 text-violet-700 border-violet-200",
  NEGOTIATION: "bg-amber-100 text-amber-800 border-amber-200",
  WON: "bg-emerald-100 text-emerald-700 border-emerald-200",
  LOST: "bg-rose-100 text-rose-700 border-rose-200",
};

export const priorityColorClass: Record<LeadPriority, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-800",
  URGENT: "bg-rose-100 text-rose-700",
};

