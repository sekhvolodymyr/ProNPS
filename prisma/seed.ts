import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const ownerPassword = await bcrypt.hash("password123", 12);
  const adminPassword = await bcrypt.hash("admin12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@pronps.test" },
    update: {},
    create: {
      email: "admin@pronps.test",
      passwordHash: adminPassword,
      role: Role.ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  const owner = await prisma.user.upsert({
    where: { email: "owner@pronps.test" },
    update: {},
    create: {
      email: "owner@pronps.test",
      passwordHash: ownerPassword,
      emailVerifiedAt: new Date(),
    },
  });

  const company = await prisma.company.upsert({
    where: { slug: "nova-clinic" },
    update: {},
    create: {
      ownerId: owner.id,
      name: "Nova Clinic",
      category: "Клініка",
      website: "https://example.com",
      slug: "nova-clinic",
      thankYouSettings: {
        create: {
          title: "Дякуємо за чесний відгук",
          message: "Ваш коментар допоможе нам покращити сервіс.",
          bonusEnabled: true,
          bonusText: "Покажіть цей екран адміністратору та отримайте 10% на наступний візит.",
          promoCode: "NOVA10",
          buttonLabel: "Записатися ще раз",
          buttonUrl: "https://example.com",
        },
      },
    },
  });

  const count = await prisma.review.count({ where: { companyId: company.id } });
  if (!count) {
    const comments = [
      [5, "Дуже уважна команда, швидкий сервіс і зрозумілі пояснення після консультації."],
      [4, "Все було добре, але хотілося б трохи менше чекати перед прийомом."],
      [3, "Комунікація перед записом була не дуже зручною, довелося уточнювати час кілька разів."],
      [5, "Сподобалася атмосфера, чистота і те, як персонал пояснює кожен крок."],
      [2, "Мене не попередили про затримку, тому досвід вийшов гіршим, ніж очікував."],
      [5, "Чудовий сервіс, легко записатися, команда дуже привітна."],
    ] as const;

    await prisma.review.createMany({
      data: comments.map(([rating, comment], index) => ({
        companyId: company.id,
        rating,
        comment,
        contact: index % 2 ? "client@example.com" : null,
        source: index % 2 ? "link" : "qr",
        createdAt: new Date(Date.now() - index * 3 * 24 * 60 * 60 * 1000),
      })),
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

