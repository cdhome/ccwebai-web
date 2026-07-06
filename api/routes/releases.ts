import { Router, type Request, type Response } from "express";
import { ensureDatabaseConfigured, queryOrThrow } from "../lib/db.js";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

type DownloadKey = "macos-arm64" | "macos-x64" | "windows-x64" | "linux-x64";

function buildDownloadUrl(baseUrl: string, platform: DownloadKey) {
  const base = String(baseUrl || "").replace(/\/+$/, "");
  if (!base) return "";
  return `${base}/${platform}.zip`;
}

function mapRelease(row: {
  id: string;
  version: string;
  base_url: string;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}) {
  return {
    id: row.id,
    version: row.version,
    baseUrl: row.base_url,
    notes: row.notes || "",
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    downloads: {
      "macos-arm64": buildDownloadUrl(row.base_url, "macos-arm64"),
      "macos-x64": buildDownloadUrl(row.base_url, "macos-x64"),
      "windows-x64": buildDownloadUrl(row.base_url, "windows-x64"),
      "linux-x64": buildDownloadUrl(row.base_url, "linux-x64"),
    },
  };
}

router.get("/native-host/latest", async (_req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();

    const result = await queryOrThrow<{
      id: string;
      version: string;
      base_url: string;
      notes: string | null;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    }>(
      `
        select id, version, base_url, notes, is_active, created_at, updated_at
        from native_host_releases
        where is_active = true
        order by updated_at desc
        limit 1
      `
    );

    if (!result.rows[0]) {
      res.status(200).json({
        ok: true,
        available: false,
        message: "Native host release is not published yet",
        latest: null,
      });
      return;
    }

    res.status(200).json({
      ok: true,
      available: true,
      latest: mapRelease(result.rows[0]),
    });
  } catch (error) {
    res.status(200).json({
      ok: true,
      available: false,
      message: String((error as Error)?.message || error),
      latest: null,
    });
  }
});

router.get("/admin/native-host", requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();

    const result = await queryOrThrow<{
      id: string;
      version: string;
      base_url: string;
      notes: string | null;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    }>(
      `
        select id, version, base_url, notes, is_active, created_at, updated_at
        from native_host_releases
        order by is_active desc, created_at desc
      `
    );

    res.json({
      ok: true,
      items: result.rows.map(mapRelease),
    });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.post("/admin/native-host", requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    ensureDatabaseConfigured();

    const version = String(req.body?.version || "").trim();
    const baseUrl = String(req.body?.baseUrl || "").trim().replace(/\/+$/, "");
    const notes = String(req.body?.notes || "").trim();
    const isActive = Boolean(req.body?.isActive);
    const session = req.ccwebaiSession;

    if (!version || !baseUrl) {
      res.status(400).json({ ok: false, error: "版本号和下载基地址不能为空" });
      return;
    }

    if (isActive) {
      await queryOrThrow(`update native_host_releases set is_active = false where is_active = true`);
    }

    const result = await queryOrThrow<{
      id: string;
      version: string;
      base_url: string;
      notes: string | null;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    }>(
      `
        insert into native_host_releases (version, base_url, notes, is_active, created_by)
        values ($1, $2, $3, $4, $5::uuid)
        returning id, version, base_url, notes, is_active, created_at, updated_at
      `,
      [version, baseUrl, notes || null, isActive, session?.userId || null]
    );

    res.json({
      ok: true,
      item: mapRelease(result.rows[0]),
    });
  } catch (error) {
    res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
  }
});

router.post(
  "/admin/native-host/:id/activate",
  requireAdmin,
  async (req: Request, res: Response): Promise<void> => {
    try {
      ensureDatabaseConfigured();

      const releaseId = String(req.params.id || "").trim();
      if (!releaseId) {
        res.status(400).json({ ok: false, error: "缺少 release id" });
        return;
      }

      await queryOrThrow(`update native_host_releases set is_active = false where is_active = true`);
      const result = await queryOrThrow<{
        id: string;
        version: string;
        base_url: string;
        notes: string | null;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      }>(
        `
          update native_host_releases
          set is_active = true, updated_at = now()
          where id = $1::uuid
          returning id, version, base_url, notes, is_active, created_at, updated_at
        `,
        [releaseId]
      );

      if (!result.rows[0]) {
        res.status(404).json({ ok: false, error: "release 不存在" });
        return;
      }

      res.json({
        ok: true,
        item: mapRelease(result.rows[0]),
      });
    } catch (error) {
      res.status(503).json({ ok: false, error: String((error as Error)?.message || error) });
    }
  }
);

export default router;
