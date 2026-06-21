const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const stamp = Date.now();
  const email = `db-smoke-${stamp}@example.com`;
  const slug = `db-smoke-${stamp}`;

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash("password123", 12),
      company: {
        create: {
          name: `DB Smoke ${stamp}`,
          category: "Clinic",
          website: "https://example.com",
          slug,
          thankYouSettings: {
            create: {
              title: "Thank you",
              message: "We appreciate your feedback.",
              bonusEnabled: true,
              bonusText: "Show this page to receive your bonus.",
              promoCode: "SMOKE",
              buttonLabel: "Visit website",
              buttonUrl: "https://example.com",
            },
          },
        },
      },
    },
    include: { company: true },
  });

  await prisma.review.create({
    data: {
      companyId: user.company.id,
      rating: 5,
      comment: "Everything was fast, helpful, and clear during the database smoke test.",
      contact: email,
      source: "smoke",
    },
  });

  const reviewCount = await prisma.review.count({ where: { companyId: user.company.id } });
  await prisma.$disconnect();

  console.log(`DB_FLOW_OK ${slug} reviews=${reviewCount}`);
}

main().catch(async (error) => {
  console.log(`DB_FLOW_ERROR ${error.code || error.name} ${String(error.message).slice(0, 500)}`);
  await prisma.$disconnect();
  process.exit(1);
});
