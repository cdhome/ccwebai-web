import { ensureDatabaseConfigured, queryOrThrow } from "../api/lib/db.js";

async function main() {
  ensureDatabaseConfigured();

  const email = String(process.argv[2] || "").trim().toLowerCase();
  const name = String(process.argv[3] || email || "CCWebAI Admin").trim();
  const role = String(process.argv[4] || "admin").trim().toLowerCase();

  if (!email) {
    throw new Error("用法：pnpm admin:grant -- <email> [name] [role]");
  }

  if (!["admin", "super_admin"].includes(role)) {
    throw new Error("role 仅支持 admin 或 super_admin");
  }

  const result = await queryOrThrow<{
    id: string;
    email: string;
    name: string;
    role: string;
  }>(
    `
      insert into users (email, name, role)
      values ($1, $2, $3)
      on conflict (email) do update
      set
        name = excluded.name,
        role = excluded.role
      returning id, email, name, role
    `,
    [email, name, role]
  );

  const user = result.rows[0];
  console.log(`granted ${user.role} -> ${user.email} (${user.name})`);
}

main().catch((error) => {
  console.error(String((error as Error)?.message || error));
  process.exit(1);
});
