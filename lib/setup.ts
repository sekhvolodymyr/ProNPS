export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export const databaseSetupMessage =
  "База даних ще не підключена. Створіть файл .env з DATABASE_URL, запустіть npm run prisma:migrate і npm run prisma:seed.";

