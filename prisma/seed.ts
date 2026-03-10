import {
  ActivityType,
  LeadPriority,
  LeadStage,
  NotificationType,
  Prisma,
  PrismaClient,
  Role,
  TaskStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, subDays } from "date-fns";

const prisma = new PrismaClient();

const PIPELINE_STAGES = [
  { key: LeadStage.NEW, name: "New", stageOrder: 1, color: "#9AA6C4", winProbability: 10 },
  { key: LeadStage.CONTACTED, name: "Contacted", stageOrder: 2, color: "#4F7CFF", winProbability: 20 },
  { key: LeadStage.QUALIFIED, name: "Qualified", stageOrder: 3, color: "#3CC7B2", winProbability: 40 },
  { key: LeadStage.PROPOSAL_SENT, name: "Proposal Sent", stageOrder: 4, color: "#8B7CFF", winProbability: 55 },
  { key: LeadStage.NEGOTIATION, name: "Negotiation", stageOrder: 5, color: "#FFB547", winProbability: 70 },
  { key: LeadStage.WON, name: "Won", stageOrder: 6, color: "#22C55E", winProbability: 100 },
  { key: LeadStage.LOST, name: "Lost", stageOrder: 7, color: "#F87171", winProbability: 0 },
];

async function main() {
  const passwordHash = await bcrypt.hash("DemoPass123!", 12);

  await prisma.leadTag.deleteMany();
  await prisma.leadNote.deleteMany();
  await prisma.leadActivity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedFilter.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.pipelineStage.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.leadSource.deleteMany();
  await prisma.loginEvent.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const [admin, manager, repA, repB] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alyssa Morgan",
        email: "admin@leadflowcrm.dev",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Marcus Lane",
        email: "manager@leadflowcrm.dev",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Emma Ruiz",
        email: "emma@leadflowcrm.dev",
        passwordHash,
      },
    }),
    prisma.user.create({
      data: {
        name: "Daniel Cho",
        email: "daniel@leadflowcrm.dev",
        passwordHash,
      },
    }),
  ]);

  const workspace = await prisma.workspace.create({
    data: {
      name: "Northline Growth Partners",
      slug: "northline-growth",
      timezone: "America/New_York",
      currency: "USD",
    },
  });

  await prisma.membership.createMany({
    data: [
      { workspaceId: workspace.id, userId: admin.id, role: Role.ADMIN, isDefault: true },
      { workspaceId: workspace.id, userId: manager.id, role: Role.MANAGER, isDefault: true },
      { workspaceId: workspace.id, userId: repA.id, role: Role.SALES_REP, isDefault: true },
      { workspaceId: workspace.id, userId: repB.id, role: Role.SALES_REP, isDefault: true },
    ],
  });

  await prisma.pipelineStage.createMany({
    data: PIPELINE_STAGES.map((stage) => ({
      ...stage,
      workspaceId: workspace.id,
    })),
  });

  const [organic, referral, paidAds, outreach, partner] = await Promise.all([
    prisma.leadSource.create({
      data: { workspaceId: workspace.id, name: "Organic", color: "#4F7CFF", isSystem: true },
    }),
    prisma.leadSource.create({
      data: { workspaceId: workspace.id, name: "Referral", color: "#3CC7B2", isSystem: true },
    }),
    prisma.leadSource.create({
      data: { workspaceId: workspace.id, name: "Paid Ads", color: "#FFB547", isSystem: true },
    }),
    prisma.leadSource.create({
      data: { workspaceId: workspace.id, name: "Outreach", color: "#8B7CFF", isSystem: true },
    }),
    prisma.leadSource.create({
      data: { workspaceId: workspace.id, name: "Partner", color: "#FF6B8A", isSystem: true },
    }),
  ]);

  const tagRows = await Promise.all([
    prisma.tag.create({ data: { workspaceId: workspace.id, name: "Hot", color: "#FF6B8A" } }),
    prisma.tag.create({ data: { workspaceId: workspace.id, name: "Enterprise", color: "#315EFB" } }),
    prisma.tag.create({ data: { workspaceId: workspace.id, name: "Renewal", color: "#8B7CFF" } }),
    prisma.tag.create({ data: { workspaceId: workspace.id, name: "Inbound", color: "#3CC7B2" } }),
  ]);

  const leadsSeed: Array<{
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    stage: LeadStage;
    priority: LeadPriority;
    value: number;
    sourceId: string;
    ownerId: string;
    score: number;
    probability: number;
    followUpInDays: number;
    tags: string[];
  }> = [
    {
      firstName: "Sophia",
      lastName: "Cole",
      company: "Acme Studio",
      email: "sophia@acmestudio.com",
      stage: LeadStage.QUALIFIED,
      priority: LeadPriority.HIGH,
      value: 32000,
      sourceId: referral.id,
      ownerId: repA.id,
      score: 82,
      probability: 65,
      followUpInDays: 1,
      tags: ["Hot", "Inbound"],
    },
    {
      firstName: "Jordan",
      lastName: "Mills",
      company: "Northline Systems",
      email: "jordan@northlinesystems.com",
      stage: LeadStage.PROPOSAL_SENT,
      priority: LeadPriority.HIGH,
      value: 48000,
      sourceId: outreach.id,
      ownerId: manager.id,
      score: 88,
      probability: 72,
      followUpInDays: 2,
      tags: ["Enterprise", "Hot"],
    },
    {
      firstName: "Leah",
      lastName: "Wong",
      company: "Bluepeak Consulting",
      email: "leah@bluepeak.co",
      stage: LeadStage.CONTACTED,
      priority: LeadPriority.MEDIUM,
      value: 14000,
      sourceId: paidAds.id,
      ownerId: repB.id,
      score: 59,
      probability: 30,
      followUpInDays: 3,
      tags: ["Inbound"],
    },
    {
      firstName: "Noah",
      lastName: "Evans",
      company: "Summit Freight",
      email: "noah@summitfreight.io",
      stage: LeadStage.NEGOTIATION,
      priority: LeadPriority.URGENT,
      value: 72000,
      sourceId: partner.id,
      ownerId: manager.id,
      score: 93,
      probability: 86,
      followUpInDays: 1,
      tags: ["Enterprise", "Hot"],
    },
    {
      firstName: "Olivia",
      lastName: "Hart",
      company: "Kitehouse Media",
      email: "olivia@kitehouse.media",
      stage: LeadStage.NEW,
      priority: LeadPriority.MEDIUM,
      value: 9000,
      sourceId: organic.id,
      ownerId: repA.id,
      score: 41,
      probability: 18,
      followUpInDays: 5,
      tags: ["Inbound"],
    },
    {
      firstName: "Mason",
      lastName: "Diaz",
      company: "Vertex Labs",
      email: "mason@vertexlabs.ai",
      stage: LeadStage.WON,
      priority: LeadPriority.HIGH,
      value: 56000,
      sourceId: referral.id,
      ownerId: repB.id,
      score: 97,
      probability: 100,
      followUpInDays: 10,
      tags: ["Enterprise", "Renewal"],
    },
    {
      firstName: "Ava",
      lastName: "Chen",
      company: "BeaconWorks",
      email: "ava@beaconworks.com",
      stage: LeadStage.LOST,
      priority: LeadPriority.LOW,
      value: 11000,
      sourceId: paidAds.id,
      ownerId: repA.id,
      score: 24,
      probability: 0,
      followUpInDays: 14,
      tags: [],
    },
    {
      firstName: "Ethan",
      lastName: "Clark",
      company: "Prime Ledger",
      email: "ethan@primeledger.com",
      stage: LeadStage.CONTACTED,
      priority: LeadPriority.MEDIUM,
      value: 17000,
      sourceId: organic.id,
      ownerId: repB.id,
      score: 52,
      probability: 34,
      followUpInDays: 2,
      tags: ["Inbound"],
    },
    {
      firstName: "Liam",
      lastName: "Parker",
      company: "AtlasCore",
      email: "liam@atlascore.com",
      stage: LeadStage.QUALIFIED,
      priority: LeadPriority.HIGH,
      value: 39000,
      sourceId: partner.id,
      ownerId: manager.id,
      score: 84,
      probability: 62,
      followUpInDays: 4,
      tags: ["Enterprise"],
    },
    {
      firstName: "Zoe",
      lastName: "Grant",
      company: "NexaPay",
      email: "zoe@nexapay.io",
      stage: LeadStage.NEW,
      priority: LeadPriority.LOW,
      value: 7000,
      sourceId: outreach.id,
      ownerId: repA.id,
      score: 38,
      probability: 14,
      followUpInDays: 6,
      tags: [],
    },
    {
      firstName: "Caleb",
      lastName: "Moore",
      company: "Redline Creative",
      email: "caleb@redlinecreative.co",
      stage: LeadStage.PROPOSAL_SENT,
      priority: LeadPriority.HIGH,
      value: 45000,
      sourceId: referral.id,
      ownerId: repA.id,
      score: 86,
      probability: 74,
      followUpInDays: 2,
      tags: ["Hot", "Inbound"],
    },
    {
      firstName: "Hannah",
      lastName: "Lee",
      company: "CloudPath Logistics",
      email: "hannah@cloudpath.io",
      stage: LeadStage.NEGOTIATION,
      priority: LeadPriority.URGENT,
      value: 68000,
      sourceId: partner.id,
      ownerId: manager.id,
      score: 91,
      probability: 81,
      followUpInDays: 1,
      tags: ["Enterprise", "Hot"],
    },
  ];

  const leadTagLookup = new Map(tagRows.map((tag) => [tag.name, tag.id]));
  const users = [admin, manager, repA, repB];

  for (const [index, seed] of leadsSeed.entries()) {
    const createdAt = subDays(new Date(), 20 - index * 2);

    const lead = await prisma.lead.create({
      data: {
        workspaceId: workspace.id,
        createdById: users[index % users.length].id,
        ownerId: seed.ownerId,
        sourceId: seed.sourceId,
        firstName: seed.firstName,
        lastName: seed.lastName,
        company: seed.company,
        email: seed.email,
        phone: `+1-202-555-${String(1300 + index)}`,
        stage: seed.stage,
        priority: seed.priority,
        leadScore: seed.score,
        estimatedValue: new Prisma.Decimal(seed.value),
        probabilityToClose: seed.probability,
        nextFollowUpAt: addDays(new Date(), seed.followUpInDays),
        createdAt,
      },
    });

    if (seed.tags.length > 0) {
      await prisma.leadTag.createMany({
        data: seed.tags
          .map((tagName) => leadTagLookup.get(tagName))
          .filter(Boolean)
          .map((tagId) => ({
            leadId: lead.id,
            tagId: tagId as string,
          })),
      });
    }

    await prisma.leadNote.createMany({
      data: [
        {
          workspaceId: workspace.id,
          leadId: lead.id,
          authorId: manager.id,
          body: `Discovery call summary captured for ${seed.company}.`,
          createdAt: subDays(new Date(), 4),
        },
        {
          workspaceId: workspace.id,
          leadId: lead.id,
          authorId: seed.ownerId,
          body: "Follow-up sequence personalized with case study and pricing overview.",
          createdAt: subDays(new Date(), 1),
        },
      ],
    });

    await prisma.leadActivity.createMany({
      data: [
        {
          workspaceId: workspace.id,
          leadId: lead.id,
          actorId: lead.createdById,
          activityType: ActivityType.LEAD_CREATED,
          message: `${seed.firstName} ${seed.lastName} was added from ${
            seed.sourceId === referral.id ? "Referral" : "new source"
          }`,
          createdAt,
        },
        {
          workspaceId: workspace.id,
          leadId: lead.id,
          actorId: seed.ownerId,
          activityType: ActivityType.STAGE_CHANGED,
          message: `Stage updated to ${seed.stage.replace("_", " ")}.`,
          createdAt: subDays(new Date(), 2),
        },
      ],
    });

    await prisma.task.createMany({
      data: [
        {
          workspaceId: workspace.id,
          leadId: lead.id,
          assignedToId: seed.ownerId,
          createdById: manager.id,
          title: `Follow up with ${seed.company}`,
          description: "Send tailored next-step email and schedule a 20-minute sync.",
          status: seed.stage === LeadStage.WON ? TaskStatus.COMPLETED : TaskStatus.OPEN,
          priority: seed.priority,
          dueDate: addDays(new Date(), Math.max(1, seed.followUpInDays - 1)),
          completedAt: seed.stage === LeadStage.WON ? subDays(new Date(), 1) : null,
        },
      ],
    });
  }

  await prisma.notification.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: repA.id,
        type: NotificationType.REMINDER,
        title: "Follow-up due soon",
        message: "Acme Studio needs an update before 11:00 AM.",
      },
      {
        workspaceId: workspace.id,
        userId: manager.id,
        type: NotificationType.INFO,
        title: "Pipeline milestone",
        message: "Negotiation-stage deal value passed $140k this week.",
      },
    ],
  });

  await prisma.loginEvent.createMany({
    data: [
      {
        workspaceId: workspace.id,
        userId: admin.id,
        email: admin.email,
        success: true,
        ipAddress: "192.168.1.12",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X)",
      },
      {
        workspaceId: workspace.id,
        email: "unknown@leadflowcrm.dev",
        success: false,
        reason: "Invalid password",
        ipAddress: "203.0.113.12",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    ],
  });

  console.log("Seed complete. Demo users:");
  console.log("admin@leadflowcrm.dev / DemoPass123!");
  console.log("manager@leadflowcrm.dev / DemoPass123!");
  console.log("emma@leadflowcrm.dev / DemoPass123!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

