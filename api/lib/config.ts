import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

function toNumber(value: string | undefined, fallback: number): number {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export const config = {
  port: toNumber(process.env.PORT, 3001),
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:5173",
  publicSiteUrl: process.env.PUBLIC_SITE_URL || "https://www.ccwebai.com",
  sessionSecret: process.env.SESSION_SECRET || "ccwebai-dev-session-secret",
  databaseUrl: process.env.DATABASE_URL || "",
  db: {
    host: process.env.DB_HOST || "",
    port: toNumber(process.env.DB_PORT, 5432),
    database: process.env.DB_NAME || "postgres",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || "",
  adminEmails: String(process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
};

export function isDatabaseConfigured(): boolean {
  return Boolean(
    config.databaseUrl || (config.db.host && config.db.user && config.db.password)
  );
}
