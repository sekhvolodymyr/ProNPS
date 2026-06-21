const fs = require("fs");
const { Client } = require("pg");

function readDatabaseUrl() {
  const env = fs.readFileSync(".env", "utf8");
  const line = env.split(/\r?\n/).find((item) => item.startsWith("DATABASE_URL="));

  if (!line) {
    throw new Error("NO_DATABASE_URL");
  }

  const rawUrl = line.slice("DATABASE_URL=".length).trim().replace(/^"|"$/g, "");
  const url = new URL(rawUrl);

  // node-postgres validates the pooler cert chain differently than Prisma.
  // Keep TLS enabled for transport and let this setup script run in local dev.
  url.searchParams.delete("sslmode");
  return url.toString();
}

async function main() {
  const databaseUrl = readDatabaseUrl();
  const client = new Client({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 15000,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const existing = await client.query("select to_regclass('public.\"User\"') as table_name");
  if (existing.rows[0]?.table_name) {
    console.log("SCHEMA_EXISTS");
    await client.end();
    return;
  }

  const sql = fs.readFileSync("prisma/supabase-init.sql", "utf8");
  await client.query(sql);
  await client.end();

  console.log("SCHEMA_APPLIED");
}

main().catch((error) => {
  console.log(`SCHEMA_ERROR ${error.code || error.name} ${String(error.message).slice(0, 500)}`);
  process.exit(1);
});
