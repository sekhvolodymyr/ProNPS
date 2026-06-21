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
  // Keep TLS enabled for transport and let this diagnostic run in local dev.
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
  const result = await client.query("select 1 as ok");
  await client.end();

  console.log(`PG_OK ${result.rows[0].ok}`);
}

main().catch((error) => {
  console.log(`PG_ERROR ${error.code || error.name} ${String(error.message).slice(0, 300)}`);
  process.exit(1);
});
