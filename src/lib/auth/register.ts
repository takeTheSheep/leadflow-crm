import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/lib/security/safe-error";
import { registerSchema } from "@/lib/validation/auth-schemas";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function registerDemoUser(payload: unknown) {
  const parsed = registerSchema.safeParse(payload);

  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "Invalid registration data", 400);
  }

  const { name, email, password, workspaceName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const workspaceSlug = `${slugify(workspaceName)}-${Math.floor(Math.random() * 10_000)}`;
  const passwordHash = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: workspaceName,
        slug: workspaceSlug,
      },
    });

    const user = await tx.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    await tx.membership.create({
      data: {
        workspaceId: workspace.id,
        userId: user.id,
        role: Role.ADMIN,
        isDefault: true,
      },
    });

    await tx.pipelineStage.createMany({
      data: [
        { workspaceId: workspace.id, name: "New", stageOrder: 1, key: "NEW", color: "#9AA6C4", winProbability: 10 },
        { workspaceId: workspace.id, name: "Contacted", stageOrder: 2, key: "CONTACTED", color: "#4F7CFF", winProbability: 20 },
        { workspaceId: workspace.id, name: "Qualified", stageOrder: 3, key: "QUALIFIED", color: "#3CC7B2", winProbability: 40 },
        {
          workspaceId: workspace.id,
          name: "Proposal Sent",
          stageOrder: 4,
          key: "PROPOSAL_SENT",
          color: "#8B7CFF",
          winProbability: 55,
        },
        {
          workspaceId: workspace.id,
          name: "Negotiation",
          stageOrder: 5,
          key: "NEGOTIATION",
          color: "#FFB547",
          winProbability: 70,
        },
        { workspaceId: workspace.id, name: "Won", stageOrder: 6, key: "WON", color: "#22C55E", winProbability: 100 },
        { workspaceId: workspace.id, name: "Lost", stageOrder: 7, key: "LOST", color: "#F87171", winProbability: 0 },
      ],
    });

    await tx.leadSource.createMany({
      data: [
        { workspaceId: workspace.id, name: "Organic", color: "#4F7CFF", isSystem: true },
        { workspaceId: workspace.id, name: "Referral", color: "#3CC7B2", isSystem: true },
        { workspaceId: workspace.id, name: "Paid Ads", color: "#FFB547", isSystem: true },
        { workspaceId: workspace.id, name: "Outreach", color: "#8B7CFF", isSystem: true },
        { workspaceId: workspace.id, name: "Partner", color: "#FF6B8A", isSystem: true },
      ],
    });

    return user;
  });

  return result;
}

