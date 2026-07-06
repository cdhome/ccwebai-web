import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getPool } from "../api/lib/db.js";

async function main() {
  const pool = await getPool();
  if (!pool) {
    throw new Error("数据库未配置，无法执行迁移");
  }

  const client = await pool.connect();
  try {
    await client.query(`
      create table if not exists schema_migrations (
        version text primary key,
        applied_at timestamptz not null default now()
      )
    `);

    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const migrationsDir = path.resolve(currentDir, "../migrations");
    const migrationFiles = (await readdir(migrationsDir))
      .filter((name) => name.endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b));

    const appliedResult = await client.query<{ version: string }>(
      "select version from schema_migrations"
    );
    const applied = new Set(appliedResult.rows.map((row) => row.version));

    for (const fileName of migrationFiles) {
      if (applied.has(fileName)) {
        console.log(`skip ${fileName}`);
        continue;
      }

      const sql = await readFile(path.join(migrationsDir, fileName), "utf8");
      console.log(`apply ${fileName}`);

      await client.query("begin");
      try {
        await client.query(sql);
        await client.query("insert into schema_migrations (version) values ($1)", [fileName]);
        await client.query("commit");
      } catch (error) {
        await client.query("rollback");
        throw error;
      }
    }

    console.log("migrations complete");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(String((error as Error)?.message || error));
  process.exit(1);
});
