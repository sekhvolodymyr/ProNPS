export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getDatabaseSetupError() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return databaseSetupMessage;

  try {
    const url = new URL(databaseUrl);
    if (url.hostname.startsWith("db.") && url.hostname.endsWith(".supabase.co") && url.port === "5432") {
      return databaseUnavailableMessage;
    }
  } catch {
    return "DATABASE_URL має некоректний формат.";
  }

  return null;
}

export const databaseSetupMessage =
  "База даних ще не підключена. Створіть файл .env з DATABASE_URL, запустіть npm run prisma:migrate і npm run prisma:seed.";

export const databaseUnavailableMessage =
  "Потрібен Supabase pooler DATABASE_URL. Direct host db.*.supabase.co:5432 у цьому середовищі недоступний і викликає помилку реєстрації.";

export function logServerError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${scope}] ${message}`);
}
