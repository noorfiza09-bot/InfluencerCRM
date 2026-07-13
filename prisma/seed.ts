import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const demoEmail = "demo@demo.com";
  const demoPassword = "demo1234";

  const hashedPassword = await bcrypt.hash(demoPassword, 12);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      password: hashedPassword,
    },
  });

  console.log(`Seeded demo user: ${demoUser.email}`);

  const creators: Array<{
    name: string;
    handle: string;
    platform: "INSTAGRAM" | "TIKTOK" | "YOUTUBE" | "TWITTER" | "OTHER";
    followers: number;
    email?: string;
    niche: string[];
  }> = [
    { name: "Maya Chen", handle: "@mayacreates", platform: "INSTAGRAM", followers: 184000, email: "maya@creatormail.com", niche: ["beauty", "skincare"] },
    { name: "Jordan Rivera", handle: "@jordanlifts", platform: "TIKTOK", followers: 512000, email: "jordan@creatormail.com", niche: ["fitness"] },
    { name: "Priya Sharma", handle: "@priyacooks", platform: "YOUTUBE", followers: 89000, niche: ["food", "lifestyle"] },
    { name: "Alex Kim", handle: "@alexkgaming", platform: "TWITTER", followers: 45000, email: "alex@creatormail.com", niche: ["gaming", "tech"] },
    { name: "Sofia Torres", handle: "@sofiastyled", platform: "INSTAGRAM", followers: 276000, niche: ["fashion", "beauty"] },
    { name: "Marcus Webb", handle: "@marcusmoves", platform: "TIKTOK", followers: 98000, email: "marcus@creatormail.com", niche: ["fitness", "wellness"] },
    { name: "Nina Patel", handle: "@ninatravels", platform: "YOUTUBE", followers: 143000, niche: ["travel"] },
    { name: "Leo Fischer", handle: "@leocooksit", platform: "INSTAGRAM", followers: 67000, email: "leo@creatormail.com", niche: ["food"] },
    { name: "Zoe Anderson", handle: "@zoereviews", platform: "TIKTOK", followers: 321000, niche: ["tech", "gadgets"] },
    { name: "Ryan Cole", handle: "@ryanoutdoors", platform: "YOUTUBE", followers: 55000, email: "ryan@creatormail.com", niche: ["outdoors", "fitness"] },
    { name: "Emma Larsson", handle: "@emmaminimal", platform: "INSTAGRAM", followers: 412000, niche: ["lifestyle", "home"] },
    { name: "Diego Ramirez", handle: "@diegostreams", platform: "TWITTER", followers: 78000, email: "diego@creatormail.com", niche: ["gaming"] },
    { name: "Hannah Brooks", handle: "@hannahwellness", platform: "TIKTOK", followers: 156000, niche: ["wellness", "beauty"] },
    { name: "Tyler Brooks", handle: "@tylerbuilds", platform: "OTHER", followers: 34000, email: "tyler@creatormail.com", niche: ["diy", "home"] },
    { name: "Olivia Bennett", handle: "@oliviaeats", platform: "INSTAGRAM", followers: 201000, niche: ["food", "travel"] },
  ];

  const createdCreators: Array<{ id: string; handle: string }> = [];
  for (const creator of creators) {
    const existing = await prisma.creator.findFirst({
      where: { userId: demoUser.id, handle: creator.handle },
      select: { id: true, handle: true },
    });
    if (existing) {
      createdCreators.push(existing);
    } else {
      const created = await prisma.creator.create({
        data: { ...creator, userId: demoUser.id },
        select: { id: true, handle: true },
      });
      createdCreators.push(created);
    }
  }

  console.log(`Seeded ${creators.length} demo creators`);

  // ~3 campaigns and deliverables spread across all 6 stages (plan.md §6)
  // so reviewers see a populated pipeline immediately.
  const campaignDefs = [
    {
      name: "Summer Skincare Launch",
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-07-15"),
      budget: 12000,
    },
    {
      name: "Fitness App Q3 Push",
      startDate: new Date("2026-07-01"),
      endDate: new Date("2026-08-31"),
      budget: 25000,
    },
    {
      name: "Holiday Gadget Roundup",
      startDate: new Date("2026-11-01"),
      endDate: new Date("2026-12-20"),
      budget: 18000,
    },
  ] as const;

  const createdCampaigns: Array<{ id: string; name: string }> = [];
  for (const campaign of campaignDefs) {
    const existing = await prisma.campaign.findFirst({
      where: { userId: demoUser.id, name: campaign.name },
      select: { id: true, name: true },
    });
    if (existing) {
      createdCampaigns.push(existing);
    } else {
      const created = await prisma.campaign.create({
        data: { ...campaign, userId: demoUser.id },
        select: { id: true, name: true },
      });
      createdCampaigns.push(created);
    }
  }

  console.log(`Seeded ${createdCampaigns.length} demo campaigns`);

  const stages = [
    "OUTREACH_SENT",
    "NEGOTIATING",
    "CONTRACTED",
    "CONTENT_SUBMITTED",
    "POSTED",
    "PAID",
  ] as const;

  const existingDeliverableCount = await prisma.deliverable.count({
    where: { campaignId: { in: createdCampaigns.map((c) => c.id) } },
  });

  if (existingDeliverableCount === 0) {
    let creatorCursor = 0;
    let deliverableCount = 0;

    for (const campaign of createdCampaigns) {
      // 5 deliverables per campaign, one per stage (cycling through stages),
      // spread across different creators so the pipeline looks realistic.
      for (let i = 0; i < 5; i++) {
        const creator = createdCreators[creatorCursor % createdCreators.length];
        const stage = stages[(creatorCursor + i) % stages.length];
        creatorCursor++;

        await prisma.deliverable.create({
          data: {
            creatorId: creator.id,
            campaignId: campaign.id,
            status: stage,
            dueDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
            amount: 300 + i * 150,
          },
        });
        deliverableCount++;
      }
    }

    console.log(`Seeded ${deliverableCount} demo deliverables`);
  } else {
    console.log("Deliverables already seeded, skipping");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
