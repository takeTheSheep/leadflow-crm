import { Role } from "@prisma/client";

export function canViewWorkspaceData(role: Role) {
  return [Role.ADMIN, Role.MANAGER, Role.SALES_REP].includes(role);
}

export function canManageUsers(role: Role) {
  return role === Role.ADMIN;
}

export function canExportData(role: Role) {
  return role === Role.ADMIN;
}

export function canDeleteLead(role: Role) {
  return role === Role.ADMIN;
}

export function canManageLead({
  role,
  userId,
  ownerId,
}: {
  role: Role;
  userId: string;
  ownerId: string;
}) {
  if (role === Role.ADMIN) {
    return true;
  }

  if (role === Role.MANAGER) {
    return true;
  }

  return role === Role.SALES_REP && userId === ownerId;
}

export function canAssignLead(role: Role) {
  return role === Role.ADMIN || role === Role.MANAGER;
}

export function canChangeWorkspaceSettings(role: Role) {
  return role === Role.ADMIN;
}

export function canViewAnalytics(role: Role) {
  return role === Role.ADMIN || role === Role.MANAGER;
}

export function canUseTeamView(role: Role) {
  return role === Role.ADMIN || role === Role.MANAGER;
}

