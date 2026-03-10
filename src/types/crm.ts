import { ActivityType, LeadPriority, LeadStage, Role, TaskStatus } from "@prisma/client";

export type LeadRow = {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string | null;
  source: string | null;
  sourceColor: string | null;
  ownerId: string;
  ownerName: string;
  ownerImage: string | null;
  stage: LeadStage;
  priority: LeadPriority;
  leadScore: number;
  estimatedValue: number;
  probabilityToClose: number;
  nextFollowUpAt: Date | null;
  createdAt: Date;
  tags: Array<{ id: string; name: string; color: string | null }>;
};

export type DashboardMetric = {
  label: string;
  value: string;
  rawValue: number;
  trend: number;
  note: string;
  accent: "blue" | "teal" | "violet" | "amber" | "rose";
};

export type ActivityItem = {
  id: string;
  leadId: string;
  leadName: string;
  actorName: string;
  message: string;
  type: ActivityType;
  createdAt: Date;
};

export type TeamPerformance = {
  userId: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  activeLeads: number;
  conversionRate: number;
  averageResponseHours: number;
  recentActivity: string;
};

export type TaskItem = {
  id: string;
  leadId: string;
  leadName: string;
  title: string;
  status: TaskStatus;
  priority: LeadPriority;
  dueDate: Date;
  assignedToId: string;
  assignedToName: string;
};

