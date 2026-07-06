import pg from "pg";
import { registerTypes } from "pgvector/pg";
import { config, isDatabaseConfigured } from "./config.js";

const { Pool } = pg;

let pool: pg.Pool | null = null;

function createPool(): pg.Pool {
  if (config.databaseUrl) {
    return new Pool({
      connectionString: config.databaseUrl,
      ssl: false,
    });
  }

  return new Pool({
    host: config.db.host,
    port: config.db.port,
    database: config.db.database,
    user: config.db.user,
    password: config.db.password,
    ssl: false,
  });
}

export async function getPool(): Promise<pg.Pool | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!pool) {
    pool = createPool();
    const client = await pool.connect();
    try {
      await registerTypes(client);
    } finally {
      client.release();
    }
  }

  return pool;
}

export async function queryOrThrow<T = unknown>(
  sql: string,
  params: unknown[] = []
): Promise<pg.QueryResult<T>> {
  const activePool = await getPool();
  if (!activePool) {
    throw new Error("数据库未配置");
  }
  return activePool.query<T>(sql, params);
}

export function ensureDatabaseConfigured(): void {
  if (!isDatabaseConfigured()) {
    throw new Error("数据库未配置");
  }
}
