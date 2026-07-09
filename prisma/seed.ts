import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

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

  // Day 2+: seed ~15 creators/deliverables across all 6 stages and
  // ~3 campaigns here (plan.md §6) so the demo account isn't empty.
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
