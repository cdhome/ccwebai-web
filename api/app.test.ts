import request from "supertest";
import { vi } from "vitest";

vi.mock("./lib/db.js", () => ({
  ensureDatabaseConfigured: vi.fn(),
  queryOrThrow: vi.fn(async (sql: string) => {
    if (sql.includes("from issues")) {
      return {
        rows: [
          {
            id: "issue_1",
            title: "示例问题",
            description: "示例描述",
            provider_id: "gemini",
            extension_version: "0.8.4",
            created_at: new Date().toISOString(),
            status: "open",
            votes: "3",
            has_logs: false,
          },
        ],
      };
    }
    return { rows: [] };
  }),
}));

import app from "./app.js";

describe("api app", () => {
  it("returns health status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  it("returns issue list", async () => {
    const response = await request(app).get("/api/issues");

    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
    expect(Array.isArray(response.body.items)).toBe(true);
  });
});
